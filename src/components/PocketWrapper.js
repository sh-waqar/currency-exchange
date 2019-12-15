import React from 'react';
import styled from '@emotion/styled';

import colors from '../colors';

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
`;

const Balance = styled.div`
  color: ${colors.lightGray};
  font-size: 14px;
  padding-top: 8px;
  padding-left: 8px;
`;

export const ExchangeInput = styled.input`
  border: 0;
  font-size: 28px;
  text-align: right;
  background-color: transparent;

  &::-webkit-input-placeholder {
    color: ${colors.lightGray};
  }
  &:-ms-input-placeholder {
    color: ${colors.lightGray};
  }
  &::placeholder {
    color: ${colors.lightGray};
  }
`;

function PocketWrapper({ origin }) {
  return (
    <Wrapper origin={origin}>
      <div>
        <CurrencySelector>
          <option key="EUR">EUR</option>
          <option key="USD">USD</option>
          <option key="GBP">GBP</option>
        </CurrencySelector>
        <Balance>Balance: $123,22</Balance>
      </div>
      <ExchangeInput placeholder="0" />
    </Wrapper>
  );
}

export default PocketWrapper;
