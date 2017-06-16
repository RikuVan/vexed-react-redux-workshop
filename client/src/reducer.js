// TODO: make use of combineReducers here perhaps?
import {combineReducers} from 'redux'
import {apiRequest} from './ducks/api-requests.js'
import {round} from './ducks/rounds.js'
export default combineReducers({api: apiRequest, round})
