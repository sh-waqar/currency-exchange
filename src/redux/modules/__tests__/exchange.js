import exchangeReducer, {
  CHANGE_AMOUNT,
  EXCHANGE_CURRENCY,
  CHANGE_CURRENCY_PAIR,
  SWAP_CURRENCY_PAIR,
  exchangeCurrency,
  changeAmount,
  changeCurrencyPair,
  swapCurrencyPair,
  isExchangeDisabled
} from '../exchange';

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

// Actions

describe('exchangeCurrency', () => {
  it('creates the action without any payload', () => {
    expect(exchangeCurrency()).toEqual({
      type: EXCHANGE_CURRENCY
    });
  });
});

describe('changeAmount', () => {
  it('creates the action with origin, amount, and rate in payload and parseFloat the amount', () => {
    const origin = 'source';
    const rate = 1.1;

    expect(changeAmount(origin, '100', rate)).toEqual({
      type: CHANGE_AMOUNT,
      origin,
      amount: 100,
      rate
    });
  });

  it('does not parseFloat the amount if empty string', () => {
    const origin = 'source';
    const rate = 1.1;

    expect(changeAmount(origin, '', rate)).toEqual({
      type: CHANGE_AMOUNT,
      origin,
      amount: '',
      rate
    });
  });
});

describe('changeCurrencyPair', () => {
  it('creates the action with origin and new currency in payload', () => {
    const origin = 'source';
    const currency = 'USD';

    expect(changeCurrencyPair(origin, currency)).toEqual({
      type: CHANGE_CURRENCY_PAIR,
      origin,
      currency
    });
  });
});

describe('swapCurrencyPair', () => {
  it('creates the action without any payload', () => {
    expect(swapCurrencyPair()).toEqual({
      type: SWAP_CURRENCY_PAIR
    });
  });
});

// Reducer

it('returns the intial state', () => {
  expect(exchangeReducer(undefined, {})).toEqual(initialState);
});

describe('CHANGE_CURRENCY_PAIR', () => {
  it('change the currency pair for given source and reset the input values', () => {
    const changes = exchangeReducer(
      initialState,
      changeCurrencyPair('source', 'USD')
    );
    const expectedState = {
      ...initialState,
      selectedCurrency: {
        ...initialState.selectedCurrency,
        source: 'USD'
      },
      currentValue: {
        source: '',
        target: ''
      }
    };

    expect(changes).toEqual(expectedState);
  });
});

describe('SWAP_CURRENCY_PAIR', () => {
  it('swap between the source and target currencies and input values', () => {
    const updatedState = {
      ...initialState,
      currentValue: {
        source: '10',
        target: '15'
      }
    };
    const changes = exchangeReducer(updatedState, swapCurrencyPair());
    const expectedState = {
      ...initialState,
      selectedCurrency: {
        source: 'GBP',
        target: 'EUR'
      },
      currentValue: {
        source: '15',
        target: '10'
      }
    };

    expect(changes).toEqual(expectedState);
  });
});

describe('CHANGE_AMOUNT', () => {
  it('change the input value for source and update the target input based on rate', () => {
    const changes = exchangeReducer(
      initialState,
      changeAmount('source', '50', 1.1)
    );
    const expectedState = {
      ...initialState,
      currentValue: {
        source: '50',
        target: '55'
      }
    };

    expect(changes).toEqual(expectedState);
  });

  it('change the input value for target and update the source input based on rate', () => {
    const changes = exchangeReducer(
      initialState,
      changeAmount('target', '50', 1.1)
    );
    const expectedState = {
      ...initialState,
      currentValue: {
        source: '45.45',
        target: '50'
      }
    };

    expect(changes).toEqual(expectedState);
  });

  it('only allow values upto 2 decimal places', () => {
    const changes = exchangeReducer(
      initialState,
      changeAmount('source', '50.1234', 1.1)
    );
    const expectedState = {
      ...initialState,
      currentValue: {
        source: '50.12',
        target: '55.13'
      }
    };

    expect(changes).toEqual(expectedState);
  });

  it('only allow positive numbers', () => {
    const changes = exchangeReducer(
      initialState,
      changeAmount('source', '-50', 1.1)
    );
    const expectedState = {
      ...initialState,
      currentValue: {
        source: '',
        target: ''
      }
    };

    expect(changes).toEqual(expectedState);
  });

  it('set empty string', () => {
    const changes = exchangeReducer(
      initialState,
      changeAmount('source', '', 1.1)
    );
    const expectedState = {
      ...initialState,
      currentValue: {
        source: '',
        target: ''
      }
    };

    expect(changes).toEqual(expectedState);
  });
});

describe('EXCHANGE_CURRENCY', () => {
  it('exchange the currency from source to target based on current rate and reset inputs', () => {
    const updatedState = {
      ...initialState,
      selectedCurrency: {
        source: 'EUR',
        target: 'GBP'
      },
      currentValue: {
        source: '10',
        target: '15'
      }
    };
    const changes = exchangeReducer(updatedState, exchangeCurrency());
    const expectedState = {
      ...initialState,
      pockets: {
        ...initialState.pockets,
        EUR: {
          currency: 'EUR',
          amount: '220'
        },
        GBP: {
          currency: 'GBP',
          amount: '665'
        }
      },
      currentValue: {
        source: '',
        target: ''
      }
    };

    expect(changes).toEqual(expectedState);
  });
});

// Selector

describe('isExchangeDisabled', () => {
  it('should be true if source input is empty', () => {
    expect(isExchangeDisabled(initialState)).toEqual(true);
  });

  it('should be true if source amount is bigger than pocket money', () => {
    expect(
      isExchangeDisabled({
        ...initialState,
        currentValue: {
          source: '700'
        }
      })
    ).toEqual(true);
  });

  it('should be false if source amount is positive and less than pocket money', () => {
    expect(
      isExchangeDisabled({
        ...initialState,
        currentValue: {
          source: '100'
        }
      })
    ).toEqual(false);
  });
});
