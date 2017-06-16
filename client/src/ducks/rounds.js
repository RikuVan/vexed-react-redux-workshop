import {take, call, put, race, select} from 'redux-saga/effects'
import {delay} from 'redux-saga'
import {getOr} from '../helpers.js'
// -----------------------
//       actions
// -----------------------
const INITIALIZE = 'INITIALIZE'
const CHOOSE_ANSWER = 'CHOOSE_ANSWER'
const TICK = 'TICK'
const START_TIMER = 'START_TIMER'
const STOP_TIMER = 'STOP_TIMER'

// -----------------------
//   action creators
// -----------------------
export const initialize = countryList => ({type: INITIALIZE, countryList})
export const chooseAnswer = choice => ({type: CHOOSE_ANSWER, choice})
export const tick = () => ({type: TICK})
export const startTimer = () => ({type: START_TIMER})
export const stopTimer = () => ({type: STOP_TIMER})

// -----------------------
//        reducer
// -----------------------
const defaultRound = {
  choices: [],
  correctAnswer: '',
  answerStatus: 'waiting',
  hasEnded: false,
  timeLeft: 5,
  score: 0
}

export const round = (state = defaultRound, action) => {
  switch (action.type) {
    case INITIALIZE:
      return {
        ...defaultRound,
        ...getChoices(action.countryList),
        score: state.score
      }
    case CHOOSE_ANSWER:
      {
        const answerStatus = (action.choice === state.correctAnswer) ? 'success' : 'failure'
        const score = state.score + (answerStatus === 'success' ? 1 : 0)
        return {
          ...state,
          hasEnded: true,
          score,
          answerStatus
        }
      }
    case TICK:
      {
        const isTimeOut = state.timeLeft === 1
        const answerStatus = isTimeOut ? 'timeOut' : state.answerStatus
        const hasEnded = state.hasEnded || isTimeOut
        return {
          ...state,
          timeLeft: state.timeLeft - 1,
          hasEnded: hasEnded,
          answerStatus
        }
      }
    default:
      return state
  }
}

// -----------------------
//        selectors
// -----------------------
// export const getChoices = state => getOr('round.choices', [], state)
// export const getCorrectAnswer = state => getOr('round.correctAnswer', '', state)
// export const getAnswerStatus = state => getOr('round.answerStatus', 'waiting', state)
// export const hasEnded = state => getOr('round.hasEnded', false, state)
const getTimeLeft = state => getOr('round.timeLeft', 5, state)
const hasEnded = state => getOr('round.hasEnded', false, state)

// -----------------------
//        sagas
// -----------------------
function* timer() {
  while (true) {
    yield put(tick())
    const timeLeft = yield select(getTimeLeft)
    const roundEnded = yield select(hasEnded)
    console.log(roundEnded)
    if (timeLeft <= 0 || roundEnded) {
      break
    }
    yield call(delay, 1000)
  }
  put(stopTimer())
}

export function* watchTimer(){
  while (true) {
    yield take(START_TIMER)
    yield race(
      [
        call(timer),
        take(STOP_TIMER)
      ]
    )
  }
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

export function getChoices(countries, level) {   // eslint-disable-line no-unused-vars
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
