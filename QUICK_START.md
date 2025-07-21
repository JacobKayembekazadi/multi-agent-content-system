# 🚀 Quick Start Guide

## Ready to Launch! 

Your Content Marketing AI Framework is now configured to run in **demo mode** and should build successfully.

## 🏃‍♂️ **Run the System**

```bash
# Build and start all services
docker-compose up --build -d

# Check if everything is running
docker-compose ps

# View logs if needed
docker-compose logs -f content-marketing-api
```

## 🌐 **Access Your Dashboard**

- **Frontend Dashboard**: http://localhost:3000
- **API Documentation**: http://localhost:8000/docs  
- **API Health Check**: http://localhost:8000/health

## 🔧 **What's Running in Demo Mode**

### ✅ **Fully Functional**
- ✅ Frontend React Dashboard
- ✅ FastAPI Backend with all endpoints
- ✅ PostgreSQL Database
- ✅ Redis Cache
- ✅ Agent Status Monitoring
- ✅ Campaign Management
- ✅ Task Tracking
- ✅ Demo Content Generation

### 🔶 **Demo Mode (No Real API Keys Required)**
- 🔶 **Google Gemini AI**: Returns demo content instead of real AI generation
- 🔶 **Google Analytics**: Shows demo metrics and data
- 🔶 **Zapier Integration**: Simulated webhook responses

## 🔑 **Get Real API Keys (Optional)**

To unlock full functionality, get these API keys:

### 1. **Google Gemini AI** (Recommended)
1. Go to https://aistudio.google.com/app/apikey
2. Create an API key
3. Update `.env`: `GOOGLE_API_KEY=your-real-key`
4. Restart: `docker-compose restart`

### 2. **Google Cloud Services** (Optional)
1. Go to https://console.cloud.google.com/
2. Create a service account
3. Download JSON credentials
4. Replace `credentials/google-credentials.json`
5. Restart: `docker-compose restart`

### 3. **Zapier Integration** (Optional)
1. Get Zapier API key
2. Update `.env`: `ZAPIER_API_KEY=your-key`
3. Set up webhook URLs

## 🧪 **Test the API**

```bash
# Run the test suite
python test_api.py
```

## 🎯 **Key Features to Try**

1. **Dashboard Overview**: View KPIs and agent status
2. **Create Campaign**: Use the campaign creation form
3. **Execute Workflows**: Try the content creation workflow
4. **Agent Monitoring**: Watch real-time agent status
5. **Task Tracking**: View recent tasks and their progress

## 🔍 **Troubleshooting**

### If build fails:
```bash
# Clean up and try again
docker-compose down -v
docker system prune -f
docker-compose up --build -d
```

### If services won't start:
```bash
# Check logs
docker-compose logs content-marketing-api
docker-compose logs content-marketing-ui
```

### If frontend can't connect to API:
- Check that backend is running on port 8000
- Verify `.env` has correct `REACT_APP_API_URL=http://localhost:8000`

## 📊 **What You'll See**

- **Working Dashboard** with real-time metrics
- **Agent Status Cards** showing all 6 AI agents
- **Campaign Progress** tracking
- **Task Management** with detailed logs
- **Integration Status** monitoring
- **Performance Charts** and analytics

## 🎉 **Success!**

You now have a fully functional Content Marketing AI Framework running locally! The system demonstrates:

- ✅ Multi-agent AI coordination
- ✅ Real-time dashboard
- ✅ Campaign management
- ✅ Content workflow automation
- ✅ Integration monitoring
- ✅ Performance analytics

**Ready for production?** Add real API keys and deploy to your preferred cloud platform! 