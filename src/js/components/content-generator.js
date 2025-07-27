/**
 * Content Generator Component
 * Handles AI-powered content generation using multiple providers
 */

class ContentGenerator {
    constructor() {
        this.currentPost = null;
        this.generatedPosts = [];
        this.aiProviders = {
            ollama: { name: 'Ollama (Local)', url: 'http://localhost:11434/api/generate' },
            claude: { name: 'Claude API', url: 'https://api.anthropic.com/v1/messages' },
            openai: { name: 'OpenAI GPT', url: 'https://api.openai.com/v1/chat/completions' }
        };
        this.templates = this.initializeTemplates();
    }

    /**
     * Initialize content templates
     */
    initializeTemplates() {
        return {
            'ai-readiness': [
                `🚀 {{topic}} for {{audience}}:\n\n✅ Key insight: AI isn't about replacing humans, it's about amplifying potential\n✅ Focus on strategy before technology\n✅ Start small, scale smart\n\nWhat's your experience with AI implementation? Share your thoughts! 👇\n\n#AI #DigitalTransformation #Leadership #Innovation`,
                
                `💡 Thinking about {{topic}}?\n\nHere's what {{audience}} need to know:\n\n🎯 Start with clear business objectives\n🎯 Invest in your team's skills first\n🎯 Measure impact, not just implementation\n🎯 Build trust through transparency\n\nWhat challenges have you faced? Let's discuss!\n\n#ArtificialIntelligence #BusinessStrategy #Leadership`,
                
                `📊 {{topic}} Reality Check:\n\n❌ Common mistake: Technology-first approach\n✅ Better approach: Business-value-first\n\nFor {{audience}}, success means:\n• Clear ROI measurement\n• Employee empowerment\n• Sustainable integration\n• Customer value creation\n\nWhat's your take on this? 💭\n\n#AI #Innovation #Leadership #BusinessTransformation`
            ],
            'roi-ai': [
                `💰 {{topic}} - The Numbers Don't Lie:\n\nCompanies implementing AI strategically see:\n📈 25% increase in operational efficiency\n📈 30% faster decision-making\n📈 40% improvement in customer satisfaction\n\nFor {{audience}}, the key is measuring what matters:\n✓ Time saved per process\n✓ Error reduction rates\n✓ Revenue impact\n✓ Employee satisfaction\n\nWhat metrics are you tracking? 📊\n\n#ROI #AI #BusinessMetrics #Leadership`,
                
                `🎯 {{topic}} Strategy:\n\n"The best AI investment isn't in technology—it's in understanding."\n\n{{audience}} who succeed focus on:\n→ Clear problem definition\n→ Realistic timeline expectations\n→ Change management planning\n→ Continuous measurement\n\nROI isn't just financial—it's operational, strategic, and cultural.\n\nHow are you measuring AI success? 💭\n\n#AI #ROI #BusinessStrategy #Innovation`
            ],
            'ai-misconceptions': [
                `🤔 {{topic}} - Let's Set the Record Straight:\n\nMyth: "AI will replace all jobs"\nReality: AI augments human capabilities\n\nMyth: "AI is too complex for our business"\nReality: Start small, scale gradually\n\nMyth: "AI is only for tech companies"\nReality: Every industry can benefit\n\n{{audience}}, what AI myths have you encountered?\n\n#AI #Myths #DigitalTransformation #Leadership`,
                
                `🧠 {{topic}} - Common Misunderstandings:\n\nFor {{audience}}, the biggest misconception about AI is that it's:\n❌ A magic solution to all problems\n❌ Something that works perfectly from day one\n❌ A replacement for human judgment\n\n✅ Reality: AI is a powerful tool that requires:\n• Strategic planning\n• Human oversight\n• Continuous improvement\n• Ethical considerations\n\nWhat's your AI reality check? 💭\n\n#AI #BusinessReality #Leadership #Strategy`
            ]
        };
    }

