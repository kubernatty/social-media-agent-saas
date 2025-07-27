import { useState } from 'react';

export default function ContentScheduler() {
  const [content, setContent] = useState('');
  const [scheduleType, setScheduleType] = useState('optimal');
  const [customDate, setCustomDate] = useState('');
  const [customTime, setCustomTime] = useState('');
  const [scheduledPosts, setScheduledPosts] = useState([
    {
      id: 1,
      content: "Excited to share insights from today's AI leadership summit...",
      scheduledFor: "2024-01-15T14:30:00",
      status: "scheduled",
      platform: "linkedin"
    },
    {
      id: 2,
      content: "Here are 5 key strategies for digital transformation...",
      scheduledFor: "2024-01-16T09:00:00",
      status: "scheduled",
      platform: "linkedin"
    }
  ]);

  const handleSchedule = () => {
    if (!content.trim()) return;
    
    const newPost = {
      id: Date.now(),
      content: content.substring(0, 100) + (content.length > 100 ? '...' : ''),
      scheduledFor: scheduleType === 'optimal' ? 
        new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() :
        scheduleType === 'asap' ?
        new Date().toISOString() :
        new Date(`${customDate}T${customTime}`).toISOString(),
      status: 'scheduled',
      platform: 'linkedin'
    };
    
    setScheduledPosts([...scheduledPosts, newPost]);
    setContent('');
  };

  const loadFromGenerator = () => {
    setContent('🚀 Sample content loaded from generator...\n\nThis would typically load the last generated content from the Content Generator tab.');
  };

  return (
    <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-dark-text">Content Scheduler</h2>
        <div className="flex items-center space-x-3">
          <div className="inline-flex items-center px-3 py-1 bg-green-600/20 text-green-400 rounded-lg text-sm">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
            Optimal Timing Enabled
          </div>
          <button className="px-4 py-2 border border-dark-border text-dark-text hover:bg-dark-panel rounded-lg text-sm transition-colors">
            ⚙️ Settings
          </button>
        </div>
      </div>

      {/* Quick Schedule Section */}
      <div className="mb-8 p-4 bg-dark-primary border border-dark-border rounded-lg">
        <h3 className="text-lg font-semibold text-dark-text mb-4">📝 Quick Schedule</h3>
        
        {/* Content Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-dark-text mb-2">Post Content</label>
          <textarea 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="4" 
            className="w-full px-3 py-2 bg-dark-panel border border-dark-border rounded-lg text-dark-text placeholder-dark-text-muted focus:ring-2 focus:ring-aifluence-500 focus:border-transparent resize-none" 
            placeholder="Enter your LinkedIn post content here..."
          />
          <div className="flex justify-between items-center mt-2">
            <div className="text-sm text-dark-text-muted">{content.length} characters</div>
            <button 
              onClick={loadFromGenerator}
              className="text-sm text-aifluence-500 hover:text-aifluence-400"
            >
              Load from Generator
            </button>
          </div>
        </div>

        {/* Scheduling Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-dark-text mb-2">Schedule Type</label>
            <select 
              value={scheduleType}
              onChange={(e) => setScheduleType(e.target.value)}
              className="w-full px-3 py-2 bg-dark-panel border border-dark-border rounded-lg text-dark-text focus:ring-2 focus:ring-aifluence-500"
            >
              <option value="optimal">🎯 Optimal Time (Recommended)</option>
              <option value="custom">🕐 Custom Time</option>
              <option value="asap">⚡ Post ASAP</option>
            </select>
          </div>
          {scheduleType === 'custom' && (
            <>
              <div>
                <label className="block text-sm font-medium text-dark-text mb-2">Date</label>
                <input 
                  type="date" 
                  value={customDate}
                  onChange={(e) => setCustomDate(e.target.value)}
                  className="w-full px-3 py-2 bg-dark-panel border border-dark-border rounded-lg text-dark-text focus:ring-2 focus:ring-aifluence-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-text mb-2">Time</label>
                <input 
                  type="time" 
                  value={customTime}
                  onChange={(e) => setCustomTime(e.target.value)}
                  className="w-full px-3 py-2 bg-dark-panel border border-dark-border rounded-lg text-dark-text focus:ring-2 focus:ring-aifluence-500"
                />
              </div>
            </>
          )}
        </div>

        {/* Next Optimal Time Display */}
        {scheduleType === 'optimal' && (
          <div className="mb-4 p-3 bg-aifluence-600/20 border border-aifluence-500/30 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-aifluence-400 rounded-full"></div>
              <span className="text-aifluence-400 font-medium">Next Optimal Time:</span>
              <span className="text-dark-text">Tomorrow at 2:30 PM EST</span>
              <span className="text-xs text-dark-text-muted">(Based on your audience activity)</span>
            </div>
          </div>
        )}

        {/* Schedule Button */}
        <button 
          onClick={handleSchedule}
          disabled={!content.trim()}
          className="w-full py-3 bg-gradient-to-r from-aifluence-600 to-purple-600 hover:from-aifluence-700 hover:to-purple-700 disabled:opacity-50 text-white rounded-lg transition-colors font-medium"
        >
          📅 Schedule Post
        </button>
      </div>

      {/* Scheduled Posts */}
      <div>
        <h3 className="text-lg font-semibold text-dark-text mb-4">📋 Scheduled Posts ({scheduledPosts.length})</h3>
        <div className="space-y-3">
          {scheduledPosts.map((post) => (
            <div key={post.id} className="bg-dark-primary border border-dark-border rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-dark-text mb-2">{post.content}</p>
                  <div className="flex items-center space-x-4 text-sm text-dark-text-muted">
                    <span>📅 {new Date(post.scheduledFor).toLocaleDateString()}</span>
                    <span>🕐 {new Date(post.scheduledFor).toLocaleTimeString()}</span>
                    <span className="px-2 py-1 bg-blue-600/20 text-blue-400 rounded text-xs">LinkedIn</span>
                    <span className="px-2 py-1 bg-green-600/20 text-green-400 rounded text-xs">Scheduled</span>
                  </div>
                </div>
                <div className="flex space-x-2 ml-4">
                  <button className="text-aifluence-500 hover:text-aifluence-400 text-sm">Edit</button>
                  <button className="text-red-400 hover:text-red-300 text-sm">Cancel</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}