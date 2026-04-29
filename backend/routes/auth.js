const express = require('express');
const { body } = require('express-validator');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { register, login, getMe, updateProfile, verifyOTP } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// ── Validation rules ──────────────────────────────────────────────────────────

const registerValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email address')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
];

const loginValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email address')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Password is required'),
];

// ── Routes ─────────────────────────────────────────────────────────────────────

// POST /api/auth/register
router.post('/register', registerValidation, register);

// POST /api/auth/login
router.post('/login', loginValidation, login);

// POST /api/auth/verify-otp
router.post('/verify-otp', verifyOTP);

// GET /api/auth/me  (protected)
router.get('/me', protect, getMe);

// PUT /api/auth/update-profile  (protected)
router.put('/update-profile', protect, updateProfile);

// ── Google OAuth Routes ───────────────────────────────────────────────────────

// GET /api/auth/google  — redirects to Google's consent screen
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: true })
);

// GET /api/auth/google/callback  — Google redirects here after consent
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: `${process.env.CLIENT_URL?.split(',')[0] || 'http://localhost:5173'}/login?error=oauth_failed`, session: true }),
  (req, res) => {
    // Sign a JWT for the authenticated Google user
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });

    // Destroy the server-side session (we use JWT, not sessions, after this point)
    req.session.destroy(() => {
      const frontendUrl = process.env.CLIENT_URL?.split(',')[0] || 'http://localhost:5173';
      res.redirect(`${frontendUrl}/auth/callback?token=${token}`);
    });
  }
);

module.exports = router;

