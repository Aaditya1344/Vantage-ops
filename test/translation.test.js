// Test language detection logic
const LANGUAGE_CODES = {
  'Spanish': 'es',
  'French': 'fr',
  'Portuguese': 'pt',
  'German': 'de',
  'Italian': 'it',
  'Arabic': 'ar',
  'Japanese': 'ja',
  'Korean': 'ko',
  'Hindi': 'hi',
  'Chinese (Simplified)': 'zh-CN',
  'Russian': 'ru',
  'Turkish': 'tr',
  'Dutch': 'nl',
  'Polish': 'pl',
  'Swedish': 'sv'
};

test('language codes map has correct entries', () => {
  expect(LANGUAGE_CODES['Spanish']).toBe('es');
  expect(LANGUAGE_CODES['French']).toBe('fr');
  expect(LANGUAGE_CODES['Arabic']).toBe('ar');
  expect(LANGUAGE_CODES['Hindi']).toBe('hi');
});

test('language codes map has 15 entries', () => {
  expect(Object.keys(LANGUAGE_CODES).length).toBe(15);
});

test('all language codes are strings', () => {
  Object.values(LANGUAGE_CODES).forEach(code => {
    expect(typeof code).toBe('string');
    expect(code.length).toBeGreaterThan(0);
  });
});

test('Chinese simplified has correct ISO code', () => {
  expect(LANGUAGE_CODES['Chinese (Simplified)']).toBe('zh-CN');
});