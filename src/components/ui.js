// UI Helper Functions and Main Application Class

// Toast notification system
export function showToast(message, type = 'info', duration = 4000) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `max-w-sm w-full shadow-lg rounded-lg pointer-events-auto transform transition-all duration-300 translate-x-full`;
    
    const bgColor = {
        success: 'bg-green-600',
        error: 'bg-red-600',
        warning: 'bg-yellow-600',
        info: 'bg-blue-600'
    }[type] || 'bg-slate-600';

    const icon = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    }[type] || 'ℹ️';

    toast.innerHTML = `
        <div class="${bgColor} p-4 rounded-lg text-white">
            <div class="flex items-center">
                <div class="flex-shrink-0 mr-3">
                    <span class="text-lg">${icon}</span>
                </div>
                <div class="flex-1">
                    <p class="text-sm font-medium">${message}</p>
                </div>
                <button onclick="this.parentElement.parentElement.parentElement.remove()" class="ml-3 text-white hover:text-gray-200 focus:outline-none">
                    <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                    </svg>
                </button>
            </div>
        </div>
    `;

    container.appendChild(toast);
    setTimeout(() => toast.classList.remove('translate-x-full'), 100);
    setTimeout(() => {
        toast.classList.add('translate-x-full');
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// Main Application Class
export class AifluenceApp {
    constructor() {
        this.authService = null;
        this.contentGenerator = null;
        this.currentUser = null;
        this.initialized = false;
    }

    async init(AuthService, ContentGenerator) {
        console.log('🚀 Initializing AIfluence App...');
        
        try {
            this.authService = new AuthService();
            this.contentGenerator = new ContentGenerator();
            
            await this.authService.initialize();
            await this.contentGenerator.init();
            
            this.setupGlobalReferences();
            this.setupEventListeners();
            this.setupAuthStateListener();
            this.updateUIForAuthState();
            
            this.initialized = true;
            console.log('✅ AIfluence App initialized successfully');
            
        } catch (error) {
            console.error('❌ Failed to initialize app:', error);
            showToast('Failed to initialize application. Please refresh the page.', 'error');
        }
    }

    setupGlobalReferences() {
        window.authService = this.authService;
        window.contentGenerator = this.contentGenerator;
        window.app = this;
        window.showToast = showToast;
        
        window.handleLogout = this.handleLogout.bind(this);
        window.useDemoAccount = this.useDemoAccount.bind(this);
        window.generateLinkedInPost = this.generateLinkedInPost.bind(this);
        window.generateMultiplePosts = this.generateMultiplePosts.bind(this);
        
        window.copyPost = this.copyPost.bind(this);
        window.editPost = this.editPost.bind(this);
        window.copyAllPosts = this.copyAllPosts.bind(this);
        window.clearPosts = this.clearPosts.bind(this);
        
        console.log('✅ Global references set up');
    }

    setupEventListeners() {
        this.attachEventListener('demo-account-btn', 'click', this.useDemoAccount.bind(this));
        this.attachEventListener('generate-btn', 'click', this.generateLinkedInPost.bind(this));
        this.attachEventListener('generate-multiple-btn', 'click', this.generateMultiplePosts.bind(this));
        
        this.attachEventListener('copy-all-posts', 'click', this.copyAllPosts.bind(this));
        this.attachEventListener('clear-posts', 'click', this.clearPosts.bind(this));
        
        console.log('✅ Event listeners attached');
    }

    attachEventListener(elementId, event, handler) {
        const element = document.getElementById(elementId);
        if (element) {
            element.addEventListener(event, (e) => {
                e.preventDefault();
                try {
                    handler(e);
                } catch (error) {
                    console.error(`Error in ${elementId} ${event} handler:`, error);
                    showToast('An error occurred. Please try again.', 'error');
                }
            });
            console.log(`✅ ${elementId} event listener attached`);
        } else {
            console.log(`⚠️ ${elementId} element not found`);
        }
    }

    setupAuthStateListener() {
        this.authService.onAuthStateChange((event) => {
            const { type, user } = event.detail;
            console.log(`🔐 Auth state changed: ${type}`, user);
            this.currentUser = user;
            window.currentUser = user;
            this.updateUIForAuthState();
        });
    }

    updateUIForAuthState() {
        const isAuthenticated = this.authService.isAuthenticated();
        const user = this.authService.getCurrentUser();
        
        this.toggleElement('auth-section', !isAuthenticated);
        this.toggleElement('main-app', isAuthenticated);
        
        if (isAuthenticated && user) {
            this.updateUserDisplay(user);
        }
        
        console.log(`🔄 UI updated for auth state: ${isAuthenticated ? 'authenticated' : 'not authenticated'}`);
    }

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

    updateUserDisplay(user) {
        const userNameElements = document.querySelectorAll('.user-name');
        userNameElements.forEach(element => {
            element.textContent = user.name;
        });
    }

    async handleLogout() {
        if (confirm('Are you sure you want to sign out?')) {
            await this.authService.logout();
            showToast('You have been signed out successfully.', 'success');
        }
    }

    async useDemoAccount() {
        console.log('🎭 Demo account initiated');
        
        showToast('Setting up demo account...', 'info');
        
        const result = await this.authService.useDemoAccount();
        
        if (result.success) {
            showToast('Welcome to the AIfluence demo!', 'success');
        } else {
            showToast('Failed to set up demo account.', 'error');
        }
    }

    async generateLinkedInPost() {
        if (!this.authService.isAuthenticated()) {
            showToast('Please sign in to generate content.', 'error');
            return;
        }
        
        const result = await this.contentGenerator.generatePost();
        
        if (!result.success) {
            showToast(result.error || 'Failed to generate post.', 'error');
        }
    }

    async generateMultiplePosts() {
        if (!this.authService.isAuthenticated()) {
            showToast('Please sign in to generate content.', 'error');
            return;
        }
        
        const result = await this.contentGenerator.generateMultiplePosts();
        
        if (!result.success) {
            showToast(result.error || 'Failed to generate posts.', 'error');
        }
    }

    copyPost(index) {
        const posts = this.contentGenerator.generatedPosts;
        if (posts && posts[index]) {
            navigator.clipboard.writeText(posts[index].content).then(() => {
                showToast(`Post ${index + 1} copied to clipboard!`, 'success');
            }).catch(() => {
                showToast('Failed to copy post. Please try again.', 'error');
            });
        }
    }

    editPost(index) {
        const posts = this.contentGenerator.generatedPosts;
        if (posts && posts[index]) {
            const newContent = prompt('Edit post content:', posts[index].content);
            if (newContent && newContent.trim() !== '') {
                posts[index].content = newContent.trim();
                this.contentGenerator.displayMultiplePosts(posts);
                showToast(`Post ${index + 1} updated!`, 'success');
            }
        }
    }

    copyAllPosts() {
        const posts = this.contentGenerator.generatedPosts;
        if (posts && posts.length > 0) {
            const allContent = posts.map((post, index) => 
                `=== POST ${index + 1} ===\n\n${post.content}\n\n`
            ).join('');
            
            navigator.clipboard.writeText(allContent).then(() => {
                showToast(`All ${posts.length} posts copied to clipboard!`, 'success');
            }).catch(() => {
                showToast('Failed to copy posts. Please try again.', 'error');
            });
        }
    }

    clearPosts() {
        if (confirm('Are you sure you want to clear all generated posts?')) {
            this.contentGenerator.generatedPosts = [];
            const container = document.getElementById('multiple-posts-container');
            if (container) {
                container.classList.add('hidden');
            }
            showToast('All posts cleared!', 'success');
        }
    }
}

// Initialize app when DOM is loaded
export function initializeApp() {
    document.addEventListener('DOMContentLoaded', async () => {
        console.log('🎯 DOM loaded, initializing AIfluence App...');
        
        setTimeout(() => {
            const loadingIndicator = document.getElementById('loading-indicator');
            if (loadingIndicator) {
                loadingIndicator.classList.add('hidden');
            }
        }, 1000);
        
        // Dynamic imports will be handled in the main HTML file
        console.log('✅ UI module loaded successfully');
    });
}