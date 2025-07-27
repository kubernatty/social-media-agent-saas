import { useState } from 'react';
import ContentGenerator from './components/ContentGenerator';
import ContentScheduler from './components/ContentScheduler';
import ContentAnalytics from './components/ContentAnalytics';
import PersonalAI from './components/PersonalAI';
import TemplateLibrary from './components/TemplateLibrary';
import Settings from './components/Settings';

function App() {
  const [activeTab, setActiveTab] = useState('generator');
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const tabs = [
    { id: 'generator', name: 'Generator', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
    { id: 'template-library', name: 'Templates', icon: 'M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z' },
    { id: 'scheduler', name: 'Scheduler', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { id: 'analytics', name: 'Analytics', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { id: 'personal-ai', name: 'Personal AI', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { id: 'settings', name: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' }
  ];

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setActiveTab('generator'); // Switch to generator tab
  };

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'generator':
        return <ContentGenerator selectedTemplate={selectedTemplate} onTemplateUsed={() => setSelectedTemplate(null)} />;
      case 'template-library':
        return <TemplateLibrary onTemplateSelect={handleTemplateSelect} />;
      case 'scheduler':
        return <ContentScheduler />;
      case 'analytics':
        return <ContentAnalytics />;
      case 'personal-ai':
        return <PersonalAI />;
      case 'settings':
        return <Settings />;
      default:
        return <ContentGenerator selectedTemplate={selectedTemplate} onTemplateUsed={() => setSelectedTemplate(null)} />;
    }
  };

  return (
    <div className="min-h-screen bg-dark-secondary text-dark-text">
      {/* Header */}
      <header className="bg-dark-primary border-b border-dark-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-aifluence-600 to-purple-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <h1 className="text-xl font-bold">AIfluence</h1>
            <span className="text-sm text-dark-text-muted">AI-Powered Social Media Intelligence</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 px-3 py-1 bg-green-600/20 text-green-400 rounded-lg">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-sm">Connected to LinkedIn</span>
            </div>
            <button className="w-8 h-8 bg-dark-panel border border-dark-border rounded-lg flex items-center justify-center hover:bg-dark-border transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-dark-primary border-r border-dark-border min-h-screen">
          <nav className="p-4">
            <div className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-dark-accent text-white'
                      : 'text-dark-text-muted hover:text-dark-text hover:bg-dark-panel/50'
                  }`}
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={tab.icon}></path>
                  </svg>
                  <span>{tab.name}</span>
                </button>
              ))}
            </div>
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 p-6">
          {renderActiveComponent()}
        </main>
      </div>
    </div>
  );
}

export default App;