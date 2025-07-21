# Multi-Agent Content Marketing AI Framework - Setup Guide

## Overview

This comprehensive framework provides a multi-agent AI system for content marketing automation, integrating Google ADK, Google A2A, and Zapier MCP to create a powerful, scalable solution.

## Architecture Components

### Core Components
- **Backend API** (FastAPI + Python): Multi-agent coordination and API endpoints
- **Frontend Dashboard** (React + TypeScript): Real-time monitoring and control interface
- **Database** (PostgreSQL): Persistent storage for campaigns, tasks, and metrics
- **Cache/Queue** (Redis): Task queuing and session management
- **Reverse Proxy** (Nginx): Load balancing and SSL termination

### AI Agents
1. **Content Strategist**: Strategy planning, competitor analysis, trend identification
2. **Content Creator**: Blog posts, social media content, video scripts
3. **SEO Optimizer**: Keyword research, content optimization, technical audits
4. **Social Media Manager**: Post scheduling, engagement, performance tracking
5. **Analytics Agent**: Reporting, KPI tracking, attribution analysis
6. **Coordinator**: Workflow orchestration and inter-agent communication

### Integrations
- **Google ADK**: Analytics, Search Console, Cloud Services
- **Google A2A**: Drive, Sheets, Docs, Gmail APIs with OAuth2
- **Zapier MCP**: Tool integrations (Hootsuite, Mailchimp, Slack, etc.)

## Prerequisites

### System Requirements
- **OS**: Ubuntu 20.04+ / macOS 12+ / Windows 10+ with WSL2
- **Memory**: 8GB RAM minimum, 16GB recommended
- **Storage**: 20GB free space minimum
- **CPU**: 4+ cores recommended
- **Network**: Stable internet connection for API integrations

### Software Dependencies
- Docker & Docker Compose 3.8+
- Node.js 18+ and npm
- Python 3.11+
- Git

### API Keys and Credentials Required
- Google Cloud Platform project with enabled APIs
- Google OAuth2 credentials (Client ID/Secret)
- Google Gemini API key
- Zapier API key and webhook URLs

## Quick Start (Development)

### 1. Clone and Setup Repository

```bash
# Clone the repository
git clone <repository-url>
cd content-marketing-ai-framework

# Create directory structure
mkdir -p backend frontend credentials logs nginx

# Copy configuration files
cp .env.example .env
```

### 2. Configure Environment Variables

Edit `.env` file with your credentials:

```bash
# Google Integration
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_APPLICATION_CREDENTIALS=/app/credentials/google-credentials.json

# Google Gemini AI
GOOGLE_API_KEY=your_google_gemini_api_key_here

# Zapier
ZAPIER_API_KEY=your_zapier_api_key_here
```

### 3. Setup Google Cloud Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Enable required APIs:
   - Google Analytics Data API
   - Google Analytics Reporting API
   - Google Search Console API
   - Google Drive API
   - Google Sheets API
   - Google Docs API
   - Gmail API

4. Create service account and download JSON credentials
5. Place credentials file at `./credentials/google-credentials.json`

### 4. Configure OAuth2 for Google A2A

1. In Google Cloud Console → APIs & Services → Credentials
2. Create OAuth 2.0 Client ID
3. Set authorized redirect URIs:
   - `http://localhost:3000/callback`
   - `https://yourdomain.com/callback` (production)

### 5. Setup Zapier Integration

1. Create Zapier account and get API key
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
docker-compose logs -f content-marketing-ui
```

### 7. Verify Installation

- **Frontend**: http://localhost:3000
- **API Documentation**: http://localhost:8000/docs
- **API Health**: http://localhost:8000/health
- **Database**: localhost:5432
- **Redis**: localhost:6379

## Production Deployment

### Option 1: Docker Swarm

```bash
# Initialize swarm
docker swarm init

# Create secrets
echo "your_secret_key" | docker secret create db_password -
echo "your_google_credentials" | docker secret create google_creds -

# Deploy stack
docker stack deploy -c docker-compose.prod.yml content-marketing

# Scale services
docker service scale content-marketing_api=3
```

### Option 2: Kubernetes

```bash
# Create namespace
kubectl create namespace content-marketing

# Apply secrets
kubectl create secret generic db-secret \
  --from-literal=url="postgresql://user:password@postgres:5432/content_marketing" \
  -n content-marketing

