import {takeEvery, take, select, put} from 'redux-saga/effects'
import {getApiData} from './api-requests'
import {startTimer, stopTimer, getSeconds, TICK} from './timer'

// -----------------------
//       actions
// -----------------------

export const START_ROUND = 'round/START';
export const INIT_ROUND = 'round/INIT';
export const SELECT = 'round/SELECT';
const LOG_TIME = 'round/LOG_TIME'
const EXPIRE = 'round/EXPIRE'

// -----------------------
//   action creators
// -----------------------

export const startRound = () => ({type: START_ROUND})
export const initRound = payload => ({type: INIT_ROUND, payload})
export const selectAnswer = value => ({type: SELECT, payload: {value}})
export const logTime = value => ({type: LOG_TIME, payload: {value}})
const expire = () => ({type: EXPIRE})

// -----------------------
//        reducer
// -----------------------

export default function (state = {
  seconds: 0,
  stoppedTime: null,
}, action) {
  switch (action.type) {
    case START_ROUND: {
      return {
        ...state,
        active: true,
        stoppedTime: null,
      }
    }
    case INIT_ROUND: {
      return {
        ...state,
        ...action.payload,
      }
    }
    case SELECT: {
      return {
        ...state,
        active: false,
        isCorrect: action.payload.value === state.correctAnswer,
      }
    }
    case LOG_TIME: {
      return {
        ...state,
        stoppedTime: action.payload.value,
      }
    }
    case EXPIRE: {
      return {
        ...state,
        active: false,
      }
    }
    default:
      return state
  }
}

// -----------------------
//        selectors
// -----------------------

export const getRoundChoices = state => state.rounds.choices;
export const getRound = state => state.rounds;
export const getFlagUrl = state => `/flags/${(state.rounds.correctAnswer || '').toLowerCase()}.png`

// -----------------------
//        sagas
// -----------------------

function* doStartRound() {
  const countries = yield select(getApiData('countries'))
  const keys = Object.keys(countries);
  const indexes = [];
  while (indexes.length < 3) {
    const randomIndex = Math.floor(Math.random() * keys.length);
    if (!indexes.includes(randomIndex)) {
      indexes.push(randomIndex);
    }
  }
  const rand = Math.floor(Math.random() * 3);
  yield put(initRound({
    correctAnswer: keys[indexes[rand]],
    choices: indexes.map(x => ({[keys[x]]: countries[keys[x]]})),
    started: true,
  }))
  yield put(startTimer())
}

function* watchStartRound() {
  yield takeEvery(START_ROUND, doStartRound)
}

function* watchSelect() {
  while (true) {
    yield take(SELECT)
    const seconds = yield select(getSeconds)
    yield put(logTime(seconds))
    yield put(stopTimer())
  }
}

function* watchTimerExpire() {
  while (true) {
    yield take(TICK)
    const seconds = yield select(getSeconds)
    if (seconds <= 0) {
      yield put(expire())
    }
  }
}

export const sagas = [
  watchStartRound(),
  watchSelect(),
  watchTimerExpire(),
];

// -----------------------
//      side effects
// -----------------------

const getRandomNum = max => Math.floor(Math.random() * max)

const getRandomCountry = countries => {
  const keys = Object.keys(countries)
  const code = keys[getRandomNum(keys.length)]
  return {code, choice: {[code]: countries[code]}}
}

const getCorrectAnswer = choices =>
  Object.keys(choices[getRandomNum(choices.length)])[0]

function getChoices(countries, level) {   // eslint-disable-line no-unused-vars
  let numberOfChoices = level === 'hard' ? 5 : 3
  const choices = []
  const codes = []
  do {
    const {code, choice} = getRandomCountry(countries)
    if (codes.indexOf(code) === -1) {
      --numberOfChoices
      choices.push(choice)
      codes.push(code)
    }
  } while (numberOfChoices > 0)
  return {choices, correctAnswer: getCorrectAnswer(choices)}
}
