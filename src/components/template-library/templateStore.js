/**
 * LinkedIn Template Store
 * Shared module for template data and operations
 */

// Template categories with metadata
const TEMPLATE_CATEGORIES = {
  "Personal Story": {
    name: "Personal Story",
    description: "Share personal experiences and transformations",
    tags: ["inspirational", "authentic", "engagement"],
    icon: "👤",
    color: "#3B82F6"
  },
  "Lessons Learned": {
    name: "Lessons Learned", 
    description: "Share professional insights and key learnings",
    tags: ["educational", "wisdom", "professional"],
    icon: "💡",
    color: "#10B981"
  },
  "Industry Insights": {
    name: "Industry Insights",
    description: "Share industry trends and expert analysis", 
    tags: ["technical", "analytical", "thought-leadership"],
    icon: "📊",
    color: "#8B5CF6"
  },
  "Career Advice": {
    name: "Career Advice",
    description: "Provide guidance for professional development",
    tags: ["educational", "mentoring", "growth"],
    icon: "🚀",
    color: "#F59E0B"
  },
  "Leadership": {
    name: "Leadership",
    description: "Leadership principles and management insights",
    tags: ["professional", "management", "inspiration"],
    icon: "👑",
    color: "#EF4444"
  },
  "Success Stories": {
    name: "Success Stories",
    description: "Share achievements and case studies",
    tags: ["inspirational", "proof", "achievement"],
    icon: "🏆",
    color: "#06B6D4"
  },
  "Motivation": {
    name: "Motivation",
    description: "Inspire and motivate your audience",
    tags: ["inspirational", "engagement", "energy"],
    icon: "⚡",
    color: "#EC4899"
  },
  "Business Strategy": {
    name: "Business Strategy",
    description: "Strategic insights and business analysis",
    tags: ["technical", "analytical", "strategic"],
    icon: "🎯",
    color: "#6366F1"
  },
  "Technology Trends": {
    name: "Technology Trends",
    description: "Tech insights and digital transformation",
    tags: ["technical", "innovation", "future"],
    icon: "🔬",
    color: "#059669"
  },
  "Team Building": {
    name: "Team Building",
    description: "Team dynamics and collaboration insights",
    tags: ["professional", "collaboration", "culture"],
    icon: "🤝",
    color: "#DC2626"
  },
  "Work-Life Balance": {
    name: "Work-Life Balance",
    description: "Balance, productivity, and wellness",
    tags: ["wellness", "lifestyle", "personal"],
    icon: "⚖️",
    color: "#7C3AED"
  },
  "Innovation": {
    name: "Innovation",
    description: "Creative thinking and breakthrough ideas",
    tags: ["creative", "innovation", "future"],
    icon: "💫",
    color: "#0891B2"
  },
  "Networking": {
    name: "Networking",
    description: "Professional relationships and connections",
    tags: ["professional", "relationships", "growth"],
    icon: "🌐",
    color: "#BE185D"
  },
  "Problem Solving": {
    name: "Problem Solving",
    description: "Solutions and methodical approaches",
    tags: ["analytical", "solutions", "process"],
    icon: "🔧",
    color: "#059669"
  },
  "Communication": {
    name: "Communication",
    description: "Effective communication strategies",
    tags: ["professional", "skills", "clarity"],
    icon: "💬",
    color: "#7C2D12"
  },
  "Sales & Marketing": {
    name: "Sales & Marketing",
    description: "Sales strategies and marketing insights",
    tags: ["business", "growth", "strategy"],
    icon: "📈",
    color: "#9333EA"
  },
  "Finance & Business": {
    name: "Finance & Business",
    description: "Financial insights and business metrics",
    tags: ["analytical", "business", "data"],
    icon: "💰",
    color: "#0D9488"
  },
  "Customer Experience": {
    name: "Customer Experience",
    description: "Customer service and satisfaction insights",
    tags: ["service", "customer", "quality"],
    icon: "😊",
    color: "#DB2777"
  },
  "Digital Marketing": {
    name: "Digital Marketing",
    description: "Digital strategies and online marketing",
    tags: ["technical", "marketing", "digital"],
    icon: "📱",
    color: "#2563EB"
  },
  "Data & Analytics": {
    name: "Data & Analytics",
    description: "Data insights and analytical thinking",
    tags: ["technical", "analytical", "data"],
    icon: "📊",
    color: "#7C3AED"
  },
  "Entrepreneurship": {
    name: "Entrepreneurship",
    description: "Startup insights and business building",
    tags: ["business", "startup", "innovation"],
    icon: "🚀",
    color: "#EA580C"
  },
  "Mental Health & Wellness": {
    name: "Mental Health & Wellness",
    description: "Workplace wellness and mental health",
    tags: ["wellness", "health", "personal"],
    icon: "🧠",
    color: "#059669"
  },
  "Productivity": {
    name: "Productivity",
    description: "Efficiency tips and time management",
    tags: ["efficiency", "process", "optimization"],
    icon: "⏱️",
    color: "#DC2626"
  },
  "Remote Work": {
    name: "Remote Work",
    description: "Remote work insights and distributed teams",
    tags: ["remote", "flexibility", "modern"],
    icon: "🏠",
    color: "#0891B2"
  },
  "Industry News": {
    name: "Industry News",
    description: "Current events and industry updates",
    tags: ["news", "current", "relevant"],
    icon: "📰",
    color: "#6366F1"
  }
};

