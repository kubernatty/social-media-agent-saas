import { useState, useMemo } from 'react';
import TemplateStore from './template-library/templateStore';

export default function TemplateLibrary({ onTemplateSelect }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Get all templates from the comprehensive template store
  const allTemplates = useMemo(() => {
    try {
      const categories = TemplateStore.getCategories();
      const templates = [];
      
      categories.forEach(category => {
        const categoryTemplates = TemplateStore.getTemplatesByCategory(category.id);
        categoryTemplates.forEach(template => {
          templates.push({
            id: template.id,
            title: template.title,
            category: category.name,
            description: template.preview || category.description,
            preview: template.structure,
            tags: category.tags || [],
            engagement: template.engagement || 'Medium',
            length: template.length || 'Medium',
            hashtags: template.hashtags || '',
            placeholders: template.placeholders || []
          });
        });
      });
      
      return templates;
    } catch (error) {
      console.error('Error loading templates:', error);
      // Fallback to basic templates if there's an error
      return [
        {
          id: 'fallback_1',
          title: "Basic Template",
          category: "General",
          description: "A simple template to get started",
          preview: "Share your thoughts on [TOPIC] with your audience...",
          tags: ["general"],
          engagement: "Medium"
        }
      ];
    }
  }, []);

  // Get categories for filter dropdown
  const categories = useMemo(() => {
    const cats = ['all'];
    const uniqueCategories = [...new Set(allTemplates.map(t => t.category))];
    return cats.concat(uniqueCategories.sort());
  }, [allTemplates]);

  const filteredTemplates = allTemplates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getEngagementColor = (engagement) => {
    switch (engagement) {
      case 'Very High': return 'bg-green-600/20 text-green-400';
      case 'High': return 'bg-blue-600/20 text-blue-400';
      case 'Medium': return 'bg-yellow-600/20 text-yellow-400';
      default: return 'bg-gray-600/20 text-gray-400';
    }
  };

  const useTemplate = (template) => {
    if (onTemplateSelect) {
      onTemplateSelect(template);
    }
  };

  return (
    <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-dark-text">Template Library</h2>
          <p className="text-sm text-dark-text-muted">
            {filteredTemplates.length} of {allTemplates.length} templates
            {selectedCategory !== 'all' && ` in ${selectedCategory}`}
            {searchTerm && ` matching "${searchTerm}"`}
          </p>
        </div>
        <button className="px-4 py-2 bg-aifluence-600 hover:bg-aifluence-700 text-white rounded-lg text-sm transition-colors">
          + Create Template
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 bg-dark-primary border border-dark-border rounded-lg text-dark-text placeholder-dark-text-muted focus:ring-2 focus:ring-aifluence-500 focus:border-transparent"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 bg-dark-primary border border-dark-border rounded-lg text-dark-text focus:ring-2 focus:ring-aifluence-500"
        >
          {categories.map(category => (
            <option key={category} value={category}>
              {category === 'all' ? 'All Categories' : category}
            </option>
          ))}
        </select>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <div key={template.id} className="bg-dark-primary border border-dark-border rounded-lg p-4 hover:border-aifluence-500/50 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-dark-text mb-1">{template.title}</h3>
                <span className="text-xs px-2 py-1 bg-dark-border text-dark-text-muted rounded-full">
                  {template.category}
                </span>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${getEngagementColor(template.engagement)}`}>
                {template.engagement}
              </span>
            </div>
            
            <p className="text-sm text-dark-text-muted mb-3">{template.description}</p>
            
            <div className="bg-dark-panel border border-dark-border rounded p-3 mb-4">
              <p className="text-sm text-dark-text italic">{template.preview}</p>
            </div>
            
            <div className="flex flex-wrap gap-1 mb-4">
              {template.tags.map((tag) => (
                <span key={tag} className="text-xs px-2 py-1 bg-aifluence-600/20 text-aifluence-400 rounded">
                  #{tag}
                </span>
              ))}
            </div>
            
            <div className="flex space-x-2">
              <button 
                onClick={() => useTemplate(template)}
                className="flex-1 py-2 bg-aifluence-600 hover:bg-aifluence-700 text-white rounded text-sm transition-colors"
              >
                Use Template
              </button>
              <button className="px-3 py-2 border border-dark-border text-dark-text hover:bg-dark-panel rounded text-sm transition-colors">
                Preview
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-dark-border rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-dark-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-dark-text mb-2">No templates found</h3>
          <p className="text-dark-text-muted">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
}