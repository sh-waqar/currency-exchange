import React from 'react';
import styled from '@emotion/styled';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 12px;
  background-color: #fff;
`;

const CloseBtn = styled.button`
  border: 0;
  background-color: transparent;
  font-size: 28px;
  cursor: pointer;
`;

const Title = styled.h1`
  font-size: 22px;
  font-weight: 400;
  margin-left: 10px;
`;

const Header = ({ onClose }) => (
  <Wrapper>
    <CloseBtn
      aria-label="Close currency exchange section"
      data-testid="close-button"
      onClick={onClose}
    >
      &times;
    </CloseBtn>
    <Title>Exchange</Title>
  </Wrapper>
);

export default Header;
