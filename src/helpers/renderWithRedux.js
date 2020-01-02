import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';

import configureStore from 'redux/configureStore';

export default function renderWithRedux(
  ui,
  { initialState, store = configureStore(initialState) } = {}
) {
  return {
    ...render(<Provider store={store}>{ui}</Provider>),
    store
  };
}
