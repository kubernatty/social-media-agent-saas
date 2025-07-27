/**
 * Authentication API Service
 * Handles all authentication-related API calls and user session management
 */

class AuthService {
    constructor() {
        this.currentUser = null;
        this.token = null;
        this.initialized = false;
    }

    /**
     * Initialize authentication service
     * Checks for existing session and validates token
     */
    async initialize() {
        console.log('🔐 Initializing AuthService...');
        
        // Check for existing session
        const savedUserId = localStorage.getItem('socialMediaAgent_currentUserId');
        const persistentLogin = localStorage.getItem('socialMediaAgent_persistentLogin');
        const token = localStorage.getItem('aifluence_auth_token');
        
        if (savedUserId && persistentLogin === 'true') {
            await this.loadUserFromStorage(savedUserId);
        } else if (token) {
            await this.validateToken(token);
        }
        
        this.initialized = true;
        console.log('✅ AuthService initialized');
    }

    /**
     * Load user data from localStorage (legacy support)
     */
    async loadUserFromStorage(userId) {
        try {
            const users = JSON.parse(localStorage.getItem('socialMediaAgent_users') || '[]');
            const user = users.find(u => u.id === userId);
            
            if (user) {
                this.currentUser = user;
                console.log('👤 User loaded from storage:', user.name);
                this.dispatchAuthEvent('login', user);
                return user;
            }
        } catch (error) {
            console.error('❌ Error loading user from storage:', error);
        }
        return null;
    }

    /**
     * Validate JWT token with backend
     */
    async validateToken(token) {
        try {
            const response = await window.apiRequest('/api/auth/verify', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.user) {
                this.currentUser = response.user;
                this.token = token;
                console.log('✅ Token validated, user loaded:', response.user.name);
                this.dispatchAuthEvent('login', response.user);
                return response.user;
            }
        } catch (error) {
            console.error('❌ Token validation failed:', error);
            localStorage.removeItem('aifluence_auth_token');
        }
        return null;
    }

    /**
     * Login user with email and password
     */
    async login(email, password) {
        try {
            console.log('🔄 Attempting login for:', email);
            
            // Try backend API first
            if (window.API_CONFIG) {
                const response = await window.apiRequest('/api/auth/login', {
                    method: 'POST',
                    body: JSON.stringify({ email, password })
                });
                
                if (response.token && response.user) {
                    this.currentUser = response.user;
                    this.token = response.token;
                    localStorage.setItem('aifluence_auth_token', response.token);
                    
                    console.log('✅ Backend login successful');
                    this.dispatchAuthEvent('login', response.user);
                    return { success: true, user: response.user };
                }
            }
            
            // Fallback to localStorage-based authentication
            return await this.loginWithLocalStorage(email, password);
            
        } catch (error) {
            console.error('❌ Login error:', error);
            return { 
                success: false, 
                error: error.message || 'Login failed. Please check your credentials.' 
            };
        }
    }

    /**
     * Legacy localStorage-based login
     */
    async loginWithLocalStorage(email, password) {
        const users = JSON.parse(localStorage.getItem('socialMediaAgent_users') || '[]');
        
        // Hash password for comparison
        const hashedPassword = await this.hashPassword(password);
        const user = users.find(u => u.email === email && u.password === hashedPassword);
        
        if (user) {
            // Store session data
            localStorage.setItem('socialMediaAgent_currentUserId', user.id);
            localStorage.setItem('socialMediaAgent_persistentLogin', 'true');
            localStorage.setItem('socialMediaAgent_currentSession', JSON.stringify({
                userId: user.id,
                loginTime: new Date().toISOString(),
                userAgent: navigator.userAgent
            }));
            
            this.currentUser = user;
            console.log('✅ localStorage login successful');
            this.dispatchAuthEvent('login', user);
            
            return { success: true, user };
        } else {
            return { 
                success: false, 
                error: 'Invalid email or password. Please check your credentials.' 
            };
        }
    }

    /**
     * Register new user
     */
    async register(userData) {
        try {
            console.log('🔄 Attempting registration for:', userData.email);
            
            // Validate input
            const validation = this.validateRegistrationData(userData);
            if (!validation.valid) {
                return { success: false, error: validation.error };
            }
            
            // Try backend API first
            if (window.API_CONFIG) {
                const response = await window.apiRequest('/api/auth/register', {
                    method: 'POST',
                    body: JSON.stringify(userData)
                });
                
                if (response.token && response.user) {
                    this.currentUser = response.user;
                    this.token = response.token;
                    localStorage.setItem('aifluence_auth_token', response.token);
                    
                    console.log('✅ Backend registration successful');
                    this.dispatchAuthEvent('register', response.user);
                    return { success: true, user: response.user };
                }
            }
            
            // Fallback to localStorage-based registration
            return await this.registerWithLocalStorage(userData);
            
        } catch (error) {
            console.error('❌ Registration error:', error);
            return { 
                success: false, 
                error: error.message || 'Registration failed. Please try again.' 
            };
        }
    }

