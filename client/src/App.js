import React, {Component} from 'react'
import './App.css'
import {apiAction} from './ducks/api-requests.js'
import {getChoices,addSelection,addWin} from './ducks/rounds.js'
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
  countryList: [],
  // timer: 5
}

const statusTexts = {
  waiting: 'Select the correct country for the flag',
  success: 'Correct! :)',
  failure: 'You suck!'
}

class App extends Component {
  state = initialState

  handleCountryChoice = (choice) => {
    this.setState({
      answerStatus: (choice === this.state.correctAnswer) ? 'success' : 'failure',
      roundHasEnded: true
    })
  }

  // handleTimerUpdate = () => {
  //   let currentTime = this.state.timer
  //   if(currentTime >)
  //   this.setState({
  //     timer: this.state.timer - 1
  //   })
  // }

  resetRound = () => {
    this.props.addSelection(this.state.answerStatus=='success')
  //  if(this.state.answerStatus=='success'){
  //    this.props.addWin();
  //  }
    this.setState({
      ...getChoices(this.state.countryList),
      answerStatus: 'waiting',
      roundHasEnded: false
    })
  }

  componentDidMount() {
    const countriesPromise = apiAction('get', 'api/countries')
    countriesPromise.then(response => {
      const newState = {
        ...getChoices(response.data),
        countryList: response.data
      }
      this.setState(newState)
      console.log(this)
    })
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
          <h3>{statusTexts[this.state.answerStatus]}</h3>
          <div>Rounds played. {this.props.rounds.rounds}<br/>
          Right answers: {this.props.rounds.correct}
          </div>
          {
            this.state.correctAnswer
              ? <img src={'flags/' + this.state.correctAnswer + '.png'} alt='country flag' />
              : null
          }
          <div className='controls'>
            <RadioPads options={this.state.choices}
              handleSelection={this.handleCountryChoice}
              disabled={this.state.roundHasEnded} />
          </div>
          <div className='controls'>
            {this.state.roundHasEnded ? <Button onClick={this.resetRound}>
            New Round</Button> : null}
          </div>
        </main>
      </div>
    )
  }
}

App.propTypes = {}

const mapStateToProps = state => ({
  rounds: state.rounds
})

export default connect (mapStateToProps,{addSelection,addWin})(App)