// Template structures with placeholders and metadata
const TEMPLATE_STRUCTURES = {
  "Personal Story": [
    {
      id: "ps_001",
      title: "Challenge to Success Journey",
      structure: "Three years ago, I [insert challenge]. Today, I [insert current state]. Here's what I learned: [insert lesson]. The key insight: [insert insight]. What challenges have shaped your career?",
      placeholders: ["challenge", "current state", "lesson", "insight"],
      engagement: "High",
      length: "Medium",
      hashtags: "#PersonalGrowth #CareerJourney #Lessons",
      preview: "Share your transformation story from struggle to success..."
    },
    {
      id: "ps_002", 
      title: "Belief Transformation",
      structure: "I used to believe [insert old belief]. Then [insert pivotal moment] happened. Now I understand that [insert new perspective]. This shift changed everything: [insert impact]. Sometimes our biggest assumptions need questioning.",
      placeholders: ["old belief", "pivotal moment", "new perspective", "impact"],
      engagement: "High",
      length: "Medium",
      hashtags: "#Mindset #Growth #Transformation",
      preview: "Tell the story of how your perspective fundamentally changed..."
    },
    {
      id: "ps_003",
      title: "Moment of Realization",
      structure: "The moment I realized [insert realization] was when [insert situation]. It felt [insert emotion], but it taught me [insert lesson]. Now I approach [insert area] completely differently: [insert new approach].",
      placeholders: ["realization", "situation", "emotion", "lesson", "area", "new approach"],
      engagement: "Medium",
      length: "Long",
      hashtags: "#PersonalDevelopment #Lessons #Growth",
      preview: "Share a pivotal moment that changed your approach..."
    },
    {
      id: "ps_004",
      title: "Failure to Learning",
      structure: "My biggest failure was [insert failure]. I felt [insert emotion] and wanted to [insert initial reaction]. Instead, I [insert what you did]. The result? [insert outcome]. Failure isn't the opposite of success—it's part of it.",
      placeholders: ["failure", "emotion", "initial reaction", "what you did", "outcome"],
      engagement: "High",
      length: "Medium",
      hashtags: "#Resilience #FailureToSuccess #Growth",
      preview: "Turn your biggest setback into a learning story..."
    },
    {
      id: "ps_005",
      title: "Overcoming Limitations",
      structure: "Growing up, I was told [insert limiting belief]. For years, I [insert how it affected you]. Then I met [insert person/situation] who showed me [insert new perspective]. Today, I [insert current state]. Your background doesn't define your future.",
      placeholders: ["limiting belief", "how it affected you", "person/situation", "new perspective", "current state"],
      engagement: "High",
      length: "Long",
      hashtags: "#Inspiration #OvercomingLimits #Success",
      preview: "Share how you overcame limiting beliefs about yourself..."
    },
    {
      id: "ps_006",
      title: "Risk Taking Story",
      structure: "Last [insert timeframe], I took a risk: [insert risk]. People said [insert criticism]. My family worried about [insert concern]. But I knew [insert conviction]. The outcome? [insert result]. Sometimes you have to bet on yourself.",
      placeholders: ["timeframe", "risk", "criticism", "concern", "conviction", "result"],
      engagement: "Medium",
      length: "Long",
      hashtags: "#TakingRisks #Entrepreneurship #Courage",
      preview: "Tell about a time you took a leap of faith..."
    },
    {
      id: "ps_007",
      title: "Difficult Conversation Impact",
      structure: "The hardest conversation I ever had was [insert situation]. I had to [insert what you had to do]. It was difficult because [insert why]. But it led to [insert positive outcome]. Difficult conversations create breakthrough moments.",
      placeholders: ["situation", "what you had to do", "why", "positive outcome"],
      engagement: "Medium",
      length: "Medium",
      hashtags: "#Courage #Communication #Leadership",
      preview: "Share how a tough conversation led to positive change..."
    },
    {
      id: "ps_008",
      title: "Memorable Learning Moment",
      structure: "I'll never forget [insert memorable moment]. It was [insert context]. In that moment, I learned [insert lesson]. This experience shaped how I [insert impact on behavior]. Some lessons can only be learned through experience.",
      placeholders: ["memorable moment", "context", "lesson", "impact on behavior"],
      engagement: "Medium",
      length: "Medium",
      hashtags: "#LifeLessons #Wisdom #Experience",
      preview: "Share an unforgettable moment that taught you something..."
    },
    {
      id: "ps_009",
      title: "Unique Journey Celebration",
      structure: "When I started [insert beginning], I had [insert initial state]. Everyone around me [insert others' situation]. But I believed [insert belief]. After [insert timeframe], I [insert achievement]. Your journey is unique—embrace it.",
      placeholders: ["beginning", "initial state", "others' situation", "belief", "timeframe", "achievement"],
      engagement: "Medium",
      length: "Long",
      hashtags: "#Authenticity #Journey #Success",
      preview: "Celebrate what makes your path different from others..."
    },
    {
      id: "ps_010",
      title: "Mentorship and Wisdom",
      structure: "The person who changed my perspective was [insert person]. They told me [insert advice/insight]. At first, I [insert initial reaction]. But over time, I realized [insert realization]. This wisdom now guides [insert how it guides you].",
      placeholders: ["person", "advice/insight", "initial reaction", "realization", "how it guides you"],
      engagement: "High",
      length: "Medium",
      hashtags: "#Mentorship #WisdomShared #Growth",
      preview: "Honor someone who shaped your thinking..."
    }
  ],
  
  "Lessons Learned": [
    {
      id: "ll_001",
      title: "Top Professional Lessons",
      structure: "After [insert timeframe] in [insert field/role], here are the 3 most important lessons I've learned: 1) [insert lesson 1] 2) [insert lesson 2] 3) [insert lesson 3]. Which of these resonates most with your experience?",
      placeholders: ["timeframe", "field/role", "lesson 1", "lesson 2", "lesson 3"],
      engagement: "High",
      length: "Medium",
      hashtags: "#Leadership #Experience #Lessons",
      preview: "Share your top 3 professional lessons learned..."
    },
    {
      id: "ll_002",
      title: "Most Valuable Mistake",
      structure: "The mistake that taught me the most was [insert mistake]. I thought [insert wrong assumption]. The reality was [insert what actually happened]. Now I always [insert new approach]. What's the most valuable mistake you've made?",
      placeholders: ["mistake", "wrong assumption", "what actually happened", "new approach"],
      engagement: "High",
      length: "Medium",
      hashtags: "#LearningFromFailure #Growth #Mistakes",
      preview: "Turn your biggest mistake into a teaching moment..."
    },
    {
      id: "ll_003",
      title: "Advice to Younger Self",
      structure: "If I could go back and tell my younger self one thing, it would be: [insert advice]. Back then, I was [insert past mindset]. I wish I had known [insert knowledge]. This would have saved me [insert what it would have saved]. What advice would you give your past self?",
      placeholders: ["advice", "past mindset", "knowledge", "what it would have saved"],
      engagement: "High",
      length: "Long",
      hashtags: "#Reflection #Advice #Wisdom",
      preview: "Share wisdom you wish you'd known earlier..."
    },
    {
      id: "ll_004",
      title: "Best Career Advice Received",
      structure: "The best career advice I ever received was '[insert advice]' from [insert source]. Initially, I [insert initial reaction]. But when I applied it to [insert situation], the result was [insert outcome]. Simple advice often has the deepest impact.",
      placeholders: ["advice", "source", "initial reaction", "situation", "outcome"],
      engagement: "High",
      length: "Medium",
      hashtags: "#CareerAdvice #Mentorship #Success",
      preview: "Share the most impactful advice you've received..."
    },
    {
      id: "ll_005",
      title: "People Management Insights",
      structure: "Working with [insert type of people/situation] taught me that [insert lesson]. Before this, I believed [insert old belief]. Now I understand [insert new understanding]. This shift improved [insert area of improvement]. Perspective changes everything.",
      placeholders: ["type of people/situation", "lesson", "old belief", "new understanding", "area of improvement"],
      engagement: "Medium",
      length: "Long",
      hashtags: "#Teamwork #Understanding #Management",
      preview: "Share what working with others taught you..."
    },
    {
      id: "ll_006",
      title: "Project Learning Experience",
      structure: "The project that taught me the most was [insert project]. We faced [insert challenge]. I learned [insert lesson 1], [insert lesson 2], and [insert lesson 3]. The biggest surprise was [insert surprise]. Complex projects teach simple truths.",
      placeholders: ["project", "challenge", "lesson 1", "lesson 2", "lesson 3", "surprise"],
      engagement: "Medium",
      length: "Long",
      hashtags: "#ProjectManagement #Learning #Experience",
      preview: "Extract lessons from a challenging project..."
    },
    {
      id: "ll_007",
      title: "Professional Regret Lesson",
      structure: "My biggest professional regret is [insert regret]. I should have [insert what you should have done]. Instead, I [insert what you actually did]. This taught me [insert lesson]. Now I prioritize [insert priority]. Regrets are lessons in disguise.",
      placeholders: ["regret", "what you should have done", "what you actually did", "lesson", "priority"],
      engagement: "Medium",
      length: "Long",
      hashtags: "#Reflection #ProfessionalGrowth #Lessons",
      preview: "Turn professional regret into wisdom for others..."
    },
    {
      id: "ll_008",
      title: "Skill Development Insight",
      structure: "The skill I wish I had developed earlier is [insert skill]. I underestimated its importance because [insert reason]. When I finally focused on it, [insert result]. It impacted [insert areas of impact]. Invest in skills before you need them.",
      placeholders: ["skill", "reason", "result", "areas of impact"],
      engagement: "Medium",
      length: "Medium",
      hashtags: "#SkillDevelopment #Growth #Career",
      preview: "Highlight a skill you wish you'd developed sooner..."
    },
    {
      id: "ll_009",
      title: "Failure Teaching Success",
      structure: "Failure taught me [insert lesson] in a way success never could. After [insert failure], I realized [insert realization]. This changed how I approach [insert area]. Now I see challenges as [insert new perspective]. Failure is the best teacher.",
      placeholders: ["lesson", "failure", "realization", "area", "new perspective"],
      engagement: "High",
      length: "Medium",
      hashtags: "#Resilience #FailureToSuccess #Learning",
      preview: "Show how failure became your greatest teacher..."
    },
    {
      id: "ll_010",
      title: "Counterintuitive Insight",
      structure: "The most counterintuitive thing I've learned is [insert counterintuitive insight]. Most people think [insert common belief]. But in reality, [insert truth]. This applies to [insert application]. Sometimes the opposite approach works best.",
      placeholders: ["counterintuitive insight", "common belief", "truth", "application"],
      engagement: "High",
      length: "Medium",
      hashtags: "#CounterIntuitive #Strategy #Wisdom",
      preview: "Share surprising wisdom that goes against conventional thinking..."
    }
  ],

  // Add more categories - abbreviated for space, but following same pattern
  "Industry Insights": [
    {
      id: "ii_001",
      title: "Market Shift Analysis",
      structure: "The [insert industry] landscape is shifting. Here's what most people are missing: [insert insight]. While everyone focuses on [insert common focus], the real opportunity is in [insert real opportunity]. Companies that adapt will [insert prediction].",
      placeholders: ["industry", "insight", "common focus", "real opportunity", "prediction"],
      engagement: "Medium",
      length: "Medium",
      hashtags: "#Industry #Innovation #Trends",
      preview: "Share what others are missing in your industry..."
    },
    // ... (9 more industry insight templates)
  ],

  "Career Advice": [
    {
      id: "ca_001",
      title: "Hidden Career Advice",
      structure: "The career advice no one gives you: [insert advice]. Most people focus on [insert common focus]. But the real career accelerator is [insert real accelerator]. I learned this when [insert learning moment]. Apply this to [insert application].",
      placeholders: ["advice", "common focus", "real accelerator", "learning moment", "application"],
      engagement: "High",
      length: "Medium",
      hashtags: "#CareerGrowth #ProfessionalDevelopment #Advice",
      preview: "Share career advice that's not commonly given..."
    },
    // ... (9 more career advice templates)
  ],

  "Leadership": [
    {
      id: "ld_001",
      title: "Leadership Philosophy",
      structure: "My leadership philosophy is simple: [insert philosophy]. I learned this when [insert learning moment]. It changed how I [insert change in approach]. The result? [insert result]. Leadership isn't about being in charge—it's about taking care of those in your charge.",
      placeholders: ["philosophy", "learning moment", "change in approach", "result"],
      engagement: "High",
      length: "Medium",
      hashtags: "#Leadership #Management #TeamBuilding",
      preview: "Share your core leadership philosophy and insights..."
    },
    {
      id: "ld_002",
      title: "Difficult Leadership Decision",
      structure: "The hardest decision I had to make as a leader was [insert decision]. The stakes were [insert stakes]. I considered [insert options]. Ultimately, I chose to [insert choice] because [insert reasoning]. Leadership means making tough calls when no one else will.",
      placeholders: ["decision", "stakes", "options", "choice", "reasoning"],
      engagement: "High",
      length: "Long",
      hashtags: "#Leadership #DecisionMaking #Responsibility",
      preview: "Share a tough leadership decision and the lessons learned..."
    },
    {
      id: "ld_003",
      title: "Team Transformation",
      structure: "When I inherited [insert team situation], the team was [insert initial state]. I implemented [insert changes]. The biggest challenge was [insert challenge]. Today, the team [insert current state]. Great leaders create more leaders, not followers.",
      placeholders: ["team situation", "initial state", "changes", "challenge", "current state"],
      engagement: "Medium",
      length: "Long",
      hashtags: "#Leadership #TeamDevelopment #Transformation",
      preview: "Tell the story of how you transformed a team..."
    }
  ],

  "Success Stories": [
    {
      id: "ss_001",
      title: "Against All Odds",
      structure: "Everyone said [insert what people said]. The odds were [insert odds]. But I believed [insert belief]. I started with [insert starting point]. After [insert timeframe], we achieved [insert achievement]. Sometimes the best opportunities come disguised as impossible challenges.",
      placeholders: ["what people said", "odds", "belief", "starting point", "timeframe", "achievement"],
      engagement: "High",
      length: "Long",
      hashtags: "#Success #Perseverance #Achievement",
      preview: "Share your against-all-odds success story..."
    },
    {
      id: "ss_002",
      title: "Breakthrough Moment",
      structure: "For months, we struggled with [insert problem]. We tried [insert attempts]. Then came the breakthrough: [insert breakthrough]. The key insight was [insert insight]. This led to [insert result]. Sometimes the biggest breakthroughs come after the longest struggles.",
      placeholders: ["problem", "attempts", "breakthrough", "insight", "result"],
      engagement: "High",
      length: "Medium",
      hashtags: "#Success #Breakthrough #Innovation",
      preview: "Share a moment when everything clicked and success followed..."
    },
    {
      id: "ss_003",
      title: "Team Success Achievement",
      structure: "Our team accomplished something incredible: [insert achievement]. It started when [insert beginning]. The turning point was [insert turning point]. What made it special was [insert special factor]. Success is sweeter when shared with an amazing team.",
      placeholders: ["achievement", "beginning", "turning point", "special factor"],
      engagement: "Medium",
      length: "Medium",
      hashtags: "#TeamSuccess #Achievement #Collaboration",
      preview: "Celebrate a major team accomplishment..."
    }
  ],

  "Motivation": [
    {
      id: "mt_001",
      title: "Monday Motivation",
      structure: "Here's what keeps me motivated every Monday: [insert motivation]. When I feel overwhelmed, I remember [insert reminder]. This week, I'm focusing on [insert focus]. What's driving you this week? Let's make it count.",
      placeholders: ["motivation", "reminder", "focus"],
      engagement: "High",
      length: "Short",
      hashtags: "#MondayMotivation #Focus #Goals",
      preview: "Start the week with motivational energy..."
    },
    {
      id: "mt_002",
      title: "Overcoming Obstacles",
      structure: "When faced with [insert obstacle], remember this: [insert motivation]. I've learned that [insert lesson]. The key is to [insert key action]. You're stronger than you think, and closer to success than you realize.",
      placeholders: ["obstacle", "motivation", "lesson", "key action"],
      engagement: "High",
      length: "Medium",
      hashtags: "#Motivation #Resilience #Strength",
      preview: "Motivate others to overcome their challenges..."
    },
    {
      id: "mt_003",
      title: "Dream Achievement Inspiration",
      structure: "Your dreams are not too big—[insert encouragement]. I once thought [insert limiting thought], but I discovered [insert discovery]. The path forward is [insert path]. Start today, start small, but start.",
      placeholders: ["encouragement", "limiting thought", "discovery", "path"],
      engagement: "High",
      length: "Medium",
      hashtags: "#Dreams #Inspiration #Action",
      preview: "Inspire others to pursue their biggest dreams..."
    }
  ],

  "Business Strategy": [
    {
      id: "bs_001",
      title: "Strategic Pivot Success",
      structure: "When [insert market change] happened, we had to pivot. Our original strategy was [insert original strategy]. The new approach: [insert new approach]. The result? [insert result]. In business, adaptability beats perfection every time.",
      placeholders: ["market change", "original strategy", "new approach", "result"],
      engagement: "Medium",
      length: "Long",
      hashtags: "#Strategy #BusinessPivot #Adaptability",
      preview: "Share how strategic thinking led to business success..."
    },
    {
      id: "bs_002",
      title: "Competitive Advantage Discovery",
      structure: "We discovered our competitive advantage by [insert discovery method]. While competitors focused on [insert competitor focus], we doubled down on [insert our focus]. This differentiation led to [insert outcome]. Find your unique value and own it.",
      placeholders: ["discovery method", "competitor focus", "our focus", "outcome"],
      engagement: "Medium",
      length: "Medium",
      hashtags: "#Strategy #CompetitiveAdvantage #Differentiation",
      preview: "Explain how you found and leveraged your competitive edge..."
    },
    {
      id: "bs_003",
      title: "Market Opportunity Analysis",
      structure: "I spotted an opportunity when I noticed [insert observation]. The market was missing [insert gap]. Our solution: [insert solution]. The key insight: [insert insight]. Sometimes the biggest opportunities hide in plain sight.",
      placeholders: ["observation", "gap", "solution", "insight"],
      engagement: "Medium",
      length: "Medium",
      hashtags: "#Strategy #MarketOpportunity #Innovation",
      preview: "Share how you identified and seized a market opportunity..."
    }
  ],

  "Productivity": [
    {
      id: "pr_001",
      title: "Time Management System",
      structure: "My productivity system: [insert system]. I start each day by [insert daily routine]. The game-changer was [insert game changer]. This approach helps me [insert benefit]. Time is our most valuable asset—invest it wisely.",
      placeholders: ["system", "daily routine", "game changer", "benefit"],
      engagement: "High",
      length: "Medium",
      hashtags: "#Productivity #TimeManagement #Efficiency",
      preview: "Share your productivity system and time management tips..."
    },
    {
      id: "pr_002",
      title: "Focus and Deep Work",
      structure: "To achieve deep focus, I [insert focus method]. My biggest distraction used to be [insert distraction]. Now I [insert solution]. The result: [insert result]. Deep work creates disproportionate value.",
      placeholders: ["focus method", "distraction", "solution", "result"],
      engagement: "Medium",
      length: "Medium",
      hashtags: "#Productivity #Focus #DeepWork",
      preview: "Share strategies for maintaining focus and doing deep work..."
    },
    {
      id: "pr_003",
      title: "Productivity Mistake Lessons",
      structure: "My biggest productivity mistake: [insert mistake]. I thought [insert wrong assumption]. This led to [insert consequence]. What I learned: [insert lesson]. Now I [insert current approach]. Learn from my mistakes.",
      placeholders: ["mistake", "wrong assumption", "consequence", "lesson", "current approach"],
      engagement: "High",
      length: "Medium",
      hashtags: "#Productivity #Lessons #Efficiency",
      preview: "Share productivity mistakes and the lessons learned..."
    }
  ]

  // Continue for all 25 categories...
};

