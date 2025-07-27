/**
 * AIfluence Main Application
 * Entry point for the modular application architecture
 */

import { AuthService } from './api/auth.js';
import { ContentGenerator } from './components/content-generator.js';

class AifluenceApp {
    constructor() {
        this.authService = new AuthService();
        this.contentGenerator = new ContentGenerator();
        this.currentUser = null;
        this.initialized = false;
    }

    /**
     * Initialize the application
     */
    async init() {
        console.log('🚀 Initializing AIfluence App...');
        
        try {
            // Initialize services
            await this.authService.initialize();
            
            // Set up global references for backward compatibility
            this.setupGlobalReferences();
            
            // Set up event listeners
            this.setupEventListeners();
            
            // Set up authentication state listener
            this.setupAuthStateListener();
            
            // Initialize UI based on auth state
            this.updateUIForAuthState();
            
            this.initialized = true;
            console.log('✅ AIfluence App initialized successfully');
            
        } catch (error) {
            console.error('❌ Failed to initialize app:', error);
            this.showError('Failed to initialize application. Please refresh the page.');
        }
    }

    /**
     * Set up global references for backward compatibility
     */
    setupGlobalReferences() {
        // Global service instances
        window.authService = this.authService;
        window.contentGenerator = this.contentGenerator;
        window.app = this;
        
        // Backward compatibility functions
        window.handleLogin = this.handleLogin.bind(this);
        window.handleRegister = this.handleRegister.bind(this);
        window.handleLogout = this.handleLogout.bind(this);
        window.useDemoAccount = this.useDemoAccount.bind(this);
        window.generateLinkedInPost = this.generateLinkedInPost.bind(this);
        window.generateMultiplePosts = this.generateMultiplePosts.bind(this);
        
        console.log('✅ Global references set up');
    }

    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Authentication buttons
        this.attachEventListener('login-btn', 'click', this.handleLogin.bind(this));
        this.attachEventListener('register-btn', 'click', this.handleRegister.bind(this));
        this.attachEventListener('demo-account-btn', 'click', this.useDemoAccount.bind(this));
        this.attachEventListener('show-register-btn', 'click', this.showRegisterForm.bind(this));
        
        // Content generation buttons
        this.attachEventListener('generate-btn', 'click', this.generateLinkedInPost.bind(this));
        this.attachEventListener('generate-multiple-btn', 'click', this.generateMultiplePosts.bind(this));
        
        // Form submissions
        this.attachFormListener('login-form', this.handleLoginForm.bind(this));
        this.attachFormListener('register-form', this.handleRegisterForm.bind(this));
        
