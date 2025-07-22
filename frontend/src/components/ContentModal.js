import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { X, FileText, Target, Palette, Calendar, Trash2, Edit3, Copy } from 'lucide-react';

const ContentModal = ({ 
  isOpen, 
  onClose, 
  content = null, 
  onSave, 
  onDelete, 
  mode = 'create' // 'create', 'edit', 'view'
}) => {
  const [formData, setFormData] = useState({
    title: '',
    content_type: 'blog_post',
    topic: '',
    target_keywords: [],
    tone: 'professional',
    word_count: 1000,
    platform: 'blog',
    status: 'draft',
    content_body: '',
    meta_description: '',
    tags: [],
    campaign_id: '',
    scheduled_date: '',
    ai_generated: false
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [keywordInput, setKeywordInput] = useState('');
  const [tagInput, setTagInput] = useState('');

  const contentTypes = [
    'blog_post', 'social_media_post', 'email_newsletter', 
    'video_script', 'infographic_copy', 'white_paper', 'case_study'
  ];

  const toneOptions = [
    'professional', 'casual', 'friendly', 'authoritative', 
    'conversational', 'formal', 'humorous', 'inspiring'
  ];

  const platformOptions = [
    'blog', 'linkedin', 'twitter', 'facebook', 'instagram', 
    'email', 'youtube', 'website', 'medium'
  ];

  useEffect(() => {
    if (content && (mode === 'edit' || mode === 'view')) {
      setFormData({
        title: content.title || '',
        content_type: content.content_type || content.type || 'blog_post',
        topic: content.topic || '',
        target_keywords: content.target_keywords || content.keywords || [],
        tone: content.tone || 'professional',
        word_count: content.word_count || 1000,
        platform: content.platform || 'blog',
        status: content.status || 'draft',
        content_body: content.content_body || content.content || '',
        meta_description: content.meta_description || '',
        tags: content.tags || [],
        campaign_id: content.campaign_id || '',
        scheduled_date: content.scheduled_date || '',
        ai_generated: content.ai_generated || false
      });
    } else if (mode === 'create') {
      setFormData({
        title: '',
        content_type: 'blog_post',
        topic: '',
        target_keywords: [],
        tone: 'professional',
        word_count: 1000,
        platform: 'blog',
        status: 'draft',
        content_body: '',
        meta_description: '',
        tags: [],
        campaign_id: '',
        scheduled_date: '',
        ai_generated: false
      });
    }
    setErrors({});
    setKeywordInput('');
    setTagInput('');
  }, [content, mode, isOpen]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const addKeyword = () => {
    if (keywordInput.trim() && !formData.target_keywords.includes(keywordInput.trim())) {
      setFormData(prev => ({
        ...prev,
        target_keywords: [...prev.target_keywords, keywordInput.trim()]
      }));
      setKeywordInput('');
    }
  };

  const removeKeyword = (keyword) => {
    setFormData(prev => ({
      ...prev,
      target_keywords: prev.target_keywords.filter(k => k !== keyword)
    }));
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.topic.trim()) {
      newErrors.topic = 'Topic is required';
    }
    
    if (!formData.word_count || isNaN(formData.word_count) || parseInt(formData.word_count) <= 0) {
      newErrors.word_count = 'Valid word count is required';
    }

    if (formData.content_body.trim().length > 0) {
      const wordCount = formData.content_body.trim().split(/\s+/).length;
      const targetCount = parseInt(formData.word_count);
      if (Math.abs(wordCount - targetCount) > targetCount * 0.2) {
        newErrors.content_body = `Word count (${wordCount}) should be close to target (${targetCount})`;
      }
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
      const contentData = {
        ...formData,
        word_count: parseInt(formData.word_count)
      };
      
      await onSave(contentData);
      onClose();
    } catch (error) {
      console.error('Error saving content:', error);
      setErrors({ submit: 'Failed to save content. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this content? This action cannot be undone.')) {
      setLoading(true);
      try {
        await onDelete(content.id);
        onClose();
      } catch (error) {
        console.error('Error deleting content:', error);
        setErrors({ submit: 'Failed to delete content. Please try again.' });
      } finally {
        setLoading(false);
      }
    }
  };

  const generateWithAI = async () => {
    setLoading(true);
    try {
      const result = await fetch('/api/content/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content_type: formData.content_type,
          topic: formData.topic,
          target_keywords: formData.target_keywords,
          tone: formData.tone,
          word_count: formData.word_count,
          platform: formData.platform
        })
      });
      
      if (result.ok) {
        const data = await result.json();
        setFormData(prev => ({
          ...prev,
          content_body: data.content,
          title: data.title || prev.title,
          meta_description: data.meta_description || prev.meta_description,
          ai_generated: true
        }));
      }
    } catch (error) {
      console.error('Error generating content:', error);
      setErrors({ submit: 'Failed to generate content. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(formData.content_body);
    alert('Content copied to clipboard!');
  };

  const isReadOnly = mode === 'view';
  const isEdit = mode === 'edit';
  const isCreate = mode === 'create';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {isCreate ? 'Create New Content' : 
               isEdit ? 'Edit Content' : 
               'Content Details'}
            </h2>
            {content && (
              <p className="text-gray-600 mt-1">
                Content ID: {content.id} • Created: {content.created_at || 'Unknown'}
              </p>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {content && !isCreate && (
              <Badge className={`${
                content.status === 'published' ? 'bg-green-100 text-green-800' :
                content.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                content.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {content.status}
              </Badge>
            )}
            {formData.ai_generated && (
              <Badge className="bg-purple-100 text-purple-800">
                AI Generated
              </Badge>
            )}
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(95vh-140px)]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
            {/* Left Panel - Form */}
            <div className="lg:col-span-1 p-6 border-r bg-gray-50">
              <form className="space-y-4">
                {errors.submit && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-3">
                    <p className="text-red-800 text-sm">{errors.submit}</p>
                  </div>
                )}

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FileText className="h-4 w-4 inline mr-1" />
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    disabled={isReadOnly}
                    className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm ${
                      errors.title ? 'border-red-500' : 'border-gray-300'
                    } ${isReadOnly ? 'bg-gray-100' : ''}`}
                    placeholder="Enter content title"
                  />
                  {errors.title && (
                    <p className="text-red-500 text-xs mt-1">{errors.title}</p>
                  )}
                </div>

                {/* Content Type and Platform */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Content Type
                    </label>
                    <select
                      value={formData.content_type}
                      onChange={(e) => handleInputChange('content_type', e.target.value)}
                      disabled={isReadOnly}
                      className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 text-sm ${
                        isReadOnly ? 'bg-gray-100' : ''
                      }`}
                    >
                      {contentTypes.map(type => (
                        <option key={type} value={type}>
                          {type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Platform
                    </label>
                    <select
                      value={formData.platform}
                      onChange={(e) => handleInputChange('platform', e.target.value)}
                      disabled={isReadOnly}
                      className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 text-sm ${
                        isReadOnly ? 'bg-gray-100' : ''
                      }`}
                    >
                      {platformOptions.map(platform => (
                        <option key={platform} value={platform}>
                          {platform.charAt(0).toUpperCase() + platform.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Topic */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Target className="h-4 w-4 inline mr-1" />
                    Topic *
                  </label>
                  <input
                    type="text"
                    value={formData.topic}
                    onChange={(e) => handleInputChange('topic', e.target.value)}
                    disabled={isReadOnly}
                    className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm ${
                      errors.topic ? 'border-red-500' : 'border-gray-300'
                    } ${isReadOnly ? 'bg-gray-100' : ''}`}
                    placeholder="Enter content topic"
                  />
                  {errors.topic && (
                    <p className="text-red-500 text-xs mt-1">{errors.topic}</p>
                  )}
                </div>

                {/* Tone and Word Count */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Palette className="h-4 w-4 inline mr-1" />
                      Tone
                    </label>
                    <select
                      value={formData.tone}
                      onChange={(e) => handleInputChange('tone', e.target.value)}
                      disabled={isReadOnly}
                      className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 text-sm ${
                        isReadOnly ? 'bg-gray-100' : ''
                      }`}
                    >
                      {toneOptions.map(tone => (
                        <option key={tone} value={tone}>
                          {tone.charAt(0).toUpperCase() + tone.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Word Count *
                    </label>
                    <input
                      type="number"
                      min="50"
                      max="10000"
                      value={formData.word_count}
                      onChange={(e) => handleInputChange('word_count', e.target.value)}
                      disabled={isReadOnly}
                      className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 text-sm ${
                        errors.word_count ? 'border-red-500' : 'border-gray-300'
                      } ${isReadOnly ? 'bg-gray-100' : ''}`}
                    />
                    {errors.word_count && (
                      <p className="text-red-500 text-xs mt-1">{errors.word_count}</p>
                    )}
                  </div>
                </div>

                {/* Status and Scheduled Date */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                      disabled={isReadOnly}
                      className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 text-sm ${
                        isReadOnly ? 'bg-gray-100' : ''
                      }`}
                    >
                      <option value="draft">Draft</option>
                      <option value="review">Review</option>
                      <option value="scheduled">Scheduled</option>
                      <option value="published">Published</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="h-4 w-4 inline mr-1" />
                      Scheduled Date
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.scheduled_date}
                      onChange={(e) => handleInputChange('scheduled_date', e.target.value)}
                      disabled={isReadOnly}
                      className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 text-sm ${
                        isReadOnly ? 'bg-gray-100' : ''
                      }`}
                    />
                  </div>
                </div>

                {/* Keywords */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Keywords
                  </label>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {formData.target_keywords.map((keyword, index) => (
                      <Badge key={index} className="bg-blue-100 text-blue-800 text-xs">
                        {keyword}
                        {!isReadOnly && (
                          <button
                            type="button"
                            onClick={() => removeKeyword(keyword)}
                            className="ml-1 text-blue-600 hover:text-blue-800"
                          >
                            ×
                          </button>
                        )}
                      </Badge>
                    ))}
                  </div>
                  {!isReadOnly && (
                    <div className="flex">
                      <input
                        type="text"
                        value={keywordInput}
                        onChange={(e) => setKeywordInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                        className="flex-1 p-2 border rounded-l focus:ring-2 focus:ring-blue-500 text-sm"
                        placeholder="Add keyword"
                      />
                      <Button
                        type="button"
                        onClick={addKeyword}
                        className="px-3 rounded-l-none"
                        size="sm"
                      >
                        Add
                      </Button>
                    </div>
                  )}
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {formData.tags.map((tag, index) => (
                      <Badge key={index} className="bg-gray-100 text-gray-800 text-xs">
                        {tag}
                        {!isReadOnly && (
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-1 text-gray-600 hover:text-gray-800"
                          >
                            ×
                          </button>
                        )}
                      </Badge>
                    ))}
                  </div>
                  {!isReadOnly && (
                    <div className="flex">
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                        className="flex-1 p-2 border rounded-l focus:ring-2 focus:ring-blue-500 text-sm"
                        placeholder="Add tag"
                      />
                      <Button
                        type="button"
                        onClick={addTag}
                        className="px-3 rounded-l-none"
                        size="sm"
                      >
                        Add
                      </Button>
                    </div>
                  )}
                </div>

                {/* Meta Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Description
                  </label>
                  <textarea
                    value={formData.meta_description}
                    onChange={(e) => handleInputChange('meta_description', e.target.value)}
                    disabled={isReadOnly}
                    rows={2}
                    maxLength={160}
                    className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 text-sm ${
                      isReadOnly ? 'bg-gray-100' : 'border-gray-300'
                    }`}
                    placeholder="SEO meta description (max 160 chars)"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.meta_description.length}/160 characters
                  </p>
                </div>

                {/* AI Generation */}
                {!isReadOnly && (
                  <div className="pt-4 border-t">
                    <Button
                      type="button"
                      onClick={generateWithAI}
                      disabled={loading || !formData.topic}
                      className="w-full bg-purple-600 hover:bg-purple-700"
                    >
                      {loading ? 'Generating...' : 'Generate with AI'}
                    </Button>
                  </div>
                )}
              </form>
            </div>

            {/* Right Panel - Content Editor */}
            <div className="lg:col-span-2 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Content Body</h3>
                <div className="flex space-x-2">
                  {formData.content_body && (
                    <>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={copyToClipboard}
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        Copy
                      </Button>
                      <span className="text-sm text-gray-500 self-center">
                        {formData.content_body.trim().split(/\s+/).length} words
                      </span>
                    </>
                  )}
                </div>
              </div>

              <textarea
                value={formData.content_body}
                onChange={(e) => handleInputChange('content_body', e.target.value)}
                disabled={isReadOnly}
                rows={20}
                className={`w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm ${
                  errors.content_body ? 'border-red-500' : 'border-gray-300'
                } ${isReadOnly ? 'bg-gray-50' : ''}`}
                placeholder="Write your content here or use the AI generator..."
              />
              {errors.content_body && (
                <p className="text-red-500 text-sm mt-1">{errors.content_body}</p>
              )}

              {/* Preview */}
              {formData.content_body && (
                <div className="mt-6">
                  <h4 className="text-md font-semibold mb-2">Preview</h4>
                  <div className="border rounded-lg p-4 bg-gray-50 max-h-60 overflow-y-auto">
                    <div className="prose prose-sm max-w-none">
                      {formData.content_body.split('\n').map((paragraph, index) => (
                        <p key={index} className="mb-2">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <div>
            {content && !isCreate && (
              <Button
                type="button"
                variant="outline"
                onClick={handleDelete}
                disabled={loading}
                className="text-red-600 border-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Content
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
                {loading ? 'Saving...' : (isCreate ? 'Create Content' : 'Save Changes')}
              </Button>
            )}
            
            {isReadOnly && content && (
              <Button
                type="button"
                onClick={() => window.open(`/content/${content.id}/edit`, '_blank')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Edit Content
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentModal; 