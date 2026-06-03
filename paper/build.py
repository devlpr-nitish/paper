"""
Frappe lifecycle hook: after_build.

Runs `npm run build` when `bench build` is invoked in a production context.
Gated behind NEXTJS_BUILD=1 — set it during production deploys.

Usage:
    NEXTJS_BUILD=1 bench build          # production deploy
    SKIP_NEXTJS_BUILD=1 bench build     # CI asset-only build
"""

import os
import shutil
import subprocess
import traceback

from paper.setup import _frontend_path, _log


def after_build() -> None:
    if os.environ.get("SKIP_NEXTJS_BUILD"):
        _log("SKIP_NEXTJS_BUILD set — skipping Next.js build")
        return

    if not os.environ.get("NEXTJS_BUILD"):
        _log(
            "NEXTJS_BUILD not set — skipping Next.js build "
            "(set NEXTJS_BUILD=1 when deploying to production)"
        )
        return

    npm = shutil.which("npm")
    if not npm:
        raise RuntimeError("npm not found in PATH — cannot run Next.js build")

    frontend = _frontend_path()
    if not frontend:
        raise RuntimeError("No frontend directory found — cannot build")

    node_modules = os.path.join(frontend, "node_modules")
    if not os.path.isdir(node_modules):
        _log("node_modules missing — running npm install first ...")
        install = subprocess.run([npm, "install"], cwd=frontend, timeout=300)
        if install.returncode != 0:
            raise RuntimeError(f"npm install failed with exit {install.returncode}")

    _log(f"Running npm run build in {frontend} ...")
    try:
        result = subprocess.run(
            [npm, "run", "build"],
            cwd=frontend,
            timeout=600,
            check=False,
        )
    except subprocess.TimeoutExpired:
        raise RuntimeError("npm run build timed out after 10 minutes") from None
    except Exception:
        raise RuntimeError(
            f"Unexpected error during Next.js build:\n{traceback.format_exc()}"
        ) from None

    if result.returncode != 0:
        raise RuntimeError(
            f"npm run build failed with exit {result.returncode}. "
            "Check the output above."
        )

    _log("npm run build complete")
