/**
 * Refactored Content Generator Component
 * Modular, maintainable content generation with separated concerns
 */

// For now, we'll create a simpler version that works with the current structure
// import { AIProviderService } from '../services/ai-providers.js';
// import { contentTemplates, getRandomTemplate, replaceTemplatePlaceholders } from '../templates/content-templates.js';
// import { validateContent, getContentMetrics, getContentQualityScore, generateContentId, formatContentForDisplay, generateAIPrompt, estimatePostPerformance } from '../utils/content-utils.js';

export class ContentGenerator {
    constructor() {
        this.currentPost = null;
        this.generatedPosts = [];
        this.aiService = new AIProviderService();
        this.isInitialized = false;
    }

    /**
     * Initialize the content generator
     */
    async initialize() {
        if (this.isInitialized) return;
        
        console.log('🚀 Initializing Content Generator...');
        
        try {
            await this.aiService.initialize();
            this.setupEventListeners();
            this.isInitialized = true;
            console.log('✅ Content Generator initialized successfully');
        } catch (error) {
            console.error('❌ Failed to initialize Content Generator:', error);
            throw error;
        }
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Provider switching
        const providerSelect = document.getElementById('ai-provider-select');
        if (providerSelect) {
            providerSelect.addEventListener('change', (e) => {
                this.aiService.switchProvider(e.target.value);
            });
        }

        // Generate button
        const generateBtn = document.getElementById('generate-btn');
        if (generateBtn) {
            generateBtn.addEventListener('click', () => this.generatePost());
        }

        // Multiple posts button
        const multipleBtn = document.getElementById('generate-multiple-btn');
        if (multipleBtn) {
            multipleBtn.addEventListener('click', () => this.generateMultiplePosts());
        }
    }

    /**
     * Generate a single LinkedIn post
     */
    async generatePost(options = {}) {
        const config = this.getGenerationConfig(options);
        
        console.log('🚀 Generating LinkedIn post...', config);

        try {
            this.showLoadingState('Generating your content...');
            
            // Generate content
            const content = await this.generateContent(config);
            
            // Validate content
            const validation = validateContent(content);
            if (!validation.valid) {
                throw new Error(validation.error);
            }

            // Create post object
            this.currentPost = {
                id: generateContentId('post'),
                content: validation.content,
                ...config,
                createdAt: new Date().toISOString(),
                platform: 'linkedin',
                status: 'draft',
                metrics: getContentMetrics(validation.content),
                quality: getContentQualityScore(validation.content),
                performance: estimatePostPerformance(validation.content)
            };

            // Update UI
            this.displayGeneratedContent(this.currentPost);
            this.hideLoadingState();
            
            // Track usage
            this.trackUsage('post_generated', config);

            console.log('✅ Post generated successfully');
            return { success: true, post: this.currentPost };

        } catch (error) {
            console.error('❌ Error generating post:', error);
            this.hideLoadingState();
            this.showError(error.message);
            return { success: false, error: error.message };
        }
    }

    /**
     * Generate multiple posts with different angles
     */
    async generateMultiplePosts(options = {}) {
        const config = this.getGenerationConfig(options);
        const count = options.count || 5;
        
        console.log('🔥 Generating multiple posts...', { count, ...config });

        try {
            this.showLoadingState(`Generating ${count} unique posts...`);
            
            const posts = [];
            const angles = this.getContentAngles(count);

            for (let i = 0; i < count; i++) {
                const angleConfig = {
                    ...config,
                    topic: `${config.topic} - ${angles[i]}`,
                    angle: angles[i]
                };

                // Generate content for this angle
                const content = await this.generateContent(angleConfig);
                
                // Validate content
                const validation = validateContent(content);
                if (validation.valid) {
                    const post = {
                        id: generateContentId('multi'),
                        content: validation.content,
                        ...angleConfig,
                        createdAt: new Date().toISOString(),
                        platform: 'linkedin',
                        status: 'draft',
                        metrics: getContentMetrics(validation.content),
                        quality: getContentQualityScore(validation.content),
                        performance: estimatePostPerformance(validation.content)
                    };

                    posts.push(post);
                }
                
                // Small delay between generations
                await this.delay(500);
            }

            this.generatedPosts = posts;
            
            // Display multiple posts UI
            this.displayMultiplePosts(posts);
            
            // Auto-schedule if enabled
            if (options.autoSchedule !== false) {
                await this.schedulePostsIfEnabled(posts);
            }

            this.hideLoadingState();
            
            // Track usage
            this.trackUsage('multiple_posts_generated', { count, generated: posts.length });

            console.log(`✅ Generated ${posts.length}/${count} posts successfully`);
            return { success: true, posts };

        } catch (error) {
            console.error('❌ Error generating multiple posts:', error);
            this.hideLoadingState();
            this.showError(error.message);
            return { success: false, error: error.message };
        }
    }

