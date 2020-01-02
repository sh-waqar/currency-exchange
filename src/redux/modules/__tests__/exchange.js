import exchangeReducer, {
  CHANGE_AMOUNT,
  EXCHANGE_CURRENCY,
  CHANGE_CURRENCY_PAIR,
  SWAP_CURRENCY_PAIR,
  exchangeCurrency,
  changeAmount,
  changeCurrencyPair,
  swapCurrencyPair,
  getIsExchangeDisabled,
  getHasLowBalance,
  getPocketCurrencies,
  getSupportedPockets,
  getRealTimeValue,
  getCurrentRate,
  getActiveInput,
  getBalance
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
  },
  lastActiveInput: {
    source: false,
    target: false
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
  it('creates the action with origin, amount, and rate in payload', () => {
    const origin = 'source';
    const rate = 1.1;

    expect(changeAmount(origin, '100', rate)).toEqual({
      type: CHANGE_AMOUNT,
      origin,
      amount: '100',
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
      lastActiveInput: {
        source: true,
        target: false
      },
      currentValue: {
        source: '50',
        target: '55.00'
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
      lastActiveInput: {
        source: false,
        target: true
      },
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
      lastActiveInput: {
        source: true,
        target: false
      },
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
      lastActiveInput: {
        source: true,
        target: false
      },
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
      lastActiveInput: {
        source: true,
        target: false
      },
      currentValue: {
        source: '',
        target: ''
      }
    };

    expect(changes).toEqual(expectedState);
  });

  it('handle large numbers in source', () => {
    const changes = exchangeReducer(
      initialState,
      changeAmount('source', '9999999999999', 3.4)
    );
    const expectedState = {
      ...initialState,
      lastActiveInput: {
        source: true,
        target: false
      },
      currentValue: {
        source: '9999999999999',
        target: '33999999999996.60'
      }
    };

    expect(changes).toEqual(expectedState);
  });

  it('handle large numbers in target', () => {
    const changes = exchangeReducer(
      initialState,
      changeAmount('target', '2119999999999788', 212)
    );
    const expectedState = {
      ...initialState,
      lastActiveInput: {
        source: false,
        target: true
      },
      currentValue: {
        source: '9999999999999.00',
        target: '2119999999999788'
      }
    };

    expect(changes).toEqual(expectedState);
  });

  it('allow maximum of 1 trillion in source', () => {
    const changes = exchangeReducer(
      initialState,
      changeAmount('source', '99999999999999', 3.4)
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

describe('getBalance', () => {
  it('should return the balance for source and target based on selected currencies', () => {
    expect(getBalance({ exchange: initialState })).toEqual({
      source: '230',
      target: '650'
    });
  });
});

describe('getActiveInput', () => {
  it('should return last active input object', () => {
    expect(getActiveInput({ exchange: { ...initialState } })).toEqual({
      source: false,
      target: false
    });
  });
});

describe('getHasLowBalance', () => {
  it('should be false if source input is empty', () => {
    expect(getHasLowBalance({ exchange: initialState })).toEqual(false);
  });

  it('should be true if source amount is bigger than pocket money', () => {
    expect(
      getHasLowBalance({
        exchange: {
          ...initialState,
          currentValue: {
            source: '700'
          }
        }
      })
    ).toEqual(true);
  });

  it('should be false if source amount is positive and less than pocket money', () => {
    expect(
      getHasLowBalance({
        exchange: {
          ...initialState,
          currentValue: {
            source: '100'
          }
        }
      })
    ).toEqual(false);
  });
});

describe('getIsExchangeDisabled', () => {
  it('should be true if source input is empty', () => {
    expect(getIsExchangeDisabled({ exchange: initialState })).toEqual(true);
  });

  it('should be true if source amount is bigger than pocket money', () => {
    expect(
      getIsExchangeDisabled({
        exchange: {
          ...initialState,
          currentValue: {
            source: '700'
          }
        }
      })
    ).toEqual(true);
  });

  it('should be false if source amount is positive and less than pocket money', () => {
    expect(
      getIsExchangeDisabled({
        exchange: {
          ...initialState,
          currentValue: {
            source: '100'
          }
        }
      })
    ).toEqual(false);
  });
});

describe('getPocketCurrencies', () => {
  it('should return empty array for default case', () => {
    expect(
      getPocketCurrencies({
        exchange: {}
      })
    ).toEqual([]);
  });

  it('should return pocket currencies array', () => {
    expect(
      getPocketCurrencies({
        exchange: initialState
      })
    ).toEqual(['EUR', 'USD', 'GBP']);
  });
});

describe('getSupportedPockets', () => {
  it('should not include target currency for source currency dropdown and vice versa', () => {
    expect(
      getSupportedPockets({
        exchange: initialState
      })
    ).toEqual({
      source: ['EUR', 'USD'],
      target: ['USD', 'GBP']
    });
  });
});

describe('getRealTimeValue', () => {
  it('should get the realtime value for source and target based on current exchange rate', () => {
    expect(
      getRealTimeValue({
        exchange: {
          ...initialState,
          currentValue: {
            source: 100,
            target: 122
          }
        },
        rate: {
          EUR: {
            USD: 1.11,
            GBP: 1.22
          }
        }
      })
    ).toEqual({
      source: '100.00',
      target: '122.00'
    });
  });

  it('should return empty string if amount is 0 or malformed input', () => {
    expect(
      getRealTimeValue({
        exchange: {
          ...initialState,
          currentValue: {
            source: '',
            target: ''
          }
        }
      })
    ).toEqual({
      source: '',
      target: ''
    });
  });
});

describe('getCurrentRate', () => {
  it('should not return any exchange rate if rates are not loaded', () => {
    expect(
      getCurrentRate({
        exchange: {
          selectedCurrency: {
            source: 'GBP',
            target: 'USD'
          }
        },
        rate: {}
      })
    ).toBeUndefined();
  });

  it('should return the current exchange rate based on source and target selected currencies', () => {
    expect(
      getCurrentRate({
        exchange: {
          selectedCurrency: {
            source: 'GBP',
            target: 'USD'
          }
        },
        rate: {
          GBP: {
            EUR: 1.1,
            USD: 1.1
          }
        }
      })
    ).toEqual(1.1);
  });
});
