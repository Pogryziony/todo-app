const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { google } = require('googleapis');

// Get current user profile
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-googleAccessToken -googleRefreshToken');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    console.error('Error fetching current user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Refresh Google access token
exports.refreshGoogleToken = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user || !user.googleRefreshToken) {
      return res.status(400).json({ message: 'No refresh token available' });
    }
    
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_CALLBACK_URL
    );
    
    oauth2Client.setCredentials({
      refresh_token: user.googleRefreshToken
    });
    
    const { credentials } = await oauth2Client.refreshAccessToken();
    
    // Update user with new tokens
    user.googleAccessToken = credentials.access_token;
    if (credentials.refresh_token) {
      user.googleRefreshToken = credentials.refresh_token;
    }
    
    await user.save();
    
    res.json({ success: true, message: 'Token refreshed successfully' });
  } catch (error) {
    console.error('Error refreshing Google token:', error);
    res.status(500).json({ message: 'Failed to refresh token' });
  }
};

// Handle logout
exports.logout = async (req, res) => {
  try {
    // In JWT authentication we don't need server-side logout
    // Just provide guidance to the client
    res.json({ 
      success: true, 
      message: 'Logged out successfully',
      guidance: 'Please remove the token from your local storage'
    });
  } catch (error) {
    console.error('Error during logout:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 