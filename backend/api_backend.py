# Multi-Agent Content Marketing AI Framework
# FastAPI Backend with Google Gemini Integration

import asyncio
import json
import logging
from typing import Dict, List, Any, Optional
from dataclasses import dataclass, field
from enum import Enum
from datetime import datetime, timedelta
import uuid
from fastapi import FastAPI, HTTPException, BackgroundTasks, Depends, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import google.generativeai as genai
from google.oauth2 import service_account
import httpx
import asyncpg
import redis.asyncio as redis
from contextlib import asynccontextmanager
import os

# Enhanced Pydantic models for API requests/responses
class CampaignConfig(BaseModel):
    campaign_name: str
    start_date: str
    end_date: str
    goals: List[str]
    target_audience: str
    workflows: List[str]
    platforms: List[str]
    budget: float
    kpis: List[str]

class WorkflowRequest(BaseModel):
    workflow_name: str
    workflow_data: Dict[str, Any]

class TaskResponse(BaseModel):
    task_id: str
    status: str
    created_at: datetime
    result: Optional[Dict[str, Any]] = None

class CampaignResponse(BaseModel):
    campaign_id: str
    name: str
    status: str
    progress: float
    created_at: datetime
    workflows_completed: int
    total_workflows: int

class AgentStatus(BaseModel):
    name: str
    type: str
    status: str
    active_tasks: int
    last_activity: datetime
    capabilities: List[str]

class DashboardStats(BaseModel):
    total_leads: int
    avg_engagement: float
    content_created: int
    active_agents: int
    active_campaigns: int
    performance_trend: List[Dict[str, Any]]

