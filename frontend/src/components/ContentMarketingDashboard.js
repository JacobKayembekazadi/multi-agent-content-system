import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import {
  Activity, Users, TrendingUp, Calendar, FileText, Share2,
  Settings, Play, Pause, RefreshCw, CheckCircle, Clock, AlertCircle
} from 'lucide-react';
import { apiService } from '../services/apiService';

const ContentMarketingDashboard = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [agents, setAgents] = useState([]);
  const [recentTasks, setRecentTasks] = useState([]);
  const [kpiData, setKpiData] = useState({
    total_leads: 1245,
    avg_engagement: 3.7,
    content_created: 89,
    active_agents: 6
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock data for demo purposes (will be replaced with API data)
  const [performanceData] = useState([
    { month: 'Jan', leads: 120, engagement: 2.8, mentions: 85 },
    { month: 'Feb', leads: 150, engagement: 3.1, mentions: 95 },
    { month: 'Mar', leads: 180, engagement: 3.4, mentions: 110 },
    { month: 'Apr', leads: 210, engagement: 3.7, mentions: 125 },
    { month: 'May', leads: 190, engagement: 3.5, mentions: 140 },
    { month: 'Jun', leads: 245, engagement: 3.9, mentions: 158 }
  ]);

  const [channelData] = useState([
    { name: 'Blog', value: 35, color: '#8884d8' },
    { name: 'LinkedIn', value: 25, color: '#82ca9d' },
    { name: 'Twitter', value: 20, color: '#ffc658' },
    { name: 'Email', value: 15, color: '#ff7300' },
    { name: 'Other', value: 5, color: '#00ff00' }
  ]);

  useEffect(() => {
    loadDashboardData();
    // Set up real-time updates
    const interval = setInterval(loadAgentStatus, 10000); // Update agent status every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadCampaigns(),
        loadAgentStatus(),
        loadRecentTasks(),
        loadDashboardStats()
      ]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadDashboardStats = async () => {
    try {
      const stats = await apiService.getDashboardStats();
      if (stats) {
        // Update KPI cards with real data
        setKpiData(stats);
      }
    } catch (error) {
      console.error('Failed to load dashboard stats:', error);
    }
  };

  const loadCampaigns = async () => {
    try {
      // For demo, using sample data. In production, this would be:
      // const campaigns = await apiService.getCampaigns();
      setCampaigns([
        {
          id: '1',
          name: 'Q4 Product Launch',
          status: 'active',
          progress: 65,
          startDate: '2024-10-01',
          endDate: '2024-12-31',
          budget: 50000,
          spent: 32500,
          kpis: {
            leads_generated: { current: 245, target: 500 },
            content_engagement: { current: 3.2, target: 4.0 },
            brand_mentions: { current: 158, target: 300 }
          }
        },
        {
          id: '2',
          name: 'Holiday Marketing',
          status: 'planning',
          progress: 25,
          startDate: '2024-11-15',
          endDate: '2024-12-25',
          budget: 25000,
          spent: 0,
          kpis: {
            leads_generated: { current: 0, target: 200 },
            content_engagement: { current: 0, target: 3.5 },
            brand_mentions: { current: 0, target: 150 }
          }
        }
      ]);
    } catch (error) {
      console.error('Failed to load campaigns:', error);
    }
  };

  const loadAgentStatus = async () => {
    try {
      const agentStatus = await apiService.getAgentStatus();
      if (agentStatus) {
        // Transform API response to UI format
        const transformedAgents = Object.entries(agentStatus).map(([name, status]) => ({
          name: name.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
          status: 'active',
          tasks: status.active_tasks || 0,
          queueSize: status.queue_size || 0,
          lastActivity: '< 1 min ago',
          capabilities: status.capabilities || []
        }));
        setAgents(transformedAgents);
      } else {
        // Fallback to demo data
        setAgents([
          { name: 'Content Strategist', status: 'active', tasks: 3, lastActivity: '2 mins ago' },
          { name: 'Content Creator', status: 'active', tasks: 5, lastActivity: '5 mins ago' },
          { name: 'SEO Optimizer', status: 'active', tasks: 2, lastActivity: '1 min ago' },
          { name: 'Social Media Manager', status: 'active', tasks: 7, lastActivity: '3 mins ago' },
          { name: 'Analytics Agent', status: 'active', tasks: 1, lastActivity: '10 mins ago' },
          { name: 'Coordinator', status: 'active', tasks: 12, lastActivity: '1 min ago' }
        ]);
      }
    } catch (error) {
      console.error('Failed to load agent status:', error);
      // Use demo data on error
      setAgents([
        { name: 'Content Strategist', status: 'active', tasks: 3, lastActivity: '2 mins ago' },
        { name: 'Content Creator', status: 'active', tasks: 5, lastActivity: '5 mins ago' },
        { name: 'SEO Optimizer', status: 'active', tasks: 2, lastActivity: '1 min ago' },
        { name: 'Social Media Manager', status: 'active', tasks: 7, lastActivity: '3 mins ago' },
        { name: 'Analytics Agent', status: 'active', tasks: 1, lastActivity: '10 mins ago' },
        { name: 'Coordinator', status: 'active', tasks: 12, lastActivity: '1 min ago' }
      ]);
    }
  };

  const loadRecentTasks = async () => {
    try {
      // For demo purposes, using sample data
      setRecentTasks([
        { id: 1, type: 'Blog Post Creation', agent: 'Content Creator', status: 'completed', timestamp: '10:30 AM' },
        { id: 2, type: 'SEO Audit', agent: 'SEO Optimizer', status: 'in_progress', timestamp: '10:15 AM' },
        { id: 3, type: 'Social Media Schedule', agent: 'Social Media Manager', status: 'completed', timestamp: '09:45 AM' },
        { id: 4, type: 'Analytics Report', agent: 'Analytics Agent', status: 'pending', timestamp: '09:30 AM' },
        { id: 5, type: 'Content Strategy', agent: 'Content Strategist', status: 'in_progress', timestamp: '09:15 AM' }
      ]);
    } catch (error) {
      console.error('Failed to load recent tasks:', error);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      active: 'bg-green-100 text-green-800',
      planning: 'bg-blue-100 text-blue-800',
      paused: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-gray-100 text-gray-800'
    };
    return variants[status] || variants.active;
  };

  const startWorkflow = async (workflowName) => {
    try {
      const result = await apiService.executeWorkflow(workflowName, {
        topic: 'AI-Generated Content',
        target_audience: 'Marketing professionals',
        platforms: ['linkedin', 'blog']
      });
      
      if (result) {
        alert(`Workflow "${workflowName}" started successfully!`);
        // Refresh agent status to show updated task counts
        loadAgentStatus();
      }
    } catch (error) {
      console.error('Failed to start workflow:', error);
      alert(`Failed to start workflow: ${error.message}`);
    }
  };

  const createCampaign = async () => {
    try {
      const campaignData = {
        campaign_name: 'New AI Campaign',
        start_date: '2024-01-01',
        end_date: '2024-03-31',
        goals: ['brand_awareness', 'lead_generation'],
        target_audience: 'Tech professionals',
        workflows: ['content_creation'],
        platforms: ['linkedin', 'blog'],
        budget: 10000,
        kpis: ['engagement_rate', 'leads_generated']
      };

      const result = await apiService.createCampaign(campaignData);
      
      if (result) {
        alert(`Campaign created successfully! ID: ${result.campaign_id}`);
        // Refresh campaigns list
        loadCampaigns();
      }
    } catch (error) {
      console.error('Failed to create campaign:', error);
      alert(`Failed to create campaign: ${error.message}`);
    }
  };

  const generateContent = async (contentType = 'blog_post') => {
    try {
      const contentData = {
        type: contentType,
        topic: 'AI in Marketing Automation',
        keywords: ['AI marketing', 'automation', 'digital transformation'],
        tone: 'professional',
        word_count: 1500
      };

      const result = await apiService.generateContent(contentData);
      
      if (result) {
        alert('Content generation started! Check the recent tasks for progress.');
        // Refresh recent tasks
        loadRecentTasks();
      }
    } catch (error) {
      console.error('Failed to generate content:', error);
      alert(`Failed to generate content: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading Dashboard...</h2>
          <p className="text-gray-600">Fetching latest data from AI agents</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Dashboard Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={loadDashboardData}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Content Marketing AI Dashboard</h1>
            <p className="text-gray-600 mt-1">Multi-agent framework orchestrating your content strategy</p>
          </div>
          <div className="flex space-x-3">
            <Button onClick={createCampaign} className="bg-blue-600 hover:bg-blue-700">
              <Play className="h-4 w-4 mr-2" />
              New Campaign
            </Button>
            <Button variant="outline" onClick={() => startWorkflow('content_creation')}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Run Workflow
            </Button>
            <Button variant="outline" onClick={() => generateContent('blog_post')}>
              <FileText className="h-4 w-4 mr-2" />
              Generate Content
            </Button>
          </div>
        </div>

        {/* KPI Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Total Leads</p>
                  <p className="text-2xl font-bold">{kpiData.total_leads.toLocaleString()}</p>
                  <p className="text-sm text-blue-100">+12% vs last month</p>
                </div>
                <Users className="h-8 w-8 text-blue-100" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Avg Engagement</p>
                  <p className="text-2xl font-bold">{kpiData.avg_engagement}%</p>
                  <p className="text-sm text-green-100">+0.3% vs last month</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-100" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">Content Created</p>
                  <p className="text-2xl font-bold">{kpiData.content_created}</p>
                  <p className="text-sm text-purple-100">This month</p>
                </div>
                <FileText className="h-8 w-8 text-purple-100" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100">Active Agents</p>
                  <p className="text-2xl font-bold">{kpiData.active_agents}/6</p>
                  <p className="text-sm text-orange-100">All systems operational</p>
                </div>
                <Activity className="h-8 w-8 text-orange-100" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Campaigns */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Active Campaigns
                  </div>
                  <Button variant="outline" size="sm" onClick={loadCampaigns}>
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {campaigns.map((campaign) => (
                  <div key={campaign.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{campaign.name}</h3>
                        <p className="text-sm text-gray-600">{campaign.startDate} - {campaign.endDate}</p>
                      </div>
                      <Badge className={getStatusBadge(campaign.status)}>
                        {campaign.status}
                      </Badge>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>{campaign.progress}%</span>
                        </div>
                        <Progress value={campaign.progress} className="h-2" />
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Budget</p>
                          <p className="font-semibold">${campaign.budget.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Spent</p>
                          <p className="font-semibold">${campaign.spent.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Remaining</p>
                          <p className="font-semibold">${(campaign.budget - campaign.spent).toLocaleString()}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 pt-3 border-t">
                        {Object.entries(campaign.kpis).map(([key, value]) => (
                          <div key={key} className="text-center">
                            <p className="text-xs text-gray-600 capitalize">{key.replace('_', ' ')}</p>
                            <p className="font-semibold">{value.current}/{value.target}</p>
                            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                              <div 
                                className="bg-blue-600 h-1.5 rounded-full" 
                                style={{ width: `${Math.min((value.current / value.target) * 100, 100)}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Performance Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="leads" stroke="#3b82f6" strokeWidth={2} name="Leads" />
                    <Line type="monotone" dataKey="engagement" stroke="#10b981" strokeWidth={2} name="Engagement %" />
                    <Line type="monotone" dataKey="mentions" stroke="#f59e0b" strokeWidth={2} name="Mentions" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Agent Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Activity className="h-5 w-5 mr-2" />
                    AI Agents Status
                  </div>
                  <Button variant="outline" size="sm" onClick={loadAgentStatus}>
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {agents.map((agent, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{agent.name}</p>
                      <p className="text-xs text-gray-600">{agent.lastActivity}</p>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-green-100 text-green-800 mb-1">
                        {agent.status}
                      </Badge>
                      <p className="text-xs text-gray-600">{agent.tasks} tasks</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Tasks */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Tasks</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentTasks.map((task) => (
                  <div key={task.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg">
                    {getStatusIcon(task.status)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{task.type}</p>
                      <p className="text-xs text-gray-600">{task.agent} • {task.timestamp}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Channel Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Channel Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={channelData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {channelData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {channelData.map((channel, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-2" 
                          style={{ backgroundColor: channel.color }}
                        ></div>
                        <span>{channel.name}</span>
                      </div>
                      <span className="font-medium">{channel.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => generateContent('blog_post')}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Create Content
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => startWorkflow('seo_optimization')}
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  SEO Analysis
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => startWorkflow('social_media')}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Social Schedule
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => console.log('Generate report')}
                >
                  <Activity className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentMarketingDashboard; 