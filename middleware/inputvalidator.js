// Input validation — sanitize and validate all user inputs
function validateQuestion(req, res, next) {
  const { question } = req.body;

  if (!question) {
    return res.status(400).json({ error: 'Question is required.' });
  }

  if (typeof question !== 'string') {
    return res.status(400).json({ error: 'Question must be text.' });
  }

  // Max 500 characters — prevents prompt injection attempts
  if (question.length > 500) {
    return res.status(400).json({ error: 'Question is too long (max 500 characters).' });
  }

  // Min 3 characters — prevents spam
  if (question.trim().length < 3) {
    return res.status(400).json({ error: 'Question must be at least 3 characters.' });
  }

  next();
}

function validateFileUpload(req, res, next) {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  // Validate file size — max 5MB
  if (req.file.size > 5 * 1024 * 1024) {
    return res.status(400).json({ error: 'File is too large (max 5MB).' });
  }

  // Validate file extension
  const allowedExts = ['.csv', '.pdf'];
  const ext = require('path').extname(req.file.originalname).toLowerCase();
  if (!allowedExts.includes(ext)) {
    return res.status(400).json({ error: 'Only .csv and .pdf files are allowed.' });
  }

  // Validate MIME type (basic check)
  const allowedMimes = ['text/csv', 'application/pdf', 'text/plain'];
  if (!allowedMimes.includes(req.file.mimetype)) {
    return res.status(400).json({ error: 'Invalid file type.' });
  }

  next();
}

module.exports = { validateQuestion, validateFileUpload };