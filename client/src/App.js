import React, {Component} from 'react'
import './App.css'
import RadioPads from './components/Radio-pads'
import {apiAction} from './ducks/api-requests'

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
  state = {countries: [], choices: null, currentIndex: null}

  componentDidMount() {
    apiAction('get', '/api/countries').then(resp => {
      const keys = Object.keys(resp.data);
      const indexes = [];
      while (indexes.length < 3) {
        const randomIndex = Math.floor(Math.random() * keys.length);
        if (!indexes.includes(randomIndex)) {
          indexes.push(randomIndex);
        }
      }
      const rand = Math.floor(Math.random() * 3);
      this.setState({
        countries: resp.data,
        randomOne: keys[indexes[rand]],
        choices: indexes.map(x => ({[keys[x]]: resp.data[keys[x]]})),
      })
    })
  }

  handleSelection = selected => {
    console.log(selected);
  }

  render() {
    console.log(this.state.choices);
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
          <h3>Please make me</h3>
          {this.state.randomOne && <img src={`//localhost:3001/flags/${this.state.randomOne.toLowerCase()}.png`} />}
          {this.state.choices && <RadioPads options={this.state.choices} handleSelection={this.handleSelection} />}
        </main>
      </div>
    )
  }
}

App.propTypes = {}

export default App