    /**
     * Legacy localStorage-based registration
     */
    async registerWithLocalStorage(userData) {
        const users = JSON.parse(localStorage.getItem('socialMediaAgent_users') || '[]');
        
        // Check if email already exists
        if (users.some(u => u.email === userData.email)) {
            return { 
                success: false, 
                error: 'An account with this email already exists. Please use a different email or try logging in.' 
            };
        }
        
        // Create new user
        const hashedPassword = await this.hashPassword(userData.password);
        const newUser = {
            id: 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            name: userData.name,
            email: userData.email,
            password: hashedPassword,
            plan: 'free',
            createdAt: new Date().toISOString(),
            preferences: {
                theme: 'dark',
                notifications: true,
                autoSchedule: false
            },
            usage: {
                postsGenerated: 0,
                postsScheduled: 0,
                linkedInConnections: 0
            }
        };
        
        // Save user
        users.push(newUser);
        localStorage.setItem('socialMediaAgent_users', JSON.stringify(users));
        
        // Auto-login
        localStorage.setItem('socialMediaAgent_currentUserId', newUser.id);
        localStorage.setItem('socialMediaAgent_persistentLogin', 'true');
        
        this.currentUser = newUser;
        console.log('✅ localStorage registration successful');
        this.dispatchAuthEvent('register', newUser);
        
        return { success: true, user: newUser };
    }

    /**
     * Logout current user
     */
    async logout() {
        console.log('🔄 Logging out user...');
        
        // Clear session data
        localStorage.removeItem('socialMediaAgent_currentUserId');
        localStorage.removeItem('socialMediaAgent_persistentLogin');
        localStorage.removeItem('socialMediaAgent_currentSession');
        localStorage.removeItem('aifluence_auth_token');
        
        const previousUser = this.currentUser;
        this.currentUser = null;
        this.token = null;
        
        console.log('✅ User logged out successfully');
        this.dispatchAuthEvent('logout', previousUser);
        
        return { success: true };
    }

    /**
     * Use demo account
     */
    async useDemoAccount() {
        console.log('🎭 Using demo account...');
        
        const demoUser = {
            id: 'demo_user_' + Date.now(),
            name: 'Demo User',
            email: 'demo@aifluence.com',
            plan: 'pro',
            isDemo: true,
            createdAt: new Date().toISOString(),
            preferences: {
                theme: 'dark',
                notifications: true,
                autoSchedule: true
            },
            usage: {
                postsGenerated: 23,
                postsScheduled: 15,
                linkedInConnections: 1
            }
        };
        
        // Store demo session
        localStorage.setItem('socialMediaAgent_currentUserId', demoUser.id);
        localStorage.setItem('socialMediaAgent_persistentLogin', 'true');
        
        this.currentUser = demoUser;
        console.log('✅ Demo account activated');
        this.dispatchAuthEvent('demo-login', demoUser);
        
        return { success: true, user: demoUser };
    }

    /**
     * Validate registration data
     */
    validateRegistrationData(data) {
        if (!data.name || data.name.trim().length < 2) {
            return { valid: false, error: 'Name must be at least 2 characters long.' };
        }
        
        if (!data.email || !this.isValidEmail(data.email)) {
            return { valid: false, error: 'Please enter a valid email address.' };
        }
        
        if (!data.password || data.password.length < 6) {
            return { valid: false, error: 'Password must be at least 6 characters long.' };
        }
        
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(data.password)) {
            return { 
                valid: false, 
                error: 'Password must contain at least one lowercase letter, one uppercase letter, and one number.' 
            };
        }
        
        return { valid: true };
    }

    /**
     * Check if email is valid
     */
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Hash password using Web Crypto API
     */
    async hashPassword(password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password + 'aifluence_salt');
        const hash = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hash));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    /**
     * Get current user
     */
    getCurrentUser() {
        return this.currentUser;
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated() {
        return this.currentUser !== null;
    }

    /**
     * Get authentication token
     */
    getToken() {
        return this.token || localStorage.getItem('aifluence_auth_token');
    }

    /**
     * Dispatch authentication events
     */
    dispatchAuthEvent(type, user) {
        const event = new CustomEvent('auth-state-change', {
            detail: { type, user }
        });
        document.dispatchEvent(event);
    }

    /**
     * Listen for authentication state changes
     */
    onAuthStateChange(callback) {
        document.addEventListener('auth-state-change', (event) => {
            callback(event.detail.type, event.detail.user);
        });
    }
}

// Export for module use
export { AuthService };

// Global instance for backward compatibility
window.AuthService = AuthService;