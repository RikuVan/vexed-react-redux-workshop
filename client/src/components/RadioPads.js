import React, {Component} from 'react'
import {PropTypes} from 'prop-types'
import './RadioPads.css'

class RadioPads extends Component {
  state = {selected: ''}

  handleSelection = e => {
    const selected = e.target.value
    this.setState({selected})
    this.props.handleSelection(selected)
  };

  render() {
    const {options: opts, disabled} = this.props
    return (
      <div className="options-wrapper">
        {opts.map((country, key) => {
          const code = Object.keys(country)[0]
          const isCurrent = this.state.selected === code
          return (
            <div key={key} className="RadioPad">
              <div>
                <label
                  className={
                    isCurrent
                      ? 'RadioPad-wrapper RadioPad-wrapper--selected'
                      : 'RadioPad-wrapper'
                  }
                >
                  <input
                    className="RadioPad-radio"
                    type="radio"
                    name="countries"
                    id={code}
                    value={code}
                    onChange={this.handleSelection}
                    disabled={disabled}
                  />
                  {country[code]}
                </label>
              </div>
            </div>
          )
        })}
      </div>
    )
  }
}

RadioPads.propTypes = {
  options: PropTypes.array.isRequired,
  disabled: PropTypes.bool
}

export default RadioPads

