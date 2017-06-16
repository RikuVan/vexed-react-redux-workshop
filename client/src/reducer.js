// TODO: make use of combineReducers here perhaps?

import {combineReducers} from 'redux'
import roundReducer from './ducks/rounds.js'

export default combineReducers({rounds : roundReducer});
