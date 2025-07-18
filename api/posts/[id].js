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
    const { id } = req.query;
    
    if (req.method === 'GET') {
      // Get single post
      const { data: post, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return res.status(404).json({ error: 'Post not found' });
        }
        throw error;
      }

      res.json({ post });

    } else if (req.method === 'PUT') {
      // Update post
      const { content, platform, scheduled_at, media_urls, metadata } = req.body;

      // First check if post exists and belongs to user
      const { data: existingPost, error: fetchError } = await supabase
        .from('posts')
        .select('status')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
          return res.status(404).json({ error: 'Post not found' });
        }
        throw fetchError;
      }

      if (existingPost.status === 'published') {
        return res.status(400).json({ error: 'Cannot update published posts' });
      }

      const updateData = {};
      if (content) updateData.content = content;
      if (platform) updateData.platform = platform;
      if (scheduled_at !== undefined) updateData.scheduled_at = scheduled_at;
      if (media_urls) updateData.media_urls = media_urls;
      if (metadata) updateData.metadata = metadata;

      const { data: post, error } = await supabase
        .from('posts')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      res.json({
        message: 'Post updated successfully',
        post
      });

    } else if (req.method === 'DELETE') {
      // Delete post
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      res.json({
        message: 'Post deleted successfully'
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