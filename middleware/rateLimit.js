const rateLimit = require('express-rate-limit');
const {
  RATE_LIMIT_WINDOW_MS,
  QUERY_RATE_LIMIT,
  UPLOAD_RATE_LIMIT
} = require('../config/constants');

/**
 * Rate limiter for AI query endpoint.
 * Prevents API quota abuse and DoS attacks.
 */
const queryLimiter = rateLimit({
  windowMs: RATE_LIMIT_WINDOW_MS,
  max: QUERY_RATE_LIMIT,
  message: { error: 'Too many queries from this IP. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false
});

/**
 * Rate limiter for file upload endpoint.
 * Stricter limit since uploads trigger heavier processing.
 */
const uploadLimiter = rateLimit({
  windowMs: RATE_LIMIT_WINDOW_MS,
  max: UPLOAD_RATE_LIMIT,
  message: { error: 'Too many uploads. Please wait before uploading again.' },
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = { queryLimiter, uploadLimiter };