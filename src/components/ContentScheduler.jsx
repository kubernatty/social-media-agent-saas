import React, { useState } from 'react';
import { Calendar, Clock, Send, Plus, Edit, Trash2, CheckCircle, AlertCircle } from 'lucide-react';

const ContentScheduler = ({ isLinkedInConnected }) => {
  const [scheduledPosts, setScheduledPosts] = useState([
    {
      id: 1,
      content: "🎯 Is Your Business Ready for AI? A Quick Assessment\n\nMany business leaders ask me: \"How do I know if we're ready for AI?\" Here's a simple framework...",
      scheduledDate: "2024-07-15",
      scheduledTime: "09:00",
      status: "scheduled",
      platform: "LinkedIn"
    },
    {
      id: 2,
      content: "💰 The Real Truth About AI ROI (It's Not What You Think)\n\nMost businesses calculate AI ROI wrong...",
      scheduledDate: "2024-07-16",
      scheduledTime: "14:00",
      status: "scheduled",
      platform: "LinkedIn"
    }
  ]);

  const [newPost, setNewPost] = useState({
    content: '',
    scheduledDate: '',
    scheduledTime: '09:00',
    platform: 'LinkedIn'
  });

  const [showNewPostForm, setShowNewPostForm] = useState(false);

  const handleSchedulePost = () => {
    if (!newPost.content || !newPost.scheduledDate) return;

    const post = {
      id: Date.now(),
      ...newPost,
      status: 'scheduled'
    };

    setScheduledPosts([...scheduledPosts, post]);
    setNewPost({
      content: '',
      scheduledDate: '',
      scheduledTime: '09:00',
      platform: 'LinkedIn'
    });
    setShowNewPostForm(false);
  };

  const handleDeletePost = (id) => {
    setScheduledPosts(scheduledPosts.filter(post => post.id !== id));
  };

  const handlePostNow = (post) => {
    // In a real app, this would make an API call to LinkedIn
    setScheduledPosts(scheduledPosts.map(p => 
      p.id === post.id ? { ...p, status: 'posted' } : p
    ));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'text-blue-400 bg-blue-500/20';
      case 'posted': return 'text-green-400 bg-green-500/20';
      case 'failed': return 'text-red-400 bg-red-500/20';
      default: return 'text-slate-400 bg-slate-500/20';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'scheduled': return Clock;
      case 'posted': return CheckCircle;
      case 'failed': return AlertCircle;
      default: return Clock;
    }
  };

  if (!isLinkedInConnected) {
    return (
      <div className="text-center py-12">
        <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-xl max-w-md mx-auto">
          <AlertCircle className="h-12 w-12 text-orange-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-orange-400 mb-2">LinkedIn Not Connected</h3>
          <p className="text-slate-400 text-sm">
            Please connect your LinkedIn account first to use the content scheduler.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Content Scheduler</h2>
          <p className="text-slate-400">Schedule and manage your LinkedIn posts</p>
        </div>
        <button
          onClick={() => setShowNewPostForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:scale-105 transition-transform"
        >
          <Plus className="h-4 w-4" />
          <span>Schedule Post</span>
        </button>
      </div>

      {/* New Post Form */}
      {showNewPostForm && (
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Schedule New Post</h3>
            <button
              onClick={() => setShowNewPostForm(false)}
              className="text-slate-400 hover:text-slate-200"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Content
              </label>
              <textarea
                value={newPost.content}
                onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                placeholder="Enter your post content or paste generated content..."
                className="w-full h-32 px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={newPost.scheduledDate}
                  onChange={(e) => setNewPost({...newPost, scheduledDate: e.target.value})}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Time
                </label>
                <input
                  type="time"
                  value={newPost.scheduledTime}
                  onChange={(e) => setNewPost({...newPost, scheduledTime: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Platform
                </label>
                <select
                  value={newPost.platform}
                  onChange={(e) => setNewPost({...newPost, platform: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white"
                >
                  <option value="LinkedIn">LinkedIn</option>
                </select>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleSchedulePost}
                disabled={!newPost.content || !newPost.scheduledDate}
                className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Schedule Post
              </button>
              <button
                onClick={() => setShowNewPostForm(false)}
                className="px-6 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Scheduled Posts */}
      <div className="space-y-4">
        {scheduledPosts.length === 0 ? (
          <div className="text-center py-12 bg-slate-800/30 rounded-xl border border-slate-700">
            <Calendar className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-400 mb-2">No Scheduled Posts</h3>
            <p className="text-slate-500">
              Schedule your first post to get started
            </p>
          </div>
        ) : (
          scheduledPosts.map((post) => {
            const StatusIcon = getStatusIcon(post.status);
            return (
              <div key={post.id} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(post.status)}`}>
                      <div className="flex items-center space-x-1">
                        <StatusIcon className="h-3 w-3" />
                        <span>{post.status.charAt(0).toUpperCase() + post.status.slice(1)}</span>
                      </div>
                    </div>
                    <div className="text-sm text-slate-400">
                      {post.platform}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {post.status === 'scheduled' && (
                      <>
                        <button
                          onClick={() => handlePostNow(post)}
                          className="flex items-center space-x-1 px-3 py-1 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors text-sm"
                        >
                          <Send className="h-3 w-3" />
                          <span>Post Now</span>
                        </button>
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="flex items-center space-x-1 px-3 py-1 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors text-sm"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center space-x-4 text-sm text-slate-400 mb-2">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(post.scheduledDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{post.scheduledTime}</span>
                    </div>
                  </div>
                  
                  <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-600">
                    <p className="text-slate-200 text-sm whitespace-pre-wrap line-clamp-4">
                      {post.content}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Quick Tips */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-blue-400 mb-3">Scheduling Tips</h3>
        <ul className="text-slate-300 text-sm space-y-1">
          <li>• Best posting times for LinkedIn: 9-10 AM and 12-1 PM on weekdays</li>
          <li>• Schedule posts at least 30 minutes in advance</li>
          <li>• Consistent posting (3-5 times per week) builds better engagement</li>
          <li>• Educational content performs best in the morning hours</li>
        </ul>
      </div>
    </div>
  );
};

export default ContentScheduler;