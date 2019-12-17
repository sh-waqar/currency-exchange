import rateReducer, { SET_EXCHANGE_RATE, setExchangeRate } from '../rate';

const initialState = {};
const mockRateObject = {
  rates: { EUR: 1.1, USD: 1.3 },
  base: 'GBP',
  date: '2019-12-16'
};

// Actions
describe('setExchangeRate', () => {
  it('creates the action with rate object as payload', () => {
    expect(setExchangeRate(mockRateObject)).toEqual({
      type: SET_EXCHANGE_RATE,
      rates: mockRateObject
    });
  });
});

// Reducer

it('returns the intial state', () => {
  expect(rateReducer(undefined, {})).toEqual(initialState);
});

it('handles SET_EXCHANGE_RATE and transform the data correctly', () => {
  const changes = rateReducer(initialState, setExchangeRate(mockRateObject));
  const expectedState = {
    GBP: {
      EUR: mockRateObject.rates.EUR,
      USD: mockRateObject.rates.USD
    }
  };

  expect(changes).toEqual(expectedState);
});
