import Big from 'big.js';

const initialState = {
  pockets: {
    EUR: {
      currency: 'EUR',
      amount: '230'
    },
    USD: {
      currency: 'USD',
      amount: '350'
    },
    GBP: {
      currency: 'GBP',
      amount: '650'
    }
  },
  selectedCurrency: {
    source: 'EUR',
    target: 'GBP'
  },
  currentValue: {
    source: '',
    target: ''
  }
};

// Helpers
const fixDecimalPoints = number => Math.floor(number * 100) / 100;

// Actions

export const CHANGE_AMOUNT = 'exchange/CHANGE_AMOUNT';
export const EXCHANGE_CURRENCY = 'exchange/EXCHANGE_CURRENCY';
export const CHANGE_CURRENCY_PAIR = 'exchange/CHANGE_CURRENCY_PAIR';
export const SWAP_CURRENCY_PAIR = 'exchange/SWAP_CURRENCY_PAIR';

// Action creators

export function exchangeCurrency() {
  return {
    type: EXCHANGE_CURRENCY
  };
}

export function changeAmount(origin, amount, rate) {
  return {
    type: CHANGE_AMOUNT,
    origin,
    amount: amount && parseFloat(amount),
    rate
  };
}

export function changeCurrencyPair(origin, currency) {
  return {
    type: CHANGE_CURRENCY_PAIR,
    origin,
    currency
  };
}

export function swapCurrencyPair() {
  return {
    type: SWAP_CURRENCY_PAIR
  };
}

// Reducers

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_CURRENCY_PAIR: {
      const { origin, currency } = action;

      return {
        ...state,
        selectedCurrency: {
          ...state.selectedCurrency,
          [origin]: currency
        },
        currentValue: {
          source: '',
          target: ''
        }
      };
    }

    case SWAP_CURRENCY_PAIR: {
      return {
        ...state,
        selectedCurrency: {
          source: state.selectedCurrency.target,
          target: state.selectedCurrency.source
        },
        currentValue: {
          source: state.currentValue.target,
          target: state.currentValue.source
        }
      };
    }

    case CHANGE_AMOUNT: {
      const { origin, amount, rate } = action;
      const opposite = origin === 'source' ? 'target' : 'source';

      if (amount < 0) {
        return state;
      }

      const fixedAmount = fixDecimalPoints(amount);
      const oppositeAmount =
        origin === 'source'
          ? Big(fixedAmount).times(rate)
          : Big(fixedAmount).div(rate);

      return {
        ...state,
        currentValue: {
          [origin]: amount ? Big(fixedAmount).toString() : amount,
          [opposite]: amount
            ? fixDecimalPoints(oppositeAmount).toString()
            : amount
        }
      };
    }

    case EXCHANGE_CURRENCY: {
      const sourceCurrency = state.selectedCurrency.source;
      const sourceAmount = state.currentValue.source;

      const targetCurrency = state.selectedCurrency.target;
      const targetAmount = state.currentValue.target;

      return {
        ...state,
        pockets: {
          ...state.pockets,
          [sourceCurrency]: {
            ...state.pockets[sourceCurrency],
            amount: Big(state.pockets[sourceCurrency].amount)
              .minus(sourceAmount)
              .toString()
          },
          [targetCurrency]: {
            ...state.pockets[targetCurrency],
            amount: Big(state.pockets[targetCurrency].amount)
              .add(targetAmount)
              .toString()
          }
        },
        currentValue: {
          source: '',
          target: ''
        }
      };
    }

    default: {
      return state;
    }
  }
}

// Selectors

export function isExchangeDisabled({
  selectedCurrency,
  currentValue,
  pockets
}) {
  const sourceCurrency = selectedCurrency.source;
  const sourceAmount = currentValue.source;

  return (
    !sourceAmount ||
    parseFloat(sourceAmount) > parseFloat(pockets[sourceCurrency].amount)
  );
}
