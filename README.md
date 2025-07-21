# Multi-Agent Content Marketing AI Framework

A sophisticated AI-powered content marketing system that uses Google Gemini AI and multiple specialized agents to automate content strategy, creation, optimization, and distribution.

## 🚀 Features

### AI Agents
- **Content Strategist**: Creates comprehensive content plans and strategies
- **Content Creator**: Generates blog posts, social media content, and multimedia scripts
- **SEO Optimizer**: Optimizes content for search engines and performs technical audits
- **Social Media Manager**: Handles scheduling, engagement, and performance analysis
- **Analytics Agent**: Tracks performance metrics and generates reports
- **Coordinator**: Orchestrates workflows and manages agent collaboration

### Integrations
- **Google Gemini AI**: Advanced content generation and strategy planning
- **Google Cloud Platform**: Analytics, Drive, Docs, and Sheets integration
- **Zapier MCP**: Connect to 5000+ tools and automate workflows
- **PostgreSQL**: Robust data storage and campaign tracking
- **Redis**: Task queuing and caching for high performance

## 📋 Prerequisites

- Docker & Docker Compose 3.8+
- Node.js 18+ and npm
- Python 3.11+
- Git

### API Keys and Credentials Required
- Google Cloud Platform project with enabled APIs
- Google OAuth2 credentials (Client ID/Secret)
- Google Gemini API key
- Zapier API key and webhook URLs

## ⚡ Quick Start

### 1. Clone and Setup

```bash
git clone <repository-url>
cd content-marketing-framework
cp .env.example .env
```

### 2. Configure Environment Variables

Edit `.env` with your actual credentials:

```bash
# Google Gemini AI
GOOGLE_API_KEY=your_google_gemini_api_key_here

# Google Integration
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_APPLICATION_CREDENTIALS=./credentials/google-credentials.json

# Zapier
ZAPIER_API_KEY=your_zapier_api_key_here
```

### 3. Setup Google Cloud Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Enable required APIs:
   - Google Analytics Data API
   - Google Drive API
   - Google Docs API
   - Google Sheets API
4. Create service account and download JSON credentials
5. Save as `./credentials/google-credentials.json`

### 4. Get Google Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to your `.env` file as `GOOGLE_API_KEY`

### 5. Setup Zapier Integration

