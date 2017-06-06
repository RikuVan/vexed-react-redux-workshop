import {combineReducers} from 'redux'
import api from './ducks/api-requests'
import timer from './ducks/timer'
import rounds from './ducks/rounds'

export default combineReducers({api, timer, rounds})
