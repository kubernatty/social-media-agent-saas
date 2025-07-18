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
      // Get LinkedIn connection status
      const { data: connection, error } = await supabase
        .from('linkedin_connections')
        .select('*')
        .eq('user_id', user.id)
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

    } else if (req.method === 'DELETE') {
      // Disconnect LinkedIn
      const { error } = await supabase
        .from('linkedin_connections')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      res.json({
        message: 'LinkedIn connection removed successfully'
      });

    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }

  } catch (error) {
    console.error('LinkedIn connection error:', error);
    if (error.message === 'Access token required') {
      res.status(401).json({ error: 'Access token required' });
    } else if (error.name === 'JsonWebTokenError') {
      res.status(401).json({ error: 'Invalid token' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}