1. Create [Zapier Developer Account](https://developer.zapier.com)
2. Create webhooks for each tool integration:
   - Hootsuite: Social media scheduling
   - Mailchimp: Email marketing
   - Slack: Team notifications
   - Additional tools as needed
3. Update Zapier webhook URLs in `.env`

### 6. Launch with Docker Compose

```bash
# Build and start all services
docker-compose up --build -d

# Check service status
docker-compose ps

# View logs
docker-compose logs -f content-marketing-api
```

### 7. Verify Installation

- **Frontend Dashboard**: http://localhost:3000
- **API Documentation**: http://localhost:8000/docs
- **API Health**: http://localhost:8000/health
- **Database**: localhost:5432
- **Redis**: localhost:6379

## 🎯 Usage Examples

### Create a Marketing Campaign

```bash
curl -X POST "http://localhost:8000/campaigns" \
  -H "Content-Type: application/json" \
  -d '{
    "campaign_name": "Q4 Product Launch",
    "start_date": "2024-10-01",
    "end_date": "2024-12-31",
    "goals": ["increase_brand_awareness", "generate_leads"],
    "target_audience": "B2B decision makers in tech",
    "workflows": ["content_creation", "seo_optimization"],
    "platforms": ["linkedin", "twitter", "blog"],
    "budget": 50000,
    "kpis": ["leads_generated", "content_engagement"]
  }'
```

### Generate Content

```bash
curl -X POST "http://localhost:8000/content/generate" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "blog_post",
    "topic": "AI in Marketing Automation",
    "keywords": ["AI marketing", "automation", "digital transformation"],
    "tone": "professional",
    "word_count": 1500
  }'
```

### Execute Workflow

```bash
curl -X POST "http://localhost:8000/workflows/execute" \
  -H "Content-Type: application/json" \
  -d '{
    "workflow_name": "content_creation",
    "workflow_data": {
      "topic": "Content Marketing Trends 2024",
      "target_audience": "Marketing professionals",
      "platforms": ["linkedin", "blog"]
    }
  }'
```

### Check Agent Status

```bash
curl -X GET "http://localhost:8000/agents/status"
```

## 🏗️ Architecture

### System Components

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend UI   │    │   Backend API   │    │   AI Agents     │
│   (React)       │◄──►│   (FastAPI)     │◄──►│   (Gemini)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                ┌─────────────┼─────────────┐
                │             │             │
        ┌───────▼────┐ ┌──────▼─────┐ ┌─────▼────────┐
        │ PostgreSQL │ │   Redis    │ │ Google Cloud │
        │ Database   │ │   Cache    │ │ Services     │
        └────────────┘ └────────────┘ └──────────────┘
```

### Agent Workflow

```
Content Strategy → Content Creation → SEO Optimization → Social Distribution → Analytics
      ▲                                                                           │
      └───────────────────── Feedback Loop ─────────────────────────────────────┘
```

## 🔧 Configuration

### Agent Configuration

Each agent can be customized through environment variables:

```python
# Example agent configuration
CONTENT_STRATEGIST_MODEL=gemini-1.5-pro
CONTENT_STRATEGIST_MAX_TASKS=3
CONTENT_CREATOR_TONE=professional
SEO_OPTIMIZER_KEYWORDS_LIMIT=10
```

### Webhook Configuration

Configure Zapier webhooks for different tools:

```bash
# Social Media
ZAPIER_HOOTSUITE_WEBHOOK=https://hooks.zapier.com/hooks/catch/...
ZAPIER_BUFFER_WEBHOOK=https://hooks.zapier.com/hooks/catch/...

# Email Marketing
ZAPIER_MAILCHIMP_WEBHOOK=https://hooks.zapier.com/hooks/catch/...
ZAPIER_HUBSPOT_WEBHOOK=https://hooks.zapier.com/hooks/catch/...

# Analytics
ZAPIER_GOOGLE_ANALYTICS_WEBHOOK=https://hooks.zapier.com/hooks/catch/...
```

## 📊 Monitoring and Logging

### Health Checks

```bash
# API Health
curl http://localhost:8000/health

# Database Connection
docker-compose exec postgres pg_isready

# Redis Connection
docker-compose exec redis redis-cli ping
```

### Logs

```bash
# All services
docker-compose logs

# Specific service
docker-compose logs content-marketing-api

# Follow logs
docker-compose logs -f content-marketing-api
```

### Metrics

The framework exposes Prometheus metrics at `/metrics` endpoint for monitoring:

- Request counts and latencies
- Agent task processing times
- Database connection pool status
- Cache hit/miss ratios

## 🛠️ Development

### Local Development Setup

```bash
# Backend development
cd backend
python -m venv venv
source venv/bin/activate  # or `venv\Scripts\activate` on Windows
pip install -r requirements.txt
uvicorn api_backend:app --reload

# Frontend development (if applicable)
cd frontend
npm install
npm start
```

### Running Tests

```bash
# Backend tests
cd backend
pytest

# Integration tests
docker-compose -f docker-compose.test.yml up --abort-on-container-exit
```

### Adding New Agents

1. Create agent class inheriting from `BaseAgent`
2. Implement `process_task` method
3. Register agent in framework initialization
4. Add agent-specific configuration options

```python
class CustomAgent(BaseAgent):
    async def process_task(self, task: Task) -> Dict[str, Any]:
        # Implement custom agent logic
        return {"result": "processed"}
```

## 🚀 Production Deployment

### Kubernetes Deployment

```bash
# Apply Kubernetes manifests
kubectl apply -f k8s/

# Check deployment status
kubectl get pods
kubectl get services
```

### Environment Security

```bash
# Use secrets management
export GOOGLE_CLIENT_SECRET=$(aws secretsmanager get-secret-value --secret-id google-creds --query SecretString --output text)

# Restrict file permissions
chmod 600 ./credentials/google-credentials.json
chmod 600 .env
```

### SSL Configuration

Update nginx configuration for HTTPS:

```nginx
server {
    listen 443 ssl http2;
    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
}
```

## 🐛 Troubleshooting

### Common Issues

1. **Google API Authentication Errors**
   ```bash
   # Check credentials file
   cat ./credentials/google-credentials.json
   
   # Verify API key
   curl "https://generativelanguage.googleapis.com/v1beta/models?key=${GOOGLE_API_KEY}"
   ```

2. **Database Connection Issues**
   ```bash
   # Check PostgreSQL logs
   docker-compose logs postgres
   
   # Test connection
   docker-compose exec postgres psql -U user -d content_marketing -c "SELECT 1;"
   ```

3. **Redis Connection Issues**
   ```bash
   # Check Redis status
   docker-compose exec redis redis-cli ping
   
   # View Redis logs
   docker-compose logs redis
   ```

4. **Agent Not Processing Tasks**
   ```bash
   # Check agent status
   curl http://localhost:8000/agents/status
   
   # View agent logs
   docker-compose logs content-marketing-api | grep "agent"
   ```

### Performance Optimization

1. **Database Optimization**
   - Ensure proper indexing on frequently queried columns
   - Use connection pooling
   - Monitor query performance

2. **Redis Configuration**
   - Adjust memory limits based on usage
   - Configure persistence settings
   - Monitor cache hit ratios

3. **Agent Performance**
   - Adjust `max_concurrent_tasks` per agent
   - Monitor task queue sizes
   - Optimize Gemini API usage

## 📚 API Documentation

### **Enhanced API Endpoints**

The backend now includes comprehensive endpoints for full dashboard functionality:

#### **Core Operations**
- `GET /` - API root and status
- `GET /health` - System health check with framework status
- `GET /dashboard/stats` - Real-time dashboard statistics and KPIs

#### **Campaign Management**
- `POST /campaigns` - Create new marketing campaigns
- `GET /campaigns` - List all campaigns with status
- `GET /campaigns/{id}` - Get detailed campaign information

#### **Workflow Orchestration**
- `POST /workflows/execute` - Execute AI agent workflows
- `GET /workflows` - List available workflows with descriptions

#### **Agent Management**
- `GET /agents/status` - Real-time agent status and task queues
- `GET /tasks` - Recent tasks across all agents
- `GET /tasks/{id}` - Detailed task information and logs

#### **Content Operations**
- `POST /content/generate` - Generate content using Google Gemini AI
- `GET /content/{id}` - Retrieve generated content

#### **Integration Status**
- `GET /integrations/status` - Check all integration connections
- `GET /metrics/performance` - System performance metrics

#### **Real-time Updates**
- `WebSocket /ws/agent-updates` - Live agent status updates

### **API Documentation**
Full interactive API documentation is available when the server is running:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the troubleshooting section above
- Review the API documentation at `/docs`

---

**Note**: This framework uses Google Gemini AI for content generation. Ensure you comply with Google's usage policies and rate limits. 