-- Create database schema for content marketing framework

-- Campaigns table
CREATE TABLE campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'planning',
    progress DECIMAL(5,2) DEFAULT 0.00,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    budget DECIMAL(12,2),
    spent DECIMAL(12,2) DEFAULT 0.00,
    goals JSONB,
    target_audience TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tasks table
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID REFERENCES campaigns(id),
    type VARCHAR(100) NOT NULL,
    agent_name VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    priority INTEGER DEFAULT 1,
    input_data JSONB,
    result_data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    error_message TEXT
);

-- Content table
CREATE TABLE content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID REFERENCES campaigns(id),
    task_id UUID REFERENCES tasks(id),
    title VARCHAR(500) NOT NULL,
    content_type VARCHAR(50) NOT NULL,
    content_text TEXT,
    metadata JSONB,
    seo_score INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Performance metrics table
CREATE TABLE performance_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID REFERENCES campaigns(id),
    metric_name VARCHAR(100) NOT NULL,
    metric_value DECIMAL(12,4),
    metric_date DATE NOT NULL,
    platform VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Agent status table
CREATE TABLE agent_status (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_name VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL,
    active_tasks INTEGER DEFAULT 0,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Integration logs table
CREATE TABLE integration_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    integration_name VARCHAR(100) NOT NULL,
    operation VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL,
    request_data JSONB,
    response_data JSONB,
    error_message TEXT,
    duration_ms INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_campaigns_status ON campaigns(status);
CREATE INDEX idx_campaigns_dates ON campaigns(start_date, end_date);
CREATE INDEX idx_tasks_campaign ON tasks(campaign_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_agent ON tasks(agent_name);
CREATE INDEX idx_content_campaign ON content(campaign_id);
CREATE INDEX idx_metrics_campaign_date ON performance_metrics(campaign_id, metric_date);
CREATE INDEX idx_agent_status_name ON agent_status(agent_name);
CREATE INDEX idx_integration_logs_name_date ON integration_logs(integration_name, created_at);

-- Insert sample data
INSERT INTO campaigns (name, status, progress, start_date, end_date, budget, spent, goals, target_audience) VALUES
('Q4 Product Launch', 'active', 65.0, '2024-10-01', '2024-12-31', 50000.00, 32500.00, 
 '["increase_brand_awareness", "generate_leads", "drive_sales"]'::jsonb, 
 'B2B decision makers in tech'),
('Holiday Marketing', 'planning', 25.0, '2024-11-15', '2024-12-25', 25000.00, 0.00,
 '["seasonal_promotion", "customer_retention"]'::jsonb,
 'Existing customers and prospects'); 