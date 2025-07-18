# AI Services Integration Guide

## Overview

The Social Media Agent integrates with multiple AI services to provide comprehensive content generation and image creation capabilities. This document provides detailed information on each integration, setup requirements, and troubleshooting procedures.

## Supported AI Services

### 1. Claude API (Anthropic) - Content Generation

#### Purpose
Primary AI service for generating educational LinkedIn content focused on business-AI knowledge gaps.

#### Integration Details
- **Endpoint**: `https://api.anthropic.com/v1/messages`
- **Model**: `claude-3-sonnet-20240229`
- **Authentication**: API Key (`sk-ant-...`)
- **Token Limit**: 1000 max tokens per request
- **Rate Limits**: Varies by plan

#### Setup Instructions
1. **Account Creation**: Sign up at [Anthropic Console](https://console.anthropic.com)
2. **API Key Generation**: Create new API key in dashboard
3. **Key Format**: Starts with `sk-ant-`
4. **Configuration**: Enter in Claude API Key section of app

#### Code Implementation
```javascript
async function generateContentWithClaude(topic, audience, tone) {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': CLAUDE_API_KEY,
            'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
            model: 'claude-3-sonnet-20240229',
            max_tokens: 1000,
            messages: [{
                role: 'user',
                content: prompt
            }]
        })
    });
    
    const data = await response.json();
    return data.content[0].text;
}
```

#### Error Handling
- **Invalid Key**: Format validation and user feedback
- **Rate Limits**: Exponential backoff retry
- **Network Issues**: Fallback to template system
- **Content Safety**: Built-in content filtering

### 2. OpenAI DALL-E 3 - Image Generation

#### Purpose
High-quality professional image generation for Personal AI Studio.

#### Integration Details
- **Endpoint**: `https://api.openai.com/v1/images/generations`
- **Model**: `dall-e-3`
- **Resolution**: 1024x1024
- **Authentication**: Bearer token (`sk-...`)
- **Cost**: ~$0.04 per image

#### Setup Instructions
1. **Account Creation**: Sign up at [OpenAI Platform](https://platform.openai.com)
2. **API Key Generation**: Create new API key
3. **Key Format**: Starts with `sk-`
4. **Billing Setup**: Add payment method for usage
5. **CORS Considerations**: Use proxy server for browser calls

#### Proxy Server Implementation
```javascript
// ai-proxy-server.js
app.post('/api/openai/images', async (req, res) => {
    const { prompt, apiKey } = req.body;
    
    const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: "dall-e-3",
            prompt: prompt,
            n: 1,
            size: "1024x1024",
            quality: "standard"
        })
    });
    
    const data = await response.json();
    res.json({ imageUrl: data.data[0].url });
});
```

#### Direct Integration (with CORS handling)
```javascript
async function generateWithOpenAI(prompt) {
    // Try proxy server first
    if (await checkProxyServer()) {
        return await callProxyServer('/api/openai/images', { prompt, apiKey: OPENAI_API_KEY });
    }
    
    // Fallback to direct call (may have CORS issues)
    const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: "dall-e-3",
            prompt: prompt,
            n: 1,
            size: "1024x1024",
            quality: "standard"
        })
    });
    
    return await response.json();
}
```

### 3. Replicate - Stable Diffusion XL

#### Purpose
Cost-effective, high-quality image generation alternative to OpenAI.

#### Integration Details
- **Endpoint**: `https://api.replicate.com/v1/predictions`
- **Model**: SDXL (`39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b`)
- **Resolution**: 1024x1024
- **Authentication**: Token (`r8_...`)
- **Cost**: ~$0.0025 per image

#### Setup Instructions
1. **Account Creation**: Sign up at [Replicate](https://replicate.com)
2. **Token Generation**: Create API token in account settings
3. **Key Format**: Starts with `r8_`
4. **Billing Setup**: Add payment method for usage

#### Implementation with Polling
```javascript
async function generateWithReplicate(prompt) {
    // Create prediction
    const response = await fetch('https://api.replicate.com/v1/predictions', {
        method: 'POST',
        headers: {
            'Authorization': `Token ${REPLICATE_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            version: "39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
            input: {
                prompt: prompt,
                width: 1024,
                height: 1024,
                num_inference_steps: 25,
                guidance_scale: 7.5,
            }
        })
    });
    
    const prediction = await response.json();
    
    // Poll for completion
    let result = prediction;
    while (result.status === 'starting' || result.status === 'processing') {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const statusResponse = await fetch(`https://api.replicate.com/v1/predictions/${result.id}`, {
            headers: { 'Authorization': `Token ${REPLICATE_API_KEY}` }
        });
        result = await statusResponse.json();
    }
    
    return { imageUrl: result.output[0] };
}
```

### 4. Hugging Face - Open Source Models

#### Purpose
Free-tier image generation with open-source models.

#### Integration Details
- **Endpoint**: `https://api-inference.huggingface.co/models/`
- **Models**: Various Stable Diffusion variants
- **Authentication**: Bearer token (`hf_...`)
- **Cost**: Free tier available

