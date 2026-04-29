const express = require('express');
const { body, param, validationResult } = require('express-validator');
const { protect } = require('../middleware/auth');
const {
  generatePackingList,
  estimateTripCost,
  getWeatherInsights,
  askTravelExpert,
} = require('../services/groqTravelService');

const router = express.Router();

// All routes require JWT authentication
router.use(protect);

// ── Helper: send validation errors ───────────────────────────────────────────
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

// ── POST /api/travel/packing-list ─────────────────────────────────────────────
router.post(
  '/packing-list',
  [
    body('destination').trim().notEmpty().withMessage('destination is required'),
    body('days').isInt({ min: 1, max: 90 }).withMessage('days must be 1-90'),
    body('month').trim().notEmpty().withMessage('month is required'),
    body('activities').optional().isArray(),
  ],
  validate,
  async (req, res) => {
    const { destination, month, activities = [], days } = req.body;
    const data = await generatePackingList(destination, month, activities, days);
    res.json({ success: true, data });
  }
);

// ── POST /api/travel/cost-estimate ────────────────────────────────────────────
router.post(
  '/cost-estimate',
  [
    body('destination').trim().notEmpty().withMessage('destination is required'),
    body('days').isInt({ min: 1, max: 90 }).withMessage('days must be 1-90'),
    body('companions').optional().isInt({ min: 1 }),
    body('budget').optional(),
  ],
  validate,
  async (req, res) => {
    const { destination, days, companions = 1, budget } = req.body;
    const data = await estimateTripCost(destination, days, companions, budget);
    res.json({ success: true, data });
  }
);

// ── POST /api/travel/weather ──────────────────────────────────────────────────
router.post(
  '/weather',
  [
    body('destination').trim().notEmpty().withMessage('destination is required'),
    body('month').trim().notEmpty().withMessage('month is required'),
  ],
  validate,
  async (req, res) => {
    const { destination, month } = req.body;
    const data = await getWeatherInsights(destination, month);
    res.json({ success: true, data });
  }
);

// ── POST /api/travel/ask-expert ───────────────────────────────────────────────
router.post(
  '/ask-expert',
  [
    body('question').trim().notEmpty().withMessage('question is required'),
    body('destination').trim().notEmpty().withMessage('destination is required'),
  ],
  validate,
  async (req, res) => {
    const { question, destination } = req.body;
    const data = await askTravelExpert(question, destination);
    res.json({ success: true, data });
  }
);

module.exports = router;
