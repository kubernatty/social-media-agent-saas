"""
Template Library Streamlit Component
Clean, modern UI for browsing and selecting LinkedIn post templates
"""

import streamlit as st
import json
import sys
import os
from typing import Dict, List, Optional

# Import the template store
sys.path.append(os.path.dirname(__file__))

# Template data and logic (Python version of templateStore.js)
class TemplateStore:
    """Python version of the Template Store"""
    
    TEMPLATE_CATEGORIES = {
        "Personal Story": {
            "name": "Personal Story",
            "description": "Share personal experiences and transformations",
            "tags": ["inspirational", "authentic", "engagement"],
            "icon": "👤",
            "color": "#3B82F6"
        },
        "Lessons Learned": {
            "name": "Lessons Learned", 
            "description": "Share professional insights and key learnings",
            "tags": ["educational", "wisdom", "professional"],
            "icon": "💡",
            "color": "#10B981"
        },
        "Industry Insights": {
            "name": "Industry Insights",
            "description": "Share industry trends and expert analysis", 
            "tags": ["technical", "analytical", "thought-leadership"],
            "icon": "📊",
            "color": "#8B5CF6"
        },
        "Career Advice": {
            "name": "Career Advice",
            "description": "Provide guidance for professional development",
            "tags": ["educational", "mentoring", "growth"],
            "icon": "🚀",
            "color": "#F59E0B"
        },
        "Leadership": {
            "name": "Leadership",
            "description": "Leadership principles and management insights",
            "tags": ["professional", "management", "inspiration"],
            "icon": "👑",
            "color": "#EF4444"
        },
        "Success Stories": {
            "name": "Success Stories",
            "description": "Share achievements and case studies",
            "tags": ["inspirational", "proof", "achievement"],
            "icon": "🏆",
            "color": "#06B6D4"
        },
        "Motivation": {
            "name": "Motivation",
            "description": "Inspire and motivate your audience",
            "tags": ["inspirational", "engagement", "energy"],
            "icon": "⚡",
            "color": "#EC4899"
        },
        "Business Strategy": {
            "name": "Business Strategy",
            "description": "Strategic insights and business analysis",
            "tags": ["technical", "analytical", "strategic"],
            "icon": "🎯",
            "color": "#6366F1"
        },
        "Technology Trends": {
            "name": "Technology Trends",
            "description": "Tech insights and digital transformation",
            "tags": ["technical", "innovation", "future"],
            "icon": "🔬",
            "color": "#059669"
        },
        "Team Building": {
            "name": "Team Building",
            "description": "Team dynamics and collaboration insights",
            "tags": ["professional", "collaboration", "culture"],
            "icon": "🤝",
            "color": "#DC2626"
        }
    }
    
    TEMPLATE_STRUCTURES = {
        "Personal Story": [
            {
                "id": "ps_001",
                "title": "Challenge to Success Journey",
                "structure": "Three years ago, I [insert challenge]. Today, I [insert current state]. Here's what I learned: [insert lesson]. The key insight: [insert insight]. What challenges have shaped your career?",
                "placeholders": ["challenge", "current state", "lesson", "insight"],
                "engagement": "High",
                "length": "Medium",
                "hashtags": "#PersonalGrowth #CareerJourney #Lessons",
                "preview": "Share your transformation story from struggle to success..."
            },
            {
                "id": "ps_002", 
                "title": "Belief Transformation",
                "structure": "I used to believe [insert old belief]. Then [insert pivotal moment] happened. Now I understand that [insert new perspective]. This shift changed everything: [insert impact]. Sometimes our biggest assumptions need questioning.",
                "placeholders": ["old belief", "pivotal moment", "new perspective", "impact"],
                "engagement": "High",
                "length": "Medium",
                "hashtags": "#Mindset #Growth #Transformation",
                "preview": "Tell the story of how your perspective fundamentally changed..."
            },
            {
                "id": "ps_003",
                "title": "Moment of Realization",
                "structure": "The moment I realized [insert realization] was when [insert situation]. It felt [insert emotion], but it taught me [insert lesson]. Now I approach [insert area] completely differently: [insert new approach].",
                "placeholders": ["realization", "situation", "emotion", "lesson", "area", "new approach"],
                "engagement": "Medium",
                "length": "Long",
                "hashtags": "#PersonalDevelopment #Lessons #Growth",
                "preview": "Share a pivotal moment that changed your approach..."
            },
            {
                "id": "ps_004",
                "title": "Failure to Learning",
                "structure": "My biggest failure was [insert failure]. I felt [insert emotion] and wanted to [insert initial reaction]. Instead, I [insert what you did]. The result? [insert outcome]. Failure isn't the opposite of success—it's part of it.",
                "placeholders": ["failure", "emotion", "initial reaction", "what you did", "outcome"],
                "engagement": "High",
                "length": "Medium",
                "hashtags": "#Resilience #FailureToSuccess #Growth",
                "preview": "Turn your biggest setback into a learning story..."
            },
            {
                "id": "ps_005",
                "title": "Overcoming Limitations",
                "structure": "Growing up, I was told [insert limiting belief]. For years, I [insert how it affected you]. Then I met [insert person/situation] who showed me [insert new perspective]. Today, I [insert current state]. Your background doesn't define your future.",
                "placeholders": ["limiting belief", "how it affected you", "person/situation", "new perspective", "current state"],
                "engagement": "High",
                "length": "Long",
                "hashtags": "#Inspiration #OvercomingLimits #Success",
                "preview": "Share how you overcame limiting beliefs about yourself..."
            },
            # Add more Personal Story templates...
            {
                "id": "ps_006",
                "title": "Risk Taking Story",
                "structure": "Last [insert timeframe], I took a risk: [insert risk]. People said [insert criticism]. My family worried about [insert concern]. But I knew [insert conviction]. The outcome? [insert result]. Sometimes you have to bet on yourself.",
                "placeholders": ["timeframe", "risk", "criticism", "concern", "conviction", "result"],
                "engagement": "Medium",
                "length": "Long",
                "hashtags": "#TakingRisks #Entrepreneurship #Courage",
                "preview": "Tell about a time you took a leap of faith..."
            },
            {
                "id": "ps_007",
                "title": "Difficult Conversation Impact",
                "structure": "The hardest conversation I ever had was [insert situation]. I had to [insert what you had to do]. It was difficult because [insert why]. But it led to [insert positive outcome]. Difficult conversations create breakthrough moments.",
                "placeholders": ["situation", "what you had to do", "why", "positive outcome"],
                "engagement": "Medium",
                "length": "Medium",
                "hashtags": "#Courage #Communication #Leadership",
                "preview": "Share how a tough conversation led to positive change..."
            },
            {
                "id": "ps_008",
                "title": "Memorable Learning Moment",
                "structure": "I'll never forget [insert memorable moment]. It was [insert context]. In that moment, I learned [insert lesson]. This experience shaped how I [insert impact on behavior]. Some lessons can only be learned through experience.",
                "placeholders": ["memorable moment", "context", "lesson", "impact on behavior"],
                "engagement": "Medium",
                "length": "Medium",
                "hashtags": "#LifeLessons #Wisdom #Experience",
                "preview": "Share an unforgettable moment that taught you something..."
            },
            {
                "id": "ps_009",
                "title": "Unique Journey Celebration",
                "structure": "When I started [insert beginning], I had [insert initial state]. Everyone around me [insert others' situation]. But I believed [insert belief]. After [insert timeframe], I [insert achievement]. Your journey is unique—embrace it.",
                "placeholders": ["beginning", "initial state", "others' situation", "belief", "timeframe", "achievement"],
                "engagement": "Medium",
                "length": "Long",
                "hashtags": "#Authenticity #Journey #Success",
                "preview": "Celebrate what makes your path different from others..."
            },
            {
                "id": "ps_010",
                "title": "Mentorship and Wisdom",
                "structure": "The person who changed my perspective was [insert person]. They told me [insert advice/insight]. At first, I [insert initial reaction]. But over time, I realized [insert realization]. This wisdom now guides [insert how it guides you].",
                "placeholders": ["person", "advice/insight", "initial reaction", "realization", "how it guides you"],
                "engagement": "High",
                "length": "Medium",
                "hashtags": "#Mentorship #WisdomShared #Growth",
                "preview": "Honor someone who shaped your thinking..."
            }
        ],
        
        "Lessons Learned": [
            {
                "id": "ll_001",
                "title": "Top Professional Lessons",
                "structure": "After [insert timeframe] in [insert field/role], here are the 3 most important lessons I've learned: 1) [insert lesson 1] 2) [insert lesson 2] 3) [insert lesson 3]. Which of these resonates most with your experience?",
                "placeholders": ["timeframe", "field/role", "lesson 1", "lesson 2", "lesson 3"],
                "engagement": "High",
                "length": "Medium",
                "hashtags": "#Leadership #Experience #Lessons",
                "preview": "Share your top 3 professional lessons learned..."
            },
            {
                "id": "ll_002",
                "title": "Most Valuable Mistake",
                "structure": "The mistake that taught me the most was [insert mistake]. I thought [insert wrong assumption]. The reality was [insert what actually happened]. Now I always [insert new approach]. What's the most valuable mistake you've made?",
                "placeholders": ["mistake", "wrong assumption", "what actually happened", "new approach"],
                "engagement": "High",
                "length": "Medium",
                "hashtags": "#LearningFromFailure #Growth #Mistakes",
                "preview": "Turn your biggest mistake into a teaching moment..."
            },
            # Add more Lessons Learned templates (abbreviated for space)
        ],
        
        "Career Advice": [
            {
                "id": "ca_001",
                "title": "Hidden Career Advice",
                "structure": "The career advice no one gives you: [insert advice]. Most people focus on [insert common focus]. But the real career accelerator is [insert real accelerator]. I learned this when [insert learning moment]. Apply this to [insert application].",
                "placeholders": ["advice", "common focus", "real accelerator", "learning moment", "application"],
                "engagement": "High",
                "length": "Medium",
                "hashtags": "#CareerGrowth #ProfessionalDevelopment #Advice",
                "preview": "Share career advice that's not commonly given..."
            },
            # More career advice templates...
        ]
        
        # Continue for other categories...
    }
    
    @classmethod
    def get_categories(cls):
        """Get all available categories"""
        return [{"id": key, **value} for key, value in cls.TEMPLATE_CATEGORIES.items()]
    
    @classmethod
    def get_templates_by_category(cls, category_id):
        """Get templates by category"""
        templates = cls.TEMPLATE_STRUCTURES.get(category_id, [])
        return [
            {**template, "category": category_id, "categoryInfo": cls.TEMPLATE_CATEGORIES.get(category_id, {})}
            for template in templates
        ]
    
    @classmethod
    def get_template(cls, category_id, template_index):
        """Get specific template"""
        templates = cls.TEMPLATE_STRUCTURES.get(category_id, [])
        if 0 <= template_index < len(templates):
            return {
                **templates[template_index],
                "category": category_id,
                "categoryInfo": cls.TEMPLATE_CATEGORIES.get(category_id, {}),
                "index": template_index
            }
        return None
    
    @classmethod
    def search_templates(cls, keyword, filter_tags=None):
        """Search templates by keyword"""
        results = []
        search_term = keyword.lower()
        
        for category_id, templates in cls.TEMPLATE_STRUCTURES.items():
            category = cls.TEMPLATE_CATEGORIES[category_id]
            
            # Filter by tags if provided
            if filter_tags:
                has_matching_tag = any(tag.lower() in [t.lower() for t in category["tags"]] for tag in filter_tags)
                if not has_matching_tag:
                    continue
            
            for i, template in enumerate(templates):
                searchable_text = f"{template['title']} {template['preview']} {template['structure']}".lower()
                if search_term in searchable_text:
                    results.append({
                        **template,
                        "category": category_id,
                        "categoryInfo": category,
                        "index": i
                    })
        
        return results
    
    @classmethod
    def get_all_tags(cls):
        """Get all available tags"""
        all_tags = set()
        for category in cls.TEMPLATE_CATEGORIES.values():
            all_tags.update(category["tags"])
        return sorted(list(all_tags))

