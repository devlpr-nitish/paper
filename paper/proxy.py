import http.client
import socket
import threading
import urllib.parse

import frappe
from frappe.website.page_renderers.base_renderer import BaseRenderer
from werkzeug.wrappers import Response

# Override in site_config.json: {"nextjs_url": "http://my-host:3000"}
NEXTJS_BASEPATH = "/paper"
_PROXY_PREFIXES = ("paper", "_next")

_SKIP_RESPONSE_HEADERS = frozenset(
    {"transfer-encoding", "connection", "keep-alive", "content-encoding"}
)

_WS_FORWARD_HEADERS = frozenset({
    "upgrade", "connection",
    "sec-websocket-key", "sec-websocket-version",
    "sec-websocket-extensions", "sec-websocket-protocol",
    "origin", "cookie", "authorization",
})


def _nextjs_addr() -> tuple[str, int]:
    url = frappe.conf.get("nextjs_url", "http://localhost:3000")
    parsed = urllib.parse.urlparse(url)
    return parsed.hostname, parsed.port or 80


def _nextjs_connection():
    host, port = _nextjs_addr()
    return http.client.HTTPConnection(host, port, timeout=30)


def _websocket_tunnel(client_sock: socket.socket, request, host: str, port: int) -> None:
    """Block the calling thread until the WebSocket tunnel between the browser
    and Next.js closes.  Requires Werkzeug >= 2.3 (environ['werkzeug.socket'])."""
    path = f"/{request.environ.get('PATH_INFO', '').lstrip('/')}"
    qs = request.environ.get("QUERY_STRING", "")
    if qs:
        path += f"?{qs}"

    lines = [f"GET {path} HTTP/1.1", f"Host: {host}:{port}"]
    for k, v in request.headers:
        if k.lower() in _WS_FORWARD_HEADERS:
            lines.append(f"{k}: {v}")
    upgrade_req = ("\r\n".join(lines) + "\r\n\r\n").encode()

    try:
        srv = socket.create_connection((host, port), timeout=5)
    except OSError:
        return

    try:
        srv.sendall(upgrade_req)

        # Read until end of HTTP headers from Next.js
        buf = b""
        while b"\r\n\r\n" not in buf:
            chunk = srv.recv(4096)
            if not chunk:
                return
            buf += chunk

        # Only continue if Next.js responded with 101 Switching Protocols
        status_line = buf.split(b"\r\n", 1)[0].decode("ascii", errors="replace")
        if "101" not in status_line:
            return

        client_sock.sendall(buf)

        # Bidirectional pipe — block until either direction closes
        done = threading.Event()

        def pipe(src: socket.socket, dst: socket.socket) -> None:
            try:
                while True:
                    data = src.recv(65536)
                    if not data:
                        break
                    dst.sendall(data)
            except OSError:
                pass
            finally:
                done.set()

        threading.Thread(target=pipe, args=(srv, client_sock), daemon=True).start()
        threading.Thread(target=pipe, args=(client_sock, srv), daemon=True).start()
        done.wait()
    finally:
        try:
            srv.close()
        except OSError:
            pass


class NextJSProxyRenderer(BaseRenderer):
    def can_render(self):
        return self.path.startswith(_PROXY_PREFIXES)

    def render(self):
        request = frappe.local.request

        # ── WebSocket upgrade: tunnel directly to Next.js ──────────────────
        # Werkzeug >= 2.3 exposes the raw TCP socket in environ['werkzeug.socket'].
        # We tunnel it straight to Next.js so HMR works through port 8005.
        if request.headers.get("Upgrade", "").lower() == "websocket":
            client_sock = request.environ.get("werkzeug.socket")
            if isinstance(client_sock, socket.socket):
                host, port = _nextjs_addr()
                _websocket_tunnel(client_sock, request, host, port)
                # Tunnel is done; socket is closed. Return a dummy response —
                # Werkzeug will get BrokenPipeError trying to write it, which it
                # handles silently as a normal network close.
                return Response("", status=200)

        # ── Regular HTTP proxy ──────────────────────────────────────────────
        path = f"/{self.path}"
        if request.query_string:
            path += f"?{request.query_string.decode('utf-8', errors='replace')}"

        forward_headers = {}
        for header in (
            "Cookie",
            "Accept",
            "Accept-Language",
            "Content-Type",
            "X-Frappe-CSRF-Token",
            # Next.js Server Action / RSC headers
            "Next-Action",
            "Next-Router-State-Tree",
            "Next-Router-Prefetch",
            "Next-Url",
        ):
            val = request.headers.get(header)
            if val:
                forward_headers[header] = val

        body = request.get_data() or None

        conn = _nextjs_connection()
        try:
            conn.request(request.method, path, body=body, headers=forward_headers)
            resp = conn.getresponse()
            content = resp.read()
            headers = []
            for k, v in resp.getheaders():
                if k.lower() in _SKIP_RESPONSE_HEADERS:
                    continue
                # Next.js redirect() omits basePath; add it so the browser
                # lands at the correct proxied URL.
                if k.lower() in ("location", "x-action-redirect"):
                    if v.startswith("/") and not v.startswith(NEXTJS_BASEPATH):
                        v = f"{NEXTJS_BASEPATH}{v}"
                headers.append((k, v))
            return Response(content, status=resp.status, headers=headers)
        except (http.client.HTTPException, OSError):
            return Response(
                "Next.js server is not running. Start it with: bench start",
                status=502,
                content_type="text/plain",
            )
        finally:
            conn.close()