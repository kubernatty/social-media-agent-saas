// API configuration for different environments
const API_CONFIG = {
  development: {
    baseURL: 'http://localhost:3001/api',
  },
  production: {
    baseURL: '/api', // Vercel serverless functions
  }
};

const environment = process.env.NODE_ENV || 'development';
const config = API_CONFIG[environment];

export const API_BASE_URL = config.baseURL;

// API endpoints
export const API_ENDPOINTS = {
  health: '/health',
  auth: {
    register: '/auth/register',
    login: '/auth/login',
    verify: '/auth/verify',
  },
  posts: {
    list: '/posts',
    create: '/posts',
    update: (id) => `/posts/${id}`,
    delete: (id) => `/posts/${id}`,
    publish: (id) => `/posts/${id}/publish`,
  },
  linkedin: {
    connection: '/linkedin/connection',
    auth: '/linkedin/auth',
    callback: '/linkedin/callback',
    disconnect: '/linkedin/connection',
    post: '/linkedin/post',
  },
  analytics: {
    event: '/analytics/event',
    stats: '/analytics/stats',
    summary: '/analytics/summary',
  },
  users: {
    profile: '/users/profile',
    settings: '/users/settings',
    delete: '/users/delete',
  }
};

// Helper function to make API calls
export const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Add auth token if available
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'API request failed');
    }
    
    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

export default { API_BASE_URL, API_ENDPOINTS, apiCall };