import React from 'react';
import { TrendingUp, Users, Eye, Heart, MessageCircle, Share2, Calendar, Target } from 'lucide-react';

const Dashboard = () => {
  const metrics = {
    totalPosts: 24,
    totalViews: 15420,
    totalEngagement: 1247,
    newFollowers: 89,
    topPost: {
      title: "The Real Truth About AI ROI",
      views: 2340,
      likes: 156,
      comments: 23,
      shares: 12
    }
  };

  const recentPosts = [
    {
      id: 1,
      content: "🎯 Is Your Business Ready for AI? A Quick Assessment...",
      date: "2024-07-10",
      views: 1250,
      likes: 89,
      comments: 12,
      shares: 5,
      engagement: 8.5
    },
    {
      id: 2,
      content: "💰 The Real Truth About AI ROI (It's Not What You Think)...",
      date: "2024-07-08",
      views: 2340,
      likes: 156,
      comments: 23,
      shares: 12,
      engagement: 8.2
    },
    {
      id: 3,
      content: "🤖 5 AI Myths That Cost Businesses Millions...",
      date: "2024-07-05",
      views: 980,
      likes: 67,
      comments: 8,
      shares: 3,
      engagement: 8.0
    }
  ];

  const weeklyGrowth = [
    { day: 'Mon', posts: 3, engagement: 120 },
    { day: 'Tue', posts: 2, engagement: 95 },
    { day: 'Wed', posts: 4, engagement: 180 },
    { day: 'Thu', posts: 3, engagement: 150 },
    { day: 'Fri', posts: 2, engagement: 110 },
    { day: 'Sat', posts: 1, engagement: 45 },
    { day: 'Sun', posts: 1, engagement: 35 }
  ];

  const topTopics = [
    { topic: 'AI Readiness', posts: 8, avgEngagement: 8.3 },
    { topic: 'ROI & Business Value', posts: 6, avgEngagement: 8.7 },
    { topic: 'AI Misconceptions', posts: 5, avgEngagement: 7.9 },
    { topic: 'Implementation Strategy', posts: 5, avgEngagement: 8.1 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Analytics Dashboard</h2>
        <p className="text-slate-400">Track your content performance and engagement</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-slate-400">Total Posts</h3>
            <Calendar className="h-5 w-5 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white">{metrics.totalPosts}</div>
          <div className="text-sm text-green-400">+12% this month</div>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-slate-400">Total Views</h3>
            <Eye className="h-5 w-5 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white">{metrics.totalViews.toLocaleString()}</div>
          <div className="text-sm text-green-400">+18% this month</div>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-slate-400">Engagement</h3>
            <Heart className="h-5 w-5 text-pink-400" />
          </div>
          <div className="text-2xl font-bold text-white">{metrics.totalEngagement.toLocaleString()}</div>
          <div className="text-sm text-green-400">+25% this month</div>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-slate-400">New Followers</h3>
            <Users className="h-5 w-5 text-green-400" />
          </div>
          <div className="text-2xl font-bold text-white">{metrics.newFollowers}</div>
          <div className="text-sm text-green-400">+15% this month</div>
        </div>
      </div>

      {/* Top Performing Post */}
      <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
        <div className="flex items-center space-x-3 mb-4">
          <TrendingUp className="h-6 w-6 text-yellow-400" />
          <h3 className="text-lg font-semibold text-white">Top Performing Post</h3>
        </div>
        
        <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-600 mb-4">
          <h4 className="font-medium text-white mb-2">{metrics.topPost.title}</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <Eye className="h-4 w-4 text-blue-400" />
              <span className="text-slate-300">{metrics.topPost.views} views</span>
            </div>
            <div className="flex items-center space-x-2">
              <Heart className="h-4 w-4 text-pink-400" />
              <span className="text-slate-300">{metrics.topPost.likes} likes</span>
            </div>
            <div className="flex items-center space-x-2">
              <MessageCircle className="h-4 w-4 text-green-400" />
              <span className="text-slate-300">{metrics.topPost.comments} comments</span>
            </div>
            <div className="flex items-center space-x-2">
              <Share2 className="h-4 w-4 text-purple-400" />
              <span className="text-slate-300">{metrics.topPost.shares} shares</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Activity */}
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Weekly Activity</h3>
          <div className="space-y-3">
            {weeklyGrowth.map((day, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="text-slate-300 w-12">{day.day}</div>
                <div className="flex-1 mx-4">
                  <div className="bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                      style={{ width: `${(day.engagement / 200) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-slate-400 text-sm w-16 text-right">
                  {day.engagement} eng.
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Topics */}
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Top Topics</h3>
          <div className="space-y-3">
            {topTopics.map((topic, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                <div>
                  <div className="text-slate-200 font-medium">{topic.topic}</div>
                  <div className="text-slate-400 text-sm">{topic.posts} posts</div>
                </div>
                <div className="text-right">
                  <div className="text-slate-200">{topic.avgEngagement}%</div>
                  <div className="text-slate-400 text-sm">avg. engagement</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Posts Performance */}
      <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Posts Performance</h3>
        <div className="space-y-4">
          {recentPosts.map((post) => (
            <div key={post.id} className="bg-slate-700/30 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <p className="text-slate-200 text-sm line-clamp-2 mb-2">
                    {post.content}
                  </p>
                  <div className="text-xs text-slate-400">
                    Posted on {new Date(post.date).toLocaleDateString()}
                  </div>
                </div>
                <div className="ml-4 text-right">
                  <div className="text-lg font-semibold text-white">{post.engagement}%</div>
                  <div className="text-xs text-slate-400">engagement</div>
                </div>
              </div>
              
              <div className="grid grid-cols-4 gap-4 text-sm">
                <div className="flex items-center space-x-1">
                  <Eye className="h-3 w-3 text-blue-400" />
                  <span className="text-slate-300">{post.views}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Heart className="h-3 w-3 text-pink-400" />
                  <span className="text-slate-300">{post.likes}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MessageCircle className="h-3 w-3 text-green-400" />
                  <span className="text-slate-300">{post.comments}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Share2 className="h-3 w-3 text-purple-400" />
                  <span className="text-slate-300">{post.shares}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Insights */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Target className="h-6 w-6 text-blue-400" />
          <h3 className="text-lg font-semibold text-blue-400">Content Insights</h3>
        </div>
        <ul className="text-slate-300 text-sm space-y-2">
          <li>• Your "AI ROI" content consistently gets the highest engagement</li>
          <li>• Posts published between 9-10 AM perform 23% better</li>
          <li>• Educational content outperforms promotional content by 40%</li>
          <li>• Questions in posts increase comments by 65%</li>
          <li>• Your audience responds well to practical frameworks and assessments</li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;