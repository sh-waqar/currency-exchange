import { createStore } from 'redux';

import rootReducer from './modules';

export default (initialState = {}) =>
  createStore(
    rootReducer,
    initialState,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  );
