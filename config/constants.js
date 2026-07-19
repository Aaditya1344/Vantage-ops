/**
 * Vantage Ops — Application Constants
 * Centralized configuration values used across the application.
 * Never hardcode these values directly in route handlers or middleware.
 */
module.exports = {
  // Input validation limits
  MAX_QUESTION_LENGTH: 500,
  MIN_QUESTION_LENGTH: 3,
  MAX_FILE_SIZE_MB: 5,

  // Database limits
  MAX_HISTORY_ENTRIES: 6,

  // AI configuration
  GEMINI_TIMEOUT_MS: 45000,
  GEMINI_MAX_RETRIES: 2,
  GEMINI_MODEL: 'gemini-flash-latest',
  GROQ_MODEL: 'llama-3.3-70b-versatile',

  // Rate limiting
  RATE_LIMIT_WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  QUERY_RATE_LIMIT: 30,
  UPLOAD_RATE_LIMIT: 10,

  // File upload
  ALLOWED_FILE_EXTENSIONS: ['.csv', '.pdf'],
  ALLOWED_MIME_TYPES: ['text/csv', 'application/pdf', 'text/plain'],

  // Urgency levels
  URGENCY: {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high'
  }
};
