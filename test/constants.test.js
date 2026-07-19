const constants = require('../config/constants');

test('MAX_QUESTION_LENGTH is 500', () => { expect(constants.MAX_QUESTION_LENGTH).toBe(500); });
test('MIN_QUESTION_LENGTH is 3', () => { expect(constants.MIN_QUESTION_LENGTH).toBe(3); });
test('MAX_FILE_SIZE_MB is 5', () => { expect(constants.MAX_FILE_SIZE_MB).toBe(5); });
test('MAX_HISTORY_ENTRIES is 6', () => { expect(constants.MAX_HISTORY_ENTRIES).toBe(6); });
test('GEMINI_TIMEOUT_MS is 45000', () => { expect(constants.GEMINI_TIMEOUT_MS).toBe(45000); });
test('ALLOWED_FILE_EXTENSIONS has csv and pdf', () => {
  expect(constants.ALLOWED_FILE_EXTENSIONS).toContain('.csv');
  expect(constants.ALLOWED_FILE_EXTENSIONS).toContain('.pdf');
});
test('ALLOWED_MIME_TYPES includes text/csv', () => { expect(constants.ALLOWED_MIME_TYPES).toContain('text/csv'); });
test('URGENCY levels are defined', () => {
  expect(constants.URGENCY.LOW).toBe('low');
  expect(constants.URGENCY.MEDIUM).toBe('medium');
  expect(constants.URGENCY.HIGH).toBe('high');
});
test('GEMINI_MODEL is defined', () => { expect(constants.GEMINI_MODEL).toBeDefined(); });
test('GROQ_MODEL is defined', () => { expect(constants.GROQ_MODEL).toBeDefined(); });
