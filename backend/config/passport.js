const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/auth/google/callback',
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        const avatar = profile.photos?.[0]?.value || '';

        // 1. Try to find by googleId first
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          // Already linked — just return the user
          if (!user.isVerified) {
            user.isVerified = true; // Auto-verify if they used Google
            await user.save();
          }
          return done(null, user);
        }

        // 2. Try to find by email (account already exists with email/password)
        user = await User.findOne({ email });

        if (user) {
          // Link Google account to existing user
          user.googleId = profile.id;
          user.isVerified = true; // Auto-verify if they used Google
          if (!user.avatar) user.avatar = avatar;
          await user.save();
          return done(null, user);
        }

        // 3. Brand-new user via Google — create account
        user = await User.create({
          name: profile.displayName || 'Google User',
          email,
          googleId: profile.id,
          avatar,
          isVerified: true, // Google-only account is implicitly verified
        });

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// ── LOCAL STRATEGY ──
passport.use(
  new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
      const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
      if (!user) return done(null, false, { message: 'Invalid email or password.' });
      if (!user.password) return done(null, false, { message: 'Please use Google Sign-In.' });

      const isMatch = await user.comparePassword(password);
      if (!isMatch) return done(null, false, { message: 'Invalid email or password.' });

      // Enforce OTP verification
      if (!user.isVerified) {
        return done(null, false, { message: 'Please verify your email via OTP to log in.' });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

// Minimal session serialization (only used for the OAuth round-trip)
passport.serializeUser((user, done) => done(null, user._id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
