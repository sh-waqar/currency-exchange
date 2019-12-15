import React from 'react';
import styled from '@emotion/styled';
import { connect } from 'react-redux';

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
        Balance: {formatCurrency(balance, currency)}
      </Balance>
    </div>
    <ExchangeInput
      type="number"
      autoFocus={origin === 'source'}
      placeholder="0"
      min="0"
      value={`${amount}`}
      onChange={({ target }) => onAmountChange(target.value)}
    />
  </Wrapper>
);

const mapStateToProps = ({ exchange }, { origin }) => {
  const currency = exchange.selectedCurrency[origin];
  const lowBalance =
    exchange.currentValue[origin] > exchange.pockets[currency].amount;
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
    lowBalance
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  onCurrencyChange: currency => {
    dispatch(changeCurrencyPair(ownProps.origin, currency));
  },
  onAmountChange: amount => {
    dispatch(changeAmount(ownProps.origin, amount));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(PocketWrapper);
