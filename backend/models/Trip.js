const mongoose = require('mongoose');

// ── Sub-schema: A single activity within a day slot ──────────────────────────
const activitySchema = new mongoose.Schema(
  {
    time: {
      type: String,        // e.g. "09:00 AM"
      required: true,
    },
    title: {
      type: String,        // e.g. "Visit Eiffel Tower"
      required: true,
      trim: true,
    },
    description: {
      type: String,        // detailed description of the activity
      trim: true,
    },
    location: {
      type: String,        // venue / place name
      trim: true,
    },
    category: {
      type: String,        // e.g., "sightseeing", "food", "shopping", "other"
      default: 'sightseeing',
    },
    estimatedCost: {
      type: String,        // e.g. "₹500" or "$20" — stored as string to include currency
      default: 'Free',
    },
    tips: {
      type: String,        // pro-tip for the activity
      trim: true,
    },
  },
  { _id: false } // no separate _id for sub-documents
);

// ── Sub-schema: A single day in the itinerary ────────────────────────────────
const daySchema = new mongoose.Schema(
  {
    day: {
      type: Number,        // 1-based day number
      required: true,
    },
    title: {
      type: String,        // e.g. "Arrival & City Walk"
      required: true,
      trim: true,
    },
    theme: {
      type: String,        // short mood/theme — "Adventure", "Culture & History", etc.
      trim: true,
    },
    activities: {
      type: [activitySchema],
      default: [],
    },
    dailySummary: {
      type: String,        // one-sentence summary of the day
      trim: true,
    },
  },
  { _id: false }
);

// ── Main Trip schema ──────────────────────────────────────────────────────────
const tripSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      index: true,
    },

    destination: {
      type: String,
      required: [true, 'Destination is required'],
      trim: true,
      maxlength: [100, 'Destination name cannot exceed 100 characters'],
    },

    days: {
      type: Number,
      required: [true, 'Number of days is required'],
      min: [1, 'Trip must be at least 1 day'],
      max: [30, 'Trip cannot exceed 30 days'],
    },

    budget: {
      type: Number,
      required: [true, 'Budget is required'],
      min: [0, 'Budget cannot be negative'],
    },

    currency: {
      type: String,
      required: true,
      uppercase: true,
      default: 'INR',
      maxlength: 3,   // ISO 4217 currency code (INR, USD, EUR, …)
    },

    budgetLevel: {
      type: String,
      enum: ['budget', 'moderate', 'luxury'],
      default: 'moderate',
    },

    preferences: {
      type: [String],   // e.g. ["adventure", "food", "culture"]
      default: [],
    },

    // Structured itinerary parsed from Gemini response
    itinerary: {
      type: [daySchema],
      default: [],
    },

    // Store the raw AI response in case re-parsing is needed
    rawAiResponse: {
      type: String,
      select: false, // exclude by default (large payload)
    },

    // Optional highlights / summary from AI
    tripSummary: {
      type: String,
      trim: true,
    },

    // Cover image (Unsplash URL injected client-side or by AI)
    coverImage: {
      type: String,
      default: '',
    },

    status: {
      type: String,
      enum: ['generating', 'completed', 'failed'],
      default: 'completed',
    },
  },
  {
    timestamps: true,
  }
);

// ── Indexes ───────────────────────────────────────────────────────────────────
// Compound index: list a user's trips sorted by newest first
tripSchema.index({ userId: 1, createdAt: -1 });

// ── Virtual: formatted budget string ──────────────────────────────────────────
tripSchema.virtual('budgetFormatted').get(function () {
  const symbols = { INR: '₹', USD: '$', EUR: '€', GBP: '£', JPY: '¥' };
  const symbol = symbols[this.currency] || this.currency;
  return `${symbol}${this.budget.toLocaleString()}`;
});

tripSchema.set('toJSON', { virtuals: true });
tripSchema.set('toObject', { virtuals: true });

const Trip = mongoose.model('Trip', tripSchema);

module.exports = Trip;
