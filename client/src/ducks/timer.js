import {eventChannel, END} from 'redux-saga'
import {call, put, take, cancelled, race} from 'redux-saga/effects'
import {getOr} from '../helpers'

// -----------------------
//       actions
// -----------------------

const START_COUNTDOWN = 'timer/START_COUNTDOWN'
const STOP_COUNTDOWN = 'timer/STOP_COUNTDOWN'
const RESET_TIMER = 'timer/RESET_TIMER'
const DECREMENT = 'timer/DECREMENT'

// -----------------------
//     action creators
// -----------------------

const resetTimer = () => ({type: RESET_TIMER})
export const startCountdown = () => ({type: START_COUNTDOWN, value: 10})
export const stopCountdown = stoppedAt => ({type: STOP_COUNTDOWN, stoppedAt})

// -----------------------
//        reducer
// -----------------------

const initialState = {seconds: 10, remaining: null, stoppedAt: null}

export default function reducer(time = initialState, action) {
  switch (action.type) {
    case RESET_TIMER:
      return initialState
    case DECREMENT:
      return {
        ...time,
        seconds: action.value
      }
    case STOP_COUNTDOWN:
      return {
        seconds: 0,
        stoppedAt: action.stoppedAt
      }
    default:
      return time
  }
}

// -----------------------
//        selectors
// -----------------------

export const getSeconds = state => getOr('timer.seconds', 10, state)
export const getStopTime = state => getOr('timer.stoppedAt', null, state)

// -----------------------
//        sagas
// -----------------------

const countdown = seconds => {
  return eventChannel(listener => {
    const ticker = setInterval(() => {
      seconds -= 1
      if (seconds > 0) {
        listener(seconds)
      } else {
        listener(END)
        clearInterval(ticker)
      }
    }, 1000)
    return () => clearInterval(ticker)
  })
}

function* doCountdown({value}) {
  const chan = yield call(countdown, value)

  try {
    while (true) {
      const seconds = yield take(chan)
      yield put({type: DECREMENT, value: seconds})
    }
  } finally {
    if (!(yield cancelled())) {
      yield put(stopCountdown(0))
    }
    chan.close()
  }
}

export function* watchCountdownTimer() {
  while (true) {
    const action = yield take(START_COUNTDOWN)
    yield put(resetTimer())

    yield race([
      call(doCountdown, action),
      take(STOP_COUNTDOWN)
    ])
  }
}
