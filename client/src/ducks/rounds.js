import {take, put, all, call, takeEvery} from 'redux-saga/effects'
import {startCountdown, stopCountdown} from './timer'
import {getOr} from '../helpers'

// -----------------------
//       actions
// -----------------------

const INITIATE_ROUND = 'round/INITIATE'
const INITIALIZE_ROUND = 'round/INITIALIZE'
const RECORD_ROUND = 'round/RECORD'
const CHOOSE_FLAG = 'round/CHOOSE_FLAG'

// -----------------------
//   action creators
// -----------------------

const recordRound = isCorrect => ({type: RECORD_ROUND, isCorrect})
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

// -----------------------
//        reducer
// -----------------------

const initialState = {
  choices: [],
  flags: 0,
  totalCorrect: 0,
  isCorrect: null,
  level: 'easy',
  active: false
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
        correctAnswer: action.correctAnswer
      }
    case RECORD_ROUND: {
      return {
        ...rounds,
        totalCorrect: action.isCorrect ? rounds.totalCorrect + 1 : rounds.totalCorrect,
        isCorrect: rounds.isCorrect,
        flags: rounds.flags + 1,
        active: false
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
    const {isCorrect, remaining} = yield take(CHOOSE_FLAG)
    yield all([ put(stopCountdown(remaining)), put(recordRound(isCorrect)) ])
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