/**
 * Template Store API
 */
class TemplateStore {
  /**
   * Get all available categories
   */
  static getCategories() {
    return Object.keys(TEMPLATE_CATEGORIES).map(key => ({
      id: key,
      ...TEMPLATE_CATEGORIES[key]
    }));
  }

  /**
   * Get category by ID
   */
  static getCategory(categoryId) {
    return TEMPLATE_CATEGORIES[categoryId] || null;
  }

  /**
   * Get templates by category
   */
  static getTemplatesByCategory(categoryId) {
    const templates = TEMPLATE_STRUCTURES[categoryId] || [];
    return templates.map(template => ({
      ...template,
      category: categoryId,
      categoryInfo: TEMPLATE_CATEGORIES[categoryId]
    }));
  }

  /**
   * Get specific template
   */
  static getTemplate(categoryId, templateIndex) {
    const templates = TEMPLATE_STRUCTURES[categoryId] || [];
    if (templateIndex >= 0 && templateIndex < templates.length) {
      return {
        ...templates[templateIndex],
        category: categoryId,
        categoryInfo: TEMPLATE_CATEGORIES[categoryId],
        index: templateIndex
      };
    }
    return null;
  }

  /**
   * Search templates by keyword
   */
  static searchTemplates(keyword, filterTags = []) {
    const results = [];
    const searchTerm = keyword.toLowerCase();

    Object.keys(TEMPLATE_STRUCTURES).forEach(categoryId => {
      const category = TEMPLATE_CATEGORIES[categoryId];
      const templates = TEMPLATE_STRUCTURES[categoryId];

      // Filter by tags if provided
      if (filterTags.length > 0) {
        const hasMatchingTag = filterTags.some(tag => 
          category.tags.includes(tag.toLowerCase())
        );
        if (!hasMatchingTag) return;
      }

      templates.forEach((template, index) => {
        const searchableText = `${template.title} ${template.preview} ${template.structure}`.toLowerCase();
        if (searchableText.includes(searchTerm)) {
          results.push({
            ...template,
            category: categoryId,
            categoryInfo: category,
            index: index,
            relevanceScore: this.calculateRelevance(searchableText, searchTerm)
          });
        }
      });
    });

    // Sort by relevance
    return results.sort((a, b) => b.relevanceScore - a.relevanceScore);
  }

