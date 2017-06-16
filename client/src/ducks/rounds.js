import createSagaMiddleware, {delay} from 'redux-saga'
import {
  takeEvery,
  call,
  put,
  all,
  fork,
  cancel,
  take
} from 'redux-saga/effects'

// -----------------------
//       actions
// -----------------------
const GET_CHOICES="GET_CHOICES";
const FOO_BAR = 'FOO_BAR'
const SELECTION = 'SELECTION'
const INCREMENT_ROUND = 'INCREMENT_ROUND'
const WIN = 'WIN'
// -----------------------
//   action creators
// -----------------------
export function addFooBar(){
  return{type: FOO_BAR};
}
export function addSelection(correct){
  return{type: 'SELECTION', correct}
}
export function addRoundIncrement(){
  return{type: INCREMENT_ROUND}
}
export function addWin(){
  return{type:WIN}
}
// -----------------------
//        reducer
// -----------------------
export default function roundReducer ( previousState={rounds:0, correct:0}, action){
    switch (action.type){
        case FOO_BAR:
            return Object.assign({}, previousState, { foo:'bar'})
        case SELECTION:
            return Object.assign({}, previousState );//,{rounds:previousState.rounds+1})
        case INCREMENT_ROUND:
            return Object.assign({}, previousState ,{rounds:previousState.rounds+1})
        case WIN:
            return Object.assign({}, previousState ,{correct:previousState.correct+1})
        default:
            return Object.assign({}, previousState, { foo:'bar'});
    }

}
// -----------------------
//        selectors
// -----------------------

// -----------------------
//        sagas
// -----------------------

export const sagaMiddleware = createSagaMiddleware()

export function* rootSaga(){
  yield all([
    wactchRounds()
  ])
}

function* wactchRounds(){
  console.log('watch rounds')
  yield takeEvery(SELECTION, incrementRound)
}

function* watchReset(){

}
function* incrementRound( test){
  
  console.log('incrementRound()')
  console.log(test)
  yield put(addRoundIncrement())
  if (test.correct){
    yield put(addWin())
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