        console.log('✅ Event listeners attached');
    }

    /**
     * Helper to attach event listeners with error handling
     */
    attachEventListener(elementId, event, handler) {
        const element = document.getElementById(elementId);
        if (element) {
            element.addEventListener(event, (e) => {
                e.preventDefault();
                try {
                    handler(e);
                } catch (error) {
                    console.error(`Error in ${elementId} ${event} handler:`, error);
                    this.showError('An error occurred. Please try again.');
                }
            });
            console.log(`✅ ${elementId} event listener attached`);
        } else {
            console.log(`⚠️ ${elementId} element not found`);
        }
    }

    /**
     * Helper to attach form listeners
     */
    attachFormListener(formId, handler) {
        const form = document.getElementById(formId);
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                try {
                    await handler(e);
                } catch (error) {
                    console.error(`Error in ${formId} submit handler:`, error);
                    this.showError('An error occurred. Please try again.');
                }
            });
            console.log(`✅ ${formId} form listener attached`);
        }
    }

    /**
     * Set up authentication state listener
     */
    setupAuthStateListener() {
        this.authService.onAuthStateChange((type, user) => {
            console.log(`🔐 Auth state changed: ${type}`, user);
            this.currentUser = user;
            window.currentUser = user; // Global reference for backward compatibility
            this.updateUIForAuthState();
            
            // Dispatch global event for other components
            document.dispatchEvent(new CustomEvent('user-state-change', {
                detail: { type, user }
            }));
        });
    }

    /**
     * Update UI based on authentication state
     */
    updateUIForAuthState() {
        const isAuthenticated = this.authService.isAuthenticated();
        const user = this.authService.getCurrentUser();
        
        // Show/hide sections based on auth state
        this.toggleElement('auth-section', !isAuthenticated);
        this.toggleElement('main-app', isAuthenticated);
        
        // Update user info display
        if (isAuthenticated && user) {
            this.updateUserDisplay(user);
        }
        
        console.log(`🔄 UI updated for auth state: ${isAuthenticated ? 'authenticated' : 'not authenticated'}`);
    }

    /**
     * Toggle element visibility
     */
    toggleElement(elementId, show) {
        const element = document.getElementById(elementId);
        if (element) {
            if (show) {
                element.classList.remove('hidden');
            } else {
                element.classList.add('hidden');
            }
        }
    }

    /**
     * Update user display in UI
     */
    updateUserDisplay(user) {
        // Update user name displays
        const userNameElements = document.querySelectorAll('.user-name');
        userNameElements.forEach(element => {
            element.textContent = user.name;
        });
        
        // Update user email displays
        const userEmailElements = document.querySelectorAll('.user-email');
        userEmailElements.forEach(element => {
            element.textContent = user.email;
        });
        
        // Update plan displays
        const planElements = document.querySelectorAll('.user-plan');
        planElements.forEach(element => {
            element.textContent = user.plan || 'free';
        });
    }

    /**
     * Handle login
     */
    async handleLogin() {
        console.log('🔄 Login initiated');
        this.showLoginForm();
    }

    /**
     * Handle login form submission
     */
    async handleLoginForm(event) {
        const formData = new FormData(event.target);
        const email = formData.get('email');
        const password = formData.get('password');
        
        if (!email || !password) {
            this.showError('Please enter both email and password.');
            return;
        }
        
        this.showLoading('Signing in...');
        
        const result = await this.authService.login(email, password);
        
        this.hideLoading();
        
        if (result.success) {
            this.showSuccess('Welcome back!');
            this.hideAuthForms();
        } else {
            this.showError(result.error);
        }
    }

    /**
     * Handle registration
     */
    async handleRegister() {
        console.log('🔄 Registration initiated');
        this.showRegisterForm();
    }

    /**
     * Handle register form submission
     */
    async handleRegisterForm(event) {
        const formData = new FormData(event.target);
        const userData = {
            name: formData.get('name'),
            email: formData.get('email'),
            password: formData.get('password')
        };
        
        if (!userData.name || !userData.email || !userData.password) {
            this.showError('Please fill in all fields.');
            return;
        }
        
        this.showLoading('Creating account...');
        
        const result = await this.authService.register(userData);
        
        this.hideLoading();
        
        if (result.success) {
            this.showSuccess('Account created successfully! Welcome to AIfluence!');
            this.hideAuthForms();
        } else {
            this.showError(result.error);
        }
    }

    /**
     * Handle logout
     */
    async handleLogout() {
        if (confirm('Are you sure you want to sign out?')) {
            await this.authService.logout();
            this.showSuccess('You have been signed out successfully.');
        }
    }

    /**
     * Use demo account
     */
    async useDemoAccount() {
        console.log('🎭 Demo account initiated');
        
        this.showLoading('Setting up demo account...');
        
        const result = await this.authService.useDemoAccount();
        
        this.hideLoading();
        
        if (result.success) {
            this.showSuccess('Welcome to the AIfluence demo!');
            this.hideAuthForms();
        } else {
            this.showError('Failed to set up demo account.');
        }
    }

    /**
     * Generate LinkedIn post
     */
    async generateLinkedInPost() {
        if (!this.authService.isAuthenticated()) {
            this.showError('Please sign in to generate content.');
            return;
        }
        
        const result = await this.contentGenerator.generatePost();
        
        if (result.success) {
            this.showSuccess('LinkedIn post generated successfully!');
        } else {
            this.showError(result.error || 'Failed to generate post.');
        }
    }

    /**
     * Generate multiple posts
     */
    async generateMultiplePosts() {
        if (!this.authService.isAuthenticated()) {
            this.showError('Please sign in to generate content.');
            return;
        }
        
        const result = await this.contentGenerator.generateMultiplePosts();
        
        if (result.success) {
            this.showSuccess(`Generated ${result.posts.length} posts successfully!`);
        } else {
            this.showError(result.error || 'Failed to generate posts.');
        }
    }

    /**
     * Show login form
     */
    showLoginForm() {
        this.toggleElement('login-form-container', true);
        this.toggleElement('register-form-container', false);
    }

    /**
     * Show register form
     */
    showRegisterForm() {
        this.toggleElement('register-form-container', true);
        this.toggleElement('login-form-container', false);
    }

    /**
     * Hide auth forms
     */
    hideAuthForms() {
        this.toggleElement('login-form-container', false);
        this.toggleElement('register-form-container', false);
    }

    /**
     * Show loading state
     */
    showLoading(message) {
        if (typeof showToast === 'function') {
            showToast(message, 'info');
        } else {
            console.log('⏳ ' + message);
        }
    }

    /**
     * Hide loading state
     */
    hideLoading() {
        // Loading is typically handled by toast timeout
    }

    /**
     * Show success message
     */
    showSuccess(message) {
        if (typeof showToast === 'function') {
            showToast(message, 'success');
        } else {
            console.log('✅ ' + message);
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
        }
    }

    /**
     * Get current user
     */
    getCurrentUser() {
        return this.currentUser;
    }

    /**
     * Check if app is initialized
     */
    isInitialized() {
        return this.initialized;
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🎯 DOM loaded, initializing AIfluence App...');
    
    // Create global app instance
    window.aifluenceApp = new AifluenceApp();
    
    // Initialize the app
    await window.aifluenceApp.init();
});

// Export for module use
export { AifluenceApp };