    /**
     * Generate content using AI or fallback to templates
     */
    async generateContent(config) {
        // Try AI generation first
        try {
            const prompt = generateAIPrompt(config.topic, config.audience, config.tone, config.context);
            const aiContent = await this.aiService.generateContent(prompt, {
                temperature: 0.7,
                max_tokens: 1000
            });
            
            if (aiContent && aiContent.trim().length > 50) {
                console.log('✅ Content generated via AI');
                return aiContent.trim();
            }
        } catch (error) {
            console.warn('⚠️ AI generation failed, falling back to templates:', error);
        }

        // Fallback to templates
        const templateContent = this.generateFromTemplate(config);
        console.log('✅ Content generated from template');
        return templateContent;
    }

    /**
     * Generate content from templates
     */
    generateFromTemplate(config) {
        const templateKey = this.selectTemplateKey(config.topic);
        const template = getRandomTemplate(templateKey);
        
        return replaceTemplatePlaceholders(template, {
            topic: config.topic,
            audience: config.audience,
            tone: config.tone
        });
    }

    /**
     * Get generation configuration from options and UI
     */
    getGenerationConfig(options = {}) {
        return {
            topic: options.topic || document.getElementById('custom-topic')?.value || 'AI Readiness Assessment',
            audience: options.audience || document.getElementById('custom-audience')?.value || 'C-level executives and business leaders',
            tone: options.tone || document.getElementById('custom-tone')?.value || 'Professional and authoritative',
            context: options.context || '',
            ...options
        };
    }

    /**
     * Select appropriate template key based on topic
     */
    selectTemplateKey(topic) {
        const topicLower = topic.toLowerCase();
        
        if (topicLower.includes('roi') || topicLower.includes('return')) {
            return 'roi-ai';
        } else if (topicLower.includes('myth') || topicLower.includes('misconception')) {
            return 'ai-misconceptions';
        } else if (topicLower.includes('transform')) {
            return 'digital-transformation';
        } else {
            return 'ai-readiness';
        }
    }

    /**
     * Get content angles for multiple posts
     */
    getContentAngles(count) {
        const allAngles = [
            'strategic perspective',
            'implementation challenges', 
            'success metrics',
            'common pitfalls',
            'future outlook',
            'cost considerations',
            'team readiness',
            'technology requirements',
            'risk assessment',
            'competitive advantage'
        ];
        
        return allAngles.slice(0, count);
    }

