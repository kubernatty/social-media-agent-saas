/**
 * Template Library React Component
 * Clean, modern UI for browsing and selecting LinkedIn post templates
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, Tag, Eye, Edit3, ArrowRight, Sparkles } from 'lucide-react';
import TemplateStore from './templateStore.js';

const TemplateLibrary = ({ 
  onTemplateSelect,
  onRedirectToGenerator,
  currentTab = 'template-library'
}) => {
  // State management
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [customPlaceholders, setCustomPlaceholders] = useState({});

  // Get categories and tags
  const categories = TemplateStore.getCategories();
  const allTags = TemplateStore.getAllTags();
  const statistics = TemplateStore.getStatistics();

  // Filter templates based on search, category, and tags
  const filteredTemplates = useMemo(() => {
    let results = [];

    if (searchTerm) {
      // Search across all templates
      results = TemplateStore.searchTemplates(searchTerm, selectedTags);
    } else if (selectedCategory) {
      // Get templates by category
      results = TemplateStore.getTemplatesByCategory(selectedCategory);
    } else if (selectedTags.length > 0) {
      // Get templates by tags
      results = TemplateStore.getTemplatesByTags(selectedTags);
    } else {
      // Show all templates from all categories
      results = categories.flatMap(cat => 
        TemplateStore.getTemplatesByCategory(cat.id)
      );
    }

    return results;
  }, [searchTerm, selectedCategory, selectedTags]);

  // Handle category selection
  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setSearchTerm('');
  };

  // Handle tag toggle
  const toggleTag = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  // Handle template selection with modal
  const handleTemplateClick = (template) => {
    setSelectedTemplate(template);
    setShowModal(true);
    
    // Initialize placeholders
    const placeholderObj = {};
    template.placeholders.forEach(placeholder => {
      placeholderObj[placeholder] = '';
    });
    setCustomPlaceholders(placeholderObj);
  };

  // Handle direct template use
  const handleUseTemplate = (template, withCustomPlaceholders = false) => {
    const templateData = {
      ...template,
      customPlaceholders: withCustomPlaceholders ? customPlaceholders : null
    };

    // Call parent callbacks
    if (onTemplateSelect) {
      onTemplateSelect(templateData);
    }

    if (onRedirectToGenerator) {
      onRedirectToGenerator(templateData);
    }

    setShowModal(false);
  };

  // Handle loading template into main generator
  const handleLoadIntoGenerator = (template) => {
    const templateData = {
      ...template,
      action: 'load_into_generator'
    };

    // Pass template to main generator interface
    if (onTemplateSelect) {
      onTemplateSelect(templateData);
    }
  };

  // Template Card Component
  const TemplateCard = ({ template }) => (
    <div className="bg-white rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-200 hover:shadow-lg group">
      {/* Card Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{template.categoryInfo.icon}</span>
              <span className="text-sm font-medium text-gray-600">
                {template.categoryInfo.name}
              </span>
              <div className="flex items-center gap-1">
                {template.engagement === 'High' && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <Sparkles className="w-3 h-3 mr-1" />
                    High Engagement
                  </span>
                )}
              </div>
            </div>
            <h3 className="font-semibold text-gray-900 text-sm mb-1">
              {template.title}
            </h3>
            <p className="text-gray-600 text-xs leading-relaxed">
              {template.preview}
            </p>
          </div>
        </div>
      </div>

      {/* Template Preview */}
      <div className="p-4">
        <div className="bg-gray-50 rounded-lg p-3 mb-3">
          <p className="text-sm text-gray-700 leading-relaxed font-mono">
            {template.structure.substring(0, 120)}
            {template.structure.length > 120 && '...'}
          </p>
        </div>

        {/* Template Meta */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <span>{template.placeholders.length} placeholders</span>
          <span className="flex items-center gap-1">
            <Tag className="w-3 h-3" />
            {template.length} length
          </span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {template.categoryInfo.tags.slice(0, 2).map(tag => (
            <span
              key={tag}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          <button
            onClick={() => handleLoadIntoGenerator(template)}
            className="w-full inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
          >
            <ArrowRight className="w-4 h-4 mr-1" />
            Load into Generator
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => handleTemplateClick(template)}
              className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <Edit3 className="w-4 h-4 mr-1" />
              Customize
            </button>
            <button
              onClick={() => handleUseTemplate(template, false)}
              className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Use Template
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          LinkedIn Template Library
        </h1>
        <p className="text-gray-600 mb-4">
          Choose from {statistics.totalTemplates} professionally crafted templates across {statistics.totalCategories} categories
        </p>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white min-w-[200px]"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.icon} {category.name}
              </option>
            ))}
          </select>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex items-center px-4 py-2 border rounded-lg transition-colors ${
              showFilters || selectedTags.length > 0
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
            {selectedTags.length > 0 && (
              <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-blue-100 bg-blue-600 rounded-full">
                {selectedTags.length}
              </span>
            )}
          </button>
        </div>

        {/* Tag Filters */}
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Filter by tags:</h4>
            <div className="flex flex-wrap gap-2">
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedTags.includes(tag)
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
            {selectedTags.length > 0 && (
              <button
                onClick={() => setSelectedTags([])}
                className="mt-3 text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Results Header */}
      <div className="mb-6">
        <p className="text-gray-600">
          {filteredTemplates.length === 0 ? 'No templates found' : 
           `Showing ${filteredTemplates.length} template${filteredTemplates.length !== 1 ? 's' : ''}`}
          {selectedCategory && ` in ${categories.find(c => c.id === selectedCategory)?.name}`}
          {searchTerm && ` for "${searchTerm}"`}
        </p>
      </div>

      {/* Templates Grid */}
      {filteredTemplates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template, index) => (
            <TemplateCard key={`${template.id}-${index}`} template={template} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your search terms or filters</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('');
              setSelectedTags([]);
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Customization Modal */}
      {showModal && selectedTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  Customize Template
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-2">
                  {selectedTemplate.title}
                </h4>
                <p className="text-gray-600 text-sm mb-4">
                  {selectedTemplate.preview}
                </p>

                {/* Template Preview */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-700 font-mono leading-relaxed">
                    {selectedTemplate.structure}
                  </p>
                </div>

                {/* Placeholder Inputs */}
                <div className="space-y-4">
                  <h5 className="font-medium text-gray-900">
                    Fill in the placeholders:
                  </h5>
                  {selectedTemplate.placeholders.map(placeholder => (
                    <div key={placeholder}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {placeholder}
                      </label>
                      <input
                        type="text"
                        value={customPlaceholders[placeholder] || ''}
                        onChange={(e) => setCustomPlaceholders(prev => ({
                          ...prev,
                          [placeholder]: e.target.value
                        }))}
                        placeholder={`Enter ${placeholder}...`}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => {
                    handleLoadIntoGenerator({
                      ...selectedTemplate,
                      customPlaceholders: customPlaceholders
                    });
                    setShowModal(false);
                  }}
                  className="w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                >
                  Load into Main Generator
                </button>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleUseTemplate(selectedTemplate, false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Use Empty Template
                  </button>
                  <button
                    onClick={() => handleUseTemplate(selectedTemplate, true)}
                    className="flex-1 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Use with Custom Values
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateLibrary;