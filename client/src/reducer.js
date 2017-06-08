import {combineReducers} from 'redux'
import api from './ducks/api-requests'
import timer from './ducks/timer'
import rounds from './ducks/rounds'
import auth from './ducks/auth'

export default combineReducers({api, timer, rounds, auth})
