import React from 'react';
import styled from '@emotion/styled';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import PageVisibility from 'react-page-visibility';

import {
  exchangeCurrency,
  swapCurrencyPair,
  isExchangeDisabled
} from '../redux/modules/exchange';
import { setExchangeRate } from '../redux/modules/rate';
import { fetchRate } from '../api';

import Header from '../components/Header';
import PocketWrapper from '../components/PocketWrapper';
import ExchangeButton from '../components/ExchangeButton';
import ExchangeRate from '../components/ExchangeRate';
import SwapButton from '../components/SwapButton';

const ContentWrapper = styled.div`
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

class Exchange extends React.Component {
  constructor(props) {
    super(props);

    this.scheduleRateFetcher(this.props.selectedCurrency.source);
  }

  componentDidUpdate({ selectedCurrency }) {
    const shouldFetch =
      selectedCurrency.source !== this.props.selectedCurrency.source;

    if (shouldFetch) {
      this.scheduleRateFetcher(this.props.selectedCurrency.source);
    }
  }

  componentWillUnmount() {
    this.clearFetcherInstance();
  }

  scheduleRateFetcher = source => {
    const pockets = Object.keys(this.props.pockets).filter(
      pocket => pocket !== source
    );

    // Clear interval instance if already there
    this.clearFetcherInstance();

    this.updateRates(source, pockets);
    this.fetcherInstance = setInterval(
      () => this.updateRates(source, pockets),
      10000
    );
  };

  updateRates = async (source, pockets) => {
    const rates = await fetchRate(source, pockets);

    this.props.setExchangeRate(rates);
  };

  handleVisibilityChange = isVisible => {
    if (isVisible) {
      this.scheduleRateFetcher(this.props.selectedCurrency.source);
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

  render() {
    const {
      selectedCurrency,
      targetRate,
      exchangeDisabled,
      swapPockets,
      exchangeCurrency
    } = this.props;

    return (
      <PageVisibility onChange={this.handleVisibilityChange}>
        <>
          <Header />
          <ContentWrapper>
            <div>
              <PocketWrapper origin="source" />

              <InfoRow>
                <SwapButton onClick={swapPockets}>&#8645;</SwapButton>
                <ExchangeRate
                  selectedCurrency={selectedCurrency}
                  targetRate={targetRate}
                />
                <div />
              </InfoRow>

              <PocketWrapper origin="target" />
            </div>
            <ExchangeButton
              disabled={exchangeDisabled}
              onClick={exchangeCurrency}
            >
              Exchange
            </ExchangeButton>
          </ContentWrapper>
        </>
      </PageVisibility>
    );
  }
}

const pocketShape = PropTypes.shape({
  currency: PropTypes.string.isRequired,
  amount: PropTypes.number.isRequired
});

Exchange.propTypes = {
  pockets: PropTypes.objectOf(pocketShape).isRequired,
  targetRate: PropTypes.number,
  selectedCurrency: PropTypes.shape({
    source: PropTypes.string.isRequired,
    target: PropTypes.string.isRequired
  }).isRequired,
  exchangeDisabled: PropTypes.bool.isRequired,
  exchangeCurrency: PropTypes.func.isRequired,
  swapPockets: PropTypes.func.isRequired,
  setExchangeRate: PropTypes.func.isRequired
};

const mapStateToProps = ({ exchange, rate }) => ({
  pockets: exchange.pockets,
  targetRate:
    rate[exchange.selectedCurrency.source] &&
    rate[exchange.selectedCurrency.source][exchange.selectedCurrency.target],
  selectedCurrency: exchange.selectedCurrency,
  exchangeDisabled: isExchangeDisabled(exchange)
});

const mapDispatchToProps = dispatch => ({
  exchangeCurrency: () => {
    dispatch(exchangeCurrency());
  },
  swapPockets: () => {
    dispatch(swapCurrencyPair());
  },
  setExchangeRate: rates => {
    dispatch(setExchangeRate(rates));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Exchange);