  /**
   * Get templates by tags
   */
  static getTemplatesByTags(tags) {
    const results = [];
    const targetTags = tags.map(tag => tag.toLowerCase());

    Object.keys(TEMPLATE_STRUCTURES).forEach(categoryId => {
      const category = TEMPLATE_CATEGORIES[categoryId];
      const templates = TEMPLATE_STRUCTURES[categoryId];

      const hasMatchingTag = targetTags.some(tag => 
        category.tags.includes(tag)
      );

      if (hasMatchingTag) {
        templates.forEach((template, index) => {
          results.push({
            ...template,
            category: categoryId,
            categoryInfo: category,
            index: index
          });
        });
      }
    });

    return results;
  }

  /**
   * Get random template
   */
  static getRandomTemplate(categoryId = null) {
    if (categoryId) {
      const templates = TEMPLATE_STRUCTURES[categoryId] || [];
      if (templates.length === 0) return null;
      
      const randomIndex = Math.floor(Math.random() * templates.length);
      return this.getTemplate(categoryId, randomIndex);
    }

    // Random from all categories
    const categories = Object.keys(TEMPLATE_STRUCTURES);
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const templates = TEMPLATE_STRUCTURES[randomCategory];
    const randomIndex = Math.floor(Math.random() * templates.length);
    
    return this.getTemplate(randomCategory, randomIndex);
  }

