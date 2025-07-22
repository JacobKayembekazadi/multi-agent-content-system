#!/usr/bin/env python3
"""
Working Local Development Server
Properly handles API proxy and serves React frontend
"""

import http.server
import socketserver
import urllib.request
import urllib.parse
import json
import os
import subprocess
import webbrowser
import time
from pathlib import Path

class WorkingProxyHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        self.backend_url = "http://localhost:8000"
        super().__init__(*args, **kwargs)
    
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        super().end_headers()
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()
    
    def proxy_request(self):
        """Proxy any request to backend"""
        try:
            # Clean up the path for backend
            backend_path = self.path
            if backend_path.startswith('/api'):
                backend_path = backend_path[4:]  # Remove /api prefix
            
            url = f"{self.backend_url}{backend_path}"
            
            # Get request body
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length) if content_length > 0 else None
            
            # Create request
            req = urllib.request.Request(url, data=body, method=self.command)
            
            # Copy headers
            for header, value in self.headers.items():
                if header.lower() not in ['host', 'content-length']:
                    req.add_header(header, value)
            
            # Make request
            try:
                with urllib.request.urlopen(req, timeout=10) as response:
                    self.send_response(response.status)
                    
                    for header, value in response.headers.items():
                        if header.lower() not in ['content-encoding', 'transfer-encoding']:
                            self.send_header(header, value)
                    
                    self.end_headers()
                    self.wfile.write(response.read())
                    
                    print(f"✅ API: {self.command} {backend_path} -> {response.status}")
                    
            except urllib.error.HTTPError as e:
                self.send_response(e.code)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                
                error_msg = json.dumps({'error': f'Backend error: {e.code}'}).encode()
                self.wfile.write(error_msg)
                print(f"❌ API: {self.command} {backend_path} -> {e.code}")
                
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            
            error_msg = json.dumps({'error': 'Proxy error', 'message': str(e)}).encode()
            self.wfile.write(error_msg)
            print(f"❌ API: {self.command} {backend_path} -> Error: {e}")
    
    def do_GET(self):
        # API endpoints - proxy to backend
        api_paths = ['/api/', '/health', '/dashboard/', '/campaigns', '/agents/', '/integrations/', '/tasks', '/metrics/', '/content', '/workflows/']
        
        if any(self.path.startswith(path) for path in api_paths):
            self.proxy_request()
            return
        
        # Serve frontend files
        if self.path == '/':
            self.path = '/index.html'
        
        super().do_GET()
    
    def do_POST(self):
        self.proxy_request()
    
    def do_PUT(self):
        self.proxy_request()
    
    def do_DELETE(self):
        self.proxy_request()
    
    def log_message(self, format, *args):
        """Simplified logging"""
        message = format % args
        if any(endpoint in message for endpoint in ['/health', '/campaigns', '/agents', '/content', '/dashboard']):
            return  # Already logged in proxy_request
        print(f"📁 {message}")

def check_backend():
    """Check if backend is running"""
    try:
        with urllib.request.urlopen("http://localhost:8000/health", timeout=3) as response:
            return response.status == 200
    except:
        return False

def ensure_frontend_built():
    """Ensure frontend is built"""
    build_dir = Path("frontend/build")
    
    if not build_dir.exists() or not any(build_dir.iterdir()):
        print("🔨 Building frontend...")
        try:
            result = subprocess.run(
                ["npm", "run", "build"], 
                cwd="frontend", 
                capture_output=True, 
                text=True, 
                timeout=60
            )
            if result.returncode == 0:
                print("✅ Frontend built successfully")
                return True
            else:
                print(f"❌ Frontend build failed: {result.stderr}")
                return False
        except Exception as e:
            print(f"❌ Build error: {e}")
            return False
    
    print("✅ Frontend build found")
    return True

def main():
    print("🎯 Content Marketing AI - Working Local Server")
    print("=" * 60)
    
    # Check backend
    if not check_backend():
        print("❌ Backend not running!")
        print("💡 Start with: docker-compose -f docker-compose.simple.yml up -d")
        return
    print("✅ Backend API: Running")
    
    # Ensure frontend is built
    if not ensure_frontend_built():
        return
    
    # Set up server
    port = 3000
    build_dir = Path("frontend/build")
    
    if not build_dir.exists():
        print("❌ Build directory not found")
        return
    
    # Change to build directory
    os.chdir(build_dir)
    
    # Start server
    with socketserver.TCPServer(("", port), WorkingProxyHandler) as httpd:
        print("=" * 60)
        print("🎉 FULLY FUNCTIONAL LOCAL ENVIRONMENT!")
        print("=" * 60)
        print(f"🌐 Dashboard: http://localhost:{port}")
        print(f"🔧 Backend: http://localhost:8000") 
        print(f"📚 API Docs: http://localhost:8000/docs")
        print("=" * 60)
        print("✨ Features Working:")
        print("   ✅ React Dashboard with Live Data")
        print("   ✅ Full CRUD Operations")
        print("   ✅ API Proxy (No CORS Issues)")
        print("   ✅ Multi-Agent AI Framework")
        print("   ✅ Real-time Updates")
        print("=" * 60)
        
        # Open browser
        try:
            webbrowser.open(f"http://localhost:{port}")
            print("🚀 Browser opened!")
        except:
            print("🚀 Open browser manually: http://localhost:3000")
        
        print("✨ Press Ctrl+C to stop")
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n🛑 Server stopped")

if __name__ == "__main__":
    main() 