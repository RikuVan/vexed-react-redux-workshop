import React, {Component} from 'react'
import './App.css'
import {fetchCountries} from './ducks/api-requests.js'
import {initialize, chooseAnswer, startTimer} from './ducks/rounds'
import RadioPads from './components/Radio-pads.js'
import Button from './components/Button.js'
import {connect} from 'react-redux'

// this is a little helper you can use if you like, or erase and make your own
const renderCurrentMessage = (  // eslint-disable-line no-unused-vars
  seconds,
  stoppedTime,
  round
) => {
  const {active, isCorrect, started} = round
  const showWelcomeMessage = !started && !active
  const showStartMessage = stoppedTime === null && active
  const showSuccessMessage = stoppedTime > 0 && isCorrect
  const showMistakeMessage = stoppedTime > 0 && !isCorrect

  let message = <span>Oops, time expired</span>

  if (showWelcomeMessage) {
    message = <span>Welcome. Ready to get vexed?</span>
  } else if (showStartMessage) {
    message = <span>Time remaining: {seconds}</span>
  } else if (showSuccessMessage) {
    message = (
      <span>Good job! Answered in {10 - stoppedTime} {seconds === 1 ? 'second' : 'seconds'}</span>
    )
  } else if (showMistakeMessage) {
    message = <span>Wrong answer. Keep studying!</span>
  }
  return <div className='messages-text'>{message}</div>
}

const initialState = {
  choices: [],
  correctAnswer: '',
  answerStatus: 'waiting',
  roundHasEnded: false,
  countryList: []
}

const statusTexts = {
  waiting: 'Select the correct country for the flag',
  success: 'Correct! :)',
  failure: 'You suck!',
  timeOut: 'Time out!!'
}

class App extends Component {
  state = initialState

  handleCountryChoice = (choice) => {
    this.props.chooseAnswer(choice)
  }

  handleResetRound = () => {
    this.props.initialize(this.props.api.data)
    this.props.startTimer()
  }

  componentDidMount() {
    this.props.fetchCountries()
  }
  render() {
    return (
      <div className='App'>

        <div className='App-header'>
          <i className='fa fa-flag-o' aria-hidden='true' />
          <h1>Vexed</h1>
          <h4>
            A game to improve your vexillogical knowledge
          </h4>
        </div>

        <nav><h4 style={{color: '#fff'}}>Cool nav bar here</h4></nav>

        <main>
          <h3>{statusTexts[this.props.round.answerStatus]}</h3>
          <h3>Score: {this.props.round.score}</h3>
          <h3>Time: {this.props.round.timeLeft}</h3>
          {
            this.props.round.correctAnswer
              ? <img src={'flags/' + this.props.round.correctAnswer + '.png'} alt='country flag' />
              : null
          }
          <div className='controls'>
            <RadioPads options={this.props.round.choices}
              handleSelection={this.handleCountryChoice}
              disabled={this.props.round.hasEnded} />
          </div>
          <div className='controls'>
            {
              this.props.round.hasEnded
              ? <Button onClick={this.handleResetRound}>New Round</Button>
              : null
            }
          </div>
        </main>
      </div>
    )
  }
}

App.propTypes = {}

const mapStateToProps = state => ({
  round: state.round,
  api: state.api
})

export default connect(mapStateToProps, {fetchCountries, chooseAnswer, initialize, startTimer})(App)
