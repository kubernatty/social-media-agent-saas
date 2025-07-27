/**
 * Content Templates for Social Media Posts
 * Organized by topic and use case
 */

export const contentTemplates = {
    'ai-readiness': [
        `🚀 {{topic}} for {{audience}}:\n\n✅ Key insight: AI isn't about replacing humans, it's about amplifying potential\n✅ Focus on strategy before technology\n✅ Start small, scale smart\n\nWhat's your experience with AI implementation? Share your thoughts! 👇\n\n#AI #DigitalTransformation #Leadership #Innovation`,
        
        `💡 Thinking about {{topic}}?\n\nHere's what {{audience}} need to know:\n\n🎯 Start with clear business objectives\n🎯 Invest in your team's skills first\n🎯 Measure impact, not just implementation\n🎯 Build trust through transparency\n\nWhat challenges have you faced? Let's discuss!\n\n#ArtificialIntelligence #BusinessStrategy #Leadership`,
        
        `📊 {{topic}} Reality Check:\n\n❌ Common mistake: Technology-first approach\n✅ Better approach: Business-value-first\n\nFor {{audience}}, success means:\n• Clear ROI measurement\n• Employee empowerment\n• Sustainable integration\n• Customer value creation\n\nWhat's your take on this? 💭\n\n#AI #Innovation #Leadership #BusinessTransformation`
    ],
    
    'roi-ai': [
        `💰 {{topic}} - The Numbers Don't Lie:\n\nCompanies implementing AI strategically see:\n📈 25% increase in operational efficiency\n📈 30% faster decision-making\n📈 40% improvement in customer satisfaction\n\nFor {{audience}}, the key is measuring what matters:\n✓ Time saved per process\n✓ Error reduction rates\n✓ Revenue impact\n✓ Employee satisfaction\n\nWhat metrics are you tracking? 📊\n\n#ROI #AI #BusinessMetrics #Leadership`,
        
        `🎯 {{topic}} Strategy:\n\n"The best AI investment isn't in technology—it's in understanding."\n\n{{audience}} who succeed focus on:\n→ Clear problem definition\n→ Realistic timeline expectations\n→ Change management planning\n→ Continuous measurement\n\nROI isn't just financial—it's operational, strategic, and cultural.\n\nHow are you measuring AI success? 💭\n\n#AI #ROI #BusinessStrategy #Innovation`
    ],
    
    'ai-misconceptions': [
        `🤔 {{topic}} - Let's Set the Record Straight:\n\nMyth: "AI will replace all jobs"\nReality: AI augments human capabilities\n\nMyth: "AI is too complex for our business"\nReality: Start small, scale gradually\n\nMyth: "AI is only for tech companies"\nReality: Every industry can benefit\n\n{{audience}}, what AI myths have you encountered?\n\n#AI #Myths #DigitalTransformation #Leadership`,
        
        `🧠 {{topic}} - Common Misunderstandings:\n\nFor {{audience}}, the biggest misconception about AI is that it's:\n❌ A magic solution to all problems\n❌ Something that works perfectly from day one\n❌ A replacement for human judgment\n\n✅ Reality: AI is a powerful tool that requires:\n• Strategic planning\n• Human oversight\n• Continuous improvement\n• Ethical considerations\n\nWhat's your AI reality check? 💭\n\n#AI #BusinessReality #Leadership #Strategy`
    ],
    
    'digital-transformation': [
        `🔄 {{topic}} Insight for {{audience}}:\n\nDigital transformation isn't about technology—it's about people.\n\n🎯 Key success factors:\n• Leadership commitment\n• Cultural readiness\n• Employee engagement\n• Customer focus\n• Iterative approach\n\nThe companies that thrive are those that transform their mindset first, technology second.\n\nWhat's driving your transformation journey?\n\n#DigitalTransformation #Leadership #ChangeManagement #Innovation`,
        
        `💡 {{topic}} Reality:\n\n67% of digital transformations fail. Here's why:\n\n❌ Technology-first approach\n❌ Lack of clear vision\n❌ Poor change management\n❌ Insufficient training\n\n✅ What works for {{audience}}:\n→ Start with business outcomes\n→ Invest in people development\n→ Measure progress continuously\n→ Celebrate small wins\n\nShare your transformation lessons! 👇\n\n#DigitalTransformation #BusinessStrategy #Leadership`
    ]
};

export const hashtagSets = {
    general: ['#Leadership', '#Innovation', '#BusinessStrategy'],
    ai: ['#AI', '#ArtificialIntelligence', '#MachineLearning', '#DigitalTransformation'],
    business: ['#BusinessLeadership', '#ExecutiveInsights', '#StrategicPlanning'],
    tech: ['#Technology', '#TechInnovation', '#DigitalStrategy', '#FutureOfWork']
};

export function getRandomTemplate(category) {
    const templates = contentTemplates[category];
    if (!templates || templates.length === 0) {
        return contentTemplates['ai-readiness'][0]; // fallback
    }
    return templates[Math.floor(Math.random() * templates.length)];
}

export function replaceTemplatePlaceholders(template, variables) {
    let result = template;
    Object.keys(variables).forEach(key => {
        const placeholder = `{{${key}}}`;
        result = result.replace(new RegExp(placeholder, 'g'), variables[key]);
    });
    return result;
}