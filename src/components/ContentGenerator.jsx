import React, { useState } from 'react';
import { Brain, Lightbulb, Users, Target, TrendingUp, Copy, RefreshCw, Wand2 } from 'lucide-react';

const ContentGenerator = () => {
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedAudience, setSelectedAudience] = useState('business-leaders');
  const [selectedTone, setSelectedTone] = useState('educational');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');

  const topics = [
    { 
      id: 'ai-readiness',
      title: 'AI Readiness Assessment',
      description: 'How to evaluate if your business is ready for AI'
    },
    {
      id: 'roi-ai',
      title: 'Calculating AI ROI',
      description: 'Understanding the return on investment for AI projects'
    },
    {
      id: 'ai-misconceptions',
      title: 'Common AI Misconceptions',
      description: 'Debunking myths about AI in business'
    },
    {
      id: 'data-quality',
      title: 'Data Quality for AI',
      description: 'Why good data is essential for successful AI'
    },
    {
      id: 'ai-implementation',
      title: 'AI Implementation Strategy',
      description: 'Step-by-step approach to deploying AI solutions'
    },
    {
      id: 'human-ai-collaboration',
      title: 'Human-AI Collaboration',
      description: 'How AI enhances rather than replaces human workers'
    }
  ];

  const audiences = [
    { id: 'business-leaders', label: 'Business Leaders & Executives' },
    { id: 'it-managers', label: 'IT Managers & CTOs' },
    { id: 'operations-managers', label: 'Operations Managers' },
    { id: 'small-business-owners', label: 'Small Business Owners' },
    { id: 'manufacturing-professionals', label: 'Manufacturing Professionals' }
  ];

  const tones = [
    { id: 'educational', label: 'Educational & Informative' },
    { id: 'conversational', label: 'Conversational & Approachable' },
    { id: 'professional', label: 'Professional & Authoritative' },
    { id: 'inspiring', label: 'Inspiring & Motivational' }
  ];

  const contentTemplates = {
    'ai-readiness': {
      'business-leaders': {
        educational: `🎯 **Is Your Business Ready for AI? A Quick Assessment**

Many business leaders ask me: "How do I know if we're ready for AI?" Here's a simple framework:

✅ **Data Foundation**
Do you have organized, accessible data? AI needs quality data to deliver results.

✅ **Clear Business Goals** 
Can you identify specific problems AI could solve? Start with pain points, not technology.

✅ **Change Management**
Is your team open to new processes? AI success requires cultural adaptation.

✅ **Realistic Expectations**
Do you understand AI capabilities and limitations? Avoid the "magic solution" trap.

The gap between business knowledge and AI isn't technical—it's strategic. We help bridge that gap with practical, results-driven approaches.

Ready to assess your AI readiness? Let's discuss your specific situation.

#AI #BusinessStrategy #DigitalTransformation #Leadership`
      }
    },
    'roi-ai': {
      'business-leaders': {
        educational: `💰 **The Real Truth About AI ROI (It's Not What You Think)**

Most businesses calculate AI ROI wrong. They focus on cost savings instead of value creation.

🔍 **Traditional Thinking:**
"AI will reduce our labor costs by 30%"

🚀 **Strategic Thinking:**
"AI will help us serve customers 3x faster while improving quality"

**Real ROI Sources:**
• Faster decision-making = competitive advantage
• Better customer insights = increased revenue
• Process optimization = capacity without growth costs
• Risk reduction = avoided losses

The biggest gap in business-AI understanding? Thinking AI is about replacing humans instead of amplifying human capabilities.

At Agentic Intelligence, we help you identify the right ROI metrics and build AI solutions that deliver measurable business value.

What's your biggest business challenge that technology might solve?

#ROI #AI #BusinessValue #Innovation`
      }
    },
    'ai-misconceptions': {
      'business-leaders': {
        educational: `🤖 **5 AI Myths That Cost Businesses Millions**

After working with dozens of companies, I see the same misconceptions repeatedly:

**Myth 1:** "AI is plug-and-play"
**Reality:** Successful AI requires careful planning and integration

**Myth 2:** "More data always means better AI"
**Reality:** Quality beats quantity every time

**Myth 3:** "AI will solve all our problems"
**Reality:** AI solves specific, well-defined problems exceptionally well

**Myth 4:** "AI is only for tech companies"
**Reality:** Every industry can benefit from targeted AI solutions

**Myth 5:** "AI implementation takes years"
**Reality:** With the right approach, you can see results in months

The gap between business expectations and AI reality is where projects fail. We specialize in setting realistic expectations and delivering practical AI solutions.

Which myth has your organization encountered?

#AI #BusinessMyths #DigitalTransformation #TechTruth`
      }
    }
  };

  const generateContent = async () => {
    setIsGenerating(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const template = contentTemplates[selectedTopic]?.[selectedAudience]?.[selectedTone];
    
    if (template) {
      setGeneratedContent(template);
    } else {
      // Fallback generic content
      setGeneratedContent(`🚀 **Bridging the Business-AI Gap**

The biggest challenge in AI adoption isn't technical—it's the gap between business needs and AI capabilities.

Most companies struggle with:
• Understanding where AI fits in their operations
• Setting realistic expectations for AI outcomes
• Building the right data foundation
• Managing change and training teams

At Agentic Intelligence, we specialize in translating business challenges into AI solutions that work.

Our approach:
1. Assess your current state and readiness
2. Identify high-impact AI opportunities
3. Develop practical implementation roadmaps
4. Support you through deployment and optimization

Ready to bridge the gap? Let's discuss your specific challenges.

#AI #BusinessStrategy #DigitalTransformation #Innovation`);
    }
    
    setIsGenerating(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedContent);
    // You could add a toast notification here
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">AI Content Generator</h2>
        <p className="text-slate-400">Create educational content about bridging business and AI</p>
      </div>

      {/* Content Generation Form */}
      <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Topic Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">
              Select Topic
            </label>
            <div className="space-y-2">
              {topics.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => setSelectedTopic(topic.id)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    selectedTopic === topic.id
                      ? 'bg-blue-500/20 border-blue-500/50 text-blue-300'
                      : 'bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <div className="font-medium text-sm">{topic.title}</div>
                  <div className="text-xs text-slate-400 mt-1">{topic.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Audience Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">
              Target Audience
            </label>
            <div className="space-y-2">
              {audiences.map((audience) => (
                <button
                  key={audience.id}
                  onClick={() => setSelectedAudience(audience.id)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    selectedAudience === audience.id
                      ? 'bg-purple-500/20 border-purple-500/50 text-purple-300'
                      : 'bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <div className="text-sm">{audience.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Tone Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">
              Content Tone
            </label>
            <div className="space-y-2">
              {tones.map((tone) => (
                <button
                  key={tone.id}
                  onClick={() => setSelectedTone(tone.id)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    selectedTone === tone.id
                      ? 'bg-green-500/20 border-green-500/50 text-green-300'
                      : 'bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <div className="text-sm">{tone.label}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <div className="mt-6 text-center">
          <button
            onClick={generateContent}
            disabled={!selectedTopic || isGenerating}
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isGenerating ? (
              <div className="flex items-center space-x-2">
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Generating Content...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Wand2 className="h-4 w-4" />
                <span>Generate LinkedIn Post</span>
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Generated Content */}
      {generatedContent && (
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Generated Content</h3>
            <button
              onClick={copyToClipboard}
              className="flex items-center space-x-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors"
            >
              <Copy className="h-4 w-4" />
              <span>Copy</span>
            </button>
          </div>
          
          <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-600">
            <pre className="text-slate-200 whitespace-pre-wrap text-sm leading-relaxed font-sans">
              {generatedContent}
            </pre>
          </div>
          
          <div className="mt-4 flex items-center justify-between text-sm text-slate-400">
            <div>Ready to post to LinkedIn</div>
            <div>Character count: {generatedContent.length}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentGenerator;