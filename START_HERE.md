# 🚀 **START HERE - Get Your App Running in 2 Minutes!**

## ✅ **Step 1: Start Backend (30 seconds)**
```powershell
docker-compose -f docker-compose.simple.yml up -d
```

## ✅ **Step 2: Start Frontend (30 seconds)**
```powershell
python simple_working_server.py
```

## ✅ **Step 3: Open Your Browser**
Go to: **http://localhost:3000**

---

## 🎉 **That's It! Your App is Running!**

### 🌐 **URLs:**
- **📊 Dashboard:** http://localhost:3000
- **🔧 Backend API:** http://localhost:8000  
- **📚 API Docs:** http://localhost:8000/docs

### ✨ **Features You Can Test:**
- ➕ **Create Campaigns** - Click "Create Campaign"
- ✏️ **Manage Content** - Click "Create Content" 
- 🤖 **AI Generation** - Use "Generate with AI" buttons
- 📈 **View Analytics** - Dashboard shows live metrics
- 👥 **Agent Status** - See all 6 AI agents working

---

## 🆘 **If Something Goes Wrong:**

### Backend Issues:
```powershell
docker-compose -f docker-compose.simple.yml down
docker-compose -f docker-compose.simple.yml up -d --build
```

### Frontend Issues:
```powershell
cd frontend
npm run build
cd ..
python simple_working_server.py
```

### Test Everything:
```powershell
python test_full_system.py
```

---

## 🎯 **You're Ready to Go!**
Your **fully functional** Content Marketing AI system is now running locally! 