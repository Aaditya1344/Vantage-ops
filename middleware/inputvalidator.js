const path = require('path');
const {
  MAX_QUESTION_LENGTH,
  MIN_QUESTION_LENGTH,
  MAX_FILE_SIZE_MB,
  ALLOWED_FILE_EXTENSIONS,
  ALLOWED_MIME_TYPES
} = require('../config/constants');

/**
 * Validates the volunteer question from request body.
 * Enforces length limits to prevent prompt injection and spam.
 */
function validateQuestion(req, res, next) {
  const { question } = req.body;

  if (!question) {
    return res.status(400).json({ error: 'Question is required.' });
  }
  if (typeof question !== 'string') {
    return res.status(400).json({ error: 'Question must be text.' });
  }
  if (question.length > MAX_QUESTION_LENGTH) {
    return res.status(400).json({ error: `Question is too long (max ${MAX_QUESTION_LENGTH} characters).` });
  }
  if (question.trim().length < MIN_QUESTION_LENGTH) {
    return res.status(400).json({ error: `Question must be at least ${MIN_QUESTION_LENGTH} characters.` });
  }

  next();
}

/**
 * Validates uploaded files — checks presence, size, and extension.
 * MIME type check included as secondary validation layer.
 */
function validateFileUpload(req, res, next) {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }
  if (req.file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
    return res.status(400).json({ error: `File is too large (max ${MAX_FILE_SIZE_MB}MB).` });
  }

  const ext = path.extname(req.file.originalname).toLowerCase();
  if (!ALLOWED_FILE_EXTENSIONS.includes(ext)) {
    return res.status(400).json({ error: 'Only .csv and .pdf files are allowed.' });
  }
  if (!ALLOWED_MIME_TYPES.includes(req.file.mimetype)) {
    return res.status(400).json({ error: 'Invalid file type.' });
  }

  next();
}

module.exports = { validateQuestion, validateFileUpload };