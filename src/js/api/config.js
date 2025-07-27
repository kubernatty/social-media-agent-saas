/**
 * API Configuration
 * Centralized configuration for frontend-backend communication
 */

// API Configuration for frontend-backend communication
window.API_CONFIG = {
    // Detect environment and set appropriate base URL
    BASE_URL: window.location.protocol === 'file:' 
        ? 'http://localhost:3001' 
        : window.location.protocol + '//' + window.location.hostname + ':3001',
    
    // API endpoints
    ENDPOINTS: {
        // Authentication
        REGISTER: '/api/auth/register',
        LOGIN: '/api/auth/login',
        VERIFY: '/api/auth/verify',
        REFRESH: '/api/auth/refresh',
        
        // User management
        USER_PROFILE: '/api/users/profile',
        USER_STATS: '/api/users/stats',
        CHANGE_PASSWORD: '/api/users/password',
        DELETE_ACCOUNT: '/api/users/account',
        
        // Posts
        POSTS: '/api/posts',
        PUBLISH_POST: (id) => `/api/posts/${id}/publish`,
        
        // LinkedIn
        LINKEDIN_CONNECTION: '/api/linkedin/connection',
        LINKEDIN_AUTH: '/api/linkedin/auth',
        LINKEDIN_CALLBACK: '/api/linkedin/callback',
        LINKEDIN_POST: '/api/linkedin/post',
        
        // Analytics
        ANALYTICS_EVENT: '/api/analytics/event',
        ANALYTICS_STATS: '/api/analytics/stats',
        
        // AI Services (proxy through backend)
        OPENAI_IMAGES: '/api/openai/images'
    },
    
    // Default request headers
    DEFAULT_HEADERS: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    
    // Get authorization header with token
    getAuthHeaders: function() {
        const token = localStorage.getItem('aifluence_auth_token');
        return token ? { 
            ...this.DEFAULT_HEADERS, 
            'Authorization': `Bearer ${token}` 
        } : this.DEFAULT_HEADERS;
    }
};

// API helper functions
window.apiRequest = async function(endpoint, options = {}) {
    const url = API_CONFIG.BASE_URL + endpoint;
    const config = {
        headers: API_CONFIG.getAuthHeaders(),
        ...options
    };
    
    try {
        console.log(`🌐 API Request: ${options.method || 'GET'} ${url}`);
        const response = await fetch(url, config);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log(`✅ API Response: ${endpoint}`, data);
        return data;
    } catch (error) {
        console.error(`❌ API Error: ${endpoint}`, error);
        
        // Handle authentication errors
        if (error.message.includes('401') || error.message.includes('403')) {
            localStorage.removeItem('aifluence_auth_token');
            if (typeof showToast === 'function') {
                showToast('Session expired. Please login again.', 'error');
            }
        }
        
        throw error;
    }
};

console.log('✅ API Configuration loaded');
console.log('📡 API Base URL:', API_CONFIG.BASE_URL);