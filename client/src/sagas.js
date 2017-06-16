import {all} from 'redux-saga/effects'
import {sagas as apiSagas} from './ducks/api-requests';
import {sagas as roundsSagas} from './ducks/rounds';
import {sagas as timerSagas} from './ducks/timer';

export default function* rootSaga() {
  yield all([
    ...apiSagas,
    ...roundsSagas,
    ...timerSagas,
  ])
}
