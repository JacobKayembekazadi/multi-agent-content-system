import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { X, Calendar, DollarSign, Target, Users, Trash2, Edit3 } from 'lucide-react';

const CampaignModal = ({ 
  isOpen, 
  onClose, 
  campaign = null, 
  onSave, 
  onDelete, 
  mode = 'create' // 'create', 'edit', 'view'
}) => {
  const [formData, setFormData] = useState({
    campaign_name: '',
    start_date: '',
    end_date: '',
    goals: [],
    target_audience: '',
    workflows: [],
    platforms: [],
    budget: '',
    kpis: [],
    description: '',
    status: 'planning'
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const goalOptions = [
    'brand_awareness', 'lead_generation', 'customer_acquisition', 
    'customer_retention', 'sales_conversion', 'engagement_increase'
  ];

  const workflowOptions = [
    'content_creation_workflow', 'seo_optimization_workflow', 
    'social_media_workflow', 'email_marketing_workflow'
  ];

  const platformOptions = [
    'linkedin', 'twitter', 'facebook', 'instagram', 
    'blog', 'email', 'youtube', 'tiktok'
  ];

  const kpiOptions = [
    'engagement_rate', 'leads_generated', 'conversion_rate', 
    'brand_mentions', 'website_traffic', 'social_followers'
  ];

  useEffect(() => {
    if (campaign && (mode === 'edit' || mode === 'view')) {
      setFormData({
        campaign_name: campaign.name || campaign.campaign_name || '',
        start_date: campaign.startDate || campaign.start_date || '',
        end_date: campaign.endDate || campaign.end_date || '',
        goals: campaign.goals || [],
        target_audience: campaign.target_audience || '',
        workflows: campaign.workflows || [],
        platforms: campaign.platforms || [],
        budget: campaign.budget?.toString() || '',
        kpis: campaign.kpis ? Object.keys(campaign.kpis) : [],
        description: campaign.description || '',
        status: campaign.status || 'planning'
      });
    } else if (mode === 'create') {
      // Reset form for new campaign
      setFormData({
        campaign_name: '',
        start_date: '',
        end_date: '',
        goals: [],
        target_audience: '',
        workflows: [],
        platforms: [],
        budget: '',
        kpis: [],
        description: '',
        status: 'planning'
      });
    }
    setErrors({});
  }, [campaign, mode, isOpen]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleArrayToggle = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.campaign_name.trim()) {
      newErrors.campaign_name = 'Campaign name is required';
    }
    
    if (!formData.start_date) {
      newErrors.start_date = 'Start date is required';
    }
    
    if (!formData.end_date) {
      newErrors.end_date = 'End date is required';
    }
    
    if (formData.start_date && formData.end_date && formData.start_date >= formData.end_date) {
      newErrors.end_date = 'End date must be after start date';
    }
    
    if (!formData.budget || isNaN(formData.budget) || parseFloat(formData.budget) <= 0) {
      newErrors.budget = 'Valid budget amount is required';
    }
    
    if (formData.goals.length === 0) {
      newErrors.goals = 'At least one goal is required';
    }
    
    if (formData.platforms.length === 0) {
      newErrors.platforms = 'At least one platform is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const campaignData = {
        ...formData,
        budget: parseFloat(formData.budget)
      };
      
      await onSave(campaignData);
      onClose();
    } catch (error) {
      console.error('Error saving campaign:', error);
      setErrors({ submit: 'Failed to save campaign. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this campaign? This action cannot be undone.')) {
      setLoading(true);
      try {
        await onDelete(campaign.id);
        onClose();
      } catch (error) {
        console.error('Error deleting campaign:', error);
        setErrors({ submit: 'Failed to delete campaign. Please try again.' });
      } finally {
        setLoading(false);
      }
    }
  };

  const isReadOnly = mode === 'view';
  const isEdit = mode === 'edit';
  const isCreate = mode === 'create';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {isCreate ? 'Create New Campaign' : 
               isEdit ? 'Edit Campaign' : 
               'Campaign Details'}
            </h2>
            {campaign && (
              <p className="text-gray-600 mt-1">
                Campaign ID: {campaign.id}
              </p>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {campaign && !isCreate && (
              <Badge className={`${
                campaign.status === 'active' ? 'bg-green-100 text-green-800' :
                campaign.status === 'planning' ? 'bg-blue-100 text-blue-800' :
                campaign.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {campaign.status}
              </Badge>
            )}
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-red-800">{errors.submit}</p>
              </div>
            )}

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Campaign Name *
                </label>
                <input
                  type="text"
                  value={formData.campaign_name}
                  onChange={(e) => handleInputChange('campaign_name', e.target.value)}
                  disabled={isReadOnly}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.campaign_name ? 'border-red-500' : 'border-gray-300'
                  } ${isReadOnly ? 'bg-gray-50' : ''}`}
                  placeholder="Enter campaign name"
                />
                {errors.campaign_name && (
                  <p className="text-red-500 text-sm mt-1">{errors.campaign_name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  disabled={isReadOnly || isCreate}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    isReadOnly || isCreate ? 'bg-gray-50' : ''
                  }`}
                >
                  <option value="planning">Planning</option>
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            {/* Dates and Budget */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="h-4 w-4 inline mr-1" />
                  Start Date *
                </label>
                <input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => handleInputChange('start_date', e.target.value)}
                  disabled={isReadOnly}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.start_date ? 'border-red-500' : 'border-gray-300'
                  } ${isReadOnly ? 'bg-gray-50' : ''}`}
                />
                {errors.start_date && (
                  <p className="text-red-500 text-sm mt-1">{errors.start_date}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="h-4 w-4 inline mr-1" />
                  End Date *
                </label>
                <input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => handleInputChange('end_date', e.target.value)}
                  disabled={isReadOnly}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.end_date ? 'border-red-500' : 'border-gray-300'
                  } ${isReadOnly ? 'bg-gray-50' : ''}`}
                />
                {errors.end_date && (
                  <p className="text-red-500 text-sm mt-1">{errors.end_date}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="h-4 w-4 inline mr-1" />
                  Budget *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.budget}
                  onChange={(e) => handleInputChange('budget', e.target.value)}
                  disabled={isReadOnly}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.budget ? 'border-red-500' : 'border-gray-300'
                  } ${isReadOnly ? 'bg-gray-50' : ''}`}
                  placeholder="0.00"
                />
                {errors.budget && (
                  <p className="text-red-500 text-sm mt-1">{errors.budget}</p>
                )}
              </div>
            </div>

            {/* Target Audience */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Users className="h-4 w-4 inline mr-1" />
                Target Audience
              </label>
              <textarea
                value={formData.target_audience}
                onChange={(e) => handleInputChange('target_audience', e.target.value)}
                disabled={isReadOnly}
                rows={3}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  isReadOnly ? 'bg-gray-50' : 'border-gray-300'
                }`}
                placeholder="Describe your target audience..."
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                disabled={isReadOnly}
                rows={3}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  isReadOnly ? 'bg-gray-50' : 'border-gray-300'
                }`}
                placeholder="Campaign description and notes..."
              />
            </div>

            {/* Goals */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <Target className="h-4 w-4 inline mr-1" />
                Campaign Goals *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {goalOptions.map(goal => (
                  <label key={goal} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.goals.includes(goal)}
                      onChange={() => handleArrayToggle('goals', goal)}
                      disabled={isReadOnly}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm capitalize">{goal.replace('_', ' ')}</span>
                  </label>
                ))}
              </div>
              {errors.goals && (
                <p className="text-red-500 text-sm mt-1">{errors.goals}</p>
              )}
            </div>

            {/* Platforms */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Platforms *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {platformOptions.map(platform => (
                  <label key={platform} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.platforms.includes(platform)}
                      onChange={() => handleArrayToggle('platforms', platform)}
                      disabled={isReadOnly}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm capitalize">{platform}</span>
                  </label>
                ))}
              </div>
              {errors.platforms && (
                <p className="text-red-500 text-sm mt-1">{errors.platforms}</p>
              )}
            </div>

            {/* Workflows */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                AI Workflows
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {workflowOptions.map(workflow => (
                  <label key={workflow} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.workflows.includes(workflow)}
                      onChange={() => handleArrayToggle('workflows', workflow)}
                      disabled={isReadOnly}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm capitalize">{workflow.replace(/_/g, ' ')}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* KPIs */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Key Performance Indicators
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {kpiOptions.map(kpi => (
                  <label key={kpi} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.kpis.includes(kpi)}
                      onChange={() => handleArrayToggle('kpis', kpi)}
                      disabled={isReadOnly}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm capitalize">{kpi.replace('_', ' ')}</span>
                  </label>
                ))}
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <div>
            {campaign && !isCreate && (
              <Button
                type="button"
                variant="outline"
                onClick={handleDelete}
                disabled={loading}
                className="text-red-600 border-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Campaign
              </Button>
            )}
          </div>
          
          <div className="flex space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              {isReadOnly ? 'Close' : 'Cancel'}
            </Button>
            
            {!isReadOnly && (
              <Button
                type="submit"
                onClick={handleSubmit}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading ? 'Saving...' : (isCreate ? 'Create Campaign' : 'Save Changes')}
              </Button>
            )}
            
            {isReadOnly && campaign && (
              <Button
                type="button"
                onClick={() => window.open(`/campaigns/${campaign.id}/edit`, '_blank')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Edit Campaign
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignModal; 