def render_template_library():
    """Main Streamlit component for template library"""
    
    # Initialize session state
    if 'selected_template' not in st.session_state:
        st.session_state.selected_template = None
    if 'custom_placeholders' not in st.session_state:
        st.session_state.custom_placeholders = {}
    if 'redirect_to_generator' not in st.session_state:
        st.session_state.redirect_to_generator = False
    
    # Header
    st.title("📚 LinkedIn Template Library")
    
    # Statistics
    categories = TemplateStore.get_categories()
    total_templates = sum(len(TemplateStore.get_templates_by_category(cat["id"])) for cat in categories)
    
    st.markdown(f"""
    <div style="background: linear-gradient(90deg, #3B82F6 0%, #8B5CF6 100%); padding: 1.5rem; border-radius: 1rem; margin-bottom: 2rem;">
        <h3 style="color: white; margin: 0;">🚀 {total_templates} Professional Templates</h3>
        <p style="color: rgba(255,255,255,0.9); margin: 0.5rem 0 0 0;">
            Choose from {len(categories)} categories of expertly crafted LinkedIn post templates
        </p>
    </div>
    """, unsafe_allow_html=True)
    
    # Search and Filter Controls
    col1, col2, col3 = st.columns([2, 1, 1])
    
    with col1:
        search_term = st.text_input("🔍 Search templates", placeholder="Enter keywords...")
    
    with col2:
        category_options = ["All Categories"] + [f"{cat['icon']} {cat['name']}" for cat in categories]
        selected_category_display = st.selectbox("📂 Category", category_options)
        
        # Extract actual category ID
        if selected_category_display == "All Categories":
            selected_category = None
        else:
            selected_category = selected_category_display.split(" ", 1)[1]  # Remove emoji
    
    with col3:
        all_tags = TemplateStore.get_all_tags()
        selected_tags = st.multiselect("🏷️ Tags", all_tags)
    
    # Get filtered templates
    if search_term:
        filtered_templates = TemplateStore.search_templates(search_term, selected_tags if selected_tags else None)
    elif selected_category:
        category_id = next((cat["id"] for cat in categories if cat["name"] == selected_category), None)
        if category_id:
            filtered_templates = TemplateStore.get_templates_by_category(category_id)
        else:
            filtered_templates = []
    else:
        # Show all templates from all categories
        filtered_templates = []
        for cat in categories[:5]:  # Limit to first 5 categories for performance
            filtered_templates.extend(TemplateStore.get_templates_by_category(cat["id"])[:2])  # 2 per category
    
    # Results header
    st.markdown(f"**Found {len(filtered_templates)} templates**")
    
    if filtered_templates:
        # Display templates in a grid
        for i in range(0, len(filtered_templates), 2):
            col1, col2 = st.columns(2)
            
            # Template 1
            if i < len(filtered_templates):
                template = filtered_templates[i]
                with col1:
                    render_template_card(template, key=f"template_{i}")
            
            # Template 2
            if i + 1 < len(filtered_templates):
                template = filtered_templates[i + 1]
                with col2:
                    render_template_card(template, key=f"template_{i+1}")
    else:
        st.info("No templates found matching your criteria. Try adjusting your search or filters.")
    
    # Handle template selection modal
    if st.session_state.selected_template:
        render_customization_modal()
    
    # Handle redirect to generator
    if st.session_state.redirect_to_generator:
        if st.session_state.selected_template.get('action') == 'load_into_generator':
            st.success("🔄 Template loaded into main generator! Check the generator interface above.")
        else:
            st.success("🎯 Template selected! Redirecting to AI Content Generator...")
        st.session_state.redirect_to_generator = False
        # In a real app, you would change tabs/pages here
        return st.session_state.selected_template

