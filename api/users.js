import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  // Enable CORS for your app
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { action } = req.query;

    switch (action) {
      case 'register':
        await handleRegister(req, res);
        break;
      case 'login':
        await handleLogin(req, res);
        break;
      case 'get-user':
        await handleGetUser(req, res);
        break;
      case 'update-user':
        await handleUpdateUser(req, res);
        break;
      case 'save-linkedin-connection':
        await handleSaveLinkedInConnection(req, res);
        break;
      case 'get-linkedin-connection':
        await handleGetLinkedInConnection(req, res);
        break;
      case 'disconnect-linkedin':
        await handleDisconnectLinkedIn(req, res);
        break;
      case 'save-posts':
        await handleSavePosts(req, res);
        break;
      case 'get-posts':
        await handleGetPosts(req, res);
        break;
      case 'save-usage':
        await handleSaveUsage(req, res);
        break;
      case 'get-usage':
        await handleGetUsage(req, res);
        break;
      default:
        res.status(404).json({ error: 'Action not found' });
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function handleRegister(req, res) {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Email, password, and name are required' });
  }

  // Check if user exists
  const { data: existingUser } = await supabase
    .from('aifluence_users')
    .select('id')
    .eq('email', email)
    .single();

  if (existingUser) {
    return res.status(400).json({ error: 'User already exists' });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const { data: user, error } = await supabase
    .from('aifluence_users')
    .insert([
      {
        email,
        password: hashedPassword,
        name,
        plan: 'free',
        linkedin_connected: false,
        posts: [],
        usage: {
          postsGenerated: 0,
          imagesGenerated: 0,
          monthlyLimit: 10,
          resetDate: new Date().toISOString()
        },
        preferences: {
          theme: 'dark',
          notifications: true
        }
      }
    ])
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: 'Failed to create user' });
  }

  // Generate JWT token
  const token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );

  res.json({
    success: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      plan: user.plan
    },
    token
  });
}

async function handleLogin(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  // Find user
  const { data: user, error } = await supabase
    .from('aifluence_users')
    .select('*')
    .eq('email', email)
    .single();

  if (error || !user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Verify password
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Generate JWT token
  const token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );

  res.json({
    success: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      plan: user.plan,
      linkedInConnected: user.linkedin_connected,
      linkedInProfile: user.linkedin_profile,
      posts: user.posts || [],
      usage: user.usage || {
        postsGenerated: 0,
        imagesGenerated: 0,
        monthlyLimit: 10,
        resetDate: new Date().toISOString()
      }
    },
    token
  });
}

async function handleGetUser(req, res) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { data: user } = await supabase
      .from('aifluence_users')
      .select('*')
      .eq('id', decoded.userId)
      .single();

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        plan: user.plan,
        linkedInConnected: user.linkedin_connected,
        linkedInProfile: user.linkedin_profile,
        posts: user.posts || [],
        usage: user.usage || {
          postsGenerated: 0,
          imagesGenerated: 0,
          monthlyLimit: 10,
          resetDate: new Date().toISOString()
        }
      }
    });
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

async function handleSaveLinkedInConnection(req, res) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { profile, authCode } = req.body;

    const { error } = await supabase
      .from('aifluence_users')
      .update({
        linkedin_connected: true,
        linkedin_profile: profile,
        linkedin_auth_code: authCode,
        linkedin_connected_at: new Date().toISOString()
      })
      .eq('id', decoded.userId);

    if (error) {
      return res.status(500).json({ error: 'Failed to save LinkedIn connection' });
    }

    res.json({ success: true });
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

async function handleGetLinkedInConnection(req, res) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { data: user } = await supabase
      .from('aifluence_users')
      .select('linkedin_connected, linkedin_profile, linkedin_connected_at')
      .eq('id', decoded.userId)
      .single();

    res.json({
      success: true,
      connected: user.linkedin_connected || false,
      profile: user.linkedin_profile || null,
      connectedAt: user.linkedin_connected_at || null
    });
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

async function handleDisconnectLinkedIn(req, res) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const { error } = await supabase
      .from('aifluence_users')
      .update({
        linkedin_connected: false,
        linkedin_profile: null,
        linkedin_auth_code: null,
        linkedin_connected_at: null
      })
      .eq('id', decoded.userId);

    if (error) {
      return res.status(500).json({ error: 'Failed to disconnect LinkedIn' });
    }

    res.json({ success: true });
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

async function handleSavePosts(req, res) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { posts } = req.body;

    const { error } = await supabase
      .from('aifluence_users')
      .update({ posts: posts })
      .eq('id', decoded.userId);

    if (error) {
      return res.status(500).json({ error: 'Failed to save posts' });
    }

    res.json({ success: true });
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

async function handleGetPosts(req, res) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { data: user } = await supabase
      .from('aifluence_users')
      .select('posts')
      .eq('id', decoded.userId)
      .single();

    res.json({
      success: true,
      posts: user.posts || []
    });
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

async function handleSaveUsage(req, res) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { usage } = req.body;

    const { error } = await supabase
      .from('aifluence_users')
      .update({ usage: usage })
      .eq('id', decoded.userId);

    if (error) {
      return res.status(500).json({ error: 'Failed to save usage' });
    }

    res.json({ success: true });
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

async function handleGetUsage(req, res) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { data: user } = await supabase
      .from('aifluence_users')
      .select('usage')
      .eq('id', decoded.userId)
      .single();

    res.json({
      success: true,
      usage: user.usage || {
        postsGenerated: 0,
        imagesGenerated: 0,
        monthlyLimit: 10,
        resetDate: new Date().toISOString()
      }
    });
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}