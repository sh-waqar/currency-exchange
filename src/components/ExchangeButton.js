import styled from '@emotion/styled';

import colors from 'colors';

export default styled.button`
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
  transition: background-color 250ms ease-in-out;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;

    &:hover {
      background-color: ${colors.pink};
    }
  }
  &:hover {
    background-color: #cc097e;
  }
`;
