const express = require('express');
const { supabase } = require('../config/supabase');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get LinkedIn connection status
router.get('/connection', authenticateToken, async (req, res) => {
  try {
    const { data: connection, error } = await supabase
      .from('linkedin_connections')
      .select('*')
      .eq('user_id', req.user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    res.json({
      connected: !!connection,
      connection: connection ? {
        id: connection.id,
        linkedin_id: connection.linkedin_id,
        is_active: connection.is_active,
        last_used: connection.last_used,
        profile_data: connection.profile_data
      } : null
    });
  } catch (error) {
    console.error('Get LinkedIn connection error:', error);
    res.status(500).json({ error: 'Failed to get connection status' });
  }
});

// Start LinkedIn OAuth flow
router.get('/auth', authenticateToken, (req, res) => {
  try {
    const state = Buffer.from(JSON.stringify({
      userId: req.user.id,
      timestamp: Date.now()
    })).toString('base64');

    const authUrl = `https://www.linkedin.com/oauth/v2/authorization?` +
      `response_type=code&` +
      `client_id=${process.env.LINKEDIN_CLIENT_ID}&` +
      `redirect_uri=${encodeURIComponent(process.env.LINKEDIN_REDIRECT_URI)}&` +
      `scope=${encodeURIComponent('openid profile w_member_social')}&` +
      `state=${state}`;

    res.json({
      authUrl,
      message: 'Redirect user to this URL to authorize LinkedIn connection'
    });
  } catch (error) {
    console.error('LinkedIn auth start error:', error);
    res.status(500).json({ error: 'Failed to start LinkedIn authorization' });
  }
});

// Handle LinkedIn OAuth callback
router.get('/callback', async (req, res) => {
  try {
    const { code, state, error } = req.query;

    if (error) {
      console.error('LinkedIn OAuth error:', error);
      return res.status(400).json({ error: 'LinkedIn authorization failed' });
    }

    if (!code || !state) {
      return res.status(400).json({ error: 'Missing authorization code or state' });
    }

    // Decode state to get user ID
    const decodedState = JSON.parse(Buffer.from(state, 'base64').toString());
    const userId = decodedState.userId;

    // Exchange code for access token
    const tokenResponse = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        client_id: process.env.LINKEDIN_CLIENT_ID,
        client_secret: process.env.LINKEDIN_CLIENT_SECRET,
        redirect_uri: process.env.LINKEDIN_REDIRECT_URI
      })
    });

    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token) {
      throw new Error('Failed to get access token');
    }

    // Get LinkedIn profile
    const profileResponse = await fetch('https://api.linkedin.com/v2/userinfo', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`
      }
    });

    const profileData = await profileResponse.json();

    // Save or update connection
    const { v4: uuidv4 } = require('uuid');
    const { error: upsertError } = await supabase
      .from('linkedin_connections')
      .upsert({
        id: uuidv4(),
        user_id: userId,
        linkedin_id: profileData.sub,
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        expires_at: new Date(Date.now() + (tokenData.expires_in * 1000)).toISOString(),
        profile_data: profileData,
        is_active: true,
        last_used: new Date().toISOString()
      }, { 
        onConflict: 'user_id',
        ignoreDuplicates: false 
      });

    if (upsertError) {
      throw upsertError;
    }

    console.log(`LinkedIn connected for user: ${userId}`);

    // Redirect to frontend with success
    res.redirect(`${process.env.FRONTEND_URL}/settings?linkedin=connected`);
  } catch (error) {
    console.error('LinkedIn callback error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/settings?linkedin=error`);
  }
});

// Disconnect LinkedIn
router.delete('/connection', authenticateToken, async (req, res) => {
  try {
    const { error } = await supabase
      .from('linkedin_connections')
      .delete()
      .eq('user_id', req.user.id);

    if (error) {
      throw error;
    }

    console.log(`LinkedIn disconnected for user: ${req.user.email}`);

    res.json({
      message: 'LinkedIn connection removed successfully'
    });
  } catch (error) {
    console.error('LinkedIn disconnect error:', error);
    res.status(500).json({ error: 'Failed to disconnect LinkedIn' });
  }
});

// Post to LinkedIn
router.post('/post', authenticateToken, async (req, res) => {
  try {
    const { content, media_urls } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    const { data: connection, error } = await supabase
      .from('linkedin_connections')
      .select('*')
      .eq('user_id', req.user.id)
      .eq('is_active', true)
      .single();

    if (error || !connection) {
      return res.status(400).json({ error: 'LinkedIn not connected' });
    }

    // Check if token is expired
    if (connection.expires_at && new Date() > new Date(connection.expires_at)) {
      return res.status(401).json({ error: 'LinkedIn token expired, please reconnect' });
    }

    // Post to LinkedIn (simplified)
    const postData = {
      author: `urn:li:person:${connection.linkedin_id}`,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: {
            text: content
          },
          shareMediaCategory: 'NONE'
        }
      },
      visibility: {
        'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
      }
    };

    const response = await fetch('https://api.linkedin.com/v2/ugcPosts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${connection.access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(postData)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to post to LinkedIn');
    }

    // Update last used
    await supabase
      .from('linkedin_connections')
      .update({ last_used: new Date().toISOString() })
      .eq('user_id', req.user.id);

    console.log(`Posted to LinkedIn for user: ${req.user.email}`);

    res.json({
      message: 'Posted to LinkedIn successfully',
      post_id: result.id
    });
  } catch (error) {
    console.error('LinkedIn post error:', error);
    res.status(500).json({ error: 'Failed to post to LinkedIn' });
  }
});

module.exports = router;