  /**
   * Get all available tags
   */
  static getAllTags() {
    const allTags = new Set();
    Object.values(TEMPLATE_CATEGORIES).forEach(category => {
      category.tags.forEach(tag => allTags.add(tag));
    });
    return Array.from(allTags).sort();
  }

  /**
   * Calculate search relevance score
   */
  static calculateRelevance(text, searchTerm) {
    const titleMatch = text.includes(searchTerm) ? 10 : 0;
    const wordMatches = searchTerm.split(' ').reduce((score, word) => {
      return score + (text.includes(word) ? 2 : 0);
    }, 0);
    return titleMatch + wordMatches;
  }

  /**
   * Get template statistics
   */
  static getStatistics() {
    const totalCategories = Object.keys(TEMPLATE_CATEGORIES).length;
    const totalTemplates = Object.values(TEMPLATE_STRUCTURES).reduce(
      (sum, templates) => sum + templates.length, 0
    );
    const allTags = this.getAllTags();

    return {
      totalCategories,
      totalTemplates,
      totalTags: allTags.length,
      averageTemplatesPerCategory: Math.round(totalTemplates / totalCategories),
      allTags
    };
  }
}

// Export for different module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    TemplateStore,
    TEMPLATE_CATEGORIES,
    TEMPLATE_STRUCTURES
  };
} else if (typeof window !== 'undefined') {
  window.TemplateStore = TemplateStore;
}

export default TemplateStore;