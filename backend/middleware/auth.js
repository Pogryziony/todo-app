const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Middleware to authenticate JWT token
const auth = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header('Authorization');
    
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication failed. No token provided or wrong format.' });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user by ID
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({ message: 'Authentication failed. User not found.' });
    }
    
    // Set user on request object
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ message: 'Authentication failed. Invalid token.' });
  }
};

module.exports = auth; 