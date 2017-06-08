import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import './App.css'
import {getCountries, isLoading} from './ducks/api-requests'
import {getSeconds, startCountdown, getStopTime} from './ducks/timer'
import {authenticate, getUserDisplayName, getUserId} from './ducks/auth'
import Nav from './components/Nav'
import Button from './components/Button'
import {
  initiateRound,
  getRounds,
  getCurrentFlagCode,
  chooseFlag
} from './ducks/rounds'
import RadioPads from './components/Radio-pads'

const renderCurrentMessage = (
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
  componentDidMount() {
    this.props.authenticate()
    this.props.getCountries()
  }

  startRound = () =>
    this.props.initiateRound(
      this.props.countries.data,
      this.props.rounds.level
    )

  handleSelection = value => {
    this.props.chooseFlag({
      isCorrect: value === this.props.currentFlag && this.props.seconds > 0,
      remaining: this.props.seconds,
      userId: this.props.userId
    })
  }

  render() {
    const {
      countries,
      loading,
      seconds,
      currentFlag,
      rounds,
      stoppedAt,
      displayName
    } = this.props

    if (loading || !countries) {
      return <div>...loading</div>
    }

    const getHourglass = () => {
      if (seconds >= 7) {
        return 'start'
      } else if (seconds >= 4) {
        return 'half'
      }
      return 'end'
    }

    return (
      <div className='App'>

        <div className='App-header'>
          <i className='fa fa-flag-o' aria-hidden='true' />
          <h1>Vexed</h1>
          <h4>
            A game to improve your vexillogical knowledge
          </h4>
        </div>

        <Nav
          flags={rounds.flags}
          correct={rounds.totalCorrect}
          displayName={displayName}
        />

        <main>
          <div className='messages'>
            {renderCurrentMessage(
              seconds,
              stoppedAt,
              rounds,
            )}
          </div>

          <div className='flag'>
            {currentFlag
              ? <img
                  src={`flags/${currentFlag.toLowerCase()}.png`}
                  width='250'
                  alt='logo'
                />
              : <i className='fa fa-flag-o' aria-hidden='true' />}
          </div>

          {rounds.choices &&
            <div className='options'>
              <RadioPads
                options={rounds.choices}
                handleSelection={this.handleSelection}
                disabled={stoppedAt !== null}
              />
            </div>}

          <div className='controls'>
            <Button
              type='main'
              active={seconds > 0 && rounds.active}
              onClick={this.startRound}
            >
              <span>
                <icon
                  className={`fa fa-hourglass-${getHourglass(seconds)}`}
                  aria-hidden='true'
                />
                {' '}{!rounds.active || stoppedAt !== null ? 'I\'m ready to play' : '...waiting' }
              </span>
            </Button>
          </div>

        </main>
      </div>
    )
  }
}

App.propTypes = {
  countries: PropTypes.object,
  loading: PropTypes.bool,
  seconds: PropTypes.number,
  rounds: PropTypes.object.isRequired,
  currentFlag: PropTypes.string,
  stoppedAt: PropTypes.number,
  authenticate: PropTypes.func.isRequired,
  getCountries: PropTypes.func.isRequired,
  initiateRound: PropTypes.func.isRequired,
  chooseFlag: PropTypes.func.isRequired,
  displayName: PropTypes.string,
  userId: PropTypes.number
}

const mapStateToProps = state => ({
  countries: state.api.countries,
  loading: isLoading('countries')(state),
  seconds: getSeconds(state),
  rounds: getRounds(state),
  currentFlag: getCurrentFlagCode(state),
  stoppedAt: getStopTime(state),
  displayName: getUserDisplayName(state),
  userId: getUserId(state)
})

export default connect(mapStateToProps, {
  getCountries,
  startCountdown,
  initiateRound,
  chooseFlag,
  authenticate
})(App)
