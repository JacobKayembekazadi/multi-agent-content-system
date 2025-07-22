#!/usr/bin/env python3
"""
Simple Working Server - Guaranteed to work!
"""

import http.server
import socketserver
import os
import webbrowser
from pathlib import Path

PORT = 3000

def main():
    print("🎯 Starting Simple Working Server...")
    
    # Check if frontend is built
    build_dir = Path("frontend/build")
    if not build_dir.exists():
        print("❌ Frontend not built. Building now...")
        os.system("cd frontend && npm run build")
    
    # Change to build directory  
    os.chdir("frontend/build")
    
    # Create simple handler
    class Handler(http.server.SimpleHTTPRequestHandler):
        def do_GET(self):
            if self.path == '/':
                self.path = '/index.html'
            return super().do_GET()
        
        def end_headers(self):
            self.send_header('Access-Control-Allow-Origin', '*')
            super().end_headers()
    
    # Start server
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"✅ Server running at http://localhost:{PORT}")
        print("🚀 Opening browser...")
        webbrowser.open(f"http://localhost:{PORT}")
        print("✨ Press Ctrl+C to stop")
        httpd.serve_forever()

if __name__ == "__main__":
    main() 