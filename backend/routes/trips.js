const express = require('express');
const { body } = require('express-validator');
const { protect } = require('../middleware/auth');
const {
  generateTrip,
  getHistory,
  getTripById,
  deleteTrip,
  getImage,
} = require('../controllers/tripController');

const router = express.Router();

// ── Public routes ────────────────────────────────────────────────────────────
// The image proxy route must be public since standard <img> tags don't send auth headers
router.get('/image/:destination', getImage);

// All trip routes below require authentication
router.use(protect);

// ── Validation Rules ─────────────────────────────────────────────────────────
const generateTripValidation = [
  body('destination').trim().notEmpty().withMessage('Destination is required'),
  body('days')
    .isInt({ min: 1, max: 30 })
    .withMessage('Days must be an integer between 1 and 30'),
  body('budget')
    .isFloat({ min: 0 })
    .withMessage('Budget must be a positive number'),
  body('currency')
    .optional()
    .trim()
    .isLength({ min: 3, max: 3 })
    .withMessage('Currency must be a 3-letter ISO code'),
  body('budgetLevel')
    .optional()
    .isIn(['budget', 'moderate', 'luxury'])
    .withMessage('Invalid budget level'),
  body('preferences').optional().isArray().withMessage('Preferences must be an array'),
];

// ── Routes ───────────────────────────────────────────────────────────────────

// POST /api/trips/generate - Generate a new AI trip
router.post('/generate', generateTripValidation, generateTrip);

// GET /api/trips/history - Get all past trips for logged in user
// Note: Changed from `/history` to `/` in standard REST, or keep `/history` if you prefer
router.get('/history', getHistory);

// GET /api/trips/:id - Get a single trip
router.get('/:id', getTripById);

// DELETE /api/trips/:id - Delete a trip
router.delete('/:id', deleteTrip);

module.exports = router;
