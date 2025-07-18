import React, { useState } from 'react';
import { Brain, Target, Users, Lightbulb, TrendingUp, Calendar, Share2 } from 'lucide-react';
import ContentGenerator from './components/ContentGenerator';
import LinkedInConnector from './components/LinkedInConnector';
import ContentScheduler from './components/ContentScheduler';
import Dashboard from './components/Dashboard';

function App() {
  const [activeTab, setActiveTab] = useState('generator');
  const [isLinkedInConnected, setIsLinkedInConnected] = useState(false);

  const tabs = [
    { id: 'generator', label: 'Content Generator', icon: Brain },
    { id: 'linkedin', label: 'LinkedIn Connect', icon: Share2 },
    { id: 'scheduler', label: 'Scheduler', icon: Calendar },
    { id: 'dashboard', label: 'Analytics', icon: TrendingUp }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">
                  Agentic Intelligence
                </h1>
                <p className="text-sm text-slate-400">Social Media Agent</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-300">Bridging Business & AI</p>
              <p className="text-xs text-slate-500">Educational Content Generator</p>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b border-slate-700 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'text-blue-400 border-b-2 border-blue-400 bg-slate-800/50'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'generator' && <ContentGenerator />}
        {activeTab === 'linkedin' && (
          <LinkedInConnector 
            isConnected={isLinkedInConnected}
            onConnectionChange={setIsLinkedInConnected}
          />
        )}
        {activeTab === 'scheduler' && (
          <ContentScheduler isLinkedInConnected={isLinkedInConnected} />
        )}
        {activeTab === 'dashboard' && <Dashboard />}
      </main>

      {/* Theme Context Box */}
      <div className="fixed bottom-6 right-6 max-w-sm bg-slate-800/90 backdrop-blur-sm border border-slate-600 rounded-lg p-4 shadow-xl">
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
            <Target className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white mb-1">Our Mission</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Bridging the gap between business knowledge and AI implementation. 
              We help companies understand and adopt AI solutions that drive real results.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