    /**
     * Display generated content in UI
     */
    displayGeneratedContent(post) {
        const container = document.getElementById('generated-content');
        if (!container) return;

        const formattedContent = formatContentForDisplay(post.content);
        
        container.innerHTML = `
            <div class="generated-post-container">
                <div class="post-header">
                    <h3>Generated Post</h3>
                    <div class="post-metrics">
                        <span class="metric">Quality: ${post.quality.grade}</span>
                        <span class="metric">Performance: ${post.performance.expectedEngagement}</span>
                        <span class="metric">${post.metrics.contentCharacters} chars</span>
                    </div>
                </div>
                
                <div class="post-content">
                    ${formattedContent}
                </div>
                
                <div class="post-actions">
                    <button onclick="navigator.clipboard.writeText(\`${post.content.replace(/`/g, '\\`')}\`)">
                        Copy to Clipboard
                    </button>
                    <button onclick="window.contentGenerator.editPost('${post.id}')">
                        Edit Post
                    </button>
                    <button onclick="window.contentGenerator.shareToLinkedIn('${post.id}')">
                        Share to LinkedIn
                    </button>
                </div>
                
                <div class="post-insights">
                    <details>
                        <summary>Content Insights</summary>
                        <div class="insights-content">
                            <p><strong>Quality Factors:</strong> ${post.quality.factors.join(', ')}</p>
                            ${post.quality.suggestions.length > 0 ? 
                                `<p><strong>Suggestions:</strong> ${post.quality.suggestions.join(', ')}</p>` : 
                                ''
                            }
                            <p><strong>Best Time to Post:</strong> ${post.performance.bestTimeToPost}</p>
                            <p><strong>Hashtags:</strong> ${post.metrics.hashtags.join(', ')}</p>
                        </div>
                    </details>
                </div>
            </div>
        `;

        container.classList.remove('hidden');
    }

    /**
     * Display multiple posts in UI
     */
    displayMultiplePosts(posts) {
        const container = document.getElementById('multiple-posts-container');
        if (!container) return;

        const postsHTML = posts.map((post, index) => `
            <div class="multi-post-item" data-post-id="${post.id}">
                <div class="post-header">
                    <h4>Post ${index + 1}: ${post.angle}</h4>
                    <div class="post-metrics">
                        <span class="quality-badge grade-${post.quality.grade.toLowerCase()}">${post.quality.grade}</span>
                        <span class="performance-badge">${post.performance.expectedEngagement}</span>
                    </div>
                </div>
                <div class="post-preview">
                    ${formatContentForDisplay(post.content.substring(0, 150))}${post.content.length > 150 ? '...' : ''}
                </div>
                <div class="post-actions">
                    <button onclick="window.contentGenerator.viewFullPost('${post.id}')">View Full</button>
                    <button onclick="navigator.clipboard.writeText(\`${post.content.replace(/`/g, '\\`')}\`)">Copy</button>
                    <button onclick="window.contentGenerator.schedulePost('${post.id}')">Schedule</button>
                </div>
            </div>
        `).join('');

        container.innerHTML = `
            <div class="multiple-posts-header">
                <h3>Generated Posts (${posts.length})</h3>
                <div class="batch-actions">
                    <button onclick="window.contentGenerator.copyAllPosts()">Copy All</button>
                    <button onclick="window.contentGenerator.scheduleAllPosts()">Schedule All</button>
                </div>
            </div>
            <div class="posts-grid">
                ${postsHTML}
            </div>
        `;

        container.classList.remove('hidden');
    }

    /**
     * Show loading state
     */
    showLoadingState(message = 'Generating content...') {
        const loadingEl = document.getElementById('loading-state');
        if (loadingEl) {
            loadingEl.textContent = message;
            loadingEl.classList.remove('hidden');
        }
    }

    /**
     * Hide loading state
     */
    hideLoadingState() {
        const loadingEl = document.getElementById('loading-state');
        if (loadingEl) {
            loadingEl.classList.add('hidden');
        }
    }

    /**
     * Show error message
     */
    showError(message) {
        if (typeof showToast === 'function') {
            showToast(message, 'error');
        } else {
            console.error('❌ ' + message);
            // Fallback to alert if showToast is not available
            alert('Error: ' + message);
        }
    }

    /**
     * Track usage analytics
     */
    trackUsage(event, data = {}) {
        try {
            // Simple analytics tracking
            const usage = {
                event,
                timestamp: new Date().toISOString(),
                data,
                provider: this.aiService.currentProvider
            };
            
            // Store in localStorage for basic analytics
            const usageHistory = JSON.parse(localStorage.getItem('content_usage') || '[]');
            usageHistory.push(usage);
            
            // Keep only last 100 events
            if (usageHistory.length > 100) {
                usageHistory.splice(0, usageHistory.length - 100);
            }
            
            localStorage.setItem('content_usage', JSON.stringify(usageHistory));
            
            console.log('📊 Usage tracked:', event, data);
        } catch (error) {
            console.warn('⚠️ Failed to track usage:', error);
        }
    }

    /**
     * Schedule posts if auto-scheduling is enabled
     */
    async schedulePostsIfEnabled(posts) {
        // This would integrate with a scheduling service
        // For now, just log the intention
        console.log('📅 Auto-scheduling not implemented yet, posts ready for manual scheduling');
    }

    /**
     * Utility: delay function
     */
    async delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Get current post
     */
    getCurrentPost() {
        return this.currentPost;
    }

    /**
     * Get all generated posts
     */
    getGeneratedPosts() {
        return this.generatedPosts;
    }

    /**
     * Check if generator is initialized
     */
    isReady() {
        return this.isInitialized;
    }
}