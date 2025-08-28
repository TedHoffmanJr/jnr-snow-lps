#!/usr/bin/env python3
"""
Simple HTTP Server for J and R Snow Landing Pages Local Development

Usage:
  python server.py

Then visit:
  http://localhost:8000/snow-cicero/
  http://localhost:8000/snow-clay/
  http://localhost:8000/snow-liverpool/
  etc.

Features:
- Serves from current directory
- Handles CORS for local development
- Serves common MIME types
- Shows helpful startup message
"""

import http.server
import socketserver
import os
import sys
from pathlib import Path

class CORSRequestHandler(http.server.SimpleHTTPRequestHandler):
    """Custom handler that adds CORS headers for local development"""
    
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()
    
    def guess_type(self, path):
        """Add some common MIME types"""
        mimetype = super().guess_type(path)
        if mimetype == 'text/plain':
            if path.endswith('.css'):
                return 'text/css'
            elif path.endswith('.js'):
                return 'application/javascript'
        return mimetype

def main():
    PORT = 8000
    
    # Change to the script directory
    os.chdir(Path(__file__).parent)
    
    print("=" * 60)
    print("🚀 J and R Snow Landing Pages - Local Development Server")
    print("=" * 60)
    print(f"📁 Serving from: {os.getcwd()}")
    print(f"🌐 Server running at: http://localhost:{PORT}")
    print()
    print("📄 Available Pages:")
    print(f"   • Cicero:      http://localhost:{PORT}/snow-cicero/")
    print(f"   • Clay:        http://localhost:{PORT}/snow-clay/")
    print(f"   • Liverpool:   http://localhost:{PORT}/snow-liverpool/")
    print(f"   • Commercial:  http://localhost:{PORT}/snow-commercial/")
    print(f"   • Giveaway:    http://localhost:{PORT}/snow-giveaway/")
    print()
    print("🎯 Current Focus: snow-cicero (other pages not built yet)")
    print("📱 Test on mobile: Open DevTools > Toggle device toolbar")
    print()
    print("Press Ctrl+C to stop the server")
    print("=" * 60)
    
    try:
        with socketserver.TCPServer(("", PORT), CORSRequestHandler) as httpd:
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n\n✅ Server stopped. Happy coding!")
        sys.exit(0)
    except OSError as e:
        if e.errno == 98 or "already in use" in str(e).lower():
            print(f"\n❌ Port {PORT} is already in use!")
            print("Try:")
            print(f"   • Kill existing server: lsof -ti:{PORT} | xargs kill")
            print(f"   • Use different port: python server.py --port 8001")
        else:
            print(f"❌ Error starting server: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()