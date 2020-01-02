import React from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';

import colors from 'colors';
import formatCurrency from 'helpers/formatCurrency';

const Wrapper = styled.div`
  color: ${colors.blue};
  background-color: #fff;
  border: 2px solid ${colors.gray};
  padding: 4px 16px;
  border-radius: 12px;
  font-size: 14px;
`;

const ExchangeRate = ({ sourceCurrency, targetCurrency, targetRate }) => {
  const sourceRateFormat = formatCurrency({
    currency: sourceCurrency,
    minimumFractionDigits: 0
  });
  const targetRateFormat = formatCurrency({
    currency: targetCurrency,
    maximumFractionDigits: 4
  });

  return (
    <Wrapper data-testid="exchange-rate">
      <span data-testid="source-currency-rate">{sourceRateFormat(1)}</span>
      {' = '}
      <span data-testid="current-rate">
        {targetRate ? targetRateFormat(targetRate) : '...'}
      </span>
    </Wrapper>
  );
};

ExchangeRate.propTypes = {
  sourceCurrency: PropTypes.string.isRequired,
  targetCurrency: PropTypes.string.isRequired,
  targetRate: PropTypes.number
};

export default ExchangeRate;
