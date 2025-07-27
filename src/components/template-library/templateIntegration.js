/**
 * Template Integration with Main Content Generator
 * Handles loading templates into the main AI content generator interface
 */

// Example integration for main content generator
export const handleTemplateLoad = (templateData, setGeneratorState) => {
  if (templateData.action === 'load_into_generator') {
    // Extract template information
    const {
      title,
      structure,
      placeholders,
      customPlaceholders,
      category,
      categoryInfo,
      hashtags
    } = templateData;

    // Update the main generator interface
    setGeneratorState(prevState => ({
      ...prevState,
      // Set the template as the base content
      content: structure,
      
      // Set category for context
      selectedCategory: category,
      
      // Set placeholders for guided editing
      templatePlaceholders: placeholders,
      
      // Apply any custom placeholder values
      customValues: customPlaceholders || {},
      
      // Set template metadata
      templateMetadata: {
        title,
        category,
        categoryInfo,
        hashtags,
        loadedFromTemplate: true
      },
      
      // Switch to template editing mode
      mode: 'template_editing',
      
      // Show template loaded notification
      notification: {
        type: 'success',
        message: `Template "${title}" loaded from ${categoryInfo.name} category`,
        timestamp: Date.now()
      }
    }));

    // Optionally scroll to generator
    scrollToGenerator();
  }
};

// Helper function to scroll to main generator
const scrollToGenerator = () => {
  const generatorElement = document.getElementById('main-content-generator');
  if (generatorElement) {
    generatorElement.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    });
  }
};

// Template processing utilities
export const templateUtils = {
  // Extract unfilled placeholders
  getUnfilledPlaceholders: (content) => {
    const placeholderRegex = /\[insert ([^\]]+)\]/g;
    const matches = [];
    let match;
    
    while ((match = placeholderRegex.exec(content)) !== null) {
      matches.push(match[1]);
    }
    
    return [...new Set(matches)]; // Remove duplicates
  },

  // Fill placeholders in content
  fillPlaceholders: (content, values) => {
    let filledContent = content;
    
    Object.entries(values).forEach(([placeholder, value]) => {
      if (value && value.trim()) {
        const regex = new RegExp(`\\[insert ${placeholder}\\]`, 'g');
        filledContent = filledContent.replace(regex, value);
      }
    });
    
    return filledContent;
  },

  // Generate AI prompt from template
  generateAIPrompt: (templateData, context = '') => {
    const { structure, placeholders, categoryInfo } = templateData;
    
    return `
You are helping create a professional LinkedIn post using this template structure:

Template: "${structure}"

Category: ${categoryInfo.name} - ${categoryInfo.description}

Placeholders to fill: ${placeholders.join(', ')}

Additional context: ${context}

Please generate engaging, professional content for each placeholder that fits the ${categoryInfo.name} category style. The content should be authentic, valuable, and encourage engagement.

Return the filled template as a complete LinkedIn post.
    `.trim();
  },

  // Validate template before loading
  validateTemplate: (templateData) => {
    const required = ['structure', 'placeholders', 'category', 'title'];
    const missing = required.filter(field => !templateData[field]);
    
    if (missing.length > 0) {
      throw new Error(`Template missing required fields: ${missing.join(', ')}`);
    }
    
    return true;
  }
};

// React hook for template integration
export const useTemplateLoader = (setGeneratorState) => {
  const loadTemplate = (templateData) => {
    try {
      templateUtils.validateTemplate(templateData);
      handleTemplateLoad(templateData, setGeneratorState);
      return { success: true };
    } catch (error) {
      console.error('Template loading error:', error);
      return { success: false, error: error.message };
    }
  };

  return { loadTemplate };
};

// Example main generator component integration
export const MainGeneratorIntegration = {
  // Update your main generator component to handle template loading
  example: `
  import { useTemplateLoader, templateUtils } from './templateIntegration.js';
  
  const MainContentGenerator = () => {
    const [generatorState, setGeneratorState] = useState({
      content: '',
      mode: 'normal', // or 'template_editing'
      templateMetadata: null,
      // ... other state
    });
    
    const { loadTemplate } = useTemplateLoader(setGeneratorState);
    
    // Handle template selection from library
    const handleTemplateSelect = (templateData) => {
      const result = loadTemplate(templateData);
      if (!result.success) {
        // Handle error
        console.error('Failed to load template:', result.error);
      }
    };
    
    return (
      <div>
        {/* Template Library Component */}
        <TemplateLibrary 
          onTemplateSelect={handleTemplateSelect}
          onRedirectToGenerator={handleTemplateSelect}
        />
        
        {/* Main Generator Interface */}
        <div id="main-content-generator">
          {generatorState.templateMetadata && (
            <div className="template-info-bar">
              <span>Using template: {generatorState.templateMetadata.title}</span>
              <button onClick={() => clearTemplate()}>Clear Template</button>
            </div>
          )}
          
          <textarea 
            value={generatorState.content}
            onChange={(e) => setGeneratorState(prev => ({
              ...prev, 
              content: e.target.value
            }))}
            placeholder="Enter your content or load a template..."
          />
          
          {/* Show placeholder guidance if in template mode */}
          {generatorState.mode === 'template_editing' && (
            <PlaceholderGuidance 
              placeholders={templateUtils.getUnfilledPlaceholders(generatorState.content)}
            />
          )}
        </div>
      </div>
    );
  };
  `
};

// HTML Integration Example (for index.html)
export const HTMLIntegration = {
  // How to integrate with existing HTML page
  usage: `
  // In your HTML page, templates can be loaded using:
  
  // 1. From template library components (already implemented)
  const templateData = {
    title: "Challenge to Success Journey",
    structure: "Three years ago, I [insert challenge]...",
    placeholders: ["challenge", "current state", "lesson", "insight"], 
    action: "load_into_generator",
    categoryInfo: { name: "Personal Story", icon: "👤" }
  };
  
  // 2. Load template into main generator
  window.templateLoader.loadTemplate(templateData);
  
  // 3. Template system provides:
  // - Template info bar showing loaded template
  // - Template editor with placeholder guidance
  // - Auto-fill with AI functionality
  // - Character counting
  // - Easy transition to final content
  
  // 4. User workflow:
  // - Click "Load into Generator" from template library
  // - Template appears in main generator with info bar
  // - User can edit template content directly
  // - Click "Auto-Fill with AI" to populate placeholders
  // - Click "Use Content" to move to final generated content area
  `,
  
  features: [
    "Seamless integration with existing generator interface",
    "Visual template info bar with category and title",
    "Template content editor with real-time placeholder detection", 
    "Auto-fill placeholders using existing AI generation",
    "Character counting and content validation",
    "Smooth transitions between template editing and final content",
    "Clear template functionality to return to normal mode"
  ]
};

export default {
  handleTemplateLoad,
  templateUtils,
  useTemplateLoader,
  MainGeneratorIntegration
};