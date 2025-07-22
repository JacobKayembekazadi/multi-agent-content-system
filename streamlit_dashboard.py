#!/usr/bin/env python3
"""
Streamlit Dashboard for Content Marketing AI
Simple alternative to React frontend
"""

import streamlit as st
import requests
import json
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from datetime import datetime, timedelta

# Configure Streamlit page
st.set_page_config(
    page_title="Content Marketing AI Dashboard",
    page_icon="🎯",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Backend API URL
API_URL = "http://localhost:8000"

def check_backend():
    """Check if backend is running"""
    try:
        response = requests.get(f"{API_URL}/health", timeout=3)
        return response.status_code == 200
    except:
        return False

def call_api(endpoint, method="GET", data=None):
    """Make API calls to backend"""
    try:
        url = f"{API_URL}{endpoint}"
        if method == "GET":
            response = requests.get(url, timeout=10)
        elif method == "POST":
            response = requests.post(url, json=data, timeout=10)
        elif method == "PUT":
            response = requests.put(url, json=data, timeout=10)
        elif method == "DELETE":
            response = requests.delete(url, timeout=10)
        
        if response.status_code == 200:
            return response.json()
        else:
            st.error(f"API Error: {response.status_code}")
            return None
    except Exception as e:
        st.error(f"Connection Error: {e}")
        return None

def main():
    # Header
    st.title("🎯 Content Marketing AI Dashboard")
    st.markdown("---")
    
    # Check backend status
    if not check_backend():
        st.error("🔥 Backend API not running!")
        st.info("Start backend: `docker-compose -f docker-compose.simple.yml up -d`")
        st.stop()
    
    st.success("✅ Backend API Connected")
    
    # Sidebar
    st.sidebar.title("🎛️ Control Panel")
    
    # Main tabs
    tab1, tab2, tab3, tab4, tab5 = st.tabs(["📊 Dashboard", "📋 Campaigns", "✏️ Content", "🤖 Agents", "⚙️ Settings"])
    
    with tab1:
        st.header("📊 Dashboard Overview")
        
        # Get dashboard stats
        stats = call_api("/dashboard/stats")
        
        if stats:
            # KPI Metrics
            col1, col2, col3, col4 = st.columns(4)
            
            with col1:
                st.metric(
                    label="📋 Total Campaigns",
                    value=stats.get('total_campaigns', 0),
                    delta=f"+{stats.get('campaigns_this_month', 0)} this month"
                )
            
            with col2:
                st.metric(
                    label="✏️ Content Pieces",
                    value=stats.get('total_content', 0),
                    delta=f"+{stats.get('content_this_week', 0)} this week"
                )
            
            with col3:
                st.metric(
                    label="✅ Completed Tasks",
                    value=stats.get('completed_tasks', 0),
                    delta=f"{stats.get('completion_rate', 0):.1f}% rate"
                )
            
            with col4:
                st.metric(
                    label="🎯 Success Rate",
                    value=f"{stats.get('success_rate', 0):.1f}%",
                    delta="📈 +2.3%"
                )
            
            # Charts
            st.subheader("📈 Performance Charts")
            
            col1, col2 = st.columns(2)
            
            with col1:
                # Sample performance data
                performance_data = {
                    'Date': pd.date_range(start='2025-01-01', periods=30, freq='D'),
                    'Engagement': [50 + i*2 + (i%7)*10 for i in range(30)],
                    'Reach': [100 + i*5 + (i%5)*20 for i in range(30)],
                    'Conversions': [10 + i*0.5 + (i%3)*5 for i in range(30)]
                }
                df = pd.DataFrame(performance_data)
                
                fig = px.line(df, x='Date', y=['Engagement', 'Reach', 'Conversions'],
                             title="📈 Performance Trends")
                st.plotly_chart(fig, use_container_width=True)
            
            with col2:
                # Campaign distribution
                campaign_data = {
                    'Type': ['Social Media', 'Email', 'Blog', 'Video', 'SEO'],
                    'Count': [12, 8, 15, 6, 9]
                }
                df_campaigns = pd.DataFrame(campaign_data)
                
                fig2 = px.pie(df_campaigns, values='Count', names='Type',
                             title="📊 Campaign Distribution")
                st.plotly_chart(fig2, use_container_width=True)
    
    with tab2:
        st.header("📋 Campaign Management")
        
        # Get campaigns
        campaigns = call_api("/campaigns")
        
        col1, col2 = st.columns([3, 1])
        
        with col2:
            if st.button("➕ Create Campaign", type="primary"):
                st.session_state.show_campaign_form = True
        
        # Campaign creation form
        if st.session_state.get('show_campaign_form', False):
            with st.expander("🆕 Create New Campaign", expanded=True):
                with st.form("campaign_form"):
                    name = st.text_input("Campaign Name")
                    description = st.text_area("Description")
                    
                    col1, col2 = st.columns(2)
                    with col1:
                        start_date = st.date_input("Start Date")
                        budget = st.number_input("Budget", min_value=0.0, format="%.2f")
                    with col2:
                        end_date = st.date_input("End Date")
                        platform = st.selectbox("Platform", 
                                               ["Social Media", "Email", "Blog", "Video", "SEO"])
                    
                    submitted = st.form_submit_button("🚀 Create Campaign")
                    
                    if submitted and name:
                        campaign_data = {
                            "name": name,
                            "description": description,
                            "start_date": start_date.isoformat(),
                            "end_date": end_date.isoformat(),
                            "budget": budget,
                            "platform": platform,
                            "status": "planning"
                        }
                        
                        result = call_api("/campaigns", "POST", campaign_data)
                        if result:
                            st.success("✅ Campaign created successfully!")
                            st.session_state.show_campaign_form = False
                            st.rerun()
        
        # Display campaigns
        if campaigns:
            st.subheader("📋 Active Campaigns")
            
            for campaign in campaigns:
                with st.expander(f"📋 {campaign.get('name', 'Unnamed Campaign')}"):
                    col1, col2, col3 = st.columns(3)
                    
                    with col1:
                        st.write(f"**Status:** {campaign.get('status', 'Unknown')}")
                        st.write(f"**Platform:** {campaign.get('platform', 'N/A')}")
                    
                    with col2:
                        st.write(f"**Budget:** ${campaign.get('budget', 0):,.2f}")
                        st.write(f"**Start:** {campaign.get('start_date', 'N/A')}")
                    
                    with col3:
                        if st.button(f"🗑️ Delete", key=f"del_{campaign.get('id')}"):
                            result = call_api(f"/campaigns/{campaign.get('id')}", "DELETE")
                            if result:
                                st.success("Campaign deleted!")
                                st.rerun()
        else:
            st.info("No campaigns found. Create your first campaign!")
    
    with tab3:
        st.header("✏️ Content Management")
        
        # Content generation
        st.subheader("🤖 AI Content Generation")
        
        with st.form("content_generation"):
            content_type = st.selectbox("Content Type", 
                                      ["Blog Post", "Social Media", "Email", "Ad Copy"])
            topic = st.text_input("Topic/Keywords")
            tone = st.selectbox("Tone", ["Professional", "Casual", "Friendly", "Authoritative"])
            word_count = st.slider("Word Count", 50, 2000, 500)
            
            if st.form_submit_button("🎯 Generate Content"):
                if topic:
                    content_data = {
                        "content_type": content_type,
                        "topic": topic,
                        "tone": tone,
                        "word_count": word_count
                    }
                    
                    with st.spinner("🤖 AI is generating content..."):
                        result = call_api("/content/generate", "POST", content_data)
                    
                    if result:
                        st.success("✅ Content generated!")
                        st.subheader("📝 Generated Content:")
                        st.write(result.get('content', 'Content generated successfully'))
                        
                        # Option to save
                        if st.button("💾 Save Content"):
                            save_data = {
                                "title": f"{content_type}: {topic}",
                                "content": result.get('content', ''),
                                "type": content_type.lower().replace(' ', '_'),
                                "status": "draft"
                            }
                            save_result = call_api("/content", "POST", save_data)
                            if save_result:
                                st.success("✅ Content saved!")
        
        # Content list
        content_list = call_api("/content")
        
        if content_list:
            st.subheader("📝 Content Library")
            
            for content in content_list:
                with st.expander(f"📄 {content.get('title', 'Untitled')}"):
                    st.write(f"**Type:** {content.get('type', 'Unknown')}")
                    st.write(f"**Status:** {content.get('status', 'Unknown')}")
                    st.write(f"**Created:** {content.get('created_at', 'Unknown')}")
                    
                    if content.get('content'):
                        st.text_area("Content", content['content'], height=100, disabled=True)
    
    with tab4:
        st.header("🤖 AI Agent Status")
        
        # Get agent status
        agents = call_api("/agents/status")
        
        if agents:
            st.subheader("👥 Agent Overview")
            
            for agent_name, agent_data in agents.items():
                with st.expander(f"🤖 {agent_name.replace('_', ' ').title()}"):
                    col1, col2 = st.columns(2)
                    
                    with col1:
                        status = agent_data.get('status', 'Unknown')
                        if status == 'active':
                            st.success(f"✅ Status: {status}")
                        else:
                            st.warning(f"⚠️ Status: {status}")
                        
                        st.write(f"**Tasks Completed:** {agent_data.get('tasks_completed', 0)}")
                    
                    with col2:
                        st.write(f"**Specialization:** {agent_data.get('specialization', 'General')}")
                        st.write(f"**Last Active:** {agent_data.get('last_active', 'Unknown')}")
        
        # Recent tasks
        st.subheader("📋 Recent Tasks")
        tasks = call_api("/tasks")
        
        if tasks:
            for task in tasks[-10:]:  # Show last 10 tasks
                col1, col2, col3 = st.columns([2, 1, 1])
                
                with col1:
                    st.write(f"**{task.get('title', 'Untitled Task')}**")
                    st.caption(task.get('description', 'No description'))
                
                with col2:
                    status = task.get('status', 'Unknown')
                    if status == 'completed':
                        st.success(f"✅ {status}")
                    elif status == 'in_progress':
                        st.info(f"🔄 {status}")
                    else:
                        st.warning(f"⏳ {status}")
                
                with col3:
                    st.caption(task.get('created_at', 'Unknown'))
    
    with tab5:
        st.header("⚙️ Settings & Integrations")
        
        # Integration status
        integrations = call_api("/integrations/status")
        
        if integrations:
            st.subheader("🔗 Integration Status")
            
            for integration, status in integrations.items():
                col1, col2 = st.columns([2, 1])
                
                with col1:
                    st.write(f"**{integration.replace('_', ' ').title()}**")
                
                with col2:
                    if status.get('status') == 'connected':
                        st.success("✅ Connected")
                    else:
                        st.error("❌ Disconnected")
        
        # API Test
        st.subheader("🧪 API Testing")
        
        if st.button("🔍 Test All Endpoints"):
            endpoints = ['/health', '/dashboard/stats', '/campaigns', '/agents/status']
            
            for endpoint in endpoints:
                result = call_api(endpoint)
                if result:
                    st.success(f"✅ {endpoint}")
                else:
                    st.error(f"❌ {endpoint}")

if __name__ == "__main__":
    main() 