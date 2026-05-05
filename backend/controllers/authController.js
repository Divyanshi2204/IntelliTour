const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const { sendOTP } = require('../services/emailService');

// ── Helper: sign a JWT for a user ─────────────────────────────────────────────
const signToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// ── Helper: build and send token response ────────────────────────────────────
const sendTokenResponse = (user, statusCode, res) => {
  const token = signToken(user._id);
  res.status(statusCode).json({
    success: true,
    token,
    user: user.toPublicJSON(),
  });
};

// ── Helper: return validation errors neatly ────────────────────────────────────
const checkValidation = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  return null;
};

// ─────────────────────────────────────────────────────────────────────────────
// @route   POST /api/auth/register
// @access  Public
// @desc    Create a new user account and return a JWT
// ─────────────────────────────────────────────────────────────────────────────
const register = async (req, res) => {
  // 1. Validate incoming request body
  const validationError = checkValidation(req, res);
  if (validationError) return;

  const { name, email, password } = req.body;

  // 2. Check if email is already registered
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: 'An account with this email already exists. Please log in.',
    });
  }

  // 3. Create the user — password is hashed in the pre-save hook
  // Generate 6-digit OTP
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Hash OTP for storage
  const hashedOtp = crypto.createHash('sha256').update(otpCode).digest('hex');
  const otpExpires = Date.now() + 15 * 60 * 1000; // 15 mins

  const user = await User.create({ 
    name, 
    email, 
    password,
    otp: hashedOtp,
    otpExpires,
    isVerified: false
  });

  // 4. Send Email
  try {
    await sendOTP(user.email, otpCode);
    res.status(201).json({
      success: true,
      message: 'OTP sent to your email. Please verify to continue.',
    });
  } catch (error) {
    // Log the real SMTP error so it appears in Render's log stream
    console.error('❌ Email send failed:', error.message);
    console.error('   Stack:', error.stack);
    // If email fails, cleanup user and throw error
    await User.findByIdAndDelete(user._id);
    return res.status(500).json({
      success: false,
      message: 'Failed to send verification email. Please try again.',
      // Include error detail in dev mode for easier debugging
      ...(process.env.NODE_ENV !== 'production' && { debug: error.message }),
    });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @route   POST /api/auth/verify-otp
// @access  Public
// @desc    Verify email using 6-digit OTP
// ─────────────────────────────────────────────────────────────────────────────
const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ success: false, message: 'Please provide email and OTP.' });
  }

  const cleanEmail = email.toLowerCase().trim();
  console.log("Attempting to verify OTP for:", cleanEmail);

  const user = await User.findOne({ email: cleanEmail });
  if (!user) {
    console.log("User not found in DB:", cleanEmail);
    return res.status(404).json({ success: false, message: 'User not found.' });
  }

  const hashedSubmittedOtp = crypto.createHash('sha256').update(otp).digest('hex');

  if (user.otp !== hashedSubmittedOtp || user.otpExpires < Date.now()) {
    return res.status(400).json({ success: false, message: 'Invalid or expired OTP.' });
  }

  // Success
  user.isVerified = true;
  user.otp = undefined;
  user.otpExpires = undefined;
  await user.save();

  sendTokenResponse(user, 200, res);
};

// ─────────────────────────────────────────────────────────────────────────────
// @route   POST /api/auth/login
// @access  Public
// @desc    Authenticate user and return a JWT
// ─────────────────────────────────────────────────────────────────────────────
const login = async (req, res) => {
  // 1. Validate incoming request body
  const validationError = checkValidation(req, res);
  if (validationError) return;

  const { email, password } = req.body;

  // 2. Find user — explicitly select password (select: false in schema)
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

  if (!user) {
    // Generic message to avoid user enumeration
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password.',
    });
  }

  // 3. Guard: Google-only accounts have no password
  if (!user.password) {
    return res.status(401).json({
      success: false,
      message: 'This account uses Google Sign-In. Please click "Continue with Google".',
    });
  }

  // 4. Verify password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password.',
    });
  }

  // 5. Enforce email verification
  if (!user.isVerified) {
    return res.status(403).json({
      success: false,
      message: 'Your email is not verified. Please verify using the OTP sent to your email.',
    });
  }

  // 6. Check if account is active
  if (!user.isActive) {
    return res.status(403).json({
      success: false,
      message: 'This account has been deactivated. Please contact support.',
    });
  }

  // 7. Return token + public user data
  sendTokenResponse(user, 200, res);
};

// ─────────────────────────────────────────────────────────────────────────────
// @route   GET /api/auth/me
// @access  Private  (protect middleware required)
// @desc    Return the currently authenticated user's profile
// ─────────────────────────────────────────────────────────────────────────────
const getMe = async (req, res) => {
  // req.user is attached by the protect middleware
  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found.' });
  }

  res.status(200).json({
    success: true,
    user: user.toPublicJSON(),
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// @route   PUT /api/auth/update-profile
// @access  Private
// @desc    Update name or avatar
// ─────────────────────────────────────────────────────────────────────────────
const updateProfile = async (req, res) => {
  const allowedFields = ['name', 'avatar'];
  const updates = {};

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully.',
    user: user.toPublicJSON(),
  });
};

module.exports = { register, login, getMe, updateProfile, verifyOTP };
