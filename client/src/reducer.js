import {combineReducers} from 'redux';
import api from './ducks/api-requests';
import rounds from './ducks/rounds';
import timer from './ducks/timer';

export default combineReducers({
  api,
  rounds,
  timer,
})
