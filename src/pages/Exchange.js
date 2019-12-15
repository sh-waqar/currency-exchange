import React from 'react';
import styled from '@emotion/styled';

import Header from '../components/Header';
import PocketWrapper from '../components/PocketWrapper';
import colors from '../colors';

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

const Swap = styled.button`
  width: 32px;
  height: 32px;
  background-color: #fff;
  border: 2px solid ${colors.gray};
  font-size: 14px;
  border-radius: 100%;
  color: ${colors.blue};
  text-align: center;
  cursor: pointer;
`;

const ExchangeRate = styled.div`
  color: ${colors.blue};
  background-color: #fff;
  border: 2px solid ${colors.gray};
  padding: 4px 16px;
  border-radius: 12px;
  font-size: 14px;
`;

const ExchangeButton = styled.button`
  background-color: ${colors.pink};
  color: #fff;
  font-size: 14px;
  padding: 12px;
  width: calc(100% - 36px);
  margin: 0 18px 20px;
  border: 0;
  border-radius: 22px;
  font-weight: 500;
  font-size: 16px;
  cursor: pointer;
  box-shadow: 0px 4px 8px 2px #eb008d52;
`;

function Exchange() {
  return (
    <>
      <Header />
      <ContentWrapper>
        <div>
          <PocketWrapper origin="source" />
          <InfoRow>
            <Swap>&#8645;</Swap>
            <ExchangeRate>$1 = EUR 22</ExchangeRate>
          </InfoRow>
          <PocketWrapper origin="target" />
        </div>
        <ExchangeButton>Exchange</ExchangeButton>
      </ContentWrapper>
    </>
  );
}

export default Exchange;
