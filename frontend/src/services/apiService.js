const API_BASE_URL = 'http://localhost:8000';  // Direct backend URL

// Debug logging to help troubleshoot
console.log('API_BASE_URL:', API_BASE_URL);

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    console.log('ApiService initialized with baseURL:', this.baseURL);
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      mode: 'cors',  // Enable CORS
      ...options,
    };

    try {
      console.log(`Making API request to: ${url}`);
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`API response from ${endpoint}:`, data);
      return data;
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Health check
  async getHealth() {
    return this.request('/health');
  }

  // Dashboard
  async getDashboardStats() {
    return this.request('/dashboard/stats');
  }

  async getPerformanceMetricsSystem() {
    return this.request('/metrics/performance');
  }

  // Campaigns
  async createCampaign(campaignData) {
    return this.request('/campaigns', {
      method: 'POST',
      body: JSON.stringify(campaignData),
    });
  }

  async getCampaigns() {
    return this.request('/campaigns');
  }

  async getCampaign(id) {
    return this.request(`/campaigns/${id}`);
  }

  async updateCampaign(id, campaignData) {
    return this.request(`/campaigns/${id}`, {
      method: 'PUT',
      body: JSON.stringify(campaignData),
    });
  }

  async deleteCampaign(id) {
    return this.request(`/campaigns/${id}`, {
      method: 'DELETE',
    });
  }

  // Workflows
  async executeWorkflow(workflowData) {
    return this.request('/workflows/execute', {
      method: 'POST',
      body: JSON.stringify(workflowData),
    });
  }

  // Content
  async generateContent(contentData) {
    return this.request('/content/generate', {
      method: 'POST',
      body: JSON.stringify(contentData),
    });
  }

  async getContent(id) {
    return this.request(`/content/${id}`);
  }

  async listContent() {
    return this.request('/content');
  }

  async createContent(contentData) {
    return this.request('/content', {
      method: 'POST',
      body: JSON.stringify(contentData),
    });
  }

  async updateContent(id, contentData) {
    return this.request(`/content/${id}`, {
      method: 'PUT',
      body: JSON.stringify(contentData),
    });
  }

  async deleteContent(id) {
    return this.request(`/content/${id}`, {
      method: 'DELETE',
    });
  }

  // Agents
  async getAgentStatus() {
    return this.request('/agents/status');
  }

  // Tasks
  async getTasks() {
    return this.request('/tasks');
  }

  async createTask(taskData) {
    return this.request('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  }

  async updateTask(id, taskData) {
    return this.request(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(taskData),
    });
  }

  // Integrations
  async getIntegrationStatus() {
    return this.request('/integrations/status');
  }

  async testIntegration(integration) {
    return this.request('/integrations/test', {
      method: 'POST',
      body: JSON.stringify({ integration }),
    });
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export { apiService };
export default apiService; 