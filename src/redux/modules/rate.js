const initialState = {
  isLoading: false,
  hasError: false
};

// Actions

export const RATE_FETCH_STARTED = 'rate/RATE_FETCH_STARTED';
export const RATE_FETCH_SUCCEEDED = 'rate/RATE_FETCH_SUCCEEDED';
export const RATE_FETCH_FAILED = 'rate/RATE_FETCH_FAILED';

// Action creators

export function fetchRate() {
  return {
    type: RATE_FETCH_STARTED
  };
}

export function fetchRateSuccess(rates) {
  return {
    type: RATE_FETCH_SUCCEEDED,
    rates
  };
}

export function fetchRateError() {
  return {
    type: RATE_FETCH_FAILED
  };
}

// Reducers

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case RATE_FETCH_STARTED: {
      return {
        ...state,
        isLoading: true,
        hasError: false
      };
    }

    case RATE_FETCH_SUCCEEDED: {
      const { rates } = action;

      return {
        ...state,
        [rates.base]: rates.rates,
        isLoading: false,
        hasError: false
      };
    }

    case RATE_FETCH_FAILED: {
      return {
        ...state,
        isLoading: false,
        hasError: true
      };
    }

    default: {
      return state;
    }
  }
}

// Selectors

export const getRate = state => state.rate || {};

export const getIsRateLoading = state => state.rate.isLoading;

export const getRateHasError = state => state.rate.hasError;
