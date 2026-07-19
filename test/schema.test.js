function detectSchema(data) {
  if (!Array.isArray(data) || data.length === 0) return 'empty';
  const keys = Object.keys(data[0]).map(k => k.toLowerCase().trim());
  if (keys.includes('gate') && keys.includes('queue_length')) return 'gate_status';
  if (keys.includes('incident_type') || keys.includes('minutes_since_report')) return 'incident_log';
  return 'generic';
}

test('detects gate_status schema', () => {
  expect(detectSchema([{ gate: 'Gate A', queue_length: '500', capacity: '1000' }])).toBe('gate_status');
});

test('detects incident_log schema', () => {
  expect(detectSchema([{ incident_type: 'medical', minutes_since_report: '2', location: 'Section 205' }])).toBe('incident_log');
});

test('returns generic for unknown schema', () => {
  expect(detectSchema([{ random_column: 'value' }])).toBe('generic');
});

test('returns empty for empty array', () => {
  expect(detectSchema([])).toBe('empty');
});

test('detects incident_log by minutes_since_report alone', () => {
  expect(detectSchema([{ minutes_since_report: '5', location: 'Gate B' }])).toBe('incident_log');
});

test('detects incident_log by incident_type alone', () => {
  expect(detectSchema([{ incident_type: 'medical' }])).toBe('incident_log');
});

test('returns generic for single unrecognized column', () => {
  expect(detectSchema([{ name: 'John' }])).toBe('generic');
});

test('handles null values in data rows', () => {
  expect(detectSchema([{ gate: 'Gate A', queue_length: null }])).toBe('gate_status');
});

test('is case insensitive for column names', () => {
  expect(detectSchema([{ GATE: 'Gate A', QUEUE_LENGTH: '500' }])).toBe('gate_status');
});
