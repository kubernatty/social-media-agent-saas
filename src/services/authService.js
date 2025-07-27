export class AuthService {
    constructor() {
        this.currentUser = null;
        this.initialized = false;
    }

    async initialize() {
        console.log('🔐 Initializing AuthService...');
        const savedUserId = localStorage.getItem('socialMediaAgent_currentUserId');
        const persistentLogin = localStorage.getItem('socialMediaAgent_persistentLogin');
        
        if (savedUserId && persistentLogin === 'true') {
            await this.loadUserFromStorage(savedUserId);
        }
        
        this.initialized = true;
        console.log('✅ AuthService initialized');
    }

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
        
        localStorage.setItem('socialMediaAgent_currentUserId', demoUser.id);
        localStorage.setItem('socialMediaAgent_persistentLogin', 'true');
        
        this.currentUser = demoUser;
        console.log('✅ Demo account activated');
        this.dispatchAuthEvent('demo-login', demoUser);
        
        return { success: true, user: demoUser };
    }

    async logout() {
        console.log('🔄 Logging out user...');
        
        localStorage.removeItem('socialMediaAgent_currentUserId');
        localStorage.removeItem('socialMediaAgent_persistentLogin');
        localStorage.removeItem('socialMediaAgent_currentSession');
        localStorage.removeItem('aifluence_auth_token');
        
        const previousUser = this.currentUser;
        this.currentUser = null;
        
        console.log('✅ User logged out successfully');
        this.dispatchAuthEvent('logout', previousUser);
        
        return { success: true };
    }

    getCurrentUser() {
        return this.currentUser;
    }

    isAuthenticated() {
        return this.currentUser !== null;
    }

    dispatchAuthEvent(type, user) {
        const event = new CustomEvent('auth-state-change', {
            detail: { type, user }
        });
        document.dispatchEvent(event);
    }

    onAuthStateChange(callback) {
        document.addEventListener('auth-state-change', callback);
    }

    removeAuthStateListener(callback) {
        document.removeEventListener('auth-state-change', callback);
    }
}