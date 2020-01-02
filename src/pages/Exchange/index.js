import React from 'react';
import styled from '@emotion/styled';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import PropTypes from 'prop-types';
import PageVisibility from 'react-page-visibility';

import {
  exchangeCurrency,
  swapCurrencyPair,
  getPocketCurrencies,
  getIsExchangeDisabled,
  getCurrentRate,
  getSupportedPockets,
  getSourceCurrency,
  getTargetCurrency
} from 'redux/modules/exchange';
import {
  fetchRate,
  fetchRateSuccess,
  fetchRateError,
  getIsRateLoading,
  getRateHasError
} from 'redux/modules/rate';
import { fetchExchangeRate } from 'api';

import Header from 'components/Header';
import ExchangeButton from 'components/ExchangeButton';
import ExchangeRate from 'components/ExchangeRate';
import SwapButton from 'components/SwapButton';

import PocketWrapper from './PocketWrapper';

const FormWrapper = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-grow: 1;
`;

const InfoRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: -16px;
  padding: 0 12px;
`;

const ErrorMessage = styled.div`
  padding: 12px;
  background-color: #000;
  color: #fff;
  margin: 0 18px 20px;
  border-radius: 4px;
  text-align: center;
`;

class Exchange extends React.Component {
  constructor(props) {
    super(props);

    this.scheduleRateFetcher(this.props.sourceCurrency);
  }

  componentDidUpdate({ sourceCurrency }) {
    const shouldFetch = sourceCurrency !== this.props.sourceCurrency;

    if (shouldFetch) {
      this.scheduleRateFetcher(this.props.sourceCurrency);
    }
  }

  componentWillUnmount() {
    this.clearFetcherInstance();
  }

  scheduleRateFetcher = source => {
    const pockets = this.props.supportedPockets.target;

    // Clear interval instance if already there
    this.clearFetcherInstance();

    this.updateRates(source, pockets);
    this.fetcherInstance = setInterval(
      () => this.updateRates(source, pockets),
      10000
    );
  };

  updateRates = async (source, pockets) => {
    this.props.fetchRate(source);

    try {
      const rates = await fetchExchangeRate(source, pockets);

      this.props.fetchRateSuccess(rates);
    } catch (e) {
      this.props.fetchRateError(source);
    }
  };

  handleVisibilityChange = isVisible => {
    if (isVisible) {
      this.scheduleRateFetcher(this.props.sourceCurrency);
    } else {
      this.clearFetcherInstance();
    }
  };

  clearFetcherInstance = () => {
    if (!this.fetcherInstance) {
      return;
    }

    clearInterval(this.fetcherInstance);
    this.fetcherInstance = null;
  };

  closeSection = () => {
    alert('Closing section');
  };

  submitForm = evt => {
    this.props.exchangeCurrency();
    evt.preventDefault();
  };

  render() {
    const {
      sourceCurrency,
      targetCurrency,
      targetRate,
      isExchangeDisabled,
      rateHasError,
      supportedPockets,
      swapPockets
    } = this.props;

    return (
      <PageVisibility onChange={this.handleVisibilityChange}>
        <>
          <Header onClose={this.closeSection} />
          <FormWrapper onSubmit={this.submitForm}>
            <div>
              <PocketWrapper
                origin="source"
                currency={sourceCurrency}
                supportedPockets={supportedPockets.source}
              />

              <InfoRow>
                <SwapButton
                  type="button"
                  data-testid="swap-button"
                  aria-label="Swap source and target currencies"
                  onClick={swapPockets}
                >
                  &#8645;
                </SwapButton>
                <ExchangeRate
                  sourceCurrency={sourceCurrency}
                  targetCurrency={targetCurrency}
                  targetRate={targetRate}
                />
                <div />
              </InfoRow>

              <PocketWrapper
                origin="target"
                currency={targetCurrency}
                supportedPockets={supportedPockets.target}
              />
            </div>
            {rateHasError && (
              <ErrorMessage role="alert" data-testid="error-message">
                Fetching exchange rates failed
              </ErrorMessage>
            )}
            {!rateHasError && (
              <ExchangeButton
                type="submit"
                data-testid="exchange-button"
                disabled={isExchangeDisabled}
              >
                Exchange
              </ExchangeButton>
            )}
          </FormWrapper>
        </>
      </PageVisibility>
    );
  }
}

Exchange.propTypes = {
  pocketCurrencies: PropTypes.array.isRequired,
  targetRate: PropTypes.number,
  sourceCurrency: PropTypes.string.isRequired,
  targetCurrency: PropTypes.string.isRequired,
  supportedPockets: PropTypes.shape({
    source: PropTypes.array.isRequired,
    target: PropTypes.array.isRequired
  }).isRequired,
  isExchangeDisabled: PropTypes.bool.isRequired,
  exchangeCurrency: PropTypes.func.isRequired,
  swapPockets: PropTypes.func.isRequired,
  fetchRate: PropTypes.func.isRequired,
  fetchRateSuccess: PropTypes.func.isRequired,
  fetchRateError: PropTypes.func.isRequired
};

const mapStateToProps = createStructuredSelector({
  pocketCurrencies: getPocketCurrencies,
  targetRate: getCurrentRate,
  supportedPockets: getSupportedPockets,
  sourceCurrency: getSourceCurrency,
  targetCurrency: getTargetCurrency,
  isExchangeDisabled: getIsExchangeDisabled,
  rateIsLoading: getIsRateLoading,
  rateHasError: getRateHasError
});

const mapDispatchToProps = dispatch => ({
  exchangeCurrency: () => {
    dispatch(exchangeCurrency());
  },
  swapPockets: () => {
    dispatch(swapCurrencyPair());
  },
  fetchRate: source => {
    dispatch(fetchRate(source));
  },
  fetchRateSuccess: rates => {
    dispatch(fetchRateSuccess(rates));
  },
  fetchRateError: source => {
    dispatch(fetchRateError(source));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Exchange);
