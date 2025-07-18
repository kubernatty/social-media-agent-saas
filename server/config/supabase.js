const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Initialize Supabase client with new API key format
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Service client for admin operations (bypasses RLS)
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = {
  supabase,
  supabaseAdmin
};