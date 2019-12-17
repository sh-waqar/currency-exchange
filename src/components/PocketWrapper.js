import React from 'react';
import styled from '@emotion/styled';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { changeCurrencyPair, changeAmount } from '../redux/modules/exchange';

import colors from '../colors';
import formatCurrency from '../helpers/formatCurrency';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 12px;
  background-color: ${props =>
    ({
      source: '#fff',
      target: colors.gray
    }[props.origin])};
  height: 120px;
`;

const CurrencySelector = styled.select`
  background-color: transparent;
  border: 0;
  font-size: 24px;
  cursor: pointer;
`;

const Balance = styled.div`
  color: ${props => (props.lowBalance ? 'red' : colors.lightGray)};
  font-size: 14px;
  padding-top: 8px;
  padding-left: 8px;
`;

export const ExchangeInput = styled.input`
  border: 0;
  font-size: 28px;
  text-align: right;
  background-color: transparent;
  outline: none;

  &::placeholder {
    color: ${colors.lightGray};
  }
`;

const PocketWrapper = ({
  origin,
  currency,
  balance,
  amount,
  rate,
  lowBalance,
  supportedPockets,
  ignoredCurrency,
  onCurrencyChange,
  onAmountChange
}) => (
  <Wrapper origin={origin}>
    <div>
      <CurrencySelector
        value={currency}
        onChange={({ target }) => onCurrencyChange(target.value)}
      >
        {supportedPockets
          .filter(pocket => pocket !== ignoredCurrency)
          .map(pocket => (
            <option key={pocket}>{pocket}</option>
          ))}
      </CurrencySelector>
      <Balance lowBalance={origin === 'source' && lowBalance}>
        Balance: {formatCurrency({ currency })(balance)}
      </Balance>
    </div>
    <ExchangeInput
      type="number"
      autoFocus={origin === 'source'}
      placeholder="0"
      min="0"
      value={`${amount}`}
      onChange={({ target }) => onAmountChange(target.value, rate)}
    />
  </Wrapper>
);

PocketWrapper.propTypes = {
  origin: PropTypes.oneOf(['source', 'target']).isRequired,
  currency: PropTypes.string.isRequired,
  balance: PropTypes.number.isRequired,
  amount: PropTypes.string.isRequired,
  rate: PropTypes.number,
  lowBalance: PropTypes.bool.isRequired,
  supportedPockets: PropTypes.array.isRequired,
  ignoredCurrency: PropTypes.string.isRequired,
  onCurrencyChange: PropTypes.func.isRequired,
  onAmountChange: PropTypes.func.isRequired
};

const mapStateToProps = ({ exchange, rate }, { origin }) => {
  const currency = exchange.selectedCurrency[origin];
  const lowBalance =
    parseFloat(exchange.currentValue[origin]) >
    parseFloat(exchange.pockets[currency].amount);
  const ignoredCurrency =
    origin === 'source'
      ? exchange.selectedCurrency.target
      : exchange.selectedCurrency.source;

  return {
    supportedPockets: Object.keys(exchange.pockets),
    currency,
    balance: exchange.pockets[currency].amount,
    ignoredCurrency,
    amount: exchange.currentValue[origin],
    lowBalance,
    rate:
      rate[exchange.selectedCurrency.source] &&
      rate[exchange.selectedCurrency.source][exchange.selectedCurrency.target]
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  onCurrencyChange: currency => {
    dispatch(changeCurrencyPair(ownProps.origin, currency));
  },
  onAmountChange: (amount, rate) => {
    dispatch(changeAmount(ownProps.origin, amount, rate));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(PocketWrapper);
