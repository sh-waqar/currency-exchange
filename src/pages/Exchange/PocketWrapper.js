import React from 'react';
import styled from '@emotion/styled';
import { connect } from 'react-redux';
import AutosizeInput from 'react-input-autosize';
import PropTypes from 'prop-types';

import {
  changeCurrencyPair,
  changeAmount,
  getHasLowBalance,
  getRealTimeValue,
  getCurrentRate,
  getActiveInput,
  getCurrentValue,
  getBalance
} from 'redux/modules/exchange';

import colors from 'colors';
import formatCurrency from 'helpers/formatCurrency';

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

const BalanceWrapper = styled.div`
  min-width: 130px;
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

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const Sign = styled.span`
  font-size: 28px;
  vertical-align: top;
`;

const ExchangeInput = styled(AutosizeInput)`
  & input {
    border: 0;
    font-size: 28px;
    text-align: right;
    background-color: transparent;

    &::placeholder {
      color: #8b959e;
    }
  }
`;

const PocketWrapper = ({
  origin,
  currency,
  balance,
  amount,
  rate,
  isActive,
  realTimeValue,
  lowBalance,
  supportedPockets,
  onCurrencyChange,
  onAmountChange
}) => (
  <Wrapper origin={origin}>
    <BalanceWrapper>
      <CurrencySelector
        data-testid={`${origin}-currency-selector`}
        value={currency}
        aria-label={
          origin === 'source'
            ? 'Select source currency'
            : 'Select target currency'
        }
        onChange={({ target }) => onCurrencyChange(target.value)}
      >
        {supportedPockets.map(pocket => (
          <option key={pocket}>{pocket}</option>
        ))}
      </CurrencySelector>
      <Balance
        data-testid={`${origin}-balance`}
        lowBalance={origin === 'source' && lowBalance}
      >
        Balance: {formatCurrency({ currency })(balance)}
      </Balance>
    </BalanceWrapper>
    <InputWrapper>
      {parseFloat(amount) > 0 && <Sign>{origin === 'source' ? '-' : '+'}</Sign>}
      <ExchangeInput
        data-testid={`${origin}-input`}
        type="text"
        autoFocus={origin === 'source'}
        aria-label={
          origin === 'source' ? 'Enter source amount' : 'Enter target amount'
        }
        placeholder="0"
        value={isActive ? amount : realTimeValue}
        onChange={({ target }) => onAmountChange(target.value, rate)}
      />
    </InputWrapper>
  </Wrapper>
);

PocketWrapper.propTypes = {
  origin: PropTypes.oneOf(['source', 'target']).isRequired,
  currency: PropTypes.string.isRequired,
  balance: PropTypes.string.isRequired,
  amount: PropTypes.string.isRequired,
  rate: PropTypes.number,
  isActive: PropTypes.bool.isRequired,
  realTimeValue: PropTypes.string.isRequired,
  lowBalance: PropTypes.bool.isRequired,
  supportedPockets: PropTypes.array.isRequired,
  onCurrencyChange: PropTypes.func.isRequired,
  onAmountChange: PropTypes.func.isRequired
};

const mapStateToProps = (state, props) => ({
  realTimeValue: getRealTimeValue(state)[props.origin],
  isActive: getActiveInput(state)[props.origin],
  balance: getBalance(state)[props.origin],
  amount: getCurrentValue(state)[props.origin],
  lowBalance: getHasLowBalance(state),
  rate: getCurrentRate(state)
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onCurrencyChange: currency => {
    dispatch(changeCurrencyPair(ownProps.origin, currency));
  },
  onAmountChange: (amount, rate) => {
    dispatch(changeAmount(ownProps.origin, amount, rate));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(PocketWrapper);