#### Setup Instructions
1. **Account Creation**: Sign up at [Hugging Face](https://huggingface.co)
2. **Token Generation**: Create access token in settings
3. **Key Format**: Starts with `hf_`
4. **Model Selection**: Choose appropriate Stable Diffusion model

#### Implementation
```javascript
async function generateWithHuggingFace(prompt) {
    const response = await fetch('https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${HUGGINGFACE_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            inputs: prompt,
            parameters: {
                width: 1024,
                height: 1024,
                num_inference_steps: 25
            }
        })
    });
    
    const blob = await response.blob();
    const imageUrl = URL.createObjectURL(blob);
    return { imageUrl };
}
```

## Service Selection Strategy

### Automatic Service Detection
```javascript
function getAvailableAIService() {
    if (OPENAI_API_KEY && OPENAI_API_KEY.startsWith('sk-')) {
        return 'openai';
    } else if (REPLICATE_API_KEY && REPLICATE_API_KEY.startsWith('r8_')) {
        return 'replicate';
    } else if (HUGGINGFACE_API_KEY && HUGGINGFACE_API_KEY.startsWith('hf_')) {
        return 'huggingface';
    }
    return 'demo';
}
```

### Service Priority Order
1. **OpenAI DALL-E 3**: Highest quality, most reliable
2. **Replicate SDXL**: Good quality, cost-effective
3. **Hugging Face**: Free tier, variable quality
4. **Demo Mode**: SVG generation, no API required

### Quality vs. Cost Considerations
| Service | Quality | Cost | Speed | Reliability |
|---------|---------|------|--------|-------------|
| OpenAI DALL-E 3 | Excellent | High | Fast | Very High |
| Replicate SDXL | Very Good | Low | Medium | High |
| Hugging Face | Good | Free* | Variable | Medium |
| Demo Mode | Basic | Free | Instant | Perfect |

*Free tier limited

## Error Handling and Resilience

### API Key Validation
```javascript
function validateAPIKey(key, service) {
    const patterns = {
        'openai': /^sk-[a-zA-Z0-9]{32,}$/,
        'replicate': /^r8_[a-zA-Z0-9]{32,}$/,
        'huggingface': /^hf_[a-zA-Z0-9]{32,}$/,
        'claude': /^sk-ant-[a-zA-Z0-9-_]{32,}$/
    };
    
    return patterns[service] && patterns[service].test(key);
}
```

### Retry Logic with Exponential Backoff
```javascript
async function callWithRetry(apiFunction, maxRetries = 3) {
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await apiFunction();
        } catch (error) {
            lastError = error;
            
            if (attempt === maxRetries) break;
            
            const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    
    throw lastError;
}
```

### Graceful Degradation
```javascript
async function generateImageWithFallback(prompt) {
    try {
        // Try primary service
        return await generateWithPrimaryService(prompt);
    } catch (primaryError) {
        console.log('Primary service failed:', primaryError);
        
        try {
            // Try secondary service
            return await generateWithSecondaryService(prompt);
        } catch (secondaryError) {
            console.log('Secondary service failed:', secondaryError);
            
            // Fall back to demo mode
            return generateDemoSVG();
        }
    }
}
```

## Performance Optimization

### Request Caching
```javascript
class APICache {
    constructor(maxSize = 50, ttl = 3600000) { // 1 hour TTL
        this.cache = new Map();
        this.maxSize = maxSize;
        this.ttl = ttl;
    }
    
    get(key) {
        const item = this.cache.get(key);
        if (!item) return null;
        
        if (Date.now() - item.timestamp > this.ttl) {
            this.cache.delete(key);
            return null;
        }
        
        return item.data;
    }
    
    set(key, data) {
        if (this.cache.size >= this.maxSize) {
            const oldestKey = this.cache.keys().next().value;
            this.cache.delete(oldestKey);
        }
        
        this.cache.set(key, {
            data,
            timestamp: Date.now()
        });
    }
}

const apiCache = new APICache();
```

### Request Batching
```javascript
class RequestBatcher {
    constructor(batchSize = 5, delay = 100) {
        this.queue = [];
        this.batchSize = batchSize;
        this.delay = delay;
        this.processing = false;
    }
    
    async add(request) {
        return new Promise((resolve, reject) => {
            this.queue.push({ request, resolve, reject });
            this.processBatch();
        });
    }
    
    async processBatch() {
        if (this.processing || this.queue.length === 0) return;
        
        this.processing = true;
        await new Promise(resolve => setTimeout(resolve, this.delay));
        
        const batch = this.queue.splice(0, this.batchSize);
        
        try {
            const results = await Promise.allSettled(
                batch.map(item => item.request())
            );
            
            results.forEach((result, index) => {
                if (result.status === 'fulfilled') {
                    batch[index].resolve(result.value);
                } else {
                    batch[index].reject(result.reason);
                }
            });
        } catch (error) {
            batch.forEach(item => item.reject(error));
        }
        
        this.processing = false;
        
        if (this.queue.length > 0) {
            this.processBatch();
        }
    }
}
```

## Monitoring and Analytics

### Request Tracking
```javascript
class APIMonitor {
    constructor() {
        this.metrics = {
            requests: 0,
            successes: 0,
            failures: 0,
            totalLatency: 0,
            serviceUsage: {}
        };
    }
    
    trackRequest(service, startTime, success, error = null) {
        this.metrics.requests++;
        this.metrics.totalLatency += Date.now() - startTime;
        
        if (success) {
            this.metrics.successes++;
        } else {
            this.metrics.failures++;
            console.error(`${service} API Error:`, error);
        }
        
        this.metrics.serviceUsage[service] = (this.metrics.serviceUsage[service] || 0) + 1;
    }
    
    getStats() {
        return {
            ...this.metrics,
            averageLatency: this.metrics.totalLatency / this.metrics.requests,
            successRate: this.metrics.successes / this.metrics.requests,
            mostUsedService: Object.keys(this.metrics.serviceUsage).reduce(
                (a, b) => this.metrics.serviceUsage[a] > this.metrics.serviceUsage[b] ? a : b
            )
        };
    }
}

const apiMonitor = new APIMonitor();
```

### Cost Tracking
```javascript
class CostTracker {
    constructor() {
        this.costs = {
            openai: { perImage: 0.04, usage: 0 },
            replicate: { perImage: 0.0025, usage: 0 },
            huggingface: { perImage: 0, usage: 0 }
        };
    }
    
    trackUsage(service) {
        this.costs[service].usage++;
        localStorage.setItem('api_costs', JSON.stringify(this.costs));
    }
    
    getTotalCost() {
        return Object.values(this.costs).reduce(
            (total, service) => total + (service.perImage * service.usage), 0
        );
    }
    
    getCostBreakdown() {
        return Object.entries(this.costs).map(([service, data]) => ({
            service,
            images: data.usage,
            cost: data.perImage * data.usage
        }));
    }
}
```

## Security Best Practices

### API Key Management
- **Client-Side Only**: Keys never sent to servers
- **Secure Storage**: Use browser localStorage with caution
- **Environment Separation**: Different keys for dev/prod
- **Regular Rotation**: Update keys periodically

### Request Security
- **Input Sanitization**: Validate all user inputs
- **Rate Limiting**: Implement client-side rate limiting
- **HTTPS Only**: All API calls over HTTPS
- **Error Handling**: Don't expose sensitive error details

### Content Safety
- **Prompt Filtering**: Remove inappropriate content
- **Output Validation**: Check generated content
- **Professional Standards**: Maintain business-appropriate content
- **Brand Protection**: Ensure brand consistency

## Troubleshooting Guide

### Common Issues and Solutions

#### 1. CORS Errors (OpenAI)
**Problem**: Browser blocks direct API calls to OpenAI
**Solution**: Use proxy server or switch to Replicate

#### 2. Invalid API Keys
**Problem**: API returns authentication errors
**Solution**: Verify key format and permissions

#### 3. Rate Limit Exceeded
**Problem**: Too many requests in short time
**Solution**: Implement exponential backoff

#### 4. Network Timeouts
**Problem**: Slow or failed network requests
**Solution**: Increase timeout values and add retry logic

#### 5. Poor Image Quality
**Problem**: Generated images don't meet standards
**Solution**: Improve prompt engineering and try different services

### Diagnostic Tools
```javascript
async function runDiagnostics() {
    const results = {};
    
    // Test API key formats
    results.apiKeys = {
        openai: validateAPIKey(OPENAI_API_KEY, 'openai'),
        replicate: validateAPIKey(REPLICATE_API_KEY, 'replicate'),
        huggingface: validateAPIKey(HUGGINGFACE_API_KEY, 'huggingface'),
        claude: validateAPIKey(CLAUDE_API_KEY, 'claude')
    };
    
    // Test network connectivity
    results.connectivity = await testConnectivity();
    
    // Test proxy server
    results.proxy = await checkProxyServer();
    
    return results;
}
```

## Future Enhancements

### Planned Integrations
- **Midjourney API**: When available
- **Adobe Firefly**: Enterprise image generation
- **Custom Models**: Fine-tuned corporate models
- **Video Generation**: RunwayML, Stable Video

### Advanced Features
- **Load Balancing**: Distribute requests across services
- **Cost Optimization**: Automatic service selection based on budget
- **Quality Scoring**: Automatic quality assessment
- **A/B Testing**: Compare service outputs

## Conclusion

The AI Services Integration provides a robust, scalable foundation for multi-service AI capabilities. Through careful service selection, comprehensive error handling, and performance optimization, the system delivers reliable AI-powered content and image generation while maintaining cost efficiency and user experience quality.