kubectl create secret generic google-creds \
  --from-file=credentials.json=./credentials/google-credentials.json \
  -n content-marketing

# Deploy application
kubectl apply -f k8s/ -n content-marketing

# Check deployment
kubectl get pods -n content-marketing
kubectl get services -n content-marketing
```

### Option 3: Cloud Deployment (AWS/GCP/Azure)

#### AWS ECS with Fargate

```bash
# Create ECS cluster
aws ecs create-cluster --cluster-name content-marketing-cluster

# Register task definitions
aws ecs register-task-definition --cli-input-json file://ecs-task-definition.json

# Create service
aws ecs create-service \
  --cluster content-marketing-cluster \
  --service-name content-marketing-service \
  --task-definition content-marketing-task \
  --desired-count 2
```

#### Google Cloud Run

```bash
# Build and push images
gcloud builds submit --tag gcr.io/PROJECT_ID/content-marketing-api
gcloud builds submit --tag gcr.io/PROJECT_ID/content-marketing-ui

# Deploy services
gcloud run deploy content-marketing-api \
  --image gcr.io/PROJECT_ID/content-marketing-api \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated

gcloud run deploy content-marketing-ui \
  --image gcr.io/PROJECT_ID/content-marketing-ui \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

## Configuration Guide

### Google ADK Setup

```python
# Configure Google Analytics
ANALYTICS_PROPERTY_ID = "your_property_id"
ANALYTICS_VIEW_ID = "your_view_id"

# Configure Search Console
SEARCH_CONSOLE_SITE_URL = "https://yourwebsite.com"
```

### Zapier MCP Configuration

```json
{
  "zapier_tools": {
    "hootsuite": {
      "webhook_url": "https://hooks.zapier.com/hooks/catch/123/abc",
      "auth_token": "your_hootsuite_token"
    },
    "mailchimp": {
      "webhook_url": "https://hooks.zapier.com/hooks/catch/456/def",
      "api_key": "your_mailchimp_key"
    },
    "slack": {
      "webhook_url": "https://hooks.zapier.com/hooks/catch/789/ghi",
      "bot_token": "your_slack_bot_token"
    }
  }
}
```

### Agent Configuration

```python
# Customize agent capabilities and models
AGENT_CONFIGS = {
    "content_strategist": {
        "model": "gpt-4",
        "max_tokens": 4000,
        "temperature": 0.7,
        "capabilities": ["strategy", "analysis", "planning"]
    },
    "content_creator": {
        "model": "gpt-4",
        "max_tokens": 8000,
        "temperature": 0.8,
        "capabilities": ["writing", "creativity", "multimedia"]
    }
}
```

## Usage Examples

### Creating a Campaign

```bash
# Using API directly
curl -X POST "http://localhost:8000/campaigns" \
-H "Content-Type: application/json" \
-d '{
  "campaign_name": "Product Launch Q4",
  "start_date": "2024-10-01",
  "end_date": "2024-12-31",
  "goals": ["brand_awareness", "lead_generation"],
  "target_audience": "B2B decision makers",
  "workflows": ["content_creation_workflow", "seo_optimization_workflow"],
  "platforms": ["linkedin", "twitter", "blog"],
  "budget": 50000,
  "kpis": ["leads_generated", "content_engagement"]
}'
```

### Running Workflows

```bash
# Execute content creation workflow
curl -X POST "http://localhost:8000/workflows/execute" \
-H "Content-Type: application/json" \
-d '{
  "workflow_name": "content_creation_workflow",
  "workflow_data": {
    "topic": "AI in Marketing",
    "keywords": ["ai marketing", "automation"],
    "content_type": "blog_post",
    "word_count": 1500
  }
}'
```

### Monitoring and Analytics

```bash
# Get dashboard statistics
curl "http://localhost:8000/dashboard/stats"

# Get agent status
curl "http://localhost:8000/agents/status"

# Generate analytics report
curl "http://localhost:8000/analytics/report/performance?date_range=last_30_days"
```

## Monitoring and Maintenance

### Health Checks

```bash
# Check all services
docker-compose exec content-marketing-api curl http://localhost:8000/health
docker-compose exec redis redis-cli ping
docker-compose exec postgres pg_isready -U user -d content_marketing
```

### Log Management

```bash
# View real-time logs
docker-compose logs -f --tail=100 content-marketing-api

# Export logs
docker-compose logs content-marketing-api > api_logs.txt
```

