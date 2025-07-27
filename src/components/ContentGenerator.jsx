import { useState, useEffect } from 'react';

export default function ContentGenerator({ selectedTemplate, onTemplateUsed }) {
  const [topic, setTopic] = useState('AI Readiness Assessment');
  const [audience, setAudience] = useState('C-level executives and business leaders');
  const [tone, setTone] = useState('Professional and authoritative');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [templateInfo, setTemplateInfo] = useState(null);

  // Handle template selection from TemplateLibrary
  useEffect(() => {
    if (selectedTemplate) {
      setTemplateInfo(selectedTemplate);
      setTopic(selectedTemplate.title);
      setGeneratedContent(selectedTemplate.preview);
      if (onTemplateUsed) {
        onTemplateUsed(); // Clear the template from parent state
      }
    }
  }, [selectedTemplate, onTemplateUsed]);

  const handleGenerate = async (multiple = false) => {
    setIsGenerating(true);
    // Simulate API call
    setTimeout(() => {
      const sampleContent = `🚀 Is your organization truly ready for the AI revolution?

As we stand at the precipice of unprecedented technological transformation, ${audience} must ask themselves: Are we prepared for what's coming?

Key areas to assess:
✅ Data infrastructure readiness
✅ Team skill development
✅ Ethical AI frameworks
✅ Competitive positioning
✅ ROI measurement strategies

The companies that invest in AI readiness today will be the leaders of tomorrow. Don't let your organization fall behind.

What's your biggest AI implementation challenge? Share your thoughts below! 👇

#AI #Leadership #DigitalTransformation #Innovation`;
      
      setGeneratedContent(sampleContent);
      setIsGenerating(false);
    }, 2000);
  };

  const clearTemplate = () => {
    setTemplateInfo(null);
  };

  return (
    <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
      <h2 className="text-2xl font-bold text-dark-text mb-6">AI Content Generator</h2>
      
      {/* Input Fields */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-dark-text mb-2">Topic</label>
          <input 
            type="text" 
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full px-3 py-2 bg-dark-primary border border-dark-border rounded-lg text-dark-text focus:outline-none focus:border-aifluence-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-dark-text mb-2">Audience</label>
          <input 
            type="text" 
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            className="w-full px-3 py-2 bg-dark-primary border border-dark-border rounded-lg text-dark-text focus:outline-none focus:border-aifluence-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-dark-text mb-2">Tone</label>
          <input 
            type="text" 
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="w-full px-3 py-2 bg-dark-primary border border-dark-border rounded-lg text-dark-text focus:outline-none focus:border-aifluence-500"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button 
          onClick={() => handleGenerate(false)}
          disabled={isGenerating}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-aifluence-600 to-purple-600 hover:from-aifluence-700 hover:to-purple-700 disabled:opacity-50 text-white rounded-lg transition-colors"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
          </svg>
          <span>{isGenerating ? 'Generating...' : 'Generate Post'}</span>
        </button>
        <button 
          onClick={() => handleGenerate(true)}
          disabled={isGenerating}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 text-white rounded-lg transition-colors"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012 2v2M7 7h10"></path>
          </svg>
          <span>Generate 5 Posts</span>
        </button>
      </div>

      {/* Template Info Bar */}
      {templateInfo && (
        <div className="mb-6 p-4 bg-green-600/20 border border-green-500/30 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-green-400 font-medium">Template Loaded:</span>
              <span className="text-dark-text font-semibold">{templateInfo.title}</span>
              <span className="text-xs bg-green-600/30 text-green-300 px-2 py-1 rounded-full">{templateInfo.category}</span>
            </div>
            <button 
              onClick={clearTemplate}
              className="text-dark-text-muted hover:text-dark-text text-sm"
            >
              Clear Template
            </button>
          </div>
        </div>
      )}

      {/* Generated Content */}
      {generatedContent && (
        <div className="bg-dark-primary border border-dark-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-dark-text">Generated Content</h3>
            <div className="flex space-x-2">
              <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors">
                Copy
              </button>
              <button className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition-colors">
                Schedule
              </button>
            </div>
          </div>
          <div className="text-dark-text whitespace-pre-wrap">{generatedContent}</div>
        </div>
      )}
    </div>
  );
}