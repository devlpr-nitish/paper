/**
 * Server-side Frappe base URL.
 * Set FRAPPE_URL in .env.local — never use NEXT_PUBLIC_ (server-only).
 */
export const FRAPPE_URL = process.env.FRAPPE_URL ?? "http://localhost:8000";
