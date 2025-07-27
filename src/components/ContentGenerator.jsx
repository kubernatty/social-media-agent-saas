import { useState, useEffect } from 'react';

export default function ContentGenerator({ selectedTemplate, onTemplateUsed }) {
  const [topic, setTopic] = useState('Project Management Tips');
  const [audience, setAudience] = useState('Business professionals');
  const [tone, setTone] = useState('Professional and authoritative');
  const [generatedContent, setGeneratedContent] = useState('');
  const [generatedPosts, setGeneratedPosts] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [templateInfo, setTemplateInfo] = useState(null);
  const [copySuccess, setCopySuccess] = useState('');
  
  // Function to show completion message in console only
  const showNotification = (message) => {
    // Console bell sound (works in some terminals)
    console.log('\x07✅ ' + message);
  };
  
  // Function to call Ollama API directly
  const callOllama = async (prompt, model = 'llama3.2:1b') => {
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.8,
          top_p: 0.9,
          top_k: 40
        }
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.response;
  };

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

  // Advanced content generation based on the sophisticated original system
  const buildExpertProfile = (topic, audience) => {
    const topicLower = topic.toLowerCase();
    const audienceLower = audience.toLowerCase();
    
    let expertType = 'industry consultant';
    let credibility = 'years of experience';
    let perspective = 'practical insights';
    let specialization = topic;
    
    if (topicLower.includes('medical') || topicLower.includes('health')) {
      expertType = audienceLower.includes('student') ? 'medical educator' : 'healthcare strategist';
      credibility = 'clinical experience and research';
      perspective = 'evidence-based insights';
    } else if (topicLower.includes('marketing') || topicLower.includes('brand')) {
      expertType = 'marketing strategist';
      credibility = 'campaigns across industries';
      perspective = 'data-driven insights';
    } else if (topicLower.includes('pastry') || topicLower.includes('culinary') || topicLower.includes('food')) {
      expertType = 'culinary business consultant';
      credibility = 'restaurant operations and trends';
      perspective = 'industry insights';
    } else if (topicLower.includes('education') || topicLower.includes('school')) {
      expertType = 'education consultant';
      credibility = 'institutional transformations';
      perspective = 'systemic insights';
    } else if (topicLower.includes('tech') || topicLower.includes('software') || topicLower.includes('ai')) {
      expertType = 'technology strategist';
      credibility = 'digital transformations';
      perspective = 'innovation insights';
    }
    
    return {
      type: expertType,
      credibility,
      perspective,
      specialization,
      voice: getExpertVoice(expertType)
    };
  };

  const getExpertVoice = (expertType) => {
    const voices = {
      'medical educator': 'analytical yet accessible',
      'healthcare strategist': 'systematic and evidence-focused',
      'marketing strategist': 'results-oriented and data-driven',
      'culinary business consultant': 'passionate yet practical',
      'education consultant': 'thoughtful and student-centered',
      'technology strategist': 'forward-thinking and pragmatic',
      'industry consultant': 'experienced and strategic'
    };
    
    return voices[expertType] || voices['industry consultant'];
  };

  const selectContentStrategy = (tone, forceRandom = false) => {
    const allStrategies = ['story_with_lesson', 'contrarian_take', 'framework_sharing', 'trend_prediction', 'insight_analysis'];
    
    // For single post generation, always use random strategy for variety
    if (forceRandom) {
      return allStrategies[Math.floor(Math.random() * allStrategies.length)];
    }
    
    const strategies = {
      'conversational': 'story_with_lesson',
      'bold': 'contrarian_take',
      'actionable': 'framework_sharing',
      'visionary': 'trend_prediction',
      'professional': 'insight_analysis'
    };
    
    return strategies[tone.toLowerCase()] || strategies['professional'];
  };

  const generateExpertInsights = (topic, expertProfile) => {
    return {
      counterintuitive: generateCounterintuitiveInsight(topic, expertProfile),
      practical: generatePracticalInsight(topic, expertProfile),
      trend: generateTrendInsight(topic, expertProfile),
      mistake: generateCommonMistake(topic, expertProfile),
      opportunity: generateOpportunityInsight(topic, expertProfile)
    };
  };

  const generateCounterintuitiveInsight = (topic, expertProfile) => {
    const patterns = [
      `Most people think ${topic} success comes from perfection, but I've seen the opposite`,
      `The biggest ${topic} breakthroughs happen when you stop following best practices`,
      `Everyone focuses on the obvious ${topic} metrics, but the real indicator is something else entirely`,
      `The ${topic} advice everyone gives actually prevents success in most cases`,
      `What looks like failure in ${topic} is often the setup for breakthrough success`
    ];
    
    return patterns[Math.floor(Math.random() * patterns.length)];
  };

  const generatePracticalInsight = (topic, expertProfile) => {
    const patterns = [
      `The 3 ${topic} fundamentals I wish someone had taught me earlier`,
      `Here's what actually moves the needle in ${topic} (from analyzing 100+ cases)`,
      `The ${topic} framework I use with every client - it works every time`,
      `5 minutes of this ${topic} practice beats hours of everything else`,
      `The ${topic} question that reveals everything about potential success`
    ];
    
    return patterns[Math.floor(Math.random() * patterns.length)];
  };

  const generateTrendInsight = (topic, expertProfile) => {
    const patterns = [
      `The ${topic} shift happening right now that most people are missing`,
      `Why ${topic} in 2025 will look nothing like today`,
      `The ${topic} trend that's about to change everything`,
      `3 ${topic} predictions that will sound crazy today but obvious tomorrow`,
      `The quiet ${topic} revolution that's already started`
    ];
    
    return patterns[Math.floor(Math.random() * patterns.length)];
  };

  const generateCommonMistake = (topic, expertProfile) => {
    const patterns = [
      `The ${topic} mistake I see in 90% of cases`,
      `Why most ${topic} efforts fail (and how to avoid it)`,
      `The ${topic} assumption that destroys results`,
      `What everyone gets wrong about ${topic}`,
      `The ${topic} trap that catches even experienced professionals`
    ];
    
    return patterns[Math.floor(Math.random() * patterns.length)];
  };

  const generateOpportunityInsight = (topic, expertProfile) => {
    const patterns = [
      `The ${topic} opportunity hiding in plain sight`,
      `Why now is the perfect time for ${topic} transformation`,
      `The ${topic} competitive advantage most people ignore`,
      `How to turn ${topic} challenges into unfair advantages`,
      `The ${topic} goldmine that everyone overlooks`
    ];
    
    return patterns[Math.floor(Math.random() * patterns.length)];
  };

  const createStoryStructure = (topic, audience, expertProfile, insight) => {
    const scenarios = [
      {
        opening: `Last week, I watched a ${getAudienceMember(audience)} completely transform their approach to ${topic}.`,
        body: `They started with a simple question: "What if everything we know about ${topic} is backwards?" Instead of following the usual playbook, they tried something different. The results surprised everyone - including me.`,
        insight: `Here's what I learned: ${insight.toLowerCase()}. Sometimes the biggest breakthroughs come from questioning the fundamentals.`,
        callToAction: `What assumptions about ${topic} are you ready to challenge?`
      },
      {
        opening: `A ${getAudienceMember(audience)} asked me something yesterday that I can't stop thinking about.`,
        body: `"Why does everyone make ${topic} so complicated?" They were right. I've seen teams spend months on complex ${topic} strategies when simple approaches work better. The industry creates complexity where clarity is needed.`,
        insight: `The truth: ${insight.toLowerCase()}. Complexity is often a symptom of unclear thinking.`,
        callToAction: `How are you simplifying your approach to ${topic}?`
      },
      {
        opening: `I just saw the most interesting ${topic} case study unfold in real time.`,
        body: `A team took everything conventional wisdom says about ${topic} and flipped it. Instead of following best practices, they focused on first principles. The outcome? They achieved in 3 months what typically takes a year.`,
        insight: `The lesson: ${insight.toLowerCase()}. First principles thinking beats best practices every time.`,
        callToAction: `What first principles guide your ${topic} decisions?`
      }
    ];
    
    return scenarios[Math.floor(Math.random() * scenarios.length)];
  };

  const createContrarianeStructure = (topic, audience, expertProfile, insight) => {
    const takes = [
      {
        opening: `Unpopular opinion: Most ${topic} advice is counterproductive.`,
        body: `${insight}. I've analyzed hundreds of ${topic} cases, and the pattern is clear: the conventional approach creates more problems than it solves. The organizations winning right now are doing the opposite of what everyone recommends.`,
        insight: `The truth is uncomfortable but simple: success in ${topic} requires unlearning most of what you've been taught.`,
        callToAction: `What ${topic} "best practice" are you ready to abandon?`
      },
      {
        opening: `Hot take: The ${topic} industry has been giving backwards advice for years.`,
        body: `${insight}. While everyone focuses on optimization, the real winners are focused on something completely different. They're not playing the same game - they're playing a better game.`,
        insight: `The competitive advantage isn't better execution of standard practices - it's executing entirely different practices.`,
        callToAction: `What game are you playing in ${topic}?`
      },
      {
        opening: `Controversial thought: ${insight}.`,
        body: `I know this sounds backwards, but I've seen it proven repeatedly. The ${audience} who embrace this counter-intuitive approach consistently outperform those following conventional wisdom. The gap isn't small - it's dramatic.`,
        insight: `Sometimes the best strategy is the one that sounds wrong to everyone else.`,
        callToAction: `What would you do differently if conventional wisdom was wrong?`
      }
    ];
    
    return takes[Math.floor(Math.random() * takes.length)];
  };

  const createFrameworkStructure = (topic, audience, expertProfile, insight) => {
    const frameworks = [
      {
        opening: `${insight}:`,
        body: `1. Start with the end in mind - what does success actually look like?\n2. Identify the constraint - what's really holding you back?\n3. Test the minimum viable change - what's the smallest thing you can try?\n4. Measure what matters - ignore vanity metrics\n5. Scale what works - double down on proven approaches`,
        insight: `This framework works because it forces clarity over complexity. Most ${topic} failures happen because people skip step 1.`,
        callToAction: `Which step are you missing in your ${topic} approach?`
      },
      {
        opening: `After working with hundreds of ${audience}, I've identified the ${topic} pattern that actually works:`,
        body: `→ Map the current reality (most people skip this)\n→ Define the specific outcome you need\n→ Find the biggest leverage point\n→ Test small, iterate fast\n→ Scale gradually, measure constantly`,
        insight: `${insight}. The difference between success and failure is often execution of fundamentals, not access to advanced techniques.`,
        callToAction: `What's your biggest leverage point in ${topic} right now?`
      },
      {
        opening: `The ${topic} framework I use with every client:`,
        body: `Phase 1: Audit your current approach honestly\nPhase 2: Identify the 20% that drives 80% of results\nPhase 3: Eliminate everything else\nPhase 4: Optimize the 20% relentlessly\nPhase 5: Scale only what's proven`,
        insight: `Simple? Yes. Easy? No. But it works because ${insight.toLowerCase()}.`,
        callToAction: `What would you eliminate from your ${topic} approach if you were ruthlessly honest?`
      }
    ];
    
    return frameworks[Math.floor(Math.random() * frameworks.length)];
  };

  const createTrendStructure = (topic, audience, expertProfile, insight) => {
    const trends = [
      {
        opening: `${insight}.`,
        body: `While everyone's focused on today's challenges, smart ${audience} are already adapting to tomorrow's reality. The shift is subtle but significant - and it's accelerating. Those who see it early have an insurmountable advantage.`,
        insight: `The future belongs to those who act on trends before they become obvious to everyone else.`,
        callToAction: `How are you preparing for the future of ${topic}?`
      },
      {
        opening: `The ${topic} landscape is shifting in a way most people aren't seeing yet.`,
        body: `${insight}. I'm seeing early signals everywhere - in client conversations, industry data, and successful case studies. The organizations that adapt first will dominate the next decade.`,
        insight: `Change creates opportunity, but only for those who recognize it early and act decisively.`,
        callToAction: `What signals are you seeing in ${topic}?`
      },
      {
        opening: `Prediction: ${insight}.`,
        body: `The evidence is everywhere if you know where to look. Leading ${audience} are already making moves that seem premature today but will look prescient tomorrow. The competitive landscape is about to change dramatically.`,
        insight: `The best time to adapt to change is before everyone else realizes change is necessary.`,
        callToAction: `What would you do differently if you knew this trend was certain?`
      }
    ];
    
    return trends[Math.floor(Math.random() * trends.length)];
  };

  const createInsightStructure = (topic, audience, expertProfile, insight) => {
    const insights = [
      {
        opening: `I've been analyzing ${topic} patterns for years, and one thing keeps standing out.`,
        body: `${insight}. The data is consistent across industries and contexts. Yet most ${audience} are completely missing it. They're optimizing for the wrong metrics and solving the wrong problems.`,
        insight: `The biggest opportunities are often hiding in plain sight, disguised as things everyone already knows but no one acts on.`,
        callToAction: `What obvious opportunity are you overlooking in ${topic}?`
      },
      {
        opening: `After working with ${audience} across different industries, I've noticed something interesting.`,
        body: `${insight}. The pattern is so consistent it's almost mathematical. The organizations that embrace this insight dramatically outperform those that ignore it. Yet it remains surprisingly underutilized.`,
        insight: `Sometimes the most powerful strategies are the ones that seem too simple to work.`,
        callToAction: `How could you apply this insight to your ${topic} challenges?`
      },
      {
        opening: `Here's what I've learned from analyzing hundreds of ${topic} cases:`,
        body: `${insight}. This insight explains why some ${audience} consistently succeed while others struggle with the same challenges. It's not about having better resources or more experience - it's about seeing the game differently.`,
        insight: `Perspective often matters more than resources when it comes to breakthrough results.`,
        callToAction: `What perspective shift could transform your approach to ${topic}?`
      }
    ];
    
    return insights[Math.floor(Math.random() * insights.length)];
  };

  const getAudienceMember = (audience) => {
    const audienceLower = audience.toLowerCase();
    
    if (audienceLower.includes('student')) return 'student';
    if (audienceLower.includes('founder') || audienceLower.includes('ceo')) return 'founder';
    if (audienceLower.includes('marketing')) return 'marketing director';
    if (audienceLower.includes('sales')) return 'sales manager';
    if (audienceLower.includes('developer') || audienceLower.includes('engineer')) return 'developer';
    if (audienceLower.includes('consultant')) return 'consultant';
    if (audienceLower.includes('manager')) return 'team manager';
    if (audienceLower.includes('chef') || audienceLower.includes('culinary')) return 'chef';
    if (audienceLower.includes('doctor') || audienceLower.includes('physician')) return 'physician';
    
    return 'professional';
  };

  const craftExpertPost = (topic, audience, expertProfile, contentStrategy, insights) => {
    let selectedInsight;
    let contentStructure;
    
    switch(contentStrategy) {
      case 'story_with_lesson':
        selectedInsight = insights.practical;
        contentStructure = createStoryStructure(topic, audience, expertProfile, selectedInsight);
        break;
      case 'contrarian_take':
        selectedInsight = insights.counterintuitive;
        contentStructure = createContrarianeStructure(topic, audience, expertProfile, selectedInsight);
        break;
      case 'framework_sharing':
        selectedInsight = insights.practical;
        contentStructure = createFrameworkStructure(topic, audience, expertProfile, selectedInsight);
        break;
      case 'trend_prediction':
        selectedInsight = insights.trend;
        contentStructure = createTrendStructure(topic, audience, expertProfile, selectedInsight);
        break;
      default:
        selectedInsight = insights.opportunity;
        contentStructure = createInsightStructure(topic, audience, expertProfile, selectedInsight);
    }
    
    const content = contentStructure.opening + '\n\n' + 
                   contentStructure.body + '\n\n' + 
                   contentStructure.insight + '\n\n' + 
                   contentStructure.callToAction + '\n\n' + 
                   generateRelevantHashtags(topic, expertProfile);
    
    return content;
  };

  const generateRelevantHashtags = (topic, expertProfile) => {
    const topicWords = topic.split(' ');
    const primaryHashtag = '#' + topicWords.map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join('');
    
    const expertHashtags = {
      'medical educator': ['#MedicalEducation', '#Healthcare', '#MedicalTraining'],
      'healthcare strategist': ['#Healthcare', '#HealthTech', '#PatientCare'],
      'marketing strategist': ['#Marketing', '#Strategy', '#GrowthHacking'],
      'culinary business consultant': ['#FoodBusiness', '#Hospitality', '#CulinaryArts'],
      'education consultant': ['#Education', '#Learning', '#EdTech'],
      'technology strategist': ['#Technology', '#Innovation', '#DigitalTransformation'],
      'industry consultant': ['#Business', '#Strategy', '#Leadership']
    };
    
    const expertTags = expertHashtags[expertProfile.type] || expertHashtags['industry consultant'];
    const commonTags = ['#Leadership', '#Success', '#Growth'];
    
    const allTags = [primaryHashtag, ...expertTags, ...commonTags];
    const uniqueTags = [...new Set(allTags)].slice(0, 5);
    
    return uniqueTags.join(' ');
  };

  const generateExpertContent = async (topic, audience, tone, useRandomStrategy = false) => {
    console.log('Starting content generation with Ollama...');
    try {
      const strategies = ['story with lesson', 'contrarian take', 'actionable framework', 'trend prediction', 'expert insight'];
      const strategy = useRandomStrategy ? 
        strategies[Math.floor(Math.random() * strategies.length)] : 
        strategies[0];

      const prompt = `Just finished working on a challenging ${topic} project and wanted to share some insights with fellow ${audience.toLowerCase()}.

Here's what I learned about ${topic}:

[Continue writing the post content directly. For lists/tips use bullet points (•) or numbers (1., 2., 3.). Keep it concise - no "firstly, secondly" language. End with exactly 3-5 hashtags. No quotes. No "Here's a LinkedIn post" phrases.]`;

      console.log('Calling Ollama with strategy:', strategy);
      const response = await callOllama(prompt);

      console.log('Ollama response received:', response.substring(0, 100) + '...');
      
      // Remove quotes from beginning and end of response
      let cleanedResponse = response.trim();
      if ((cleanedResponse.startsWith('"') && cleanedResponse.endsWith('"')) ||
          (cleanedResponse.startsWith("'") && cleanedResponse.endsWith("'"))) {
        cleanedResponse = cleanedResponse.slice(1, -1);
      }
      
      // Ensure hashtags are present at the end
      if (!cleanedResponse.includes('#')) {
        const hashtags = generateRelevantHashtags(topic, { type: 'industry consultant' });
        cleanedResponse += '\n\n' + hashtags;
      }
      
      return cleanedResponse;
    } catch (error) {
      console.error('Error generating content with Ollama:', error);
      console.log('Falling back to template content');
      // Fallback to template-based content if Ollama fails
      return generateFallbackContent(topic, audience, tone);
    }
  };

  const generateFallbackContent = (topic, audience, tone) => {
    const posts = [
      {
        hook: `Here's what I learned about ${topic} this week:`,
        content: `After working with several ${audience.toLowerCase()}, I've noticed a common pattern. The most successful organizations don't just implement ${topic} - they transform their entire approach to decision-making.\n\nKey insights:\n• Start small, measure everything\n• Scale what works\n• Perfect strategy isn't needed from day one`,
        cta: `What's been your biggest learning about ${topic} lately?`
      },
      {
        hook: `Most people overcomplicate ${topic}.`,
        content: `I see ${audience.toLowerCase()} struggling with complex frameworks and elaborate processes. But the organizations seeing real results focus on three fundamentals:\n\n• Clear objectives\n• Consistent execution\n• Continuous feedback\n\nSimple beats complex every time.`,
        cta: `What's your approach to ${topic}?`
      },
      {
        hook: `The biggest ${topic} mistake I see repeatedly:`,
        content: `${audience} often jump straight to implementation without understanding their current state. It's like trying to navigate without knowing where you are.\n\nSuccessful ${topic} initiatives:\n1. Start with honest assessment\n2. Build from current reality\n3. Iterate based on learnings\n\nSkip step 1? You'll waste months going in circles.`,
        cta: `Have you seen this pattern in your organization?`
      },
      {
        hook: `Unpopular opinion about ${topic}:`,
        content: `The tools don't matter as much as everyone thinks. I've seen ${audience.toLowerCase()} achieve remarkable results with basic approaches, while others fail despite having the best technology.\n\nWhat actually matters:\n• Culture\n• Communication\n• Commitment to improvement\n\nTechnology amplifies what you already do - it doesn't fix broken processes.`,
        cta: `Do you agree? What's been your experience?`
      }
    ];
    
    const selectedPost = posts[Math.floor(Math.random() * posts.length)];
    const hashtags = generateRelevantHashtags(topic, { type: 'industry consultant' });
    
    return `${selectedPost.hook}\n\n${selectedPost.content}\n\n${selectedPost.cta}\n\n${hashtags}`;
  };

  const handleGenerate = async (multiple = false) => {
    setIsGenerating(true);
    setGeneratedPosts([]);
    
    try {
      if (multiple) {
        // Generate 5 different expert posts with different strategies
        const strategies = ['story with lesson', 'contrarian take', 'actionable framework', 'trend prediction', 'expert insight'];
        const posts = [];
        
        for (let i = 0; i < 5; i++) {
          const content = await generateExpertContent(topic, audience, tone, true);
          
          posts.push({
            id: i + 1,
            content: content,
            approach: strategies[i % strategies.length],
            timestamp: new Date().toLocaleString()
          });
        }
        
        setGeneratedPosts(posts);
        setGeneratedContent(''); // Clear single post
        showNotification('5 expert posts generated successfully! 🎉');
      } else {
        // Generate single expert post with random strategy for variety
        const content = templateInfo ? 
          await generateTemplateContent() : 
          await generateExpertContent(topic, audience, tone, true); // Use random strategy
        
        setGeneratedContent(content);
        setGeneratedPosts([]); // Clear multiple posts
        showNotification('Expert post generated successfully! ✨');
      }
    } catch (error) {
      console.error('Error generating content:', error);
      setGeneratedContent('Error generating content. Please try again.');
      showNotification('Content generation failed. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateTemplateContent = async () => {
    if (templateInfo && templateInfo.preview) {
      try {
        const prompt = `${templateInfo.preview}

[Replace all placeholders with content about ${topic} for ${audience}. Use ${tone.toLowerCase()} tone. For lists/tips use bullet points (•) or numbers (1., 2., 3.). Keep it concise - no "firstly, secondly" language. End with exactly 3-5 hashtags. No quotes around the post. No "Here's a LinkedIn post" phrases.]`;

        const response = await callOllama(prompt);
        
        // Remove quotes from beginning and end of response
        let cleanedResponse = response.trim();
        if ((cleanedResponse.startsWith('"') && cleanedResponse.endsWith('"')) ||
            (cleanedResponse.startsWith("'") && cleanedResponse.endsWith("'"))) {
          cleanedResponse = cleanedResponse.slice(1, -1);
        }
        
        // Ensure hashtags are present at the end
        if (!cleanedResponse.includes('#')) {
          const hashtags = generateRelevantHashtags(topic, { type: 'industry consultant' });
          cleanedResponse += '\n\n' + hashtags;
        }
        
        return cleanedResponse;
      } catch (error) {
        console.error('Error generating template content:', error);
        // Fallback to simple template processing
        let content = templateInfo.preview;
        content = content.replace(/\[insert[^\]]*\]/g, topic);
        content = content.replace(/\[TOPIC\]/g, topic);
        content = content.replace(/\[AUDIENCE\]/g, audience);
        content = content.replace(/\[TONE\]/g, tone);
        const hashtags = generateRelevantHashtags(topic, { type: 'industry consultant' });
        return `${content}\n\n${hashtags}`;
      }
    }
    
    return await generateExpertContent(topic, audience, tone, true);
  };

  const clearTemplate = () => {
    setTemplateInfo(null);
  };

  const copyToClipboard = async (content) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopySuccess('Copied!');
      setTimeout(() => setCopySuccess(''), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      setCopySuccess('Failed to copy');
      setTimeout(() => setCopySuccess(''), 2000);
    }
  };

  const handleSchedule = (content) => {
    // For now, just show an alert. Later this could integrate with ContentScheduler
    alert('Schedule functionality coming soon! This would send the post to the scheduler.');
  };

  const mergeInputsToContent = async (content) => {
    try {
      const prompt = `Take this post template and create a complete, natural LinkedIn post using the following inputs:

Template: ${content}

Topic: ${topic}
Audience: ${audience}
Tone: ${tone}

Transform this template into a full, engaging post. Replace placeholders with actual stories, insights, and examples related to the topic. Make it sound natural and authentic - not like fill-in-the-blank. For lists/tips use bullet points (•) or numbers. End with 3-5 hashtags.`;

      setIsGenerating(true);
      const response = await callOllama(prompt);
      
      // Clean the response
      let cleanedResponse = response.trim();
      if ((cleanedResponse.startsWith('"') && cleanedResponse.endsWith('"')) ||
          (cleanedResponse.startsWith("'") && cleanedResponse.endsWith("'"))) {
        cleanedResponse = cleanedResponse.slice(1, -1);
      }
      
      // Ensure hashtags are present
      if (!cleanedResponse.includes('#')) {
        const hashtags = generateRelevantHashtags(topic, { type: 'industry consultant' });
        cleanedResponse += '\n\n' + hashtags;
      }
      
      setGeneratedContent(cleanedResponse);
      showNotification('Template transformed into complete post! ✨');
    } catch (error) {
      console.error('Error merging content:', error);
      showNotification('Failed to transform template. Try again.');
    } finally {
      setIsGenerating(false);
    }
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
          <select 
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="w-full px-3 py-2 bg-dark-primary border border-dark-border rounded-lg text-dark-text focus:outline-none focus:border-aifluence-500"
          >
            <option value="Professional">Professional</option>
            <option value="Conversational">Conversational</option>
            <option value="Bold">Bold</option>
            <option value="Actionable">Actionable</option>
            <option value="Visionary">Visionary</option>
          </select>
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
          <span>{isGenerating ? 'Generating...' : 'Generate Expert Post'}</span>
        </button>
        <button 
          onClick={() => handleGenerate(true)}
          disabled={isGenerating}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 text-white rounded-lg transition-colors"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012 2v2M7 7h10"></path>
          </svg>
          <span>{isGenerating ? 'Generating...' : 'Generate 5 Expert Posts'}</span>
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

      {/* Copy Success Message */}
      {copySuccess && (
        <div className="mb-4 p-3 bg-green-600/20 border border-green-500/30 rounded-lg">
          <span className="text-green-400 text-sm font-medium">{copySuccess}</span>
        </div>
      )}

      {/* Single Generated Content */}
      {generatedContent && (
        <div className="bg-dark-primary border border-dark-border rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-dark-text">Generated Expert Post</h3>
            <div className="flex space-x-2">
              <button 
                onClick={() => copyToClipboard(generatedContent)}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
              >
                Copy
              </button>
              <button 
                onClick={() => mergeInputsToContent(generatedContent)}
                className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm transition-colors"
              >
                Merge
              </button>
              <button 
                onClick={() => handleSchedule(generatedContent)}
                className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition-colors"
              >
                Schedule
              </button>
            </div>
          </div>
          <div className="text-dark-text whitespace-pre-wrap bg-dark-panel border border-dark-border rounded p-3">
            {generatedContent}
          </div>
        </div>
      )}

      {/* Multiple Generated Posts */}
      {generatedPosts.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-dark-text">Generated Expert Posts ({generatedPosts.length})</h3>
            <button 
              onClick={() => {setGeneratedPosts([]); setCopySuccess('');}}
              className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors"
            >
              Clear All
            </button>
          </div>
          {generatedPosts.map((post) => (
            <div key={post.id} className="bg-dark-primary border border-dark-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-dark-text">Post {post.id}</span>
                  <span className="text-xs px-2 py-1 bg-aifluence-600/20 text-aifluence-400 rounded-full">
                    {post.approach}
                  </span>
                  <span className="text-xs text-dark-text-muted">Generated: {post.timestamp}</span>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => copyToClipboard(post.content)}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
                  >
                    Copy
                  </button>
                  <button 
                    onClick={async () => {
                      try {
                        setIsGenerating(true);
                        const prompt = `Take this post template and create a complete, natural LinkedIn post:

Template: ${post.content}

Topic: ${topic}
Audience: ${audience}
Tone: ${tone}

Transform this into a full, engaging post. Replace placeholders with actual stories and insights. Make it natural and authentic. For lists use bullet points (•) or numbers. End with 3-5 hashtags.`;

                        const response = await callOllama(prompt);
                        let cleanedResponse = response.trim();
                        if ((cleanedResponse.startsWith('"') && cleanedResponse.endsWith('"')) ||
                            (cleanedResponse.startsWith("'") && cleanedResponse.endsWith("'"))) {
                          cleanedResponse = cleanedResponse.slice(1, -1);
                        }
                        if (!cleanedResponse.includes('#')) {
                          const hashtags = generateRelevantHashtags(topic, { type: 'industry consultant' });
                          cleanedResponse += '\n\n' + hashtags;
                        }
                        
                        setGeneratedPosts(prev => prev.map(p => 
                          p.id === post.id ? {...p, content: cleanedResponse} : p
                        ));
                        showNotification('Post transformed into complete content! ✨');
                      } catch (error) {
                        console.error('Error transforming post:', error);
                        showNotification('Failed to transform post. Try again.');
                      } finally {
                        setIsGenerating(false);
                      }
                    }}
                    className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm transition-colors"
                    disabled={isGenerating}
                  >
                    {isGenerating ? 'Merging...' : 'Merge'}
                  </button>
                  <button 
                    onClick={() => handleSchedule(post.content)}
                    className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition-colors"
                  >
                    Schedule
                  </button>
                </div>
              </div>
              <div className="text-dark-text whitespace-pre-wrap bg-dark-panel border border-dark-border rounded p-3">
                {post.content}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}