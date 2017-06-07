import {watchRequests as api} from './ducks/api-requests'
import {watchCountdownTimer as timer} from './ducks/timer'
import {watchRoundsAndResponses as rounds} from './ducks/rounds'
import {watchAuth as auth} from './ducks/auth'

import {all} from 'redux-saga/effects'

export default function* rootSaga() {
  yield all([
    api(),
    timer(),
    rounds(),
    auth()
  ])
}