### Database Maintenance

```bash
# Backup database
docker-compose exec postgres pg_dump -U user content_marketing > backup.sql

# Restore database
docker-compose exec -T postgres psql -U user content_marketing < backup.sql

# Run migrations
docker-compose exec content-marketing-api alembic upgrade head
```

### Performance Monitoring

```bash
# Monitor resource usage
docker stats

# Check system metrics
curl "http://localhost:8000/metrics/performance"

# View Prometheus metrics (if enabled)
curl "http://localhost:9090/metrics"
```

## Security Considerations

### SSL/TLS Configuration

```nginx
# Enable HTTPS in nginx.conf
server {
    listen 443 ssl http2;
    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
}
```

### API Rate Limiting

```python
# Configure rate limiting in FastAPI
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(429, _rate_limit_exceeded_handler)

@app.get("/api/data")
@limiter.limit("10/minute")
async def get_data(request: Request):
    return {"data": "value"}
```

### Environment Security

```bash
# Use secrets management
export GOOGLE_CLIENT_SECRET=$(aws secretsmanager get-secret-value --secret-id google-creds --query SecretString --output text)

# Restrict file permissions
chmod 600 ./credentials/google-credentials.json
chmod 600 .env
```

## Troubleshooting

### Common Issues

**1. Google API Authentication Errors**
```bash
# Verify credentials file
cat ./credentials/google-credentials.json | jq .

# Check API quotas in Google Cloud Console
# Ensure service account has necessary permissions
```

**2. Zapier Webhook Failures**
```bash
# Test webhook connectivity
curl -X POST "https://hooks.zapier.com/hooks/catch/123/abc" \
-H "Content-Type: application/json" \
-d '{"test": "data"}'
```

**3. Database Connection Issues**
```bash
# Check database connectivity
docker-compose exec postgres psql -U user -d content_marketing -c "SELECT version();"

# Reset database if needed
docker-compose down -v
docker-compose up postgres -d
```

**4. Redis Connection Problems**
```bash
# Test Redis connection
docker-compose exec redis redis-cli ping

# Clear Redis cache
docker-compose exec redis redis-cli FLUSHALL
```

### Debug Mode

```bash
# Run in debug mode
DEBUG=True docker-compose up --build

# Enable verbose logging
LOG_LEVEL=DEBUG docker-compose restart content-marketing-api
```

## Scaling and Optimization

### Horizontal Scaling

```bash
# Scale API service
docker-compose up --scale content-marketing-api=3

# Load balance with nginx
# Update nginx.conf with multiple upstream servers
```

### Database Optimization

```sql
-- Add database indexes for better performance
CREATE INDEX CONCURRENTLY idx_tasks_status_created ON tasks(status, created_at);
CREATE INDEX CONCURRENTLY idx_campaigns_active ON campaigns(status) WHERE status = 'active';
```

### Caching Strategy

```python
# Implement Redis caching
import redis

cache = redis.Redis(host='redis', port=6379, decode_responses=True)

@app.get("/cached-data")
async def get_cached_data():
    cached_result = cache.get("data_key")
    if cached_result:
        return json.loads(cached_result)
    
    # Compute result and cache
    result = compute_expensive_operation()
    cache.setex("data_key", 3600, json.dumps(result))
    return result
```

## Support and Resources

### Documentation
- API Documentation: `http://localhost:8000/docs`
- Database Schema: See `init.sql`
- Architecture Diagrams: `/docs/architecture/`

### Community
- GitHub Issues: Report bugs and feature requests
- Discord Server: Real-time community support
- Wiki: Extended documentation and examples

### Professional Support
- Enterprise Support: Available for production deployments
- Custom Development: Tailored solutions and integrations
- Training Services: Team onboarding and best practices

## License and Contributing

This framework is released under the MIT License. Contributions are welcome! Please read our Contributing Guidelines and Code of Conduct before submitting pull requests.

### Development Setup

```bash
# Development installation
git clone <repo>
cd content-marketing-ai-framework

# Install development dependencies
pip install -r requirements-dev.txt
npm install --dev

# Run tests
pytest tests/
npm test

# Format code
black .
prettier --write .
```

---

**Framework Version**: 1.0.0  
**Last Updated**: July 2025  
**Compatibility**: Python 3.11+, Node.js 18+, Docker 20+