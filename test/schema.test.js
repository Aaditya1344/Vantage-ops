// Test CSV schema detection logic
function detectSchema(data) {
  if (!Array.isArray(data) || data.length === 0) return 'empty';
  const keys = Object.keys(data[0]).map(k => k.toLowerCase().trim());
  if (keys.includes('gate') && keys.includes('queue_length')) return 'gate_status';
  if (keys.includes('incident_type') || keys.includes('minutes_since_report')) return 'incident_log';
  return 'generic';
}

test('detects gate_status schema', () => {
  const data = [{ gate: 'Gate A', queue_length: '500', capacity: '1000' }];
  expect(detectSchema(data)).toBe('gate_status');
});

test('detects incident_log schema', () => {
  const data = [{ incident_type: 'medical', minutes_since_report: '2', location: 'Section 205' }];
  expect(detectSchema(data)).toBe('incident_log');
});

test('returns generic for unknown schema', () => {
  const data = [{ random_column: 'value', another_field: 'data' }];
  expect(detectSchema(data)).toBe('generic');
});

test('returns empty for empty array', () => {
  expect(detectSchema([])).toBe('empty');
});