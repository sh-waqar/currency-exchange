import React from 'react';
import styled from '@emotion/styled';

import colors from '../colors';
import formatCurrency from '../helpers/formatCurrency';

const Wrapper = styled.div`
  color: ${colors.blue};
  background-color: #fff;
  border: 2px solid ${colors.gray};
  padding: 4px 16px;
  border-radius: 12px;
  font-size: 14px;
`;

const ExchangeRate = ({ selectedCurrency, targetRate }) => {
  const sourceRateFormat = formatCurrency({
    currency: selectedCurrency.source,
    minimumFractionDigits: 0
  });
  const targetRateFormat = formatCurrency({
    currency: selectedCurrency.target,
    maximumFractionDigits: 4
  });

  return (
    <Wrapper>
      {sourceRateFormat(1)}
      {' = '}
      {targetRate ? targetRateFormat(targetRate) : '...'}
    </Wrapper>
  );
};

export default ExchangeRate;
