const express = require('express');
const { body, validationResult } = require('express-validator');
const { supabase } = require('../config/supabase');
const { authenticateToken, requirePlan } = require('../middleware/auth');

const router = express.Router();

// Get all posts for user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 20, status, platform } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('posts')
      .select('*', { count: 'exact' })
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + parseInt(limit) - 1);

    if (status) query = query.eq('status', status);
    if (platform) query = query.eq('platform', platform);

    const { data: posts, error, count } = await query;

    if (error) {
      throw error;
    }

    res.json({
      posts: posts || [],
      total: count || 0,
      page: parseInt(page),
      pages: Math.ceil((count || 0) / limit)
    });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ error: 'Failed to get posts' });
  }
});

// Get single post
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { data: post, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Post not found' });
      }
      throw error;
    }

    res.json({ post });
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({ error: 'Failed to get post' });
  }
});

// Create new post
router.post('/', authenticateToken, [
  body('content').trim().isLength({ min: 1, max: 3000 }),
  body('platform').optional().isIn(['linkedin', 'twitter', 'facebook']),
  body('scheduled_at').optional().isISO8601(),
  body('media_urls').optional().isArray()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { content, platform, scheduled_at, media_urls, metadata } = req.body;
    const { v4: uuidv4 } = require('uuid');

    const { data: post, error } = await supabase
      .from('posts')
      .insert([
        {
          id: uuidv4(),
          user_id: req.user.id,
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

    if (error) {
      throw error;
    }

    console.log(`User created post: ${req.user.email}`);

    res.status(201).json({
      message: 'Post created successfully',
      post
    });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// Update post
router.put('/:id', authenticateToken, [
  body('content').optional().trim().isLength({ min: 1, max: 3000 }),
  body('platform').optional().isIn(['linkedin', 'twitter', 'facebook']),
  body('scheduled_at').optional().isISO8601(),
  body('media_urls').optional().isArray()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    // First check if post exists and belongs to user
    const { data: existingPost, error: fetchError } = await supabase
      .from('posts')
      .select('status')
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
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

    const { content, platform, scheduled_at, media_urls, metadata } = req.body;
    const updateData = {};

    if (content) updateData.content = content;
    if (platform) updateData.platform = platform;
    if (scheduled_at !== undefined) updateData.scheduled_at = scheduled_at;
    if (media_urls) updateData.media_urls = media_urls;
    if (metadata) updateData.metadata = metadata;

    const { data: post, error } = await supabase
      .from('posts')
      .update(updateData)
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    console.log(`User updated post: ${req.user.email}`);

    res.json({
      message: 'Post updated successfully',
      post
    });
  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({ error: 'Failed to update post' });
  }
});

// Delete post
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', req.user.id);

    if (error) {
      throw error;
    }

    console.log(`User deleted post: ${req.user.email}`);

    res.json({
      message: 'Post deleted successfully'
    });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

// Publish post immediately
router.post('/:id/publish', authenticateToken, async (req, res) => {
  try {
    // First check if post exists and belongs to user
    const { data: existingPost, error: fetchError } = await supabase
      .from('posts')
      .select('status')
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return res.status(404).json({ error: 'Post not found' });
      }
      throw fetchError;
    }

    if (existingPost.status === 'published') {
      return res.status(400).json({ error: 'Post already published' });
    }

    // Here you would integrate with actual social media APIs
    // For now, just mark as published
    const { data: post, error } = await supabase
      .from('posts')
      .update({
        status: 'published',
        published_at: new Date().toISOString(),
        platform_post_id: `mock_${Date.now()}`
      })
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    console.log(`User published post: ${req.user.email}`);

    res.json({
      message: 'Post published successfully',
      post
    });
  } catch (error) {
    console.error('Publish post error:', error);
    res.status(500).json({ error: 'Failed to publish post' });
  }
});

module.exports = router;