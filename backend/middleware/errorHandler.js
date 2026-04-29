/**
 * Global error handler middleware
 * ────────────────────────────────
 * Must be registered LAST in server.js — after all routes.
 * express-async-errors ensures async route errors are forwarded here.
 */
const errorHandler = (err, req, res, _next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // ── Mongoose: duplicate key (e.g. email already exists) ──────────────────
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists.`;
    statusCode = 409;
  }

  // ── Mongoose: validation errors ──────────────────────────────────────────
  if (err.name === 'ValidationError') {
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join('. ');
    statusCode = 422;
  }

  // ── Mongoose: bad ObjectId ────────────────────────────────────────────────
  if (err.name === 'CastError') {
    message = `Invalid value for field: ${err.path}`;
    statusCode = 400;
  }

  if (process.env.NODE_ENV === 'development') {
    console.error('🔥 Error:', err);
    return res.status(statusCode).json({
      success: false,
      message,
      stack: err.stack,
    });
  }

  res.status(statusCode).json({ success: false, message });
};

module.exports = errorHandler;
