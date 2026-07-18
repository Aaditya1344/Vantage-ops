const rateLimit = require('express-rate-limit');

const queryLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { error: 'Too many queries from this IP. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false
  // No custom keyGenerator — let express-rate-limit handle IPv6 correctly
});

const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many uploads. Please wait before uploading again.' },
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = { queryLimiter, uploadLimiter };