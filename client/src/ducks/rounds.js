import {take, put, all, call, takeEvery, select} from 'redux-saga/effects'
import {startCountdown, stopCountdown} from './timer'
import {getOr} from '../helpers'
import {AUTH_SUCCESS} from './auth'
import {request} from './api-requests'

// -----------------------
//       actions
// -----------------------

const INITIATE_ROUND = 'round/INITIATE'
const INITIALIZE_ROUND = 'round/INITIALIZE'
const RECORD_ROUND_SYNC = 'round/RECORD_SYNC'
const RECORD_ROUND_ASYNC = 'round/RECORD_ASYNC'
const CHOOSE_FLAG = 'round/CHOOSE_FLAG'
const RESET_ROUND = 'round/RESET'

// -----------------------
//   action creators
// -----------------------

const recordRoundSync = isCorrect => ({type: RECORD_ROUND_SYNC, isCorrect})
const recordRoundAsync = (flags, totalCorrect, isCorrect) =>
  ({type: RECORD_ROUND_ASYNC, flags, totalCorrect, isCorrect})
export const chooseFlag = data => ({type: CHOOSE_FLAG, ...data})
const initializeRound = (choices, correctAnswer) => ({
  type: INITIALIZE_ROUND,
  choices,
  correctAnswer
})
export const initiateRound = (countries, level) => ({
  type: INITIATE_ROUND,
  countries,
  level
})
export const resetRound = () => ({type: RESET_ROUND})

// -----------------------
//        reducer
// -----------------------

const initialState = {
  choices: [],
  flags: 0,
  totalCorrect: 0,
  isCorrect: null,
  level: 'easy',
  active: false,
  started: false
}

export default function reducer(rounds = initialState, action = {}) {
  switch (action.type) {
    case INITIALIZE_ROUND:
      return {
        ...rounds,
        active: true,
        isCorrect: null,
        level: action.level || 'easy',
        choices: action.choices,
        correctAnswer: action.correctAnswer,
        started: true
      }
    case RESET_ROUND: {
      return initialState
    }
    case RECORD_ROUND_SYNC: {
      return {
        ...rounds,
        totalCorrect: action.isCorrect ? rounds.totalCorrect + 1 : rounds.totalCorrect,
        isCorrect: action.isCorrect,
        flags: rounds.flags + 1,
        active: false
      }
    }
    case RECORD_ROUND_ASYNC: {
      return {
        ...rounds,
        totalCorrect: action.totalCorrect,
        isCorrect: action.isCorrect,
        flags: action.flags,
        active: false
      }
    }
    case AUTH_SUCCESS: {
      return {
        ...rounds,
        totalCorrect: action.payload.user.totalCorrect,
        flags: action.payload.user.flags
      }
    }
    default:
      return rounds
  }
}

// -----------------------
//        selectors
// -----------------------

export const getRounds = state => getOr('rounds', {}, state)
export const getCurrentFlagCode = state =>
  getOr('rounds.correctAnswer', null, state)

// -----------------------
//        sagas
// -----------------------

function* doRounds({countries, level}) {
  const {choices, correctAnswer} = yield call(getChoices, countries, level)
  yield put(initializeRound(choices, correctAnswer))
  yield put(startCountdown())
}

function* watchRounds() {
  yield takeEvery(INITIATE_ROUND, doRounds)
}

function* watchResponses() {
  while (true) {
    const {isCorrect, remaining, userId} = yield take(CHOOSE_FLAG)
    yield put(stopCountdown(remaining))
    if (!userId) {
      yield put(recordRoundSync(isCorrect))
    } else {
      const {totalCorrect, flags} = yield select(getRounds)

      const payload = {
        flags: flags + 1,
        totalCorrect: isCorrect ? totalCorrect + 1 : totalCorrect
      }

      const response = yield call(
        request,
        {
          action: 'patch',
          resource: `users/${userId}`,
          endpoint: 'api',
          payload
        })

      yield put(recordRoundAsync(response.flags, response.totalCorrect, isCorrect))
    }
  }
}

export function* watchRoundsAndResponses() {
  yield all([ watchRounds(), watchResponses() ])
}

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

function getChoices(countries, level) {
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
