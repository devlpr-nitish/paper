import frappe
import frappe.sessions


@frappe.whitelist(allow_guest=True)
def get_csrf_token():
    """Return the CSRF token for the current session.
    Called server-side from Next.js before mutating API requests."""
    return frappe.sessions.get_csrf_token()


@frappe.whitelist()
def create_user(first_name: str, email: str, last_name: str = "", password: str = ""):
    """Create a new Frappe user. Requires an authenticated session."""
    first_name = first_name.strip()
    email = email.strip()

    if not first_name:
        frappe.throw("First name is required", frappe.MandatoryError)
    if not email:
        frappe.throw("Email is required", frappe.MandatoryError)
    if frappe.db.exists("User", email):
        frappe.throw(f"User with email {email} already exists", frappe.DuplicateEntryError)

    user = frappe.new_doc("User")
    user.first_name = first_name
    user.last_name = last_name.strip()
    user.email = email

    if password.strip():
        user.new_password = password.strip()
        user.send_welcome_email = 0
    else:
        user.send_welcome_email = 1

    user.insert()
    frappe.db.commit()

    return {
        "name": user.name,
        "full_name": user.full_name,
        "email": user.email,
        "enabled": user.enabled,
    }
