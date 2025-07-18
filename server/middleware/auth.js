const jwt = require('jsonwebtoken');
const { supabase } = require('../config/supabase');

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', decoded.userId)
      .single();

    if (error || !user) {
      return res.status(401).json({ error: 'User not found' });
    }

    if (user.status !== 'active') {
      return res.status(401).json({ error: 'Account is not active' });
    }

    // Remove password from user object
    const { password: _, ...userWithoutPassword } = user;
    req.user = userWithoutPassword;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

const requirePlan = (requiredPlan) => {
  const planHierarchy = { free: 0, pro: 1, enterprise: 2 };
  
  return (req, res, next) => {
    const userPlan = req.user.plan;
    if (planHierarchy[userPlan] < planHierarchy[requiredPlan]) {
      return res.status(403).json({ 
        error: `This feature requires ${requiredPlan} plan`,
        currentPlan: userPlan,
        requiredPlan
      });
    }
    next();
  };
};

module.exports = {
  authenticateToken,
  requirePlan
};