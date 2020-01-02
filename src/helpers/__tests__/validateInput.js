import validateInput from 'helpers/validateInput';

describe('should only allow numbers', () => {
  const results = [
    ['123', '123'],
    ['abc', ''],
    ['1.23', '1.23'],
    ['12.', '12.'],
    ['123a', '123'],
    ['0', '0'],
    ['-123', ''],
    ['+123', '']
  ];

  test.each(results)('%s, %s', (value, expected) => {
    expect(validateInput(value)).toBe(expected);
  });
});

describe('should only sigle decimal numbers', () => {
  const results = [
    ['12.3', '12.3'],
    ['12.3.', '12.3'],
    ['12.3.52.1', '12.3']
  ];

  test.each(results)('%s, %s', (value, expected) => {
    expect(validateInput(value)).toBe(expected);
  });
});

describe('should allow numbers with 2 fraction places', () => {
  const results = [
    ['12.34', '12.34'],
    ['12.347', '12.34'],
    ['12.3479', '12.34'],
    ['0.', '0.'],
    ['0.1', '0.1'],
    ['0.0', '0.0'],
    ['0.01', '0.01'],
    ['0.00', '0.00'],
    ['0.001', '0.00']
  ];

  test.each(results)('%s, %s', (value, expected) => {
    expect(validateInput(value)).toBe(expected);
  });
});