    /**
     * Generate a single LinkedIn post
     */
    async generatePost(options = {}) {
        const topic = options.topic || document.getElementById('custom-topic')?.value || 'AI Readiness Assessment';
        const audience = options.audience || document.getElementById('custom-audience')?.value || 'C-level executives and business leaders';
        const tone = options.tone || document.getElementById('custom-tone')?.value || 'Professional and authoritative';

        console.log('🚀 Generating LinkedIn post...', { topic, audience, tone });

        try {
            // Try AI providers in order of preference
            let content = await this.tryAIGeneration(topic, audience, tone);
            
            // Fallback to templates if AI fails
            if (!content) {
                content = this.generateFromTemplate(topic, audience, tone);
            }

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

            // Update UI
            this.displayGeneratedContent(content);
            
            // Track usage
            this.trackUsage('post_generated');

            console.log('✅ Post generated successfully');
            return { success: true, post: this.currentPost };

        } catch (error) {
            console.error('❌ Error generating post:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Generate multiple posts (5 posts with auto-scheduling)
     */
    async generateMultiplePosts(options = {}) {
        const count = options.count || 5;
        const topic = options.topic || document.getElementById('custom-topic')?.value || 'AI Readiness Assessment';
        const audience = options.audience || document.getElementById('custom-audience')?.value || 'C-level executives and business leaders';
        const tone = options.tone || document.getElementById('custom-tone')?.value || 'Professional and authoritative';

        console.log('🔥 Generating multiple posts...', { count, topic, audience, tone });

        try {
            this.showLoadingState('Generating 5 unique posts...');
            
            this.generatedPosts = [];
            const posts = [];

            // Generate posts with different angles
            const angles = [
                'strategic perspective',
                'implementation challenges', 
                'success metrics',
                'common pitfalls',
                'future outlook'
            ];

            for (let i = 0; i < count; i++) {
                const angle = angles[i] || 'general insights';
                const postTopic = `${topic} - ${angle}`;
                
                let content;
                
                // Try AI generation first
                content = await this.tryAIGeneration(postTopic, audience, tone);
                
                // Fallback to templates
                if (!content) {
                    content = this.generateFromTemplate(topic, audience, tone, i);
                }

                const post = {
                    id: 'multi_post_' + Date.now() + '_' + i,
                    content,
                    topic: postTopic,
                    audience,
                    tone,
                    createdAt: new Date().toISOString(),
                    platform: 'linkedin',
                    status: 'draft',
                    angle
                };

                posts.push(post);
                
                // Small delay between generations
                await new Promise(resolve => setTimeout(resolve, 500));
            }

            this.generatedPosts = posts;
            
            // Display multiple posts UI
            this.displayMultiplePosts(posts);
            
            // Auto-schedule if enabled
            if (options.autoSchedule !== false) {
                await this.autoSchedulePosts(posts);
            }

            this.hideLoadingState();
            
            // Track usage
            this.trackUsage('multiple_posts_generated', { count });

            console.log('✅ Multiple posts generated successfully');
            return { success: true, posts };

        } catch (error) {
            console.error('❌ Error generating multiple posts:', error);
            this.hideLoadingState();
            return { success: false, error: error.message };
        }
    }

    /**
     * Try AI generation with multiple providers
     */
    async tryAIGeneration(topic, audience, tone) {
        // Try Ollama (local) first
        try {
            return await this.generateWithOllama(topic, audience, tone);
        } catch (error) {
            console.log('⚠️ Ollama generation failed, trying other providers...');
        }

        // Try Claude API
        try {
            return await this.generateWithClaude(topic, audience, tone);
        } catch (error) {
            console.log('⚠️ Claude generation failed, trying other providers...');
        }

        // Try OpenAI API
        try {
            return await this.generateWithOpenAI(topic, audience, tone);
        } catch (error) {
            console.log('⚠️ OpenAI generation failed, falling back to templates...');
        }

        return null;
    }

    /**
     * Generate content using Ollama (local)
     */
    async generateWithOllama(topic, audience, tone) {
        const prompt = this.buildPrompt(topic, audience, tone);
        
        const response = await fetch('http://localhost:11434/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'llama2',
                prompt,
                stream: false,
                options: {
                    temperature: 0.7,
                    max_tokens: 300
                }
            })
        });

        if (!response.ok) {
            throw new Error('Ollama API request failed');
        }

        const data = await response.json();
        return this.cleanGeneratedContent(data.response);
    }

