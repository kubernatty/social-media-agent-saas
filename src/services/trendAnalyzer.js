export class TrendAnalyzer {
    constructor() {
        this.trendHistory = new Map();
    }

    async extractTrends(posts) {
        console.log('📈 Analyzing trends...');
        
        const topicCounts = {};
        const topicEngagement = {};

        posts.forEach(post => {
            const topic = post.topic;
            topicCounts[topic] = (topicCounts[topic] || 0) + 1;
            
            if (!topicEngagement[topic]) {
                topicEngagement[topic] = { likes: 0, comments: 0 };
            }
            
            topicEngagement[topic].likes += post.engagement.likes;
            topicEngagement[topic].comments += post.engagement.comments;
        });

        const trends = Object.keys(topicCounts).map(topic => ({
            name: topic,
            mentions: topicCounts[topic],
            engagement: topicEngagement[topic],
            score: topicCounts[topic] * 10 + topicEngagement[topic].likes + topicEngagement[topic].comments * 3
        })).sort((a, b) => b.score - a.score);

        return trends;
    }
}