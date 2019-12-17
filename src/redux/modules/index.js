import { combineReducers } from 'redux';

import exchange from './exchange';
import rate from './rate';

export default combineReducers({
  exchange,
  rate
});