    /**
     * Generate content using Claude API
     */
    async generateWithClaude(topic, audience, tone) {
        const apiKey = localStorage.getItem('claude_api_key');
        if (!apiKey) {
            throw new Error('Claude API key not configured');
        }

        const prompt = this.buildPrompt(topic, audience, tone);

        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-3-sonnet-20240229',
                max_tokens: 300,
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ]
            })
        });

        if (!response.ok) {
            throw new Error('Claude API request failed');
        }

        const data = await response.json();
        return this.cleanGeneratedContent(data.content[0].text);
    }

    /**
     * Generate content using OpenAI API
     */
    async generateWithOpenAI(topic, audience, tone) {
        const apiKey = localStorage.getItem('openai_api_key');
        if (!apiKey) {
            throw new Error('OpenAI API key not configured');
        }

        const prompt = this.buildPrompt(topic, audience, tone);

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a professional LinkedIn content creator specializing in AI and business content.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                max_tokens: 300,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            throw new Error('OpenAI API request failed');
        }

        const data = await response.json();
        return this.cleanGeneratedContent(data.choices[0].message.content);
    }

    /**
     * Generate content from templates
     */
    generateFromTemplate(topic, audience, tone, index = 0) {
        const topicKey = this.getTopicKey(topic);
        const templates = this.templates[topicKey] || this.templates['ai-readiness'];
        const template = templates[index % templates.length];
        
        return template
            .replace(/\{\{topic\}\}/g, topic)
            .replace(/\{\{audience\}\}/g, audience)
            .replace(/\{\{tone\}\}/g, tone);
    }

    /**
     * Build AI prompt
     */
    buildPrompt(topic, audience, tone) {
        return `Create a professional LinkedIn post about "${topic}" for ${audience}. 
        
Requirements:
- Tone: ${tone}
- Length: 150-250 words
- Include engaging hooks and call-to-action
- Use relevant emojis and hashtags
- Focus on business value and insights
- Make it shareable and discussion-worthy

Generate only the post content, no additional text.`;
    }

    /**
     * Clean generated content
     */
    cleanGeneratedContent(content) {
        return content
            .trim()
            .replace(/^["']|["']$/g, '') // Remove surrounding quotes
            .replace(/\n{3,}/g, '\n\n') // Normalize line breaks
            .slice(0, 2000); // Ensure reasonable length
    }

    /**
     * Get topic key for templates
     */
    getTopicKey(topic) {
        const lowerTopic = topic.toLowerCase();
        if (lowerTopic.includes('roi') || lowerTopic.includes('return')) return 'roi-ai';
        if (lowerTopic.includes('myth') || lowerTopic.includes('misconception')) return 'ai-misconceptions';
        return 'ai-readiness';
    }

    /**
     * Display generated content in UI
     */
    displayGeneratedContent(content) {
        const contentDisplay = document.getElementById('content-text');
        const generatedSection = document.getElementById('generated-content');
        const charCount = document.getElementById('char-count');
        
        if (contentDisplay && generatedSection) {
            contentDisplay.textContent = content;
            if (charCount) {
                charCount.textContent = `Character count: ${content.length}`;
            }
            generatedSection.classList.remove('hidden');
            generatedSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    /**
     * Display multiple posts in UI
     */
    displayMultiplePosts(posts) {
        // Create multiple posts container
        let container = document.getElementById('multiple-posts-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'multiple-posts-container';
            container.className = 'mt-6 space-y-4';
            
            const generatedSection = document.getElementById('generated-content');
            if (generatedSection) {
                generatedSection.parentNode.insertBefore(container, generatedSection.nextSibling);
            }
        }

        container.innerHTML = `
            <div class="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-semibold text-white">Generated Posts (${posts.length})</h3>
                    <button onclick="scheduleAllPosts()" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm">
                        Schedule All
                    </button>
                </div>
                <div class="space-y-4">
                    ${posts.map((post, index) => `
                        <div class="bg-slate-700/50 border border-slate-600 rounded-lg p-4">
                            <div class="flex items-start justify-between mb-2">
                                <span class="text-sm text-slate-400">Post ${index + 1} - ${post.angle}</span>
                                <div class="flex space-x-2">
                                    <button onclick="editPost('${post.id}')" class="text-blue-400 hover:text-blue-300 text-sm">Edit</button>
                                    <button onclick="schedulePost('${post.id}')" class="text-green-400 hover:text-green-300 text-sm">Schedule</button>
                                </div>
                            </div>
                            <div class="text-white text-sm line-clamp-3 mb-2">${post.content}</div>
                            <div class="text-xs text-slate-500">${post.content.length} characters</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    /**
     * Auto-schedule posts with optimal timing
     */
    async autoSchedulePosts(posts) {
        const scheduledPosts = JSON.parse(localStorage.getItem('scheduledPosts') || '[]');
        
        posts.forEach((post, index) => {
            const optimalTime = this.getOptimalScheduleTime(index);
            const scheduledPost = {
                ...post,
                scheduledAt: optimalTime.toISOString(),
                status: 'scheduled',
                autoScheduled: true
            };
            
            scheduledPosts.push(scheduledPost);
        });
        
        localStorage.setItem('scheduledPosts', JSON.stringify(scheduledPosts));
        
        if (typeof showToast === 'function') {
            showToast(`✅ ${posts.length} posts scheduled for optimal times!`, 'success');
        }
    }

    /**
     * Get optimal schedule time based on LinkedIn best practices
     */
    getOptimalScheduleTime(dayOffset = 0) {
        const now = new Date();
        const optimalHours = [9, 10, 11, 14, 15]; // Best engagement times
        const targetDate = new Date(now);
        
        // Schedule on weekdays only
        targetDate.setDate(now.getDate() + dayOffset);
        while (targetDate.getDay() === 0 || targetDate.getDay() === 6) {
            targetDate.setDate(targetDate.getDate() + 1);
        }
        
        // Set optimal hour
        const hour = optimalHours[dayOffset % optimalHours.length];
        targetDate.setHours(hour, 0, 0, 0);
        
        return targetDate;
    }

    /**
     * Show loading state
     */
    showLoadingState(message) {
        const btn = document.getElementById('generate-multiple-btn');
        if (btn) {
            btn.disabled = true;
            btn.innerHTML = `
                <svg class="h-4 w-4 animate-spin mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                ${message}
            `;
        }
        
        if (typeof showToast === 'function') {
            showToast(message, 'info', 6000);
        }
    }

    /**
     * Hide loading state
     */
    hideLoadingState() {
        const btn = document.getElementById('generate-multiple-btn');
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = `
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012 2v2M7 7h10"></path>
                </svg>
                <span>Generate 5 Posts</span>
            `;
        }
    }

    /**
     * Track usage analytics
     */
    trackUsage(action, data = {}) {
        try {
            const analytics = JSON.parse(localStorage.getItem('analytics_events') || '[]');
            analytics.push({
                action,
                data,
                timestamp: new Date().toISOString(),
                user: window.currentUser?.id || 'anonymous'
            });
            localStorage.setItem('analytics_events', JSON.stringify(analytics));
        } catch (error) {
            console.error('Error tracking usage:', error);
        }
    }

    /**
     * Get current post
     */
    getCurrentPost() {
        return this.currentPost;
    }

    /**
     * Get generated posts
     */
    getGeneratedPosts() {
        return this.generatedPosts;
    }
}

// Export for module use
export { ContentGenerator };

// Global instance for backward compatibility
window.ContentGenerator = ContentGenerator;