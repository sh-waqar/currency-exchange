import Big from 'big.js';

const initialState = {
  pockets: {
    EUR: {
      currency: 'EUR',
      amount: 231
    },
    USD: {
      currency: 'USD',
      amount: 351
    },
    GBP: {
      currency: 'GBP',
      amount: 653
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

const CHANGE_AMOUNT = 'exchange/CHANGE_AMOUNT';
const EXCHANGE_CURRENCY = 'exchange/EXCHANGE_CURRENCY';
const CHANGE_CURRENCY_PAIR = 'exchange/CHANGE_CURRENCY_PAIR';
const SWAP_CURRENCY_PAIR = 'exchange/SWAP_CURRENCY_PAIR';

// Action creators

export function exchangeCurrency(source, target, amount) {
  return {
    type: EXCHANGE_CURRENCY,
    source,
    target,
    amount
  };
}

export function changeAmount(origin, amount) {
  return {
    type: CHANGE_AMOUNT,
    origin,
    amount
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
        }
      };
    }

    case SWAP_CURRENCY_PAIR: {
      return {
        ...state,
        selectedCurrency: {
          source: state.selectedCurrency.target,
          target: state.selectedCurrency.source
        }
      };
    }

    case CHANGE_AMOUNT: {
      const { origin, amount } = action;
      const opposite = origin === 'source' ? 'target' : 'source';

      if (amount === '') {
        return {
          ...state,
          currentValue: {
            [origin]: amount,
            [opposite]: state.currentValue[opposite]
          }
        };
      }

      const fixedAmount = fixDecimalPoints(amount);

      return {
        ...state,
        currentValue: {
          [origin]: Big(fixedAmount),
          [opposite]: fixDecimalPoints(Big(fixedAmount).times(1.2))
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
            amount: Big(state.pockets[sourceCurrency].amount).minus(
              sourceAmount
            )
          },
          [targetCurrency]: {
            ...state.pockets[targetCurrency],
            amount: Big(state.pockets[targetCurrency].amount).add(targetAmount)
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

export function isExchangeDisabled({ exchange }) {
  const sourceCurrency = exchange.selectedCurrency.source;
  const sourceAmount = exchange.currentValue.source;

  return (
    !sourceAmount || sourceAmount > exchange.pockets[sourceCurrency].amount
  );
}