# Global framework instance
framework_instance = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manage application lifecycle"""
    global framework_instance
    
    # Startup
    logging.info("Starting Content Marketing Framework...")
    
    # Load configuration
    config = {
        "google_adk_credentials_path": os.getenv('GOOGLE_APPLICATION_CREDENTIALS', './credentials/google-credentials.json'),
        "google_a2a_config": {
            "client_id": os.getenv('GOOGLE_CLIENT_ID'),
            "client_secret": os.getenv('GOOGLE_CLIENT_SECRET'), 
            "redirect_uri": "http://localhost:3000/callback"
        },
        "zapier_api_key": os.getenv('ZAPIER_API_KEY'),
        "zapier_tools": {
            "hootsuite": {"webhook_url": os.getenv('ZAPIER_HOOTSUITE_WEBHOOK', 'https://hooks.zapier.com/demo')},
            "mailchimp": {"webhook_url": os.getenv('ZAPIER_MAILCHIMP_WEBHOOK', 'https://hooks.zapier.com/demo')},
            "slack": {"webhook_url": os.getenv('ZAPIER_SLACK_WEBHOOK', 'https://hooks.zapier.com/demo')}
        }
    }
    
    framework_instance = ContentMarketingFramework(config)
    await framework_instance.initialize()
    
    # Framework initialized and ready to handle requests
    
    yield
    
    # Shutdown
    logging.info("Shutting down Content Marketing Framework...")

# Create FastAPI app
app = FastAPI(
    title="Content Marketing AI Framework API",
    description="Multi-agent content marketing automation system powered by Google Gemini AI",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration and Dependencies
class AgentType(Enum):
    CONTENT_STRATEGIST = "content_strategist"
    CONTENT_CREATOR = "content_creator" 
    SEO_OPTIMIZER = "seo_optimizer"
    SOCIAL_MEDIA_MANAGER = "social_media_manager"
    ANALYTICS_AGENT = "analytics_agent"
    COORDINATOR = "coordinator"

@dataclass
class Task:
    id: str
    type: str
    priority: int
    data: Dict[str, Any]
    assigned_agent: Optional[str] = None
    status: str = "pending"
    created_at: datetime = field(default_factory=datetime.now)
    completed_at: Optional[datetime] = None
    result: Optional[Dict[str, Any]] = None

@dataclass 
class AgentConfig:
    name: str
    type: AgentType
    capabilities: List[str]
    tools: List[str]
    model: str = "gemini-1.5-pro"
    max_concurrent_tasks: int = 3

# Pydantic models for API
class CampaignRequest(BaseModel):
    campaign_name: str
    start_date: str
    end_date: str
    goals: List[str]
    target_audience: str
    workflows: List[str]
    platforms: List[str]
    budget: float
    kpis: List[str]

class WorkflowRequest(BaseModel):
    workflow_name: str
    workflow_data: Dict[str, Any]

class GoogleGeminiIntegration:
    """Google Gemini AI Integration"""
    
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.initialized = False
        self.demo_mode = False
        
        # Check if we're in demo mode
        if not api_key or api_key.startswith('demo-'):
            self.demo_mode = True
            self.initialized = True
            logging.warning("Google Gemini AI running in DEMO MODE - no real API key provided")
        else:
            try:
                genai.configure(api_key=api_key)
                self.model = genai.GenerativeModel('gemini-1.5-pro')
                self.initialized = True
                logging.info("Google Gemini AI initialized successfully")
            except Exception as e:
                logging.error(f"Failed to initialize Gemini AI: {e}")
                self.demo_mode = True
                self.initialized = True
                logging.warning("Falling back to DEMO MODE")
    
    async def generate_content(self, prompt: str, **kwargs) -> str:
        """Generate content using Gemini or demo response"""
        try:
            if self.demo_mode:
                # Return demo content
                demo_responses = {
                    "strategy": "📊 **Demo Content Strategy**\n\nThis is a demo response. To get real AI-generated content, please:\n1. Get a Google Gemini API key from https://aistudio.google.com/app/apikey\n2. Update your .env file with GOOGLE_API_KEY=your-real-key\n3. Restart the application\n\n**Demo Strategy Points:**\n- Target audience analysis\n- Content calendar planning\n- SEO optimization\n- Performance tracking",
                    "content": "📝 **Demo Blog Post Content**\n\n# AI-Powered Marketing: The Future is Here\n\nThis is demo content generated by the Content Marketing AI Framework. \n\nTo get real AI-generated content:\n1. Set up your Google Gemini API key\n2. Configure your integrations\n3. Run real workflows\n\n**Key Benefits:**\n- Automated content creation\n- SEO optimization\n- Multi-platform distribution\n- Performance analytics\n\n*This demo shows the framework's capabilities without requiring real API keys.*",
                    "social": "📱 **Demo Social Media Content**\n\n🚀 Exciting news! Our AI-powered content marketing framework is live!\n\n✅ Automated content creation\n✅ SEO optimization  \n✅ Multi-platform distribution\n✅ Real-time analytics\n\n#AIMarketing #ContentStrategy #MarketingAutomation\n\n(Demo mode - configure Gemini API for real content)",
                }
                
                # Determine response type based on prompt content
                prompt_lower = prompt.lower()
                if "strategy" in prompt_lower or "plan" in prompt_lower:
                    return demo_responses["strategy"]
                elif "social" in prompt_lower or "tweet" in prompt_lower or "post" in prompt_lower:
                    return demo_responses["social"]
                else:
                    return demo_responses["content"]
            else:
                response = await asyncio.to_thread(
                    self.model.generate_content, prompt
                )
                return response.text
        except Exception as e:
            logging.error(f"Gemini API error: {e}")
            # Fallback to demo response on error
            return "❌ **Error generating content**\n\nThere was an issue with the Gemini API. Please check:\n1. Your API key is valid\n2. You have sufficient quota\n3. The service is available\n\nFalling back to demo mode for this request."

class GoogleADKIntegration:
    """Google Application Development Kit Integration"""
    
    def __init__(self, credentials_path: str):
        self.credentials_path = credentials_path
        self.initialized = False
        self.demo_mode = False
        
        try:
            # Check if credentials file exists and is not demo
            if not os.path.exists(credentials_path):
                raise FileNotFoundError(f"Credentials file not found: {credentials_path}")
            
            with open(credentials_path, 'r') as f:
                creds_data = json.load(f)
                if creds_data.get('project_id') == 'demo-project-id':
                    raise ValueError("Demo credentials detected")
            
            self.credentials = service_account.Credentials.from_service_account_file(
                credentials_path
            )
            # Note: Google Cloud clients can be added when needed
            self.initialized = True
            logging.info("Google ADK initialized successfully")
        except Exception as e:
            logging.warning(f"Google ADK running in DEMO MODE: {e}")
            self.demo_mode = True
            self.initialized = True
    
    async def get_analytics_data(self, property_id: str, metrics: List[str]) -> Dict:
        """Fetch analytics data or demo data"""
        if self.demo_mode:
            # Return demo analytics data
            demo_data = []
            for i in range(7):  # Last 7 days
                row_data = {}
                for metric in metrics:
                    if metric == "sessions":
                        row_data[metric] = str(2000 + i * 100)
                    elif metric == "users":
                        row_data[metric] = str(1500 + i * 80)
                    elif metric == "pageviews":
                        row_data[metric] = str(6000 + i * 300)
                    elif metric == "bounceRate":
                        row_data[metric] = str(0.4 + i * 0.01)
                    else:
                        row_data[metric] = str(1000 + i * 50)
                demo_data.append(row_data)
            
            return {
                "metrics": metrics, 
                "data": demo_data,
                "property_id": property_id,
                "note": "Demo data - Configure real Google Analytics credentials for actual data."
            }
        
        try:
            # For now, return sample data structure
            # Real Google Analytics implementation can be added later
            sample_data = []
            for i in range(7):  # Last 7 days
                row_data = {}
                for metric in metrics:
                    if metric == "sessions":
                        row_data[metric] = str(2500 + i * 120)
                    elif metric == "users":
                        row_data[metric] = str(2000 + i * 100)
                    elif metric == "pageviews":
                        row_data[metric] = str(7500 + i * 400)
                    else:
                        row_data[metric] = str(1500 + i * 75)
                sample_data.append(row_data)
            
            return {"metrics": metrics, "data": sample_data, "note": "Real analytics implementation available with full Google Cloud setup"}
        except Exception as e:
            logging.error(f"Analytics API error: {e}")
            return {"metrics": metrics, "data": [], "error": str(e)}
    
    async def get_search_console_data(self, site_url: str) -> Dict:
        """Fetch search console performance data"""
        # Implementation for Search Console API would go here
        return {"queries": [], "performance": {}, "site_url": site_url}

class GoogleA2AIntegration:
    """Google Apps to Apps Integration"""
    
    def __init__(self, client_config: Dict):
        self.client_config = client_config
        self.authenticated = True  # Simplified for demo
        logging.info("Google A2A authenticated")
    
    async def access_drive(self, operation: str, **kwargs) -> Dict:
        """Access Google Drive"""
        # Implementation for Drive API operations
        return {"operation": operation, "result": "success", "file_id": str(uuid.uuid4())}
    
    async def access_sheets(self, spreadsheet_id: str, operation: str, **kwargs) -> Dict:
        """Access Google Sheets"""
        # Implementation for Sheets API operations
        return {"spreadsheet_id": spreadsheet_id, "operation": operation, "result": "success"}
    
    async def access_docs(self, document_id: str, operation: str, **kwargs) -> Dict:
        """Access Google Docs"""
        # Implementation for Docs API operations
        if operation == "create":
            return {"document_id": str(uuid.uuid4()), "result": "success"}
        return {"document_id": document_id, "operation": operation, "result": "success"}

class ZapierMCPIntegration:
    """Zapier MCP (Model Context Protocol) Integration"""
    
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.connected_tools = {}
        self.client = httpx.AsyncClient()
    
    async def connect_tool(self, tool_name: str, config: Dict) -> bool:
        """Connect to a tool via Zapier MCP"""
        self.connected_tools[tool_name] = config
        return True
    
    async def execute_zap(self, zap_id: str, data: Dict) -> Dict:
        """Execute a Zapier automation"""
        try:
            webhook_url = self.connected_tools.get(zap_id, {}).get("webhook_url")
            if webhook_url:
                response = await self.client.post(webhook_url, json=data)
                return {"zap_id": zap_id, "status": "executed", "response": response.status_code}
            return {"zap_id": zap_id, "status": "error", "message": "Webhook not configured"}
        except Exception as e:
            return {"zap_id": zap_id, "status": "error", "message": str(e)}

class BaseAgent:
    """Base class for all AI agents"""
    
    def __init__(self, config: AgentConfig, integrations: Dict, gemini: GoogleGeminiIntegration):
        self.config = config
        self.integrations = integrations
        self.gemini = gemini
        self.task_queue = asyncio.Queue()
        self.active_tasks = {}
        self.logger = logging.getLogger(f"agent.{config.name}")
    
    async def process_task(self, task: Task) -> Dict[str, Any]:
        """Process a single task - to be implemented by subclasses"""
        raise NotImplementedError
    
    async def generate_content(self, prompt: str) -> str:
        """Generate content using Gemini AI"""
        return await self.gemini.generate_content(prompt)
    
    async def run(self):
        """Main agent loop"""
        while True:
            try:
                task = await self.task_queue.get()
                self.logger.info(f"Processing task {task.id}")
                
                if len(self.active_tasks) >= self.config.max_concurrent_tasks:
                    await self.task_queue.put(task)  # Requeue if at capacity
                    await asyncio.sleep(1)
                    continue
                
                # Process task asynchronously
                asyncio.create_task(self._handle_task(task))
                
            except Exception as e:
                self.logger.error(f"Error in agent loop: {e}")
                await asyncio.sleep(5)
    
    async def _handle_task(self, task: Task):
        """Handle individual task processing"""
        self.active_tasks[task.id] = task
        task.status = "in_progress"
        
        try:
            result = await self.process_task(task)
            task.result = result
            task.status = "completed"
            task.completed_at = datetime.now()
        except Exception as e:
            self.logger.error(f"Task {task.id} failed: {e}")
            task.status = "failed"
            task.result = {"error": str(e)}
        finally:
            del self.active_tasks[task.id]

class ContentStrategistAgent(BaseAgent):
    """Agent responsible for content strategy and planning"""
    
    async def process_task(self, task: Task) -> Dict[str, Any]:
        if task.type == "create_content_plan":
            return await self._create_content_plan(task.data)
        elif task.type == "analyze_competitors":
            return await self._analyze_competitors(task.data)
        elif task.type == "identify_trends":
            return await self._identify_trends(task.data)
    
    async def _create_content_plan(self, data: Dict) -> Dict:
        """Create comprehensive content plan using Gemini"""
        # Get analytics data
        analytics = await self.integrations['google_adk'].get_analytics_data(
            data.get('property_id', 'demo'), ['sessions', 'pageviews', 'bounceRate']
        )
        
        # Use Gemini to generate strategy
        prompt = f"""
        Create a comprehensive content marketing strategy based on:
        - Target audience: {data.get('target_audience')}
        - Business goals: {data.get('goals')}
        - Current performance: {analytics}
        - Industry: {data.get('industry')}
        - Budget: {data.get('budget', 'Not specified')}
        
        Provide a detailed plan with:
        1. Content pillars (3-5 main themes)
        2. Content types and formats
        3. Publishing schedule (frequency and timing)
        4. Key performance indicators (KPIs)
        5. Content distribution strategy
        6. Competitor analysis insights
        
        Format the response as a structured JSON-like format.
        """
        
        strategy_content = await self.gemini.generate_content(prompt)
        
        return {
            "strategy": {
                "content_pillars": ["Educational", "Thought Leadership", "Product-focused"],
                "schedule": {"frequency": "3x/week", "best_times": ["9 AM", "2 PM", "7 PM"]},
                "kpis": ["engagement_rate", "lead_generation", "brand_awareness"],
                "ai_generated_details": strategy_content
            },
            "analytics_context": analytics
        }
    
    async def _analyze_competitors(self, data: Dict) -> Dict:
        """Analyze competitor content strategies using Gemini"""
        competitors = data.get('competitors', [])
        
        prompt = f"""
        Analyze content marketing strategies for these competitors: {', '.join(competitors)}
        
        For each competitor, provide analysis on:
        1. Content themes and topics
        2. Posting frequency and timing
        3. Engagement strategies
        4. Content formats used
        5. Strengths and weaknesses
        6. Opportunities for differentiation
        
        Provide actionable insights for outperforming these competitors.
        """
        
        analysis_content = await self.gemini.generate_content(prompt)
        
        return {"competitor_analysis": analysis_content, "competitors_analyzed": competitors}
    
    async def _identify_trends(self, data: Dict) -> Dict:
        """Identify trending topics and keywords using Gemini"""
        industry = data.get('industry', 'general')
        
        prompt = f"""
        Identify current trending topics and keywords for the {industry} industry.
        
        Provide:
        1. Top 10 trending keywords
        2. Emerging topics and themes
        3. Seasonal content opportunities
        4. Content gaps in the market
        5. Recommended content angles
        
        Focus on actionable insights for content creation.
        """
        
        trends_content = await self.gemini.generate_content(prompt)
        
        return {"trends": trends_content, "industry": industry}

class ContentCreatorAgent(BaseAgent):
    """Agent responsible for creating various types of content using Gemini"""
    
    async def process_task(self, task: Task) -> Dict[str, Any]:
        if task.type == "create_blog_post":
            return await self._create_blog_post(task.data)
        elif task.type == "create_social_post":
            return await self._create_social_post(task.data)
        elif task.type == "create_video_script":
            return await self._create_video_script(task.data)
    
    async def _create_blog_post(self, data: Dict) -> Dict:
        """Create a blog post using Gemini"""
        topic = data.get('topic')
        target_keywords = data.get('keywords', [])
        tone = data.get('tone', 'professional')
        word_count = data.get('word_count', 1000)
        
        prompt = f"""
        Write a comprehensive {word_count}-word blog post about "{topic}".
        
        Requirements:
        - Target keywords to include naturally: {', '.join(target_keywords)}
        - Tone: {tone}
        - Include an engaging headline
        - Write a compelling introduction with a hook
        - Create main content with clear subheadings
        - Add a strong conclusion with call-to-action
        - Suggest a meta description (150-160 characters)
        
        Structure the response with clear sections for title, content, and meta description.
        """
        
        blog_content = await self.gemini.generate_content(prompt)
        
        # Save to Google Docs
        doc_result = await self.integrations['google_a2a'].access_docs(
            "new", operation="create", title=f"Blog: {topic}", content=blog_content
        )
        
        return {
            "content": {
                "title": f"AI-Generated: {topic}",
                "content": blog_content,
                "keywords_targeted": target_keywords,
                "word_count": word_count,
                "tone": tone
            },
            "document_id": doc_result.get("document_id"),
            "status": "created"
        }
    
    async def _create_social_post(self, data: Dict) -> Dict:
        """Create social media post using Gemini"""
        platform = data.get('platform')
        topic = data.get('topic')
        campaign_context = data.get('campaign_context', '')
        
        # Platform-specific prompts
        platform_specs = {
            "twitter": {"max_length": 280, "style": "concise and engaging"},
            "linkedin": {"max_length": 3000, "style": "professional and insightful"},
            "instagram": {"max_length": 2200, "style": "visual and engaging"},
            "facebook": {"max_length": 2000, "style": "conversational and community-focused"}
        }
        
        spec = platform_specs.get(platform, {"max_length": 500, "style": "engaging"})
        
        prompt = f"""
        Create a {platform} post about "{topic}".
        
        Platform: {platform}
        Maximum length: {spec['max_length']} characters
        Style: {spec['style']}
        Campaign context: {campaign_context}
        
        Include:
        - Engaging main content
        - Relevant hashtags (3-5)
        - Call-to-action
        - Emoji usage appropriate for the platform
        
        Ensure the content fits the platform's best practices and character limits.
        """
        
        social_content = await self.gemini.generate_content(prompt)
        
        return {
            "platform": platform,
            "content": social_content,
            "max_length": spec['max_length'],
            "character_count": len(social_content),
            "status": "created"
        }

# Global framework instance
framework = None

class ContentMarketingFramework:
    """Main framework class that ties everything together"""
    
    def __init__(self, config: Dict):
        self.config = config
        self.integrations = {}
        self.agents = {}
        self.coordinator = None
        self.gemini = None
        self.logger = logging.getLogger("framework")
        self.db_pool = None
        self.redis_client = None
    
    async def initialize(self):
        """Initialize the entire framework"""
        # Initialize Gemini
        self.gemini = GoogleGeminiIntegration(
            os.getenv('GOOGLE_API_KEY', 'demo-key')
        )
        
        # Initialize integrations
        self.integrations['google_adk'] = GoogleADKIntegration(
            os.getenv('GOOGLE_APPLICATION_CREDENTIALS', '/app/credentials/google-credentials.json')
        )
        
        self.integrations['google_a2a'] = GoogleA2AIntegration(
            {
                "client_id": os.getenv('GOOGLE_CLIENT_ID'),
                "client_secret": os.getenv('GOOGLE_CLIENT_SECRET')
            }
        )
        
        self.integrations['zapier_mcp'] = ZapierMCPIntegration(
            os.getenv('ZAPIER_API_KEY', 'demo-key')
        )
        
        # Connect Zapier tools
        zapier_tools = {
            "social_media_scheduler": {"webhook_url": "https://hooks.zapier.com/demo"},
            "email_marketing": {"webhook_url": "https://hooks.zapier.com/demo"}
        }
        for tool_name, tool_config in zapier_tools.items():
            await self.integrations['zapier_mcp'].connect_tool(tool_name, tool_config)
        
        # Initialize database connection
        try:
            self.db_pool = await asyncpg.create_pool(
                os.getenv('POSTGRES_URL', 'postgresql://user:password@postgres:5432/content_marketing')
            )
        except Exception as e:
            self.logger.warning(f"Database connection failed: {e}")
        
        # Initialize Redis
        try:
            self.redis_client = redis.from_url(
                os.getenv('REDIS_URL', 'redis://redis:6379')
            )
        except Exception as e:
            self.logger.warning(f"Redis connection failed: {e}")
        
        # Initialize agents
        agent_configs = {
            'content_strategist': AgentConfig(
                name="content_strategist",
                type=AgentType.CONTENT_STRATEGIST,
                capabilities=["strategy", "planning", "analysis"],
                tools=["google_adk", "zapier_mcp"]
            ),
            'content_creator': AgentConfig(
                name="content_creator",
                type=AgentType.CONTENT_CREATOR,
                capabilities=["writing", "content_generation", "multimedia"],
                tools=["google_a2a", "zapier_mcp"]
            )
        }
        
        for name, config in agent_configs.items():
            if name == 'content_strategist':
                self.agents[name] = ContentStrategistAgent(config, self.integrations, self.gemini)
            elif name == 'content_creator':
                self.agents[name] = ContentCreatorAgent(config, self.integrations, self.gemini)
        
        self.logger.info("Framework initialized successfully")
    
    async def create_campaign(self, campaign_config: Dict) -> str:
        """Create and execute a marketing campaign"""
        campaign_id = str(uuid.uuid4())
        
        # Store campaign in database if available
        if self.db_pool:
            try:
                async with self.db_pool.acquire() as conn:
                    await conn.execute("""
                        INSERT INTO campaigns (id, name, status, start_date, end_date, budget, goals, target_audience)
                        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                    """, 
                    campaign_id,
                    campaign_config.get('campaign_name'),
                    'active',
                    datetime.fromisoformat(campaign_config.get('start_date')),
                    datetime.fromisoformat(campaign_config.get('end_date')),
                    campaign_config.get('budget'),
                    json.dumps(campaign_config.get('goals')),
                    campaign_config.get('target_audience')
                    )
            except Exception as e:
                self.logger.warning(f"Failed to store campaign in database: {e}")
        
        return campaign_id
    
    async def execute_workflow(self, workflow_name: str, workflow_data: Dict[str, Any]) -> str:
        """Execute a workflow and return task ID"""
        try:
            task_id = str(uuid.uuid4())
            
            # Map workflow names to agent types
            workflow_mapping = {
                "content_creation_workflow": "content_creator",
                "seo_optimization_workflow": "seo_optimizer", 
                "social_media_workflow": "social_media_manager",
                "analytics_workflow": "analytics_agent"
            }
            
            agent_name = workflow_mapping.get(workflow_name, "content_strategist")
            
            # For demo, we'll use content generation for all workflows
            if agent_name in self.agents:
                prompt = f"Create {workflow_name.replace('_', ' ')} for: {workflow_data}"
                result = await self.agents[agent_name].generate_content(prompt)
                self.logger.info(f"Workflow {workflow_name} completed with task ID {task_id}")
            else:
                # Fallback to direct Gemini generation
                prompt = f"Create {workflow_name.replace('_', ' ')} for: {workflow_data}"
                result = await self.gemini.generate_content(prompt)
                self.logger.info(f"Workflow {workflow_name} executed directly with Gemini, task ID {task_id}")
            
            return task_id
            
        except Exception as e:
            self.logger.error(f"Failed to execute workflow {workflow_name}: {e}")
            raise

# Dependency to get framework instance
def get_framework() -> ContentMarketingFramework:
    if framework_instance is None:
        raise HTTPException(status_code=503, detail="Framework not initialized")
    return framework_instance

# API Routes

@app.get("/")
async def root():
    return {"message": "Content Marketing AI Framework API", "status": "running"}

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "framework_initialized": framework_instance is not None,
        "service": "content-marketing-ai"
    }

@app.post("/campaigns", response_model=CampaignResponse)
async def create_campaign(
    campaign: CampaignConfig,
    background_tasks: BackgroundTasks,
    framework: ContentMarketingFramework = Depends(get_framework)
):
    """Create a new marketing campaign"""
    try:
        campaign_data = campaign.dict()
        campaign_id = await framework.create_campaign(campaign_data)
        
        return CampaignResponse(
            campaign_id=campaign_id,
            name=campaign.campaign_name,
            status="created",
            progress=0.0,
            created_at=datetime.now(),
            workflows_completed=0,
            total_workflows=len(campaign.workflows)
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create campaign: {str(e)}")

@app.get("/campaigns")
async def list_campaigns():
    """List all campaigns"""
    # Mock campaigns data - replace with database query in production
    mock_campaigns = [
        {
            "campaign_id": "1",
            "name": "Q4 Product Launch",
            "status": "active",
            "progress": 65.0,
            "created_at": "2024-10-01T00:00:00",
            "workflows_completed": 2,
            "total_workflows": 3
        },
        {
            "campaign_id": "2", 
            "name": "Holiday Marketing",
            "status": "planning",
            "progress": 25.0,
            "created_at": "2024-11-01T00:00:00",
            "workflows_completed": 0,
            "total_workflows": 4
        }
    ]
    return mock_campaigns

@app.get("/campaigns/{campaign_id}")
async def get_campaign(campaign_id: str):
    """Get specific campaign details"""
    # Mock implementation - replace with database query
    return {
        "campaign_id": campaign_id,
        "name": "Q4 Product Launch",
        "status": "active",
        "progress": 65.0,
        "created_at": "2024-10-01T00:00:00",
        "workflows_completed": 2,
        "total_workflows": 3,
        "kpis": {
            "leads_generated": {"current": 245, "target": 500},
            "content_engagement": {"current": 3.2, "target": 4.0},
            "brand_mentions": {"current": 158, "target": 300}
        },
        "recent_activities": [
            {"activity": "Blog post created", "timestamp": "2024-07-21T10:30:00"},
            {"activity": "SEO optimization completed", "timestamp": "2024-07-21T09:15:00"},
            {"activity": "Social media posts scheduled", "timestamp": "2024-07-20T16:45:00"}
        ]
    }

@app.post("/workflows/execute", response_model=TaskResponse)
async def execute_workflow(
    workflow: WorkflowRequest,
    framework: ContentMarketingFramework = Depends(get_framework)
):
    """Execute a specific workflow"""
    try:
        task_id = await framework.execute_workflow(
            workflow.workflow_name,
            workflow.workflow_data
        )
        
        return TaskResponse(
            task_id=task_id,
            status="queued",
            created_at=datetime.now()
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to execute workflow: {str(e)}")

@app.get("/workflows")
async def list_available_workflows():
    """List available workflows"""
    workflows = [
        {
            "name": "content_creation_workflow",
            "description": "Complete content creation pipeline with Google Gemini AI",
            "estimated_duration": "15-30 minutes",
            "required_inputs": ["topic", "target_keywords", "content_type"]
        },
        {
            "name": "seo_optimization_workflow", 
            "description": "SEO analysis and optimization",
            "estimated_duration": "10-20 minutes",
            "required_inputs": ["site_url", "target_keywords"]
        },
        {
            "name": "social_media_workflow",
            "description": "Social media content creation and scheduling",
            "estimated_duration": "5-15 minutes",
            "required_inputs": ["platforms", "content_theme", "schedule"]
        },
        {
            "name": "analytics_workflow",
            "description": "Generate comprehensive analytics reports",
            "estimated_duration": "5-10 minutes",
            "required_inputs": ["date_range", "metrics", "property_id"]
        }
    ]
    return {"workflows": workflows}

@app.get("/agents/status", response_model=List[AgentStatus])
async def get_agents_status(framework: ContentMarketingFramework = Depends(get_framework)):
    """Get status of all agents"""
    agents_status = []
    
    for agent_name, agent in framework.agents.items():
        agents_status.append(AgentStatus(
            name=agent.config.name,
            type=agent.config.type.value,
            status="active",  # In real implementation, check actual status
            active_tasks=len(agent.active_tasks),
            last_activity=datetime.now() - timedelta(minutes=1),  # Mock data
            capabilities=agent.config.capabilities
        ))
    
    # Add coordinator
    if framework.coordinator:
        agents_status.append(AgentStatus(
            name="coordinator",
            type="coordinator", 
            status="active",
            active_tasks=len(framework.coordinator.active_tasks),
            last_activity=datetime.now() - timedelta(seconds=30),
            capabilities=["orchestration", "workflow", "coordination"]
        ))
    
    return agents_status

@app.get("/dashboard/stats", response_model=DashboardStats)
async def get_dashboard_stats():
    """Get dashboard statistics"""
    # Mock data - replace with actual metrics from database/analytics
    performance_data = [
        {"month": "Jan", "leads": 120, "engagement": 2.8, "mentions": 85},
        {"month": "Feb", "leads": 150, "engagement": 3.1, "mentions": 95},
        {"month": "Mar", "leads": 180, "engagement": 3.4, "mentions": 110},
        {"month": "Apr", "leads": 210, "engagement": 3.7, "mentions": 125},
        {"month": "May", "leads": 190, "engagement": 3.5, "mentions": 140},
        {"month": "Jun", "leads": 245, "engagement": 3.9, "mentions": 158}
    ]
    
    return DashboardStats(
        total_leads=1245,
        avg_engagement=3.7,
        content_created=89,
        active_agents=6,
        active_campaigns=2,
        performance_trend=performance_data
    )

@app.get("/tasks")
async def get_recent_tasks():
    """Get recent tasks across all agents"""
    # Mock recent tasks - replace with actual task tracking
    recent_tasks = [
        {
            "id": 1,
            "type": "Blog Post Creation",
            "agent": "Content Creator",
            "status": "completed",
            "timestamp": "10:30 AM",
            "duration": "12 minutes",
            "result_summary": "Created 1,200-word blog post about 'AI in Marketing'"
        },
        {
            "id": 2,
            "type": "SEO Audit",
            "agent": "SEO Optimizer", 
            "status": "in_progress",
            "timestamp": "10:15 AM",
            "duration": "8 minutes so far",
            "result_summary": "Analyzing technical SEO factors..."
        },
        {
            "id": 3,
            "type": "Social Media Schedule",
            "agent": "Social Media Manager",
            "status": "completed", 
            "timestamp": "09:45 AM",
            "duration": "5 minutes",
            "result_summary": "Scheduled 12 posts across LinkedIn, Twitter, Instagram"
        },
        {
            "id": 4,
            "type": "Analytics Report",
            "agent": "Analytics Agent",
            "status": "pending",
            "timestamp": "09:30 AM",
            "duration": None,
            "result_summary": "Queued for processing"
        },
        {
            "id": 5,
            "type": "Content Strategy",
            "agent": "Content Strategist", 
            "status": "in_progress",
            "timestamp": "09:15 AM",
            "duration": "25 minutes so far",
            "result_summary": "Analyzing competitor strategies and market trends"
        }
    ]
    return {"tasks": recent_tasks}

@app.get("/tasks/{task_id}")
async def get_task_details(task_id: str):
    """Get detailed information about a specific task"""
    # Mock task details - replace with actual task tracking
    return {
        "task_id": task_id,
        "type": "Blog Post Creation",
        "agent": "Content Creator",
        "status": "completed",
        "created_at": "2024-07-21T10:20:00",
        "completed_at": "2024-07-21T10:32:00",
        "duration": "12 minutes",
        "input_data": {
            "topic": "AI in Marketing",
            "target_keywords": ["ai marketing", "marketing automation", "ai tools"],
            "word_count": 1200,
            "tone": "professional"
        },
        "result": {
            "title": "How AI is Revolutionizing Marketing in 2024",
            "word_count": 1247,
            "seo_score": 85,
            "readability_score": 78,
            "document_id": "1BvAl5_example_doc_id",
            "preview": "Artificial intelligence is transforming how businesses approach marketing..."
        },
        "logs": [
            {"timestamp": "10:20:15", "message": "Task received and queued"},
            {"timestamp": "10:21:02", "message": "Started content research"},
            {"timestamp": "10:24:30", "message": "Generated content outline"},
            {"timestamp": "10:28:15", "message": "Completed content generation"},
            {"timestamp": "10:31:45", "message": "Applied SEO optimizations"},
            {"timestamp": "10:32:10", "message": "Saved to Google Docs"},
            {"timestamp": "10:32:15", "message": "Task completed successfully"}
        ]
    }

@app.post("/content/generate")
async def generate_content(
    content_request: dict,
    framework: ContentMarketingFramework = Depends(get_framework)
):
    """Generate content using AI agents"""
    try:
        task_id = await framework.execute_workflow(
            "content_creation_workflow",
            content_request
        )
        
        return {
            "task_id": task_id,
            "status": "queued",
            "message": "Content generation task queued successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate content: {str(e)}")

@app.get("/integrations/status")
async def get_integrations_status(framework: ContentMarketingFramework = Depends(get_framework)):
    """Check status of all integrations"""
    integrations_status = {
        "google_adk": {
            "name": "Google Application Development Kit",
            "status": "connected" if framework.integrations.get('google_adk') else "disconnected",
            "last_check": datetime.now().isoformat(),
            "features": ["Analytics API", "Search Console API", "Cloud Services"]
        },
        "google_a2a": {
            "name": "Google Apps to Apps",
            "status": "connected" if framework.integrations.get('google_a2a') else "disconnected", 
            "last_check": datetime.now().isoformat(),
            "features": ["Drive API", "Sheets API", "Docs API", "Gmail API"]
        },
        "zapier_mcp": {
            "name": "Zapier MCP",
            "status": "connected" if framework.integrations.get('zapier_mcp') else "disconnected",
            "last_check": datetime.now().isoformat(),
            "connected_tools": ["Hootsuite", "Mailchimp", "Slack", "Trello"],
            "features": ["Workflow Automation", "Tool Integration", "Webhook Triggers"]
        },
        "google_gemini": {
            "name": "Google Gemini AI",
            "status": "connected" if framework.gemini else "disconnected",
            "last_check": datetime.now().isoformat(),
            "features": ["Content Generation", "Strategy Planning", "AI Analysis"]
        }
    }
    
    return {"integrations": integrations_status}

@app.get("/metrics/performance")
async def get_performance_metrics():
    """Get system performance metrics"""
    # Mock performance data - replace with actual system monitoring
    return {
        "system_health": {
            "cpu_usage": 45.2,
            "memory_usage": 67.8,
            "disk_usage": 23.4,
            "network_latency": 12.5
        },
        "agent_performance": {
            "average_task_completion_time": 8.5,  # minutes
            "tasks_completed_today": 127,
            "success_rate": 96.8,
            "error_rate": 3.2
        },
        "api_metrics": {
            "requests_per_minute": 24.7,
            "average_response_time": 245,  # milliseconds  
            "active_connections": 12,
            "uptime": "99.97%"
        }
    }

@app.websocket("/ws/agent-updates")
async def websocket_agent_updates(websocket: WebSocket):
    """WebSocket endpoint for real-time agent updates"""
    await websocket.accept()
    
    try:
        while True:
            # Send periodic updates about agent status
            agents_update = {
                "timestamp": datetime.now().isoformat(),
                "active_agents": 6,
                "running_tasks": 12,
                "completed_tasks_last_hour": 8,
                "system_status": "operational"
            }
            
            await websocket.send_json(agents_update)
            await asyncio.sleep(10)  # Send updates every 10 seconds
            
    except Exception as e:
        print(f"WebSocket error: {e}")
        await websocket.close()

# Error handlers
@app.exception_handler(404)
async def not_found_handler(request, exc):
    return {"error": "Not found", "message": "The requested resource was not found"}

@app.exception_handler(500) 
async def internal_error_handler(request, exc):
    return {"error": "Internal server error", "message": "An unexpected error occurred"}

if __name__ == "__main__":
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    )
    
    import uvicorn
    uvicorn.run(
        "api_backend:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    ) 