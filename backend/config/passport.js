const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user');
const jwt = require('jsonwebtoken');

// Set up Google OAuth strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    scope: ['profile', 'email', 'https://www.googleapis.com/auth/calendar']
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Find existing user
      let user = await User.findOne({ googleId: profile.id });
      
      // If user doesn't exist, create a new one
      if (!user) {
        user = await User.create({
          googleId: profile.id,
          email: profile.emails[0].value,
          name: profile.displayName,
          picture: profile.photos[0].value,
          googleAccessToken: accessToken,
          googleRefreshToken: refreshToken
        });
      } else {
        // Update the tokens
        user.googleAccessToken = accessToken;
        if (refreshToken) user.googleRefreshToken = refreshToken;
        await user.save();
      }
      
      // Create JWT token
      const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );
      
      // Return user info and token
      return done(null, {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          picture: user.picture
        },
        token
      });
    } catch (error) {
      return done(error, null);
    }
  }
));

module.exports = passport; 