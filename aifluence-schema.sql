-- AIfluence Database Schema for Supabase
-- Run this in your Supabase SQL editor to create the tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- AIfluence Users table
CREATE TABLE aifluence_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  plan VARCHAR(20) DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'enterprise')),
  
  -- LinkedIn Integration
  linkedin_connected BOOLEAN DEFAULT false,
  linkedin_profile JSONB DEFAULT '{}',
  linkedin_auth_code TEXT,
  linkedin_connected_at TIMESTAMP WITH TIME ZONE,
  
  -- Posts Storage (JSON array)
  posts JSONB DEFAULT '[]',
  
  -- Usage Tracking
  usage JSONB DEFAULT '{
    "postsGenerated": 0,
    "imagesGenerated": 0,
    "monthlyLimit": 10,
    "resetDate": null
  }',
  
  -- User Preferences
  preferences JSONB DEFAULT '{
    "theme": "dark",
    "notifications": true
  }',
  
  -- API Keys (encrypted)
  claude_api_key_encrypted TEXT,
  openai_api_key_encrypted TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE
);

-- Indexes for better performance
CREATE INDEX idx_aifluence_users_email ON aifluence_users(email);
CREATE INDEX idx_aifluence_users_plan ON aifluence_users(plan);
CREATE INDEX idx_aifluence_users_linkedin ON aifluence_users(linkedin_connected);

-- Row Level Security (RLS)
ALTER TABLE aifluence_users ENABLE ROW LEVEL SECURITY;

-- Users can only access their own data
CREATE POLICY aifluence_users_policy ON aifluence_users
  FOR ALL
  TO authenticated
  USING (auth.uid()::text = id::text);

-- Allow users to register (insert their own record)
CREATE POLICY aifluence_users_insert_policy ON aifluence_users
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to auto-update updated_at
CREATE TRIGGER update_aifluence_users_updated_at 
  BEFORE UPDATE ON aifluence_users
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- AIfluence Posts table (separate table for better performance)
CREATE TABLE aifluence_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES aifluence_users(id) ON DELETE CASCADE,
  
  -- Post Content
  content TEXT NOT NULL,
  topic VARCHAR(200),
  audience VARCHAR(200),
  tone VARCHAR(100),
  variation VARCHAR(100),
  
  -- Media
  media JSONB DEFAULT '{}',
  
  -- Scheduling
  scheduled_at TIMESTAMP WITH TIME ZONE,
  published_at TIMESTAMP WITH TIME ZONE,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published', 'failed')),
  
  -- LinkedIn Integration
  linkedin_post_id VARCHAR(100),
  linkedin_post_url TEXT,
  
  -- Metadata
  metadata JSONB DEFAULT '{}',
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for posts
CREATE INDEX idx_aifluence_posts_user_id ON aifluence_posts(user_id);
CREATE INDEX idx_aifluence_posts_status ON aifluence_posts(status);
CREATE INDEX idx_aifluence_posts_scheduled_at ON aifluence_posts(scheduled_at);
CREATE INDEX idx_aifluence_posts_created_at ON aifluence_posts(created_at);

-- RLS for posts
ALTER TABLE aifluence_posts ENABLE ROW LEVEL SECURITY;

-- Users can only access their own posts
CREATE POLICY aifluence_posts_policy ON aifluence_posts
  FOR ALL
  TO authenticated
  USING (auth.uid()::text = user_id::text);

-- Trigger for posts updated_at
CREATE TRIGGER update_aifluence_posts_updated_at 
  BEFORE UPDATE ON aifluence_posts
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- AIfluence Analytics table
CREATE TABLE aifluence_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES aifluence_users(id) ON DELETE CASCADE,
  
  -- Event tracking
  event_type VARCHAR(50) NOT NULL,
  event_data JSONB DEFAULT '{}',
  
  -- Metrics
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  count INTEGER DEFAULT 1,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for analytics
CREATE INDEX idx_aifluence_analytics_user_id ON aifluence_analytics(user_id);
CREATE INDEX idx_aifluence_analytics_event_type ON aifluence_analytics(event_type);
CREATE INDEX idx_aifluence_analytics_date ON aifluence_analytics(date);
CREATE INDEX idx_aifluence_analytics_user_event_date ON aifluence_analytics(user_id, event_type, date);

-- RLS for analytics
ALTER TABLE aifluence_analytics ENABLE ROW LEVEL SECURITY;

-- Users can only access their own analytics
CREATE POLICY aifluence_analytics_policy ON aifluence_analytics
  FOR ALL
  TO authenticated
  USING (auth.uid()::text = user_id::text);

-- Trigger for analytics updated_at
CREATE TRIGGER update_aifluence_analytics_updated_at 
  BEFORE UPDATE ON aifluence_analytics
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();