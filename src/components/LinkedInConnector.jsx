import React, { useState } from 'react';
import { Share2, CheckCircle, AlertCircle, ExternalLink, Key, Shield } from 'lucide-react';

const LinkedInConnector = ({ isConnected, onConnectionChange }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState('');

  const handleConnect = async () => {
    setIsConnecting(true);
    setConnectionError('');

    try {
      // LinkedIn OAuth Configuration
      const LINKEDIN_CONFIG = {
        clientId: '86groi688gvh41',
        redirectUri: window.location.origin + '/oauth-callback.html',
        scope: 'openid profile w_member_social',
        state: crypto.randomUUID()
      };

      // Store state for CSRF protection
      localStorage.setItem('linkedin_oauth_state', LINKEDIN_CONFIG.state);

      // Build LinkedIn OAuth URL
      const authUrl = `https://www.linkedin.com/oauth/v2/authorization?` +
        `response_type=code&` +
        `client_id=${LINKEDIN_CONFIG.clientId}&` +
        `redirect_uri=${encodeURIComponent(LINKEDIN_CONFIG.redirectUri)}&` +
        `scope=${encodeURIComponent(LINKEDIN_CONFIG.scope)}&` +
        `state=${LINKEDIN_CONFIG.state}`;

      // Open popup window
      const popup = window.open(
        authUrl,
        'linkedin-oauth',
        'width=600,height=600,scrollbars=yes,resizable=yes'
      );

      if (!popup) {
        throw new Error('Popup blocked. Please allow popups and try again.');
      }

      // Listen for OAuth completion via postMessage
      const handleMessage = (event) => {
        if (event.data && event.data.type === 'LINKEDIN_OAUTH_SUCCESS') {
          const { code, state } = event.data;
          
          // Validate CSRF state
          const storedState = localStorage.getItem('linkedin_oauth_state');
          if (state !== storedState) {
            throw new Error('OAuth state mismatch - possible CSRF attack');
          }

          // Clean up
          localStorage.removeItem('linkedin_oauth_state');
          window.removeEventListener('message', handleMessage);
          popup.close();

          // Mark as connected
          onConnectionChange(true);
          setIsConnecting(false);
        }
      };

      window.addEventListener('message', handleMessage);

      // Handle popup closed manually
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed);
          window.removeEventListener('message', handleMessage);
          setIsConnecting(false);
          
          // Check if auth completed via localStorage fallback
          const authCode = localStorage.getItem('linkedin_auth_code');
          const returnedState = localStorage.getItem('linkedin_returned_state');
          const storedState = localStorage.getItem('linkedin_oauth_state');
          
          if (authCode && returnedState === storedState) {
            localStorage.removeItem('linkedin_auth_code');
            localStorage.removeItem('linkedin_returned_state');
            localStorage.removeItem('linkedin_oauth_state');
            onConnectionChange(true);
          }
        }
      }, 1000);
      
    } catch (error) {
      setConnectionError(error.message || 'Failed to connect to LinkedIn. Please try again.');
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    onConnectionChange(false);
  };

  if (isConnected) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-2">LinkedIn Integration</h2>
          <p className="text-slate-400">Connected and ready to post</p>
        </div>

        {/* Connected Status */}
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <CheckCircle className="h-8 w-8 text-green-400" />
            <div>
              <h3 className="text-lg font-semibold text-green-400">LinkedIn Connected</h3>
              <p className="text-green-300 text-sm">Your account is successfully linked</p>
            </div>
          </div>
          
          <div className="bg-slate-800/50 rounded-lg p-4 mb-4">
            <h4 className="text-white font-medium mb-2">Connected Account</h4>
            <div className="text-slate-300 text-sm space-y-1">
              <p><strong>Profile:</strong> Natalee Buisson</p>
              <p><strong>Company:</strong> Agentic Intelligence</p>
              <p><strong>Permissions:</strong> Post content, Read profile</p>
              <p><strong>Connected:</strong> {new Date().toLocaleDateString()}</p>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleDisconnect}
              className="px-4 py-2 bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
            >
              Disconnect
            </button>
            <a
              href="https://linkedin.com/in/natalee-buisson"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              <span>View Profile</span>
            </a>
          </div>
        </div>

        {/* Features Available */}
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Available Features</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-700/50 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-2">
                <Share2 className="h-5 w-5 text-blue-400" />
                <h4 className="font-medium text-white">Direct Posting</h4>
              </div>
              <p className="text-slate-400 text-sm">
                Post generated content directly to your LinkedIn profile
              </p>
            </div>
            
            <div className="bg-slate-700/50 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-2">
                <Shield className="h-5 w-5 text-green-400" />
                <h4 className="font-medium text-white">Secure Connection</h4>
              </div>
              <p className="text-slate-400 text-sm">
                OAuth 2.0 secure authentication with LinkedIn
              </p>
            </div>
          </div>
        </div>

        {/* Usage Instructions */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-400 mb-3">How to Use</h3>
          <ol className="text-slate-300 text-sm space-y-2">
            <li className="flex items-start space-x-2">
              <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5">1</span>
              <span>Generate content in the Content Generator tab</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5">2</span>
              <span>Review and edit the generated content as needed</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5">3</span>
              <span>Use the Scheduler to plan your posts or post immediately</span>
            </li>
          </ol>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Connect to LinkedIn</h2>
        <p className="text-slate-400">Link your LinkedIn account to start posting content</p>
      </div>

      {/* Connection Card */}
      <div className="bg-slate-800/50 rounded-xl p-8 border border-slate-700 text-center">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full">
            <Share2 className="h-12 w-12 text-white" />
          </div>
        </div>

        <h3 className="text-xl font-semibold text-white mb-3">
          Connect Your LinkedIn Account
        </h3>
        
        <p className="text-slate-400 mb-6 max-w-md mx-auto">
          Securely connect your LinkedIn profile to enable direct posting of your generated content. 
          We only request permissions to post on your behalf.
        </p>

        {connectionError && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-6">
            <div className="flex items-center space-x-2 text-red-400">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{connectionError}</span>
            </div>
          </div>
        )}

        <button
          onClick={handleConnect}
          disabled={isConnecting}
          className="px-8 py-3 bg-linkedin hover:bg-linkedin-hover text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isConnecting ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Connecting...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Share2 className="h-4 w-4" />
              <span>Connect to LinkedIn</span>
            </div>
          )}
        </button>
      </div>

      {/* Security Information */}
      <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
        <div className="flex items-center space-x-3 mb-4">
          <Shield className="h-6 w-6 text-green-400" />
          <h3 className="text-lg font-semibold text-white">Security & Privacy</h3>
        </div>
        
        <div className="space-y-3 text-slate-300 text-sm">
          <div className="flex items-start space-x-3">
            <Key className="h-4 w-4 text-blue-400 mt-0.5" />
            <div>
              <p className="font-medium">OAuth 2.0 Authentication</p>
              <p className="text-slate-400">Secure, industry-standard authentication protocol</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <CheckCircle className="h-4 w-4 text-green-400 mt-0.5" />
            <div>
              <p className="font-medium">Limited Permissions</p>
              <p className="text-slate-400">We only request permissions to post content and read basic profile information</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <Shield className="h-4 w-4 text-purple-400 mt-0.5" />
            <div>
              <p className="font-medium">No Data Storage</p>
              <p className="text-slate-400">We don't store your LinkedIn credentials or personal data</p>
            </div>
          </div>
        </div>
      </div>

      {/* What happens next */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-blue-400 mb-3">What happens when you connect?</h3>
        <ol className="text-slate-300 text-sm space-y-2">
          <li className="flex items-start space-x-2">
            <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5">1</span>
            <span>You'll be redirected to LinkedIn's secure login page</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5">2</span>
            <span>LinkedIn will ask you to authorize our app with limited permissions</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5">3</span>
            <span>You'll be redirected back here with your account connected</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5">4</span>
            <span>You can start posting your AI-generated content directly to LinkedIn</span>
          </li>
        </ol>
      </div>
    </div>
  );
};

export default LinkedInConnector;