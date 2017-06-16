// -----------------------
//       actions
// -----------------------
const INITIALIZE = 'INITIALIZE'
const CHOOSE_ANSWER = 'CHOOSE_ANSWER'

// -----------------------
//   action creators
// -----------------------
export const initialize = countryList => ({type: INITIALIZE, countryList})
export const chooseAnswer = choice => ({type: CHOOSE_ANSWER, choice})

// -----------------------
//        reducer
// -----------------------
const defaultRound = {
  choices: [],
  correctAnswer: '',
  answerStatus: 'waiting',
  hasEnded: false
}

export const round = (state = defaultRound, action) => {
  switch (action.type) {
    case INITIALIZE:
      return {
        ...defaultRound,
        ...getChoices(action.countryList)
      }
    case CHOOSE_ANSWER:
      const answerStatus = (action.choice === state.correctAnswer) ? 'success' : 'failure'
      return {
        ...state,
        hasEnded: true,
        answerStatus
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

// -----------------------
//        sagas
// -----------------------

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
