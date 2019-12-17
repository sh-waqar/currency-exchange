const initialState = {};

// Actions

export const SET_EXCHANGE_RATE = 'rate/SET_EXCHANGE_RATE';

// Action creators

export function setExchangeRate(rates) {
  return {
    type: SET_EXCHANGE_RATE,
    rates
  };
}

// Reducers

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_EXCHANGE_RATE: {
      const { rates } = action;

      return {
        ...state,
        [rates.base]: rates.rates
      };
    }

    default: {
      return state;
    }
  }
}
