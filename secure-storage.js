// AIfluence Secure Storage API Integration
// Add this to your standalone.html file to replace localStorage with secure backend calls

class SecureStorage {
  constructor() {
    this.baseURL = window.location.origin; // Use same domain for API calls
    this.token = localStorage.getItem('aifluence_token'); // Keep token in localStorage temporarily
  }

  async apiCall(endpoint, options = {}) {
    const url = `${this.baseURL}/api/${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    if (this.token) {
      config.headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'API request failed');
      }
      
      return data;
    } catch (error) {
      console.error('API call failed:', error);
      throw error;
    }
  }

  // User Authentication
  async register(email, password, name) {
    try {
      const response = await this.apiCall('users?action=register', {
        method: 'POST',
        body: JSON.stringify({ email, password, name }),
      });
      
      if (response.success) {
        this.token = response.token;
        localStorage.setItem('aifluence_token', this.token);
        localStorage.setItem('aifluence_user', JSON.stringify(response.user));
        return response.user;
      }
      
      throw new Error(response.error || 'Registration failed');
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async login(email, password) {
    try {
      const response = await this.apiCall('users?action=login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      
      if (response.success) {
        this.token = response.token;
        localStorage.setItem('aifluence_token', this.token);
        localStorage.setItem('aifluence_user', JSON.stringify(response.user));
        return response.user;
      }
      
      throw new Error(response.error || 'Login failed');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async getCurrentUser() {
    try {
      const response = await this.apiCall('users?action=get-user');
      
      if (response.success) {
        localStorage.setItem('aifluence_user', JSON.stringify(response.user));
        return response.user;
      }
      
      return null;
    } catch (error) {
      console.error('Get user error:', error);
      return null;
    }
  }

  // LinkedIn Integration
  async saveLinkedInConnection(profile, authCode) {
    try {
      const response = await this.apiCall('users?action=save-linkedin-connection', {
        method: 'POST',
        body: JSON.stringify({ profile, authCode }),
      });
      
      if (response.success) {
        // Update local user data
        const user = JSON.parse(localStorage.getItem('aifluence_user') || '{}');
        user.linkedInConnected = true;
        user.linkedInProfile = profile;
        localStorage.setItem('aifluence_user', JSON.stringify(user));
      }
      
      return response.success;
    } catch (error) {
      console.error('Save LinkedIn connection error:', error);
      return false;
    }
  }

  async getLinkedInConnection() {
    try {
      const response = await this.apiCall('users?action=get-linkedin-connection');
      return response;
    } catch (error) {
      console.error('Get LinkedIn connection error:', error);
      return { connected: false };
    }
  }

  async disconnectLinkedIn() {
    try {
      const response = await this.apiCall('users?action=disconnect-linkedin', {
        method: 'POST',
      });
      
      if (response.success) {
        // Update local user data
        const user = JSON.parse(localStorage.getItem('aifluence_user') || '{}');
        user.linkedInConnected = false;
        user.linkedInProfile = null;
        localStorage.setItem('aifluence_user', JSON.stringify(user));
      }
      
      return response.success;
    } catch (error) {
      console.error('Disconnect LinkedIn error:', error);
      return false;
    }
  }

  // Posts Management
  async savePosts(posts) {
    try {
      const response = await this.apiCall('users?action=save-posts', {
        method: 'POST',
        body: JSON.stringify({ posts }),
      });
      
      return response.success;
    } catch (error) {
      console.error('Save posts error:', error);
      return false;
    }
  }

  async getPosts() {
    try {
      const response = await this.apiCall('users?action=get-posts');
      return response.posts || [];
    } catch (error) {
      console.error('Get posts error:', error);
      return [];
    }
  }

  // Usage Tracking
  async saveUsage(usage) {
    try {
      const response = await this.apiCall('users?action=save-usage', {
        method: 'POST',
        body: JSON.stringify({ usage }),
      });
      
      return response.success;
    } catch (error) {
      console.error('Save usage error:', error);
      return false;
    }
  }

  async getUsage() {
    try {
      const response = await this.apiCall('users?action=get-usage');
      return response.usage || {
        postsGenerated: 0,
        imagesGenerated: 0,
        monthlyLimit: 10,
        resetDate: new Date().toISOString()
      };
    } catch (error) {
      console.error('Get usage error:', error);
      return {
        postsGenerated: 0,
        imagesGenerated: 0,
        monthlyLimit: 10,
        resetDate: new Date().toISOString()
      };
    }
  }

  // Logout
  logout() {
    this.token = null;
    localStorage.removeItem('aifluence_token');
    localStorage.removeItem('aifluence_user');
  }
}

// Initialize secure storage
window.secureStorage = new SecureStorage();

// Helper functions to replace localStorage usage
window.saveUserSecurely = async function(userData) {
  // This replaces localStorage.setItem('socialMediaAgent_users', JSON.stringify(users))
  await window.secureStorage.savePosts(userData.posts || []);
  await window.secureStorage.saveUsage(userData.usage || {});
  return true;
};

window.getUserSecurely = async function() {
  // This replaces JSON.parse(localStorage.getItem('socialMediaAgent_users') || '[]')
  const user = await window.secureStorage.getCurrentUser();
  return user ? [user] : [];
};

console.log('🔐 AIfluence Secure Storage initialized');