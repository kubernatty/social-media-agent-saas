/**
 * AI Provider Service
 * Handles multiple AI providers for content generation
 */

export class AIProviderService {
    constructor() {
        this.providers = {
            ollama: { 
                name: 'Ollama (Local)', 
                url: 'http://localhost:11434/api/generate',
                available: false 
            },
            claude: { 
                name: 'Claude API', 
                url: 'https://api.anthropic.com/v1/messages',
                available: false 
            },
            openai: { 
                name: 'OpenAI GPT', 
                url: 'https://api.openai.com/v1/chat/completions',
                available: false 
            }
        };
        this.currentProvider = null;
        this.retryAttempts = 3;
        this.timeout = 10000; // 10 seconds
    }

    /**
     * Initialize and check provider availability
     */
    async initialize() {
        console.log('🔄 Initializing AI providers...');
        
        // Check each provider availability
        await Promise.allSettled([
            this.checkProviderAvailability('ollama'),
            this.checkProviderAvailability('claude'),
            this.checkProviderAvailability('openai')
        ]);

        // Set default provider to first available one
        this.setDefaultProvider();
        
        console.log('✅ AI providers initialized');
    }

    /**
     * Check if a provider is available
     */
    async checkProviderAvailability(providerName) {
        try {
            const provider = this.providers[providerName];
            if (!provider) return false;

            // Simple health check based on provider type
            let available = false;
            
            switch (providerName) {
                case 'ollama':
                    available = await this.checkOllamaHealth();
                    break;
                case 'claude':
                    available = await this.checkClaudeHealth();
                    break;
                case 'openai':
                    available = await this.checkOpenAIHealth();
                    break;
            }

            provider.available = available;
            console.log(`${provider.name}: ${available ? '✅ Available' : '❌ Unavailable'}`);
            
            return available;
        } catch (error) {
            console.error(`Error checking ${providerName}:`, error);
            this.providers[providerName].available = false;
            return false;
        }
    }

    /**
     * Check Ollama local server health
     */
    async checkOllamaHealth() {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000);
            
            const response = await fetch('http://localhost:11434/api/tags', {
                method: 'GET',
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            return response.ok;
        } catch (error) {
            return false;
        }
    }

    /**
     * Check Claude API availability
     */
    async checkClaudeHealth() {
        const apiKey = this.getAPIKey('claude');
        return apiKey && apiKey.startsWith('sk-ant-');
    }

    /**
     * Check OpenAI API availability
     */
    async checkOpenAIHealth() {
        const apiKey = this.getAPIKey('openai');
        return apiKey && apiKey.startsWith('sk-');
    }

    /**
     * Get API key for provider
     */
    getAPIKey(providerName) {
        switch (providerName) {
            case 'claude':
                return localStorage.getItem('claude_api_key') || window.CLAUDE_API_KEY;
            case 'openai':
                return localStorage.getItem('openai_api_key') || window.OPENAI_API_KEY;
            default:
                return null;
        }
    }

    /**
     * Set default provider to first available one
     */
    setDefaultProvider() {
        const availableProviders = Object.keys(this.providers)
            .filter(name => this.providers[name].available);
        
        if (availableProviders.length > 0) {
            this.currentProvider = availableProviders[0];
            console.log(`🎯 Default provider set to: ${this.providers[this.currentProvider].name}`);
        } else {
            console.warn('⚠️ No AI providers available');
        }
    }

    /**
     * Generate content using available AI provider
     */
    async generateContent(prompt, options = {}) {
        if (!this.currentProvider) {
            throw new Error('No AI provider available');
        }

        const maxRetries = options.maxRetries || this.retryAttempts;
        let lastError;

        // Try current provider first
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                console.log(`🤖 Attempt ${attempt}: Generating content with ${this.providers[this.currentProvider].name}...`);
                
                const result = await this.callProvider(this.currentProvider, prompt, options);
                if (result) {
                    console.log('✅ Content generated successfully');
                    return result;
                }
            } catch (error) {
                console.error(`❌ Attempt ${attempt} failed:`, error);
                lastError = error;
                
                if (attempt < maxRetries) {
                    await this.delay(1000 * attempt); // Exponential backoff
                }
            }
        }

        // Try other available providers as fallback
        const otherProviders = Object.keys(this.providers)
            .filter(name => name !== this.currentProvider && this.providers[name].available);

        for (const providerName of otherProviders) {
            try {
                console.log(`🔄 Fallback: Trying ${this.providers[providerName].name}...`);
                const result = await this.callProvider(providerName, prompt, options);
                if (result) {
                    console.log('✅ Content generated with fallback provider');
                    return result;
                }
            } catch (error) {
                console.error(`❌ Fallback provider ${providerName} failed:`, error);
                lastError = error;
            }
        }

        throw lastError || new Error('All AI providers failed');
    }

    /**
     * Call specific AI provider
     */
    async callProvider(providerName, prompt, options = {}) {
        switch (providerName) {
            case 'ollama':
                return await this.callOllama(prompt, options);
            case 'claude':
                return await this.callClaude(prompt, options);
            case 'openai':
                return await this.callOpenAI(prompt, options);
            default:
                throw new Error(`Unknown provider: ${providerName}`);
        }
    }

    /**
     * Call Ollama local API
     */
    async callOllama(prompt, options = {}) {
        const model = options.model || 'llama3.2';
        
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
                    temperature: options.temperature || 0.7,
                    top_p: options.top_p || 0.9,
                    max_tokens: options.max_tokens || 1000
                }
            }),
            signal: AbortSignal.timeout(this.timeout)
        });

        if (!response.ok) {
            throw new Error(`Ollama API error: ${response.status}`);
        }

        const data = await response.json();
        return data.response || null;
    }

    /**
     * Call Claude API
     */
    async callClaude(prompt, options = {}) {
        const apiKey = this.getAPIKey('claude');
        if (!apiKey) {
            throw new Error('Claude API key not found');
        }

        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: options.model || 'claude-3-haiku-20240307',
                max_tokens: options.max_tokens || 1000,
                temperature: options.temperature || 0.7,
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ]
            }),
            signal: AbortSignal.timeout(this.timeout)
        });

        if (!response.ok) {
            throw new Error(`Claude API error: ${response.status}`);
        }

        const data = await response.json();
        return data.content?.[0]?.text || null;
    }

    /**
     * Call OpenAI API
     */
    async callOpenAI(prompt, options = {}) {
        const apiKey = this.getAPIKey('openai');
        if (!apiKey) {
            throw new Error('OpenAI API key not found');
        }

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: options.model || 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                max_tokens: options.max_tokens || 1000,
                temperature: options.temperature || 0.7,
                top_p: options.top_p || 0.9
            }),
            signal: AbortSignal.timeout(this.timeout)
        });

        if (!response.ok) {
            throw new Error(`OpenAI API error: ${response.status}`);
        }

        const data = await response.json();
        return data.choices?.[0]?.message?.content || null;
    }

    /**
     * Get list of available providers
     */
    getAvailableProviders() {
        return Object.keys(this.providers)
            .filter(name => this.providers[name].available)
            .map(name => ({
                name,
                displayName: this.providers[name].name,
                current: name === this.currentProvider
            }));
    }

    /**
     * Switch to different provider
     */
    switchProvider(providerName) {
        if (this.providers[providerName] && this.providers[providerName].available) {
            this.currentProvider = providerName;
            console.log(`🔄 Switched to: ${this.providers[providerName].name}`);
            return true;
        }
        return false;
    }

    /**
     * Utility: delay function
     */
    async delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}