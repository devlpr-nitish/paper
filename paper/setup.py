"""
Frappe lifecycle hooks: after_install, after_migrate.

Each step is independent — a failure in one does not block the others.
Every step is idempotent and safe to call multiple times.
"""

import json
import os
import shutil
import subprocess
import traceback

import frappe

_APP_NAME = "paper"
_NEXTJS_DEFAULT_PORT = 3000
_FRONTEND_CANDIDATES = ("frontend",)


def _log(msg: str, level: str = "info") -> None:
    print(f"[{_APP_NAME}] {msg}")
    try:
        log = frappe.logger(_APP_NAME, allow_site=True)
        getattr(log, level)(f"[{_APP_NAME}] {msg}")
    except Exception:
        pass


def _app_root() -> str:
    return os.path.abspath(os.path.join(frappe.get_app_path(_APP_NAME), ".."))


def _bench_root() -> str:
    return os.path.abspath(os.path.join(frappe.get_app_path(_APP_NAME), "..", "..", ".."))


def _frontend_path() -> str | None:
    app_root = _app_root()
    for name in _FRONTEND_CANDIDATES:
        p = os.path.join(app_root, name)
        if os.path.isdir(p) and os.path.isfile(os.path.join(p, "package.json")):
            return p
    try:
        for name in sorted(os.listdir(app_root)):
            if name in (_APP_NAME, ".git", "node_modules"):
                continue
            p = os.path.join(app_root, name)
            if os.path.isdir(p) and os.path.isfile(os.path.join(p, "package.json")):
                return p
    except OSError:
        pass
    return None


def _patch_site_config() -> None:
    try:
        config_path = os.path.join(frappe.get_site_path(), "site_config.json")
        try:
            with open(config_path) as f:
                cfg = json.load(f)
        except FileNotFoundError:
            _log("site_config.json not found — skipping", "warning")
            return
        except json.JSONDecodeError as exc:
            _log(f"site_config.json is not valid JSON: {exc}", "warning")
            return

        changed = False

        if "nextjs_url" not in cfg:
            cfg["nextjs_url"] = f"http://localhost:{_NEXTJS_DEFAULT_PORT}"
            changed = True
            _log(f"site_config: set nextjs_url = http://localhost:{_NEXTJS_DEFAULT_PORT}")

        frappe_port = frappe.conf.get("webserver_port") or 8000
        frappe_url = f"http://localhost:{frappe_port}"
        referrers: list = list(cfg.get("allowed_referrers") or [])
        if frappe_url not in referrers:
            referrers.append(frappe_url)
            cfg["allowed_referrers"] = referrers
            changed = True
            _log(f"site_config: added {frappe_url} to allowed_referrers")

        if not changed:
            _log("site_config.json already up-to-date")
            return

        try:
            with open(config_path, "w") as f:
                json.dump(cfg, f, indent=1)
                f.write("\n")
            _log("site_config.json updated")
        except OSError as exc:
            _log(f"Could not write site_config.json: {exc}", "error")

    except Exception:
        _log(f"_patch_site_config failed:\n{traceback.format_exc()}", "error")


def _npm_install() -> None:
    try:
        npm = shutil.which("npm")
        if not npm:
            _log("npm not found in PATH — skipping npm install", "warning")
            return

        frontend = _frontend_path()
        if not frontend:
            _log("No frontend directory found — skipping npm install", "warning")
            return

        node_modules = os.path.join(frontend, "node_modules")
        if os.path.isdir(node_modules):
            _log("node_modules already present — skipping npm install")
            return

        _log(f"Running npm install in {frontend} ...")
        result = subprocess.run(
            [npm, "install"],
            cwd=frontend,
            capture_output=True,
            text=True,
            timeout=300,
        )
        if result.returncode == 0:
            _log("npm install complete")
        else:
            _log(f"npm install failed (exit {result.returncode}):\n{result.stderr.strip()}", "error")

    except subprocess.TimeoutExpired:
        _log("npm install timed out after 5 minutes", "error")
    except Exception:
        _log(f"_npm_install failed:\n{traceback.format_exc()}", "error")


def _patch_procfile() -> None:
    try:
        bench = _bench_root()
        procfile_path = os.path.join(bench, "Procfile")

        if not os.path.isfile(procfile_path):
            _log("Procfile not found — skipping Procfile patch")
            return

        with open(procfile_path) as f:
            content = f.read()

        if "nextjs:" in content:
            _log("Procfile already has nextjs entry — skipping")
            return

        frontend = _frontend_path()
        if not frontend:
            _log("No frontend dir found — cannot add Procfile entry", "warning")
            return

        try:
            rel_frontend = os.path.relpath(frontend, bench)
        except ValueError:
            rel_frontend = frontend

        entry = f"\nnextjs: cd {rel_frontend} && npm run dev -- --port {_NEXTJS_DEFAULT_PORT}\n"
        with open(procfile_path, "a") as f:
            f.write(entry)
        _log(f"Procfile: added nextjs entry (cd {rel_frontend})")

    except Exception:
        _log(f"_patch_procfile failed:\n{traceback.format_exc()}", "error")


def _patch_supervisor() -> None:
    try:
        bench = _bench_root()
        config_dir = os.path.join(bench, "config", "supervisor.d")
        try:
            os.makedirs(config_dir, exist_ok=True)
        except OSError:
            pass

        conf_path = os.path.join(config_dir, "nextjs.conf")
        if os.path.isfile(conf_path):
            _log("supervisor config already exists — skipping")
            return

        frontend = _frontend_path()
        if not frontend:
            _log("No frontend dir found — cannot write supervisor config", "warning")
            return

        node = shutil.which("node") or "node"
        next_bin = os.path.join(frontend, "node_modules", ".bin", "next")
        logs_dir = os.path.join(bench, "logs")
        os.makedirs(logs_dir, exist_ok=True)

        content = (
            "[program:nextjs]\n"
            f"command={node} {next_bin} start --port {_NEXTJS_DEFAULT_PORT}\n"
            f"directory={frontend}\n"
            "autostart=true\n"
            "autorestart=true\n"
            "stopasgroup=true\n"
            "killasgroup=true\n"
            f"stdout_logfile={logs_dir}/nextjs.log\n"
            f"stderr_logfile={logs_dir}/nextjs.error.log\n"
        )

        try:
            with open(conf_path, "w") as f:
                f.write(content)
            _log(f"Supervisor config written: {conf_path}")
            _log("Run: supervisorctl reread && supervisorctl update")
        except OSError as exc:
            _log(f"Could not write supervisor config: {exc}", "warning")

    except Exception:
        _log(f"_patch_supervisor failed:\n{traceback.format_exc()}", "error")


def after_install() -> None:
    _log("Running after_install ...")
    _patch_site_config()
    _npm_install()
    _patch_procfile()
    _patch_supervisor()
    frappe.clear_cache()
    _log("after_install complete")


def after_migrate() -> None:
    _log("Running after_migrate ...")
    _patch_site_config()
    _log("after_migrate complete")
