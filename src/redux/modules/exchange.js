import Big from 'big.js';
import { createSelector } from 'reselect';

import validateInput from 'helpers/validateInput';
import { getRate } from 'redux/modules/rate';

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
  },
  lastActiveInput: {
    source: false,
    target: false
  }
};

const MAX_AMOUNT = 10000000000000 - 1; // 9.99 Trillion

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
    amount,
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
        },
        lastActiveInput: {
          source: state.lastActiveInput.target,
          target: state.lastActiveInput.source
        }
      };
    }

    case CHANGE_AMOUNT: {
      const { origin, amount, rate = 1 } = action;
      const opposite = origin === 'source' ? 'target' : 'source';
      const validAmount = validateInput(amount);
      const maxAllowedAmount =
        origin === 'source' ? MAX_AMOUNT : Big(MAX_AMOUNT).times(rate);
      const lastActiveInput = {
        [origin]: true,
        [opposite]: false
      };

      if (validAmount === '') {
        return {
          ...state,
          lastActiveInput,
          currentValue: {
            source: '',
            target: ''
          }
        };
      }

      if (parseFloat(validAmount) > maxAllowedAmount) {
        return state;
      }

      const parsedAmount =
        validAmount.split('.').length === 2 ? validAmount : Big(validAmount);

      const oppositeAmount =
        origin === 'source'
          ? Big(parsedAmount)
              .times(rate)
              .toFixed(2)
          : Big(parsedAmount)
              .div(rate)
              .toFixed(2);

      return {
        ...state,
        lastActiveInput,
        currentValue: {
          [origin]: parsedAmount.toString(),
          [opposite]: oppositeAmount.toString()
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

export const getSelectedCurrency = state => state.exchange.selectedCurrency;
export const getCurrentValue = state => state.exchange.currentValue;
export const getPockets = state => state.exchange.pockets || {};

export const getSourceCurrency = createSelector(
  getSelectedCurrency,
  selectedCurrency => selectedCurrency.source
);

export const getTargetCurrency = createSelector(
  getSelectedCurrency,
  selectedCurrency => selectedCurrency.target
);

export const getSourceAmount = createSelector(
  getCurrentValue,
  currentValue => currentValue.source
);

export const getBalance = createSelector(
  getPockets,
  getSelectedCurrency,
  (pockets, { source, target }) => ({
    source: pockets[source].amount,
    target: pockets[target].amount
  })
);

export const getActiveInput = state => state.exchange.lastActiveInput;

export const getCurrentRate = createSelector(
  getRate,
  getSourceCurrency,
  getTargetCurrency,
  (rate, sourceCurrency, targetCurrency) =>
    rate[sourceCurrency] && rate[sourceCurrency][targetCurrency]
);

export const getHasLowBalance = createSelector(
  getSourceCurrency,
  getSourceAmount,
  getPockets,
  (sourceCurrency, sourceAmount, pockets) =>
    parseFloat(sourceAmount) > parseFloat(pockets[sourceCurrency].amount)
);

export const getIsExchangeDisabled = createSelector(
  getHasLowBalance,
  getSourceAmount,
  (hasLowBalance, sourceAmount) => {
    const parsedAmount = parseFloat(sourceAmount);

    return isNaN(parsedAmount) || parsedAmount === 0 || hasLowBalance;
  }
);

export const getPocketCurrencies = createSelector(getPockets, pockets =>
  Object.keys(pockets)
);

export const getSupportedPockets = createSelector(
  getPocketCurrencies,
  getSelectedCurrency,
  (pockets, { source, target }) => ({
    source: pockets.filter(pocket => pocket !== target),
    target: pockets.filter(pocket => pocket !== source)
  })
);

export const getRealTimeValue = createSelector(
  getCurrentRate,
  getCurrentValue,
  (rate = 1, { source, target }) => {
    const parsedAmount = parseFloat(source);

    if (isNaN(parsedAmount) || parsedAmount === 0) {
      return {
        source: '',
        target: ''
      };
    }

    return {
      source: Big(target)
        .div(rate)
        .toFixed(2),
      target: Big(source)
        .times(rate)
        .toFixed(2)
    };
  }
);
