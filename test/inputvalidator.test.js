const { validateQuestion, validateFileUpload } = require('../middleware/inputValidator');

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

// Question validation
test('rejects missing question field', () => {
  const req = { body: {} };
  const res = mockRes();
  const next = jest.fn();
  validateQuestion(req, res, next);
  expect(res.status).toHaveBeenCalledWith(400);
});

test('rejects non-string question', () => {
  const req = { body: { question: 123 } };
  const res = mockRes();
  const next = jest.fn();
  validateQuestion(req, res, next);
  expect(res.status).toHaveBeenCalledWith(400);
});

test('rejects whitespace-only question', () => {
  const req = { body: { question: '   ' } };
  const res = mockRes();
  const next = jest.fn();
  validateQuestion(req, res, next);
  expect(res.status).toHaveBeenCalledWith(400);
});

test('accepts question at exactly 500 chars', () => {
  const req = { body: { question: 'a'.repeat(500) } };
  const res = mockRes();
  const next = jest.fn();
  validateQuestion(req, res, next);
  expect(next).toHaveBeenCalled();
});

test('rejects question at 501 chars', () => {
  const req = { body: { question: 'a'.repeat(501) } };
  const res = mockRes();
  const next = jest.fn();
  validateQuestion(req, res, next);
  expect(res.status).toHaveBeenCalledWith(400);
});

test('accepts normal operational question', () => {
  const req = { body: { question: 'Is Gate C congested?' } };
  const res = mockRes();
  const next = jest.fn();
  validateQuestion(req, res, next);
  expect(next).toHaveBeenCalled();
});

// File upload validation
test('rejects missing file', () => {
  const req = { file: null };
  const res = mockRes();
  const next = jest.fn();
  validateFileUpload(req, res, next);
  expect(res.status).toHaveBeenCalledWith(400);
});

test('rejects file over 5MB', () => {
  const req = { file: { size: 6 * 1024 * 1024, originalname: 'test.csv', mimetype: 'text/csv' } };
  const res = mockRes();
  const next = jest.fn();
  validateFileUpload(req, res, next);
  expect(res.status).toHaveBeenCalledWith(400);
});

test('rejects invalid file extension', () => {
  const req = { file: { size: 1000, originalname: 'malware.exe', mimetype: 'application/octet-stream' } };
  const res = mockRes();
  const next = jest.fn();
  validateFileUpload(req, res, next);
  expect(res.status).toHaveBeenCalledWith(400);
});

test('accepts valid CSV file', () => {
  const req = { file: { size: 1000, originalname: 'gate_status.csv', mimetype: 'text/csv' } };
  const res = mockRes();
  const next = jest.fn();
  validateFileUpload(req, res, next);
  expect(next).toHaveBeenCalled();
});

test('accepts valid PDF file', () => {
  const req = { file: { size: 2000, originalname: 'incident_report.pdf', mimetype: 'application/pdf' } };
  const res = mockRes();
  const next = jest.fn();
  validateFileUpload(req, res, next);
  expect(next).toHaveBeenCalled();
});
test('rejects invalid MIME type', () => {
  const req = { file: { size: 1000, originalname: 'test.csv', mimetype: 'application/javascript' } };
  const res = mockRes(); const next = jest.fn();
  validateFileUpload(req, res, next);
  expect(res.status).toHaveBeenCalledWith(400);
});

test('accepts text/csv MIME type', () => {
  const req = { file: { size: 1000, originalname: 'gate.csv', mimetype: 'text/csv' } };
  const res = mockRes(); const next = jest.fn();
  validateFileUpload(req, res, next);
  expect(next).toHaveBeenCalled();
});

test('accepts application/pdf MIME type', () => {
  const req = { file: { size: 1000, originalname: 'report.pdf', mimetype: 'application/pdf' } };
  const res = mockRes(); const next = jest.fn();
  validateFileUpload(req, res, next);
  expect(next).toHaveBeenCalled();
});

test('rejects invalid MIME type', () => {
  const req = { file: { size: 1000, originalname: 'test.csv', mimetype: 'application/javascript' } };
  const res = mockRes(); const next = jest.fn();
  validateFileUpload(req, res, next);
  expect(res.status).toHaveBeenCalledWith(400);
});

test('accepts text/csv MIME type', () => {
  const req = { file: { size: 1000, originalname: 'gate.csv', mimetype: 'text/csv' } };
  const res = mockRes(); const next = jest.fn();
  validateFileUpload(req, res, next);
  expect(next).toHaveBeenCalled();
});

test('accepts application/pdf MIME type', () => {
  const req = { file: { size: 1000, originalname: 'report.pdf', mimetype: 'application/pdf' } };
  const res = mockRes(); const next = jest.fn();
  validateFileUpload(req, res, next);
  expect(next).toHaveBeenCalled();
});

test('rejects invalid MIME type', () => {
const req = { file: { size: 1000, originalname: 'test.csv', mimetype: 'application/javascript' } };
const res = mockRes(); const next = jest.fn();
validateFileUpload(req, res, next);
expect(res.status).toHaveBeenCalledWith(400);
});

test('accepts text/csv MIME type', () => {
const req = { file: { size: 1000, originalname: 'gate.csv', mimetype: 'text/csv' } };
const res = mockRes(); const next = jest.fn();
validateFileUpload(req, res, next);
expect(next).toHaveBeenCalled();
});

test('accepts application/pdf MIME type', () => {
const req = { file: { size: 1000, originalname: 'report.pdf', mimetype: 'application/pdf' } };
const res = mockRes(); const next = jest.fn();
validateFileUpload(req, res, next);
expect(next).toHaveBeenCalled();
});