def render_template_card(template, key):
    """Render individual template card"""
    
    # Card container with styling
    with st.container():
        st.markdown(f"""
        <div style="
            border: 1px solid #e5e7eb; 
            border-radius: 1rem; 
            padding: 1.5rem; 
            margin-bottom: 1rem; 
            background: white;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        ">
            <div style="display: flex; align-items: center; margin-bottom: 1rem;">
                <span style="font-size: 1.5rem; margin-right: 0.5rem;">{template['categoryInfo']['icon']}</span>
                <span style="color: #6b7280; font-size: 0.875rem; font-weight: 500;">
                    {template['categoryInfo']['name']}
                </span>
                {f'<span style="margin-left: auto; background: #10b981; color: white; padding: 0.25rem 0.5rem; border-radius: 9999px; font-size: 0.75rem;">High Engagement</span>' if template['engagement'] == 'High' else ''}
            </div>
            
            <h4 style="margin: 0 0 0.5rem 0; font-weight: 600; color: #111827;">
                {template['title']}
            </h4>
            
            <p style="color: #6b7280; font-size: 0.875rem; margin-bottom: 1rem; line-height: 1.5;">
                {template['preview']}
            </p>
            
            <div style="
                background: #f9fafb; 
                padding: 1rem; 
                border-radius: 0.5rem; 
                margin-bottom: 1rem;
                font-family: monospace;
                font-size: 0.875rem;
                color: #374151;
                line-height: 1.6;
            ">
                {template['structure'][:150]}{'...' if len(template['structure']) > 150 else ''}
            </div>
            
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; font-size: 0.75rem; color: #6b7280;">
                <span>{len(template['placeholders'])} placeholders</span>
                <span>{template['length']} length</span>
            </div>
            
            <div style="margin-bottom: 1rem;">
                {' '.join([f'<span style="background: #dbeafe; color: #1e40af; padding: 0.25rem 0.5rem; border-radius: 9999px; font-size: 0.75rem; margin-right: 0.25rem;">{tag}</span>' for tag in template['categoryInfo']['tags'][:2]])}
            </div>
        </div>
        """, unsafe_allow_html=True)
        
        # Action buttons
        # Primary action - Load into Generator
        if st.button("🔄 Load into Generator", key=f"load_{key}", use_container_width=True, type="primary"):
            st.session_state.selected_template = template
            st.session_state.selected_template['action'] = 'load_into_generator'
            st.session_state.redirect_to_generator = True
            st.experimental_rerun()
        
        # Secondary actions
        col1, col2 = st.columns(2)
        
        with col1:
            if st.button("✏️ Customize", key=f"customize_{key}", use_container_width=True):
                st.session_state.selected_template = template
                st.experimental_rerun()
        
        with col2:
            if st.button("🚀 Use Template", key=f"use_{key}", use_container_width=True):
                st.session_state.selected_template = template
                st.session_state.redirect_to_generator = True
                st.experimental_rerun()

