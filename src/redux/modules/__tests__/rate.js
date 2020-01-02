import rateReducer, {
  RATE_FETCH_STARTED,
  RATE_FETCH_SUCCEEDED,
  RATE_FETCH_FAILED,
  fetchRate,
  fetchRateSuccess,
  fetchRateError,
  getRate,
  getIsRateLoading,
  getRateHasError
} from '../rate';

const initialState = {
  isLoading: false,
  hasError: false
};
const mockRateObject = {
  rates: { EUR: 1.1, USD: 1.3 },
  base: 'GBP',
  date: '2019-12-16'
};

// Actions
describe('fetchRate', () => {
  it('creates the action with base currency as payload', () => {
    expect(fetchRate('EUR')).toEqual({
      type: RATE_FETCH_STARTED
    });
  });
});

describe('fetchRateSuccess', () => {
  it('creates the action with rate object as payload', () => {
    expect(fetchRateSuccess(mockRateObject)).toEqual({
      type: RATE_FETCH_SUCCEEDED,
      rates: mockRateObject
    });
  });
});

describe('fetchRateError', () => {
  it('creates the action with base currency as payload', () => {
    expect(fetchRateError('EUR')).toEqual({
      type: RATE_FETCH_FAILED
    });
  });
});

// Reducer

it('returns the intial state', () => {
  expect(rateReducer(undefined, {})).toEqual(initialState);
});

it('handles RATE_FETCH_STARTED and add the proper states', () => {
  const changes = rateReducer(initialState, fetchRate('EUR'));
  const expectedState = {
    hasError: false,
    isLoading: true
  };

  expect(changes).toEqual(expectedState);
});

it('handles RATE_FETCH_SUCCEEDED and transform the data correctly', () => {
  const changes = rateReducer(initialState, fetchRateSuccess(mockRateObject));
  const expectedState = {
    GBP: {
      EUR: mockRateObject.rates.EUR,
      USD: mockRateObject.rates.USD
    },
    hasError: false,
    isLoading: false
  };

  expect(changes).toEqual(expectedState);
});

it('handles RATE_FETCH_FAILED and add the proper states', () => {
  const changes = rateReducer(initialState, fetchRateError('EUR'));
  const expectedState = {
    hasError: true,
    isLoading: false
  };

  expect(changes).toEqual(expectedState);
});

// Selectors

describe('getRate', () => {
  it('should return the rate object', () => {
    expect(
      getRate({
        rate: {
          isLoading: false,
          hasError: false,
          EUR: {
            USD: 1,
            GBP: 2
          }
        }
      })
    ).toEqual({
      isLoading: false,
      hasError: false,
      EUR: {
        USD: 1,
        GBP: 2
      }
    });
  });
});

describe('getIsRateLoading', () => {
  it('should return the isLoading state', () => {
    expect(
      getIsRateLoading({
        rate: {
          isLoading: false,
          hasError: false,
          EUR: {
            USD: 1,
            GBP: 2
          }
        }
      })
    ).toEqual(false);
  });
});

describe('getRateHasError', () => {
  it('should return the hasError state', () => {
    expect(
      getRateHasError({
        rate: {
          isLoading: false,
          hasError: false,
          EUR: {
            USD: 1,
            GBP: 2
          }
        }
      })
    ).toEqual(false);
  });
});
