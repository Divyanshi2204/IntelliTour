const { validationResult } = require('express-validator');
const Trip = require('../models/Trip');
const groqService = require('../services/groqService');
const https = require('https');

// ── Helper: check validation errors ──────────────────────────────────────────
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
// @route   POST /api/trips/generate
// @access  Private
// @desc    Generate a new AI trip itinerary and save to DB
// ─────────────────────────────────────────────────────────────────────────────
const generateTrip = async (req, res) => {
  // 1. Validate request
  const validationError = checkValidation(req, res);
  if (validationError) return;

  const { destination, days, budget, currency, budgetLevel, preferences } = req.body;

  // 2. Create the initial Trip document in the DB (status: 'generating')
  // This is good for saving history even if generation fails, or for long-polling architecture (though we do it synchronously here).
  let trip = await Trip.create({
    userId: req.user._id,
    destination,
    days: parseInt(days, 10),
    budget: parseFloat(budget),
    currency: currency || 'INR',
    budgetLevel: budgetLevel || 'moderate',
    preferences: preferences || [],
    status: 'generating',
  });

  try {
    // 3. Call the Groq AI Service (Llama 3)
    const aiResult = await groqService.generateItinerary({
      destination,
      days: parseInt(days, 10),
      budget: parseFloat(budget),
      currency: currency || 'INR',
      budgetLevel: budgetLevel || 'moderate',
      preferences: preferences || [],
    });

    // 4. Update the Trip document with the AI response
    trip.itinerary = aiResult.days;
    trip.tripSummary = aiResult.tripSummary;
    trip.rawAiResponse = aiResult.rawText; // Store raw text for debugging if needed
    trip.status = 'completed';
    
    // We can also generate a generic cover image URL (e.g. from LoremFlickr)
    trip.coverImage = `https://loremflickr.com/800/600/${encodeURIComponent(destination)},landmark/all`;

    await trip.save();

    // 5. Send success response
    res.status(201).json({
      success: true,
      message: 'Itinerary generated successfully!',
      trip,
    });
  } catch (error) {
    // If AI fails, update status to failed
    trip.status = 'failed';
    // Mongoose doesn't support updating `createdAt` directly easily if we try to save again, 
    // just update status and save.
    await trip.save();

    console.error('TRIP GENERATION ERROR:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate itinerary. Please try again.',
    });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @route   GET /api/trips/history
// @access  Private
// @desc    Get all trips for the authenticated user
// ─────────────────────────────────────────────────────────────────────────────
const getHistory = async (req, res) => {
  // Find all trips matching the logged in user, sort newest first
  // Exclude rawAiResponse for performance unless explicitly requested
  const trips = await Trip.find({ userId: req.user._id })
    .sort({ createdAt: -1 })
    .select('-rawAiResponse');

  res.status(200).json({
    success: true,
    count: trips.length,
    trips,
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// @route   GET /api/trips/:id
// @access  Private
// @desc    Get a single trip by ID
// ─────────────────────────────────────────────────────────────────────────────
const getTripById = async (req, res) => {
  const trip = await Trip.findOne({
    _id: req.params.id,
    userId: req.user._id, // Ensure user owns the trip
  }).select('-rawAiResponse');

  if (!trip) {
    return res.status(404).json({ success: false, message: 'Trip not found or unauthorized' });
  }

  res.status(200).json({
    success: true,
    trip,
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// @route   DELETE /api/trips/:id
// @access  Private
// @desc    Delete a trip by ID
// ─────────────────────────────────────────────────────────────────────────────
const deleteTrip = async (req, res) => {
  const trip = await Trip.findOneAndDelete({
    _id: req.params.id,
    userId: req.user._id, // Ensure user owns the trip
  });

  if (!trip) {
    return res.status(404).json({ success: false, message: 'Trip not found or unauthorized' });
  }

  res.status(200).json({
    success: true,
    message: 'Trip deleted successfully',
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// @route   GET /api/trips/image/:destination
// @access  Public
// @desc    Proxy an image fetch to bypass browser SSL strictness
// ─────────────────────────────────────────────────────────────────────────────
const getImage = async (req, res) => {
  try {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; // Bypass local cert errors
    const dest = encodeURIComponent(req.params.destination);
    
    // Always use 1600x900 as it's meant for the hero header but fits nicely anywhere
    const targetUrl = `https://loremflickr.com/1600/900/${dest},landmark/all`;

    const fetchRes = await fetch(targetUrl);
    
    if (!fetchRes.ok) throw new Error('Fetch failed');

    const contentType = fetchRes.headers.get('content-type');
    if (contentType) {
      res.setHeader('Content-Type', contentType);
    }

    const { Readable } = require('stream');
    Readable.fromWeb(fetchRes.body).pipe(res);
  } catch (err) {
    console.error('Image proxy error:', err);
    res.redirect('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80');
  }
};

module.exports = {
  generateTrip,
  getHistory,
  getTripById,
  deleteTrip,
  getImage,
};
