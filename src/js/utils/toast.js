/**
 * Toast Notification System
 * Extracted from standalone.html for better organization
 */

// Toast notification system
window.showToast = function(message, type = 'info', duration = 4000) {
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

    // Animate in
    setTimeout(() => {
        toast.classList.remove('translate-x-full');
    }, 100);

    // Auto remove
    setTimeout(() => {
        toast.classList.add('translate-x-full');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, duration);
};

// Toast utility functions
window.toastSuccess = function(message, duration) {
    window.showToast(message, 'success', duration);
};

window.toastError = function(message, duration) {
    window.showToast(message, 'error', duration);
};

window.toastWarning = function(message, duration) {
    window.showToast(message, 'warning', duration);
};

window.toastInfo = function(message, duration) {
    window.showToast(message, 'info', duration);
};

console.log('✅ Toast notification system loaded');