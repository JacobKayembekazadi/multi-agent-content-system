#!/usr/bin/env python3
"""
Full System Test Script
Tests both frontend and backend functionality
"""

import requests
import time
import webbrowser

def test_backend():
    """Test backend API"""
    print("🔍 Testing Backend API...")
    try:
        response = requests.get("http://localhost:8000/health", timeout=5)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Backend API: {data.get('status', 'running')}")
            return True
        else:
            print(f"❌ Backend API: HTTP {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Backend API: {e}")
        return False

def test_frontend():
    """Test frontend"""
    print("🔍 Testing Frontend...")
    try:
        response = requests.get("http://localhost:3000", timeout=5)
        if response.status_code == 200:
            print("✅ Frontend: Accessible")
            return True
        else:
            print(f"❌ Frontend: HTTP {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Frontend: {e}")
        return False

def test_api_proxy():
    """Test API proxy through frontend"""
    print("🔍 Testing API Proxy...")
    
    # Test direct API calls through frontend server
    test_endpoints = [
        "/health",
        "/dashboard/stats", 
        "/campaigns",
        "/agents/status"
    ]
    
    working = 0
    for endpoint in test_endpoints:
        try:
            response = requests.get(f"http://localhost:3000{endpoint}", timeout=3)
            if response.status_code == 200:
                print(f"✅ Proxy: {endpoint}")
                working += 1
            else:
                print(f"❌ Proxy: {endpoint} -> {response.status_code}")
        except Exception as e:
            print(f"❌ Proxy: {endpoint} -> {str(e)[:50]}...")
    
    print(f"📊 API Proxy: {working}/{len(test_endpoints)} working")
    return working == len(test_endpoints)

def main():
    print("🧪 Content Marketing AI - Full System Test")
    print("=" * 60)
    
    backend_ok = test_backend()
    frontend_ok = test_frontend()
    proxy_ok = test_api_proxy() if frontend_ok else False
    
    print("\n" + "=" * 60)
    print("📋 FINAL STATUS")
    print("=" * 60)
    
    if backend_ok:
        print("✅ Backend API: FULLY FUNCTIONAL")
    else:
        print("❌ Backend API: Issues detected")
        print("   💡 Run: docker-compose -f docker-compose.simple.yml up -d")
    
    if frontend_ok:
        print("✅ Frontend: ACCESSIBLE")
    else:
        print("❌ Frontend: Not accessible")
        print("   💡 Run: python working_local_server.py")
    
    if proxy_ok:
        print("✅ API Integration: WORKING")
    else:
        print("❌ API Integration: Issues detected")
    
    all_working = backend_ok and frontend_ok and proxy_ok
    
    if all_working:
        print("\n🎉 SYSTEM FULLY FUNCTIONAL!")
        print("🌐 Dashboard: http://localhost:3000")
        print("🔧 Backend: http://localhost:8000")
        print("📚 API Docs: http://localhost:8000/docs")
        print("\n🚀 Opening dashboard...")
        try:
            webbrowser.open("http://localhost:3000")
        except:
            pass
    else:
        print(f"\n⚠️  Issues detected. Follow the recommendations above.")
    
    return all_working

if __name__ == "__main__":
    main() 