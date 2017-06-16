import React, {Component} from 'react'
import {connect} from 'react-redux';
import './App.css'
import RadioPads from './components/Radio-pads'
import Button from './components/Button';
import {apiGet} from './ducks/api-requests'
import {getRoundChoices, getRound, startRound, getFlagUrl, selectAnswer} from './ducks/rounds'
import {getSeconds} from './ducks/timer'

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

class App extends Component {
  // state = {countries: [], choices: null, currentIndex: null, round: {started: false}}

  componentDidMount() {
    this.props.apiGet('countries', '/api/countries');
  }

  handleSelection = selected => {
    this.props.selectAnswer(selected)
  }

  startRound = () => {
    this.props.startRound();
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
          {renderCurrentMessage(this.props.seconds, this.props.round.stoppedTime, this.props.round)}
          <div className="flag">
            {this.props.choices &&
              <img src={this.props.flagUrl} />}
          </div>
          <div style={{marginTop: '2em'}}>
            {this.props.choices &&
              <RadioPads options={this.props.choices} handleSelection={this.handleSelection}
                disabled={!this.props.round.active} />}
          </div>
          <div>
            {!this.props.round.active && <Button onClick={this.startRound}>Start</Button>}
          </div>
        </main>
      </div>
    )
  }
}

App.propTypes = {}

const mapStateToProps = state => ({
  choices: getRoundChoices(state),
  seconds: getSeconds(state),
  round: getRound(state),
  flagUrl: getFlagUrl(state),
})

export default connect(mapStateToProps, {apiGet, startRound, selectAnswer})(App)
