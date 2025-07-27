/**
 * Content Generation Utilities
 * Helper functions for content processing and validation
 */

/**
 * Validate generated content
 */
export function validateContent(content) {
    if (!content || typeof content !== 'string') {
        return { valid: false, error: 'Content is empty or invalid' };
    }

    const trimmedContent = content.trim();
    
    if (trimmedContent.length < 50) {
        return { valid: false, error: 'Content too short (minimum 50 characters)' };
    }

    if (trimmedContent.length > 3000) {
        return { valid: false, error: 'Content too long (maximum 3000 characters)' };
    }

    return { valid: true, content: trimmedContent };
}

/**
 * Extract hashtags from content
 */
export function extractHashtags(content) {
    const hashtagRegex = /#[\w\u0590-\u05ff]+/gi;
    const matches = content.match(hashtagRegex);
    return matches ? matches.map(tag => tag.toLowerCase()) : [];
}

/**
 * Count characters in content (excluding hashtags for LinkedIn limit)
 */
export function getContentMetrics(content) {
    const lines = content.split('\n');
    const hashtags = extractHashtags(content);
    const contentWithoutHashtags = content.replace(/#[\w\u0590-\u05ff]+/gi, '').trim();
    
    return {
        totalCharacters: content.length,
        contentCharacters: contentWithoutHashtags.length,
        wordCount: contentWithoutHashtags.split(/\s+/).filter(word => word.length > 0).length,
        lineCount: lines.length,
        hashtagCount: hashtags.length,
        hashtags: hashtags,
        estimatedReadTime: Math.ceil(contentWithoutHashtags.split(/\s+/).length / 200) // ~200 words per minute
    };
}

/**
 * Format content for display
 */
export function formatContentForDisplay(content) {
    return content
        .replace(/\n/g, '<br>')
        .replace(/#([\w\u0590-\u05ff]+)/gi, '<span class="hashtag">#$1</span>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>');
}

/**
 * Clean content for final output
 */
export function cleanContent(content) {
    return content
        .replace(/\s+/g, ' ') // Replace multiple spaces with single space
        .replace(/\n\s*\n\s*\n/g, '\n\n') // Replace multiple newlines with double newlines
        .trim();
}

/**
 * Generate content ID
 */
export function generateContentId(prefix = 'content') {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
}

/**
 * Check content quality score
 */
export function getContentQualityScore(content) {
    let score = 0;
    const factors = [];

    const metrics = getContentMetrics(content);
    
    // Length scoring (optimal 150-500 characters)
    if (metrics.contentCharacters >= 150 && metrics.contentCharacters <= 500) {
        score += 25;
        factors.push('Good length');
    } else if (metrics.contentCharacters >= 100) {
        score += 15;
        factors.push('Acceptable length');
    }

    // Hashtag scoring (2-5 hashtags is optimal)
    if (metrics.hashtagCount >= 2 && metrics.hashtagCount <= 5) {
        score += 20;
        factors.push('Good hashtag usage');
    } else if (metrics.hashtagCount >= 1) {
        score += 10;
        factors.push('Some hashtags');
    }

    // Structure scoring
    if (content.includes('?') || content.includes('!')) {
        score += 15;
        factors.push('Engaging punctuation');
    }

    if (content.match(/\n\n/)) {
        score += 10;
        factors.push('Good paragraph structure');
    }

    // Engagement elements
    if (content.toLowerCase().includes('what') || 
        content.toLowerCase().includes('how') || 
        content.toLowerCase().includes('share') ||
        content.toLowerCase().includes('thoughts')) {
        score += 15;
        factors.push('Engagement prompt');
    }

    // Emoji usage
    const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu;
    if (content.match(emojiRegex)) {
        score += 10;
        factors.push('Visual elements (emojis)');
    }

    // Professional keywords
    const professionalKeywords = ['strategy', 'leadership', 'innovation', 'growth', 'success', 'insights', 'experience'];
    const keywordMatches = professionalKeywords.filter(keyword => 
        content.toLowerCase().includes(keyword)
    );
    if (keywordMatches.length > 0) {
        score += Math.min(keywordMatches.length * 5, 15);
        factors.push('Professional terminology');
    }

    return {
        score: Math.min(score, 100),
        grade: getGrade(score),
        factors: factors,
        suggestions: getImprovementSuggestions(content, metrics, score)
    };
}

/**
 * Get letter grade from score
 */
function getGrade(score) {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
}

/**
 * Get improvement suggestions
 */
function getImprovementSuggestions(content, metrics, score) {
    const suggestions = [];

    if (metrics.contentCharacters < 150) {
        suggestions.push('Consider adding more detail or context to your post');
    }

    if (metrics.hashtagCount === 0) {
        suggestions.push('Add relevant hashtags to increase discoverability');
    } else if (metrics.hashtagCount > 5) {
        suggestions.push('Consider reducing hashtags (3-5 is optimal)');
    }

    if (!content.includes('?') && !content.toLowerCase().includes('share') && 
        !content.toLowerCase().includes('thoughts')) {
        suggestions.push('Add a question or call-to-action to encourage engagement');
    }

    if (!content.match(/\n\n/)) {
        suggestions.push('Break up text into shorter paragraphs for better readability');
    }

    const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu;
    if (!content.match(emojiRegex)) {
        suggestions.push('Consider adding relevant emojis to make the post more visually appealing');
    }

    return suggestions;
}

/**
 * Generate AI prompt for content creation
 */
export function generateAIPrompt(topic, audience, tone, additionalContext = '') {
    const basePrompt = `Create a professional LinkedIn post about "${topic}" targeted at "${audience}" with a "${tone}" tone.

Requirements:
- 150-400 characters for optimal engagement
- Include 3-5 relevant hashtags
- Add a question or call-to-action to encourage engagement
- Use professional language appropriate for LinkedIn
- Include relevant emojis where appropriate
- Structure with clear paragraphs

${additionalContext ? `Additional context: ${additionalContext}` : ''}

Please generate only the post content without any additional explanations or formatting.`;

    return basePrompt;
}

/**
 * Parse mentions from content
 */
export function extractMentions(content) {
    const mentionRegex = /@([a-zA-Z0-9_-]+)/g;
    const matches = content.match(mentionRegex);
    return matches ? matches.map(mention => mention.substring(1)) : [];
}

/**
 * Estimate post performance score based on content analysis
 */
export function estimatePostPerformance(content) {
    const metrics = getContentMetrics(content);
    const quality = getContentQualityScore(content);
    
    let performanceScore = quality.score;
    
    // Adjust based on optimal posting practices
    if (metrics.contentCharacters >= 150 && metrics.contentCharacters <= 300) {
        performanceScore += 5; // Sweet spot for LinkedIn
    }
    
    if (content.includes('?')) {
        performanceScore += 10; // Questions drive engagement
    }
    
    const mentions = extractMentions(content);
    if (mentions.length > 0 && mentions.length <= 2) {
        performanceScore += 5; // Strategic mentions
    }
    
    return {
        score: Math.min(performanceScore, 100),
        expectedEngagement: getExpectedEngagement(performanceScore),
        bestTimeToPost: getBestPostingTime(),
        tips: getPerformanceTips(content, metrics)
    };
}

/**
 * Get expected engagement level
 */
function getExpectedEngagement(score) {
    if (score >= 85) return 'High';
    if (score >= 70) return 'Medium-High';
    if (score >= 55) return 'Medium';
    if (score >= 40) return 'Low-Medium';
    return 'Low';
}

/**
 * Get optimal posting time (simplified)
 */
function getBestPostingTime() {
    const now = new Date();
    const day = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    // Tuesday-Thursday are generally best for LinkedIn
    if (day >= 2 && day <= 4) {
        return 'Within 2 hours (optimal day)';
    } else {
        return 'Tuesday-Thursday 9-11 AM or 1-3 PM';
    }
}

/**
 * Get performance improvement tips
 */
function getPerformanceTips(content, metrics) {
    const tips = [];
    
    if (!content.includes('?')) {
        tips.push('Add a question to increase comments');
    }
    
    if (metrics.hashtagCount < 3) {
        tips.push('Use 3-5 relevant hashtags for better reach');
    }
    
    if (metrics.lineCount < 3) {
        tips.push('Break content into shorter paragraphs');
    }
    
    return tips;
}