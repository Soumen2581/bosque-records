#!/usr/bin/env python3
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1] / "dist"
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8088
HOST = sys.argv[2] if len(sys.argv) > 2 else "127.0.0.1"

class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def do_GET(self):
        req = self.path.split("?", 1)[0]
        candidate = (ROOT / req.lstrip("/")).resolve()
        if req.startswith("/assets/") or (candidate.is_file() and str(candidate).startswith(str(ROOT))):
            return super().do_GET()
        self.path = "/index.html"
        return super().do_GET()

if not ROOT.is_dir():
    raise SystemExit(f"missing dist at {ROOT}")

httpd = ThreadingHTTPServer((HOST, PORT), Handler)
print(f"Serving {ROOT} at http://{HOST}:{PORT}/", flush=True)
httpd.serve_forever()
