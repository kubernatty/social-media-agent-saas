export default function ContentAnalytics() {
  const analyticsData = {
    totalPosts: 42,
    totalViews: 15847,
    totalEngagement: 892,
    engagementRate: 5.6,
    topPerformingPost: "AI Implementation Strategy for Modern Enterprises",
    recentPosts: [
      { id: 1, title: "AI Implementation Strategy", views: 2847, likes: 156, comments: 23, shares: 12 },
      { id: 2, title: "Digital Transformation Trends", views: 1923, likes: 98, comments: 15, shares: 8 },
      { id: 3, title: "Leadership in the AI Era", views: 3156, likes: 201, comments: 34, shares: 18 }
    ]
  };

  return (
    <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-dark-text">Content Analytics</h2>
        <div className="flex space-x-3">
          <select className="px-3 py-2 bg-dark-primary border border-dark-border rounded-lg text-dark-text text-sm">
            <option>Last 30 days</option>
            <option>Last 7 days</option>
            <option>Last 90 days</option>
          </select>
          <button className="px-4 py-2 bg-aifluence-600 hover:bg-aifluence-700 text-white rounded-lg text-sm transition-colors">
            📊 Export Report
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-dark-primary border border-dark-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-dark-text-muted">Total Posts</p>
              <p className="text-2xl font-bold text-dark-text">{analyticsData.totalPosts}</p>
            </div>
            <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
              📝
            </div>
          </div>
          <div className="mt-2 flex items-center space-x-1">
            <span className="text-green-400 text-sm">+12%</span>
            <span className="text-dark-text-muted text-sm">vs last month</span>
          </div>
        </div>

        <div className="bg-dark-primary border border-dark-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-dark-text-muted">Total Views</p>
              <p className="text-2xl font-bold text-dark-text">{analyticsData.totalViews.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center">
              👀
            </div>
          </div>
          <div className="mt-2 flex items-center space-x-1">
            <span className="text-green-400 text-sm">+24%</span>
            <span className="text-dark-text-muted text-sm">vs last month</span>
          </div>
        </div>

        <div className="bg-dark-primary border border-dark-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-dark-text-muted">Total Engagement</p>
              <p className="text-2xl font-bold text-dark-text">{analyticsData.totalEngagement}</p>
            </div>
            <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center">
              💬
            </div>
          </div>
          <div className="mt-2 flex items-center space-x-1">
            <span className="text-green-400 text-sm">+18%</span>
            <span className="text-dark-text-muted text-sm">vs last month</span>
          </div>
        </div>

        <div className="bg-dark-primary border border-dark-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-dark-text-muted">Engagement Rate</p>
              <p className="text-2xl font-bold text-dark-text">{analyticsData.engagementRate}%</p>
            </div>
            <div className="w-12 h-12 bg-yellow-600/20 rounded-lg flex items-center justify-center">
              📈
            </div>
          </div>
          <div className="mt-2 flex items-center space-x-1">
            <span className="text-green-400 text-sm">+2.1%</span>
            <span className="text-dark-text-muted text-sm">vs last month</span>
          </div>
        </div>
      </div>

      {/* Top Performing Post */}
      <div className="mb-8 p-4 bg-gradient-to-r from-aifluence-600/20 to-purple-600/20 border border-aifluence-500/30 rounded-lg">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-3 h-3 bg-aifluence-400 rounded-full"></div>
          <span className="text-aifluence-400 font-medium">🏆 Top Performing Post This Month</span>
        </div>
        <p className="text-dark-text font-semibold">{analyticsData.topPerformingPost}</p>
        <div className="flex items-center space-x-6 mt-3 text-sm text-dark-text-muted">
          <span>👀 3,247 views</span>
          <span>❤️ 234 likes</span>
          <span>💬 45 comments</span>
          <span>🔄 28 shares</span>
        </div>
      </div>

      {/* Recent Posts Performance */}
      <div>
        <h3 className="text-lg font-semibold text-dark-text mb-4">📊 Recent Posts Performance</h3>
        <div className="bg-dark-primary border border-dark-border rounded-lg overflow-hidden">
          <div className="grid grid-cols-6 gap-4 p-4 border-b border-dark-border text-sm font-medium text-dark-text-muted">
            <span>Post Title</span>
            <span>Views</span>
            <span>Likes</span>
            <span>Comments</span>
            <span>Shares</span>
            <span>Actions</span>
          </div>
          {analyticsData.recentPosts.map((post) => (
            <div key={post.id} className="grid grid-cols-6 gap-4 p-4 border-b border-dark-border last:border-b-0 text-sm">
              <span className="text-dark-text font-medium">{post.title}</span>
              <span className="text-dark-text">{post.views.toLocaleString()}</span>
              <span className="text-dark-text">{post.likes}</span>
              <span className="text-dark-text">{post.comments}</span>
              <span className="text-dark-text">{post.shares}</span>
              <div className="flex space-x-2">
                <button className="text-aifluence-500 hover:text-aifluence-400">View</button>
                <button className="text-dark-text-muted hover:text-dark-text">Analyze</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}