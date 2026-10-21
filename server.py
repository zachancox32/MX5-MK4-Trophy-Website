#!/usr/bin/env python3
"""Local preview of the BUILT site: python3 server.py -> http://localhost:4600

Run `npx eleventy` first, or use `npm run serve` for hot reload."""
import functools, http.server, os, socketserver

PORT = 4600
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "_site")

class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

socketserver.TCPServer.allow_reuse_address = True
with socketserver.TCPServer(("", PORT), functools.partial(Handler, directory=ROOT)) as httpd:
    print(f"MX-5 Cup GB serving {ROOT} on http://localhost:{PORT}")
    httpd.serve_forever()
