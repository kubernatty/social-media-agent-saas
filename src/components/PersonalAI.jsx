export default function PersonalAI() {
  return (
    <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
      <h2 className="text-2xl font-bold text-dark-text mb-6">Personal AI Assistant</h2>
      
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gradient-to-r from-aifluence-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-dark-text mb-2">Personal AI Coming Soon</h3>
        <p className="text-dark-text-muted mb-6 max-w-md mx-auto">
          We're working on an intelligent personal AI assistant that will learn your writing style, 
          preferences, and help you create more engaging content tailored to your unique voice.
        </p>
        
        <div className="space-y-4 text-left max-w-lg mx-auto">
          <div className="flex items-center space-x-3 p-3 bg-dark-primary border border-dark-border rounded-lg">
            <div className="w-2 h-2 bg-aifluence-500 rounded-full"></div>
            <span className="text-dark-text">Learn your unique writing style and tone</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-dark-primary border border-dark-border rounded-lg">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span className="text-dark-text">Personalized content suggestions</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-dark-primary border border-dark-border rounded-lg">
            <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
            <span className="text-dark-text">Smart content optimization recommendations</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-dark-primary border border-dark-border rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-dark-text">Automated engagement insights</span>
          </div>
        </div>

        <button className="mt-8 px-6 py-3 bg-gradient-to-r from-aifluence-600 to-purple-600 hover:from-aifluence-700 hover:to-purple-700 text-white rounded-lg transition-colors">
          Join Beta Waitlist
        </button>
      </div>
    </div>
  );
}