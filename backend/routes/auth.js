const express = require('express');
const passport = require('../config/passport');
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

const router = express.Router();

// Google OAuth routes
router.get('/google', passport.authenticate('google', { 
  scope: ['profile', 'email', 'https://www.googleapis.com/auth/calendar'] 
}));

router.get('/google/callback', 
  passport.authenticate('google', { session: false, failureRedirect: `${process.env.FRONTEND_URL}/login` }),
  (req, res) => {
    // Successful authentication, redirect home with token
    const { token, user } = req.user;
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}&user=${encodeURIComponent(JSON.stringify(user))}`);
  }
);

// Protected routes
router.get('/me', auth, authController.getCurrentUser);
router.post('/refresh-token', auth, authController.refreshGoogleToken);
router.post('/logout', auth, authController.logout);

module.exports = router; 