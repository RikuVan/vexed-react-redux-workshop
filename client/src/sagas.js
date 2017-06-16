import {all} from 'redux-saga/effects'
import {watchApiRequest} from './ducks/api-requests'

export default function* rootSaga() {
  yield all([
    watchApiRequest()
  ])
}
