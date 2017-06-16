import {all} from 'redux-saga/effects'
import {watchApiRequest} from './ducks/api-requests'
import {watchTimer} from './ducks/rounds'

export default function* rootSaga() {
  yield all([
    watchApiRequest(),
    watchTimer()
  ])
}