def render_customization_modal():
    """Render template customization modal"""
    template = st.session_state.selected_template
    
    st.markdown("---")
    st.subheader("✏️ Customize Template")
    
    # Template info
    col1, col2 = st.columns([3, 1])
    
    with col1:
        st.markdown(f"**{template['title']}**")
        st.markdown(f"*{template['preview']}*")
    
    with col2:
        if st.button("❌ Close", type="secondary"):
            st.session_state.selected_template = None
            st.experimental_rerun()
    
    # Template preview
    st.markdown("**Template Structure:**")
    st.code(template['structure'], language="text")
    
    # Placeholder inputs
    st.markdown("**Fill in the placeholders:**")
    
    custom_values = {}
    for placeholder in template['placeholders']:
        custom_values[placeholder] = st.text_input(
            f"📝 {placeholder.title()}:",
            key=f"placeholder_{placeholder}",
            placeholder=f"Enter {placeholder}..."
        )
    
    # Preview with filled values
    if any(custom_values.values()):
        st.markdown("**Preview with your values:**")
        preview_text = template['structure']
        for placeholder, value in custom_values.items():
            if value:
                preview_text = preview_text.replace(f"[insert {placeholder}]", f"**{value}**")
        
        st.markdown(f"""
        <div style="background: #f0f9ff; padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #3b82f6;">
            {preview_text}
        </div>
        """, unsafe_allow_html=True)
    
    # Action buttons
    # Primary action - Load into Main Generator
    if st.button("🔄 Load into Main Generator", use_container_width=True, type="primary"):
        st.session_state.selected_template['action'] = 'load_into_generator'
        st.session_state.selected_template['customPlaceholders'] = custom_values
        st.session_state.custom_placeholders = custom_values
        st.session_state.redirect_to_generator = True
        st.experimental_rerun()
    
    # Secondary actions
    col1, col2 = st.columns(2)
    
    with col1:
        if st.button("📄 Use Empty Template", use_container_width=True):
            st.session_state.custom_placeholders = {}
            st.session_state.redirect_to_generator = True
            st.experimental_rerun()
    
    with col2:
        if st.button("🎯 Use with Custom Values", use_container_width=True):
            st.session_state.custom_placeholders = custom_values
            st.session_state.redirect_to_generator = True
            st.experimental_rerun()

# Main function for integration
def main():
    """Main function for standalone use"""
    st.set_page_config(
        page_title="LinkedIn Template Library",
        page_icon="📚",
        layout="wide",
        initial_sidebar_state="collapsed"
    )
    
    # Custom CSS for better styling
    st.markdown("""
    <style>
    .stButton > button {
        width: 100%;
        border-radius: 0.5rem;
        border: 1px solid #d1d5db;
        transition: all 0.2s;
    }
    .stButton > button:hover {
        border-color: #3b82f6;
        color: #3b82f6;
    }
    .stSelectbox > div > div {
        border-radius: 0.5rem;
    }
    .stTextInput > div > div > input {
        border-radius: 0.5rem;
    }
    .stMultiSelect > div > div {
        border-radius: 0.5rem;
    }
    </style>
    """, unsafe_allow_html=True)
    
    selected_template = render_template_library()
    
    if selected_template:
        st.sidebar.success("Template Selected!")
        st.sidebar.json(selected_template)

if __name__ == "__main__":
    main()