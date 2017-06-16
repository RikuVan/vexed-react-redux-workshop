import {take, race, call, put} from 'redux-saga/effects'
import {delay} from 'redux-saga'

// -----------------------
//       actions
// -----------------------

export const TICK = 'timer/TICK';
export const START_TIMER = 'timer/START';
export const STOP_TIMER = 'timer/STOP';

// -----------------------
//     action creators
// -----------------------

export const startTimer = () => ({type: START_TIMER})
export const stopTimer = () => ({type: STOP_TIMER})
const tick = value => ({type: TICK, payload: {value}})

// -----------------------
//        reducer
// -----------------------

export default function (state = {}, action) {
  if (action.type === TICK) {
    return {
      seconds: action.payload.value
    }
  }
  return state;
}

// -----------------------
//        selectors
// -----------------------

export const getSeconds = state => state.timer.seconds;

// -----------------------
//        sagas
// -----------------------

function* doStartTimer() {
  let seconds = 10;
  yield put(tick(seconds))
  while (seconds > 0) {
    yield call(delay, 1000)
    yield put(tick(--seconds))
  }
}

function* watchStartTimer() {
  while (true) {
    yield take(START_TIMER)
    yield race({
      timer: call(doStartTimer),
      cancel: take(STOP_TIMER),
    })
  }
}

export const sagas = [
  watchStartTimer()
]
