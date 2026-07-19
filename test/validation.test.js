const { validateQuestion } = require('../middleware/inputValidator');

// Mock req, res, next
const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

test('rejects empty question', () => {
  const req = { body: { question: '' } };
  const res = mockRes();
  const next = jest.fn();
  validateQuestion(req, res, next);
  expect(res.status).toHaveBeenCalledWith(400);
  expect(next).not.toHaveBeenCalled();
});

test('rejects question over 500 chars', () => {
  const req = { body: { question: 'a'.repeat(501) } };
  const res = mockRes();
  const next = jest.fn();
  validateQuestion(req, res, next);
  expect(res.status).toHaveBeenCalledWith(400);
  expect(next).not.toHaveBeenCalled();
});

test('accepts valid question', () => {
  const req = { body: { question: 'Is Gate A crowded?' } };
  const res = mockRes();
  const next = jest.fn();
  validateQuestion(req, res, next);
  expect(next).toHaveBeenCalled();
});

test('rejects question under 3 chars', () => {
  const req = { body: { question: 'hi' } };
  const res = mockRes();
  const next = jest.fn();
  validateQuestion(req, res, next);
  expect(res.status).toHaveBeenCalledWith(400);
});