// Test rate limiter configuration
const { queryLimiter, uploadLimiter } = require('../middleware/rateLimit');

test('queryLimiter is defined', () => {
  expect(queryLimiter).toBeDefined();
  expect(typeof queryLimiter).toBe('function');
});

test('uploadLimiter is defined', () => {
  expect(uploadLimiter).toBeDefined();
  expect(typeof uploadLimiter).toBe('function');
});