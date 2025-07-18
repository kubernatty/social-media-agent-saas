import jwt from 'jsonwebtoken';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Auth middleware
function authenticateToken(req) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    throw new Error('Access token required');
  }

  return jwt.verify(token, process.env.JWT_SECRET);
}

export default async function handler(req, res) {
  try {
    const user = authenticateToken(req);
    
    if (req.method === 'GET') {
      // Get all posts for user
      const { page = 1, limit = 20, status, platform } = req.query;
      const offset = (page - 1) * limit;

      let query = supabase
        .from('posts')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .range(offset, offset + parseInt(limit) - 1);

      if (status) query = query.eq('status', status);
      if (platform) query = query.eq('platform', platform);

      const { data: posts, error, count } = await query;

      if (error) throw error;

      res.json({
        posts: posts || [],
        total: count || 0,
        page: parseInt(page),
        pages: Math.ceil((count || 0) / limit)
      });

    } else if (req.method === 'POST') {
      // Create new post
      const { content, platform, scheduled_at, media_urls, metadata } = req.body;

      if (!content || content.trim().length === 0) {
        return res.status(400).json({ error: 'Content is required' });
      }

      const { v4: uuidv4 } = require('uuid');
      const { data: post, error } = await supabase
        .from('posts')
        .insert([
          {
            id: uuidv4(),
            user_id: user.id,
            content,
            platform: platform || 'linkedin',
            scheduled_at: scheduled_at || null,
            media_urls: media_urls || [],
            metadata: metadata || {},
            status: scheduled_at ? 'scheduled' : 'draft'
          }
        ])
        .select()
        .single();

      if (error) throw error;

      res.status(201).json({
        message: 'Post created successfully',
        post
      });

    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }

  } catch (error) {
    console.error('Posts API error:', error);
    if (error.message === 'Access token required') {
      res.status(401).json({ error: 'Access token required' });
    } else if (error.name === 'JsonWebTokenError') {
      res.status(401).json({ error: 'Invalid token' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}