const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }

  // Campaign operations
  async createCampaign(campaignData) {
    return this.request('/campaigns', {
      method: 'POST',
      body: JSON.stringify(campaignData),
    });
  }

  async getCampaigns() {
    return this.request('/campaigns');
  }

  async getCampaign(campaignId) {
    return this.request(`/campaigns/${campaignId}`);
  }

  async updateCampaign(campaignId, updates) {
    return this.request(`/campaigns/${campaignId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // Workflow operations
  async executeWorkflow(workflowName, workflowData = {}) {
    return this.request('/workflows/execute', {
      method: 'POST',
      body: JSON.stringify({
        workflow_name: workflowName,
        workflow_data: workflowData,
      }),
    });
  }

  async getWorkflowStatus(workflowId) {
    return this.request(`/workflows/${workflowId}/status`);
  }

  // Agent operations
  async getAgentStatus() {
    return this.request('/agents/status');
  }

  async getAgentTasks(agentName) {
    return this.request(`/agents/${agentName}/tasks`);
  }

  // Content operations
  async generateContent(contentData) {
    return this.request('/content/generate', {
      method: 'POST',
      body: JSON.stringify(contentData),
    });
  }

  async getContent(contentId) {
    return this.request(`/content/${contentId}`);
  }

  async listContent(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    return this.request(`/content${queryParams ? `?${queryParams}` : ''}`);
  }

  // Task operations
  async getTasks(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    return this.request(`/tasks${queryParams ? `?${queryParams}` : ''}`);
  }

  async getTask(taskId) {
    return this.request(`/tasks/${taskId}`);
  }

  // Dashboard operations
  async getDashboardStats() {
    return this.request('/dashboard/stats');
  }

  // Analytics operations
  async getAnalytics(dateRange = '30d') {
    return this.request(`/analytics?range=${dateRange}`);
  }

  async getPerformanceMetrics(campaignId, metrics = []) {
    const queryParams = new URLSearchParams({
      campaign_id: campaignId,
      metrics: metrics.join(','),
    }).toString();
    return this.request(`/analytics/performance?${queryParams}`);
  }

  async generateReport(reportType, options = {}) {
    return this.request('/analytics/reports', {
      method: 'POST',
      body: JSON.stringify({
        type: reportType,
        options,
      }),
    });
  }

  async getPerformanceMetricsSystem() {
    return this.request('/metrics/performance');
  }

  // Integration operations
  async getIntegrationStatus() {
    return this.request('/integrations/status');
  }

  async testIntegration(integrationName) {
    return this.request(`/integrations/${integrationName}/test`, {
      method: 'POST',
    });
  }

  // WebSocket connection for real-time updates
  connectWebSocket(onMessage, onError = null, onClose = null) {
    const wsUrl = (process.env.REACT_APP_WS_URL || 'ws://localhost:8000/ws');
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('WebSocket connected');
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      if (onError) onError(error);
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      if (onClose) onClose();
    };

    return ws;
  }
}

export const apiService = new ApiService();
export default apiService; 