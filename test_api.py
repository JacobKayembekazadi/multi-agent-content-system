#!/usr/bin/env python3
"""
Test script for Content Marketing AI Framework API
Tests all the enhanced endpoints to ensure they're working properly.
"""

import asyncio
import aiohttp
import json
from datetime import datetime

API_BASE_URL = "http://localhost:8000"

class APITester:
    def __init__(self, base_url=API_BASE_URL):
        self.base_url = base_url
        self.session = None
    
    async def __aenter__(self):
        self.session = aiohttp.ClientSession()
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.session:
            await self.session.close()
    
    async def test_endpoint(self, method, endpoint, data=None, expected_status=200):
        """Test a single API endpoint"""
        url = f"{self.base_url}{endpoint}"
        
        try:
            if method == "GET":
                async with self.session.get(url) as response:
                    result = await response.json()
                    status = response.status
            elif method == "POST":
                async with self.session.post(url, json=data) as response:
                    result = await response.json()
                    status = response.status
            
            success = status == expected_status
            print(f"{'✅' if success else '❌'} {method} {endpoint} - Status: {status}")
            
            if not success:
                print(f"   Expected: {expected_status}, Got: {status}")
                print(f"   Response: {result}")
            else:
                # Print some key data for successful requests
                if endpoint == "/dashboard/stats":
                    print(f"   Total Leads: {result.get('total_leads', 'N/A')}")
                elif endpoint == "/agents/status":
                    print(f"   Active Agents: {len(result) if isinstance(result, list) else 'N/A'}")
                elif endpoint == "/workflows":
                    workflows = result.get('workflows', [])
                    print(f"   Available Workflows: {len(workflows)}")
                elif endpoint == "/campaigns":
                    print(f"   Campaigns: {len(result) if isinstance(result, list) else 'N/A'}")
            
            return success, result
            
        except Exception as e:
            print(f"❌ {method} {endpoint} - Error: {str(e)}")
            return False, None
    
    async def run_tests(self):
        """Run all API tests"""
        print("🚀 Testing Content Marketing AI Framework API")
        print("=" * 50)
        
        # Test basic endpoints
        await self.test_endpoint("GET", "/")
        await self.test_endpoint("GET", "/health")
        
        # Test dashboard endpoints
        await self.test_endpoint("GET", "/dashboard/stats")
        
        # Test campaign endpoints
        await self.test_endpoint("GET", "/campaigns")
        await self.test_endpoint("GET", "/campaigns/1")
        
        # Test workflow endpoints
        await self.test_endpoint("GET", "/workflows")
        
        # Test agent endpoints
        await self.test_endpoint("GET", "/agents/status")
        
        # Test task endpoints
        await self.test_endpoint("GET", "/tasks")
        await self.test_endpoint("GET", "/tasks/1")
        
        # Test integration endpoints
        await self.test_endpoint("GET", "/integrations/status")
        await self.test_endpoint("GET", "/metrics/performance")
        
        print("\n" + "=" * 50)
        print("🧪 Testing POST endpoints with sample data")
        print("=" * 50)
        
        # Test campaign creation
        campaign_data = {
            "campaign_name": "API Test Campaign",
            "start_date": "2024-01-01",
            "end_date": "2024-03-31",
            "goals": ["test_goal"],
            "target_audience": "test audience",
            "workflows": ["content_creation_workflow"],
            "platforms": ["blog"],
            "budget": 1000.0,
            "kpis": ["engagement"]
        }
        success, result = await self.test_endpoint("POST", "/campaigns", campaign_data)
        if success:
            print(f"   Created Campaign ID: {result.get('campaign_id', 'N/A')}")
        
        # Test workflow execution
        workflow_data = {
            "workflow_name": "content_creation_workflow",
            "workflow_data": {
                "topic": "API Testing",
                "keywords": ["api", "testing"],
                "tone": "technical"
            }
        }
        success, result = await self.test_endpoint("POST", "/workflows/execute", workflow_data)
        if success:
            print(f"   Workflow Task ID: {result.get('task_id', 'N/A')}")
        
        # Test content generation
        content_data = {
            "type": "blog_post",
            "topic": "API Testing Best Practices",
            "keywords": ["api", "testing", "best practices"],
            "tone": "professional",
            "word_count": 800
        }
        success, result = await self.test_endpoint("POST", "/content/generate", content_data)
        if success:
            print(f"   Content Task ID: {result.get('task_id', 'N/A')}")
        
        print("\n✨ API testing completed!")

async def main():
    """Main test function"""
    async with APITester() as tester:
        await tester.run_tests()

if __name__ == "__main__":
    print("Content Marketing AI Framework - API Test Suite")
    print("Make sure the API server is running on http://localhost:8000")
    print("Starting tests...\n")
    
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n⚠️  Tests interrupted by user")
    except Exception as e:
        print(f"\n❌ Test suite failed: {e}") 