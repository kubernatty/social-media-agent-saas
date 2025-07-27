export class ContentGenerator {
    constructor() {
        this.currentPost = null;
        this.generatedPosts = [];
        this.templates = this.initializeFlexibleStructures();
    }

    async init() {
        this.linkedinCollector = new LinkedInDataCollector();
        this.ragSystem = new RAGContentSystem();
        this.intelligentAgent = new ContentIntelligenceAgent();
        this.trendAnalyzer = new TrendAnalyzer();
        
        console.log('🚀 Initializing LinkedIn RAG Content Generator...');
        
        this.setupLinkedInIntegration();
        await this.loadCachedData();
        
        console.log('✅ LinkedIn RAG Content Generator initialized');
    }

    setupLinkedInIntegration() {
        const connectBtn = document.getElementById('connect-linkedin-btn');
        if (connectBtn) {
            connectBtn.addEventListener('click', () => this.connectToLinkedIn());
        }
        
        setInterval(() => {
            if (this.linkedinCollector.isConnected()) {
                this.refreshLinkedInData();
            }
        }, 30 * 60 * 1000);
    }

    async connectToLinkedIn() {
        console.log('🔗 Connecting to LinkedIn...');
        
        try {
            const success = await this.linkedinCollector.connect();
            
            if (success) {
                this.updateLinkedInStatus('connected');
                window.showToast('LinkedIn connected successfully!', 'success');
                await this.refreshLinkedInData();
            } else {
                throw new Error('LinkedIn connection failed');
            }
            
        } catch (error) {
            console.error('❌ LinkedIn connection error:', error);
            window.showToast('Failed to connect to LinkedIn. Please try again.', 'error');
        }
    }

    updateLinkedInStatus(status) {
        const statusIndicator = document.getElementById('linkedin-status');
        const insightsPanel = document.getElementById('linkedin-insights');
        const connectBtn = document.getElementById('connect-linkedin-btn');
        
        if (status === 'connected') {
            statusIndicator.innerHTML = `
                <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                <span class="text-xs text-slate-400">Connected</span>
            `;
            connectBtn.textContent = 'Refresh Data';
            connectBtn.onclick = () => this.refreshLinkedInData();
            insightsPanel.classList.remove('hidden');
        } else {
            statusIndicator.innerHTML = `
                <div class="w-2 h-2 bg-red-500 rounded-full"></div>
                <span class="text-xs text-slate-400">Disconnected</span>
            `;
            connectBtn.textContent = 'Connect LinkedIn';
            connectBtn.onclick = () => this.connectToLinkedIn();
            insightsPanel.classList.add('hidden');
        }
    }

    async refreshLinkedInData() {
        console.log('🔄 Refreshing LinkedIn data...');
        
        try {
            window.showToast('Refreshing LinkedIn data...', 'info', 2000);
            
            const recentPosts = await this.linkedinCollector.collectRecentPosts();
            const analysis = await this.ragSystem.analyzeContent(recentPosts);
            const trendingTopics = await this.trendAnalyzer.extractTrends(recentPosts);
            
            await this.intelligentAgent.updateMemory(analysis, trendingTopics);
            
            this.updateInsightsDisplay(recentPosts.length, trendingTopics.length);
            this.displayTrendingTopics(trendingTopics);
            
            window.showToast(`Updated with ${recentPosts.length} posts and ${trendingTopics.length} trending topics!`, 'success');
            
        } catch (error) {
            console.error('❌ Error refreshing LinkedIn data:', error);
            window.showToast('Failed to refresh LinkedIn data', 'error');
        }
    }

    updateInsightsDisplay(postsCount, topicsCount) {
        document.getElementById('posts-analyzed').textContent = postsCount;
        document.getElementById('trending-topics').textContent = topicsCount;
        document.getElementById('last-refresh').textContent = new Date().toLocaleTimeString();
    }

    displayTrendingTopics(topics) {
        const container = document.getElementById('trending-topics-list');
        const display = document.getElementById('trending-topics-display');
        
        if (topics.length > 0) {
            display.classList.remove('hidden');
            container.innerHTML = topics.slice(0, 10).map(topic => `
                <span class="px-3 py-1 bg-aifluence-600/20 text-aifluence-300 rounded-full text-xs cursor-pointer hover:bg-aifluence-600/30 transition-colors" 
                      onclick="contentGenerator.selectTrendingTopic('${topic.name}')">
                    ${topic.name} (${topic.mentions})
                </span>
            `).join('');
        } else {
            display.classList.add('hidden');
        }
    }

    selectTrendingTopic(topicName) {
        document.getElementById('content-theme').value = 'custom';
        document.getElementById('content-focus').value = topicName;
        window.showToast(`Selected trending topic: ${topicName}`, 'success');
    }

    async loadCachedData() {
        try {
            const cachedData = localStorage.getItem('linkedin_rag_data');
            if (cachedData) {
                const data = JSON.parse(cachedData);
                await this.ragSystem.loadCache(data.ragData);
                await this.intelligentAgent.loadMemory(data.agentMemory);
                
                if (data.trendingTopics) {
                    this.displayTrendingTopics(data.trendingTopics);
                    this.updateInsightsDisplay(data.postsAnalyzed || 0, data.trendingTopics.length);
                }
                
                console.log('✅ Cached LinkedIn data loaded');
            }
        } catch (error) {
            console.error('⚠️ Error loading cached data:', error);
        }
    }

    initializeFlexibleStructures() {
        return {
            personalStory: [{
                opening: [
                    "I just had a conversation that completely shifted my perspective on {topic}.",
                    "Last week, something happened that changed how I think about {topic}.",
                    "A client told me something yesterday that I can't stop thinking about.",
                    "I've been in {topic} for years, but this week taught me something new."
                ],
                story: [
                    'A {audience_member} told me: "We spent months planning the perfect {topic} strategy, but forgot to ask our team what they actually needed."',
                    "I watched a {audience_member} completely transform their approach to {topic} in just 30 minutes.",
                    'Someone said: "We don\'t need better {topic}, we need to understand why our current approach isn\'t working."',
                    "I saw a team go from struggling with {topic} to becoming industry leaders - and it had nothing to do with what I expected."
                ],
                insight: [
                    "The best {topic} approaches I've seen start with understanding people, not just implementing solutions.",
                    "Sometimes the biggest breakthroughs come from the simplest changes.",
                    "Success in {topic} isn't about having the perfect plan - it's about being willing to adapt.",
                    "The difference between success and failure often comes down to asking the right questions first."
                ],
                question: [
                    "What's driving your {topic} decisions - what's possible or what's needed?",
                    "What would you do differently if you started your {topic} journey today?",
                    "What's one assumption about {topic} that you're ready to challenge?",
                    "How are you balancing innovation with practical results in {topic}?"
                ]
            }],
            
            insights: [{
                opening: [
                    "The {audience} succeeding with {topic} aren't the ones with the biggest budgets.",
                    "I've analyzed hundreds of {topic} initiatives this year. The pattern is clear:",
                    "After working with {audience} across different industries, I've noticed something:",
                    "The biggest misconception about {topic}? That it's just about the tactics."
                ],
                framework: [
                    "They're asking better questions:\n• What problem are we actually solving?\n• How will we measure success?\n• What happens if this doesn't work?\n• Who needs to be involved?",
                    "Successful approaches share these traits:\n• Started small, scaled gradually\n• Focused on user adoption\n• Measured business impact\n• Adapted based on feedback",
                    "The pattern is consistent:\n• Clear objectives from day one\n• Regular check-ins and adjustments\n• Strong stakeholder buy-in\n• Focus on sustainable practices",
                    "Three things separate the winners:\n• They define success upfront\n• They measure what matters\n• They're willing to pivot when needed"
                ],
                insight: [
                    "Strategy beats tactics every time.",
                    "Small wins compound into big results.",
                    "Execution is more important than perfection.",
                    "People make the difference, not just process."
                ],
                question: [
                    "What questions are you asking about your {topic} initiatives?",
                    "How are you measuring success in {topic}?",
                    "What small experiment could you start next week?",
                    "Where are you focusing your {topic} efforts?"
                ]
            }],
            
            controversial: [{
                statement: [
                    "Unpopular opinion: Most {audience} aren't ready for {topic}.",
                    "Hot take: Your {topic} strategy is probably backwards.",
                    "Controversial thought: {topic} isn't your real problem.",
                    "Hard truth: Most {topic} initiatives fail for predictable reasons."
                ],
                reasoning: [
                    "Not because they lack resources or knowledge, but because they skip the fundamentals.",
                    "Instead of asking 'What can {topic} do for us?' they should ask 'What do our customers actually need?'",
                    "They're treating {topic} as a solution when they haven't clearly defined the problem.",
                    "They focus on implementation before understanding the why behind their approach."
                ],
                reality: [
                    "{topic} amplifies what you already do. If your foundation is weak, {topic} will just help you fail faster.",
                    "I've seen too many impressive {topic} demos that solve problems nobody has.",
                    "Success requires discipline in the boring work: clear processes, defined outcomes, proper planning.",
                    "The best results come from simple, well-executed approaches - not complex, cutting-edge ones."
                ],
                challenge: [
                    "Am I wrong?",
                    "What problem are you trying to solve, really?",
                    "Are you ready to do the unglamorous work first?",
                    "What would you do differently if you started over?"
                ]
            }],
            
            practical: [{
                framework: [
                    "Three questions I ask every team before they start with {topic}:",
                    "The {topic} framework that actually works:",
                    "Every successful {topic} initiative I've seen follows this pattern:",
                    "Here's the {topic} approach that consistently delivers results:"
                ],
                points: [
                    "1. If this works perfectly, what changes?\n2. If this fails completely, what do we lose?\n3. How will we know we're succeeding?",
                    "→ Start with a clear objective\n→ Identify the biggest constraint\n→ Test with a small group first\n→ Measure and adjust\n→ Scale gradually",
                    "• Define success metrics upfront\n• Get stakeholder buy-in early\n• Plan for common obstacles\n• Build feedback loops\n• Focus on adoption, not just implementation",
                    "Step 1: Understand the current state\nStep 2: Define the desired outcome\nStep 3: Identify the biggest gap\nStep 4: Test the smallest possible change\nStep 5: Scale what works"
                ],
                reality: [
                    "Most teams can't answer #1 clearly. Even fewer can answer #3 specifically.",
                    "The difference between success and failure is often in the execution details.",
                    "Simple approaches consistently outperform complex ones - but simple doesn't mean easy.",
                    "The hardest part isn't the {topic} itself - it's getting everyone aligned on the approach."
                ],
                action: [
                    "What does success actually look like for your {topic} initiative?",
                    "Which step are you skipping in your current approach?",
                    "What's the smallest change you could test this week?",
                    "How are you measuring progress, not just activity?"
                ]
            }],
            
            future: [{
                prediction: [
                    "The {audience} that will dominate the next decade aren't the ones with the most advanced {topic}.",
                    "I predict the future of {topic} isn't what most people think.",
                    "In 5 years, the most successful {audience} will be the ones who mastered this aspect of {topic}:",
                    "The {topic} revolution isn't happening where everyone's looking."
                ],
                insight: [
                    "They're the ones making {topic} feel natural and intuitive.",
                    "It's not about having the latest tactics - it's about understanding timeless principles.",
                    "Human connection and authentic value creation.",
                    "It's in the quiet, consistent work that compounds over time."
                ],
                principles: [
                    "• Value serves people, not the other way around\n• Adoption matters more than innovation\n• Simple solutions beat complex ones\n• Trust is built through consistency",
                    "• Understanding beats tactics\n• Relationships beat technology\n• Consistency beats perfection\n• Value beats volume",
                    "• Quality over quantity\n• Sustainability over growth\n• People over process\n• Results over activity",
                    "• Long-term thinking\n• Customer-focused approach\n• Continuous improvement\n• Authentic communication"
                ],
                question: [
                    "How are you building for the long term in {topic}?",
                    "What timeless principles guide your {topic} approach?",
                    "Are you optimizing for short-term gains or long-term value?",
                    "What skills are you developing that will matter in 5 years?"
                ]
            }]
        };
    }

    async generatePost(options = {}) {
        const topic = options.topic || document.getElementById('custom-topic')?.value || 'AI transformation';
        const audience = options.audience || document.getElementById('custom-audience')?.value || 'business leaders';
        const tone = options.tone || document.getElementById('custom-tone')?.value || 'professional';

        console.log('🚀 Generating LinkedIn post...', { topic, audience, tone });

        try {
            const content = this.generateIntelligentContent(topic, audience, tone);

            this.currentPost = {
                id: 'post_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
                content,
                topic,
                audience,
                tone,
                createdAt: new Date().toISOString(),
                platform: 'linkedin',
                status: 'draft'
            };

            this.displayGeneratedContent(content);
            this.trackUsage('post_generated');

            console.log('✅ Post generated successfully');
            return { success: true, post: this.currentPost };

        } catch (error) {
            console.error('❌ Error generating post:', error);
            return { success: false, error: error.message };
        }
    }

    generateIntelligentContent(topic, audience, tone) {
        return this.generateExpertContent(topic, audience, tone);
    }

    generateExpertContent(topic, audience, tone) {
        const expertProfile = this.buildExpertProfile(topic, audience);
        const contentStrategy = this.selectContentStrategy(tone);
        const insights = this.generateExpertInsights(topic, expertProfile);
        
        return this.craftExpertPost(topic, audience, expertProfile, contentStrategy, insights);
    }

    buildExpertProfile(topic, audience) {
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
            voice: this.getExpertVoice(expertType)
        };
    }

    getExpertVoice(expertType) {
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
    }

    selectContentStrategy(tone) {
        const strategies = {
            'conversational': 'story_with_lesson',
            'bold': 'contrarian_take',
            'actionable': 'framework_sharing',
            'visionary': 'trend_prediction',
            'professional': 'insight_analysis'
        };
        
        return strategies[tone] || strategies['professional'];
    }

    generateExpertInsights(topic, expertProfile) {
        const insights = {
            counterintuitive: this.generateCounterintuitiveInsight(topic, expertProfile),
            practical: this.generatePracticalInsight(topic, expertProfile),
            trend: this.generateTrendInsight(topic, expertProfile),
            mistake: this.generateCommonMistake(topic, expertProfile),
            opportunity: this.generateOpportunityInsight(topic, expertProfile)
        };
        
        return insights;
    }

    generateCounterintuitiveInsight(topic, expertProfile) {
        const patterns = [
            `Most people think ${topic} success comes from perfection, but I've seen the opposite`,
            `The biggest ${topic} breakthroughs happen when you stop following best practices`,
            `Everyone focuses on the obvious ${topic} metrics, but the real indicator is something else entirely`,
            `The ${topic} advice everyone gives actually prevents success in most cases`,
            `What looks like failure in ${topic} is often the setup for breakthrough success`
        ];
        
        return patterns[Math.floor(Math.random() * patterns.length)];
    }

    generatePracticalInsight(topic, expertProfile) {
        const patterns = [
            `The 3 ${topic} fundamentals I wish someone had taught me earlier`,
            `Here's what actually moves the needle in ${topic} (from analyzing 100+ cases)`,
            `The ${topic} framework I use with every client - it works every time`,
            `5 minutes of this ${topic} practice beats hours of everything else`,
            `The ${topic} question that reveals everything about potential success`
        ];
        
        return patterns[Math.floor(Math.random() * patterns.length)];
    }

    generateTrendInsight(topic, expertProfile) {
        const patterns = [
            `The ${topic} shift happening right now that most people are missing`,
            `Why ${topic} in 2025 will look nothing like today`,
            `The ${topic} trend that's about to change everything`,
            `3 ${topic} predictions that will sound crazy today but obvious tomorrow`,
            `The quiet ${topic} revolution that's already started`
        ];
        
        return patterns[Math.floor(Math.random() * patterns.length)];
    }

    generateCommonMistake(topic, expertProfile) {
        const patterns = [
            `The ${topic} mistake I see in 90% of cases`,
            `Why most ${topic} efforts fail (and how to avoid it)`,
            `The ${topic} assumption that destroys results`,
            `What everyone gets wrong about ${topic}`,
            `The ${topic} trap that catches even experienced professionals`
        ];
        
        return patterns[Math.floor(Math.random() * patterns.length)];
    }

    generateOpportunityInsight(topic, expertProfile) {
        const patterns = [
            `The ${topic} opportunity hiding in plain sight`,
            `Why now is the perfect time for ${topic} transformation`,
            `The ${topic} competitive advantage most people ignore`,
            `How to turn ${topic} challenges into unfair advantages`,
            `The ${topic} goldmine that everyone overlooks`
        ];
        
        return patterns[Math.floor(Math.random() * patterns.length)];
    }

    craftExpertPost(topic, audience, expertProfile, contentStrategy, insights) {
        let selectedInsight;
        let contentStructure;
        
        switch(contentStrategy) {
            case 'story_with_lesson':
                selectedInsight = insights.practical;
                contentStructure = this.createStoryStructure(topic, audience, expertProfile, selectedInsight);
                break;
            case 'contrarian_take':
                selectedInsight = insights.counterintuitive;
                contentStructure = this.createContrarianeStructure(topic, audience, expertProfile, selectedInsight);
                break;
            case 'framework_sharing':
                selectedInsight = insights.practical;
                contentStructure = this.createFrameworkStructure(topic, audience, expertProfile, selectedInsight);
                break;
            case 'trend_prediction':
                selectedInsight = insights.trend;
                contentStructure = this.createTrendStructure(topic, audience, expertProfile, selectedInsight);
                break;
            default:
                selectedInsight = insights.opportunity;
                contentStructure = this.createInsightStructure(topic, audience, expertProfile, selectedInsight);
        }
        
        const content = contentStructure.opening + '\n\n' + 
                       contentStructure.body + '\n\n' + 
                       contentStructure.insight + '\n\n' + 
                       contentStructure.callToAction + '\n\n' + 
                       this.generateRelevantHashtags(topic, expertProfile);
        
        return content;
    }

    createStoryStructure(topic, audience, expertProfile, insight) {
        const scenarios = [
            {
                opening: `Last week, I watched a ${this.getAudienceMember(audience)} completely transform their approach to ${topic}.`,
                body: `They started with a simple question: "What if everything we know about ${topic} is backwards?" Instead of following the usual playbook, they tried something different. The results surprised everyone - including me.`,
                insight: `Here's what I learned: ${insight.toLowerCase()}. Sometimes the biggest breakthroughs come from questioning the fundamentals.`,
                callToAction: `What assumptions about ${topic} are you ready to challenge?`
            },
            {
                opening: `A ${this.getAudienceMember(audience)} asked me something yesterday that I can't stop thinking about.`,
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
    }

    createContrarianeStructure(topic, audience, expertProfile, insight) {
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
    }

    createFrameworkStructure(topic, audience, expertProfile, insight) {
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
    }

    createTrendStructure(topic, audience, expertProfile, insight) {
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
    }

    createInsightStructure(topic, audience, expertProfile, insight) {
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
    }

    getAudienceMember(audience) {
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
    }

    generateRelevantHashtags(topic, expertProfile) {
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
    }

    async generateMultiplePosts(options = {}) {
        const count = options.count || 5;
        const topic = options.topic || document.getElementById('custom-topic')?.value || 'AI transformation';
        const audience = options.audience || document.getElementById('custom-audience')?.value || 'business leaders';
        const tone = options.tone || document.getElementById('custom-tone')?.value || 'professional';

        console.log('🔥 Generating multiple posts...', { count, topic, audience, tone });

        try {
            window.showToast('Generating 5 unique posts...', 'info');

            const posts = [];
            const approaches = [
                { category: 'personalStory', toneVariant: 'conversational' },
                { category: 'insights', toneVariant: 'professional' },
                { category: 'controversial', toneVariant: 'bold' },
                { category: 'practical', toneVariant: 'actionable' },
                { category: 'future', toneVariant: 'visionary' }
            ];

            for (let i = 0; i < count; i++) {
                const approach = approaches[i] || approaches[i % approaches.length];
                
                const post = await this.generatePost({
                    topic,
                    audience,
                    tone: approach.toneVariant
                });

                if (post.success) {
                    const content = this.generateCategorySpecificContent(approach.category, topic, audience, approach.toneVariant);
                    post.post.content = content;
                    post.post.approach = approach.category;
                    posts.push(post.post);
                }

                window.showToast(`Generated post ${i + 1} of ${count}`, 'success', 1000);
                await new Promise(resolve => setTimeout(resolve, 300));
            }

            this.generatedPosts = posts;
            this.displayMultiplePosts(posts);
            this.trackUsage('multiple_posts_generated', { count: posts.length });

            console.log('✅ Multiple posts generated successfully:', posts.length);
            window.showToast(`Successfully generated ${posts.length} posts!`, 'success');
            
            return { success: true, posts, count: posts.length };

        } catch (error) {
            console.error('❌ Error generating multiple posts:', error);
            window.showToast('Failed to generate multiple posts', 'error');
            return { success: false, error: error.message };
        }
    }

    generateCategorySpecificContent(category, topic, audience, tone) {
        const templates = this.templates[category];
        if (!templates || templates.length === 0) {
            return this.generateIntelligentContent(topic, audience, tone);
        }
        
        const template = templates[Math.floor(Math.random() * templates.length)];
        return this.adaptContentToContext(template, topic, audience, tone);
    }

    adaptContentToContext(template, topic, audience, tone) {
        const structure = this.buildContentFromStructure(template, topic, audience, tone);
        return structure;
    }

    buildContentFromStructure(structure, topic, audience, tone) {
        const parts = [];
        
        for (const [partName, options] of Object.entries(structure)) {
            const selectedOption = options[Math.floor(Math.random() * options.length)];
            parts.push(selectedOption);
        }
        
        let content = parts.join('\n\n');
        content = this.replacePlaceholders(content, topic, audience);
        content += `\n\n${this.generateHashtags(topic, tone)}`;
        
        return content;
    }

    replacePlaceholders(content, topic, audience) {
        const audienceMember = this.getAudienceMember(audience);
        
        return content
            .replace(/\{topic\}/g, topic)
            .replace(/\{audience\}/g, audience)
            .replace(/\{audience_member\}/g, audienceMember);
    }

    generateHashtags(topic, tone) {
        const topicHashtag = this.topicToHashtag(topic);
        const baseHashtags = ['#Leadership', '#Strategy', '#Business'];
        
        const toneHashtags = {
            'professional': ['#Innovation', '#Growth'],
            'conversational': ['#Insights', '#Experience'], 
            'bold': ['#Disruption', '#Change'],
            'actionable': ['#Implementation', '#Results'],
            'visionary': ['#Future', '#Transformation']
        };
        
        const selectedToneHashtags = toneHashtags[tone] || toneHashtags.professional;
        
        return [topicHashtag, ...selectedToneHashtags, ...baseHashtags].slice(0, 5).join(' ');
    }

    topicToHashtag(topic) {
        return '#' + topic
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join('');
    }

    displayGeneratedContent(content) {
        const contentContainer = document.getElementById('generated-content');
        const contentText = document.getElementById('content-text');
        const charCount = document.getElementById('char-count');

        if (contentContainer && contentText && charCount) {
            contentText.textContent = content;
            charCount.textContent = `Character count: ${content.length}`;
            contentContainer.classList.remove('hidden');
            
            const multipleContainer = document.getElementById('multiple-posts-container');
            if (multipleContainer) {
                multipleContainer.classList.add('hidden');
            }
        }
    }

    displayMultiplePosts(posts) {
        const multipleContainer = document.getElementById('multiple-posts-container');
        const postsList = document.getElementById('posts-list');
        const postsCount = document.getElementById('posts-count');
        
        if (!multipleContainer || !postsList || !postsCount) return;

        const singleContainer = document.getElementById('generated-content');
        if (singleContainer) {
            singleContainer.classList.add('hidden');
        }

        postsCount.textContent = posts.length;

        postsList.innerHTML = posts.map((post, index) => `
            <div class="bg-slate-800/50 border border-slate-600 rounded-lg p-4">
                <div class="flex items-start justify-between mb-3">
                    <div class="flex items-center space-x-2">
                        <span class="text-sm font-medium text-slate-300">Post ${index + 1}</span>
                        <span class="text-xs px-2 py-1 bg-slate-600 text-slate-300 rounded-full">${post.approach || 'Generated'}</span>
                    </div>
                    <div class="flex space-x-2">
                        <button onclick="copyPost(${index})" class="text-blue-400 hover:text-blue-300 text-sm transition-colors" title="Copy this post">
                            📋 Copy
                        </button>
                        <button onclick="editPost(${index})" class="text-green-400 hover:text-green-300 text-sm transition-colors" title="Edit this post">
                            ✏️ Edit
                        </button>
                    </div>
                </div>
                <div class="text-slate-200 text-sm whitespace-pre-wrap mb-3 leading-relaxed">${post.content}</div>
                <div class="flex items-center justify-between">
                    <div class="text-xs text-slate-400">${post.content.length} characters</div>
                    <div class="text-xs text-slate-400">${new Date(post.createdAt).toLocaleTimeString()}</div>
                </div>
            </div>
        `).join('');

        multipleContainer.classList.remove('hidden');
        multipleContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    trackUsage(event, data = {}) {
        const usage = {
            event,
            timestamp: new Date().toISOString(),
            user: window.currentUser?.id,
            ...data
        };
        
        const existingUsage = JSON.parse(localStorage.getItem('aifluence_usage') || '[]');
        existingUsage.push(usage);
        localStorage.setItem('aifluence_usage', JSON.stringify(existingUsage));
        
        console.log('📊 Usage tracked:', usage);
    }

    // RAG Enhancement Methods
    async generateRAGContent(role, themeType, customFocus) {
        console.log('🎯 Generating content with RAG intelligence...');
        
        try {
            const cachedData = JSON.parse(localStorage.getItem('linkedin_rag_data') || '{}');
            const trendingTopics = cachedData.trendingTopics || [];
            
            let topic = customFocus;
            
            if (themeType === 'trending' && trendingTopics.length > 0) {
                topic = this.selectBestTrendForRole(role, trendingTopics);
            }
            
            if (this.intelligentAgent) {
                const intelligentContent = await this.intelligentAgent.generateIntelligentContent(role, topic, trendingTopics);
                return intelligentContent;
            }
            
            return this.generateTrendAwareContent(role, topic, trendingTopics);
            
        } catch (error) {
            console.error('⚠️ RAG generation failed, using fallback:', error);
            return this.generateRoleBasedContent(role, customFocus, 'professional insight');
        }
    }

    selectBestTrendForRole(role, trends) {
        const roleKeywords = {
            'ceo': ['leadership', 'strategy', 'market', 'transformation', 'vision'],
            'cto': ['technology', 'innovation', 'digital', 'AI', 'technical'],
            'marketing-manager': ['marketing', 'brand', 'customer', 'growth', 'engagement'],
            'product-manager': ['product', 'user', 'feature', 'development', 'strategy'],
            'sales-director': ['sales', 'revenue', 'client', 'relationship', 'growth'],
            'finance-professional': ['finance', 'investment', 'market', 'analysis', 'risk'],
            'data-scientist': ['data', 'analytics', 'insights', 'machine learning', 'AI']
        };
        
        const keywords = roleKeywords[role] || roleKeywords['ceo'];
        
        const scoredTrends = trends.map(trend => ({
            ...trend,
            relevanceScore: keywords.reduce((score, keyword) => {
                return score + (trend.name.toLowerCase().includes(keyword.toLowerCase()) ? 1 : 0);
            }, 0)
        }));
        
        scoredTrends.sort((a, b) => (b.relevanceScore * 10 + b.score) - (a.relevanceScore * 10 + a.score));
        
        return scoredTrends[0]?.name || trends[0]?.name || 'professional insights';
    }

    generateTrendAwareContent(role, topic, trends) {
        const roleProfile = this.getRoleProfile(role);
        const trendContext = trends.slice(0, 3).map(t => t.name).join(', ');
        
        const templates = [
            `The conversation around ${topic} has been fascinating lately. Based on what I'm seeing in my network, here's what ${roleProfile.audience} should know:`,
            `I've been tracking discussions on ${topic}, and there's a clear pattern emerging. For ${roleProfile.audience}, this means:`,
            `With ${trendContext} dominating professional discussions, I wanted to share my perspective on ${topic}:`,
            `The ${topic} landscape is evolving rapidly. Here's what I'm learning from recent industry conversations:`
        ];
        
        const template = templates[Math.floor(Math.random() * templates.length)];
        const insight = this.generateContextualInsight(topic, roleProfile);
        const engagement = this.generateTrendBasedEngagement(topic, trends);
        const hashtags = this.getRoleHashtags(roleProfile, topic);
        
        return `${template}\n\n${insight}\n\n${engagement}\n\n${hashtags}`;
    }

    generateContextualInsight(topic, roleProfile) {
        const insights = [
            `Success in ${topic} isn't about following the crowd—it's about understanding what drives lasting ${roleProfile.expertise}.`,
            `The most effective ${roleProfile.audience} I know approach ${topic} with a ${roleProfile.voice} mindset that prioritizes ${roleProfile.themes[0]}.`,
            `After years of ${roleProfile.expertise}, I've learned that ${topic} success comes from focusing on ${roleProfile.themes[1]} rather than just tactics.`,
            `The breakthrough moment in ${topic} happens when you shift from ${this.getOldApproach(topic)} to ${this.getNewApproach(roleProfile, topic)}.`
        ];
        
        return insights[Math.floor(Math.random() * insights.length)];
    }

    generateTrendBasedEngagement(topic, trends) {
        if (trends.length === 0) {
            return `What's your experience with ${topic}? I'd love to hear different perspectives.`;
        }
        
        const topTrend = trends[0].name;
        return `This is especially relevant as we see the intersection of ${topic} and ${topTrend}. How are you navigating these changes in your organization?`;
    }

    // Missing method implementations
    getRoleProfile(role) {
        const profiles = {
            'ceo': {
                audience: 'executives',
                expertise: 'strategic leadership',
                voice: 'strategic',
                themes: ['vision', 'transformation', 'growth']
            },
            'cto': {
                audience: 'tech leaders',
                expertise: 'technology strategy',
                voice: 'technical',
                themes: ['innovation', 'scalability', 'architecture']
            },
            'marketing-manager': {
                audience: 'marketers',
                expertise: 'growth marketing',
                voice: 'engaging',
                themes: ['engagement', 'conversion', 'brand']
            },
            'product-manager': {
                audience: 'product professionals',
                expertise: 'product strategy',
                voice: 'analytical',
                themes: ['user experience', 'value creation', 'roadmap']
            }
        };
        
        return profiles[role] || profiles['ceo'];
    }

    getDefaultFocus(role) {
        const focuses = {
            'ceo': 'strategic transformation',
            'cto': 'technology innovation',
            'marketing-manager': 'customer engagement',
            'product-manager': 'product excellence',
            'sales-director': 'revenue growth',
            'hr-director': 'team development'
        };
        
        return focuses[role] || 'professional growth';
    }

    generateRoleBasedContent(role, topic, style) {
        const roleProfile = this.getRoleProfile(role);
        const expertProfile = this.buildExpertProfile(topic, roleProfile.audience);
        const insights = this.generateExpertInsights(topic, expertProfile);
        
        return this.craftExpertPost(topic, roleProfile.audience, expertProfile, style, insights);
    }

    getRoleHashtags(roleProfile, topic) {
        const topicHashtag = this.topicToHashtag(topic);
        const roleHashtags = {
            'strategic': ['#Leadership', '#Strategy', '#Vision'],
            'technical': ['#Technology', '#Innovation', '#Engineering'],
            'engaging': ['#Marketing', '#Growth', '#Engagement'],
            'analytical': ['#Data', '#Analytics', '#Insights']
        };
        
        const selectedHashtags = roleHashtags[roleProfile.voice] || roleHashtags['strategic'];
        return [topicHashtag, ...selectedHashtags, '#Business'].slice(0, 5).join(' ');
    }

    getOldApproach(topic) {
        const oldApproaches = {
            'leadership': 'command-and-control',
            'innovation': 'technology-first thinking',
            'growth': 'traditional marketing',
            'strategy': 'rigid planning'
        };
        
        const key = Object.keys(oldApproaches).find(k => topic.toLowerCase().includes(k));
        return oldApproaches[key] || 'conventional thinking';
    }

    getNewApproach(roleProfile, topic) {
        const newApproaches = {
            'strategic': 'adaptive leadership',
            'technical': 'human-centered innovation', 
            'engaging': 'community-driven growth',
            'analytical': 'data-informed strategy'
        };
        
        return newApproaches[roleProfile.voice] || 'sustainable value creation';
    }
}