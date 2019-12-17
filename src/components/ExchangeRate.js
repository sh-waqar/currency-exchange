import React from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';

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

ExchangeRate.propTypes = {
  selectedCurrency: PropTypes.shape({
    source: PropTypes.string.isRequired,
    target: PropTypes.string.isRequired
  }).isRequired,
  targetRate: PropTypes.number
};

export default ExchangeRate;
