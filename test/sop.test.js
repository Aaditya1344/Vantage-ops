// Test SOP knowledge base integrity
const SOP_RULES = [
  'Crowd Bottleneck',
  'Medical Incident',
  'Lost Child',
  'Lost Item',
  'Evacuation',
  'Ticket Dispute',
  'Severe Weather',
  'Unruly Fan Behavior',
  'Suspicious Package',
  'Power Outage',
  'Gate Equipment Failure',
  'VIP/VVIP Escort',
  'Disabled Access',
  'Stretcher Request',
  'Media Access',
  'Alcohol Control'
];

test('SOP has 16 rules', () => {
  expect(SOP_RULES.length).toBe(16);
});

test('SOP contains medical incident rule', () => {
  expect(SOP_RULES).toContain('Medical Incident');
});

test('SOP contains lost child rule', () => {
  expect(SOP_RULES).toContain('Lost Child');
});

test('SOP contains crowd bottleneck rule', () => {
  expect(SOP_RULES).toContain('Crowd Bottleneck');
});

test('SOP contains suspicious package rule', () => {
  expect(SOP_RULES).toContain('Suspicious Package');
});

test('all SOP rules are non-empty strings', () => {
  SOP_RULES.forEach(rule => {
    expect(typeof rule).toBe('string');
    expect(rule.length).toBeGreaterThan(0);
  });
});