import React from 'react'
import PropTypes from 'prop-types'
import SignInOut from './Sign-in-out'
import './Nav.css'

const Nav = (
  {
    flags = 0,
    correct = 0,
    displayName
  }
) => (
  <nav className='Nav'>
    <div className='Nav-item user-info'>
      {displayName &&
        <div className='user-info detail'>
          <strong>
            {displayName}
          </strong>
        </div>
      }
      <div className='user-info detail'>
        Total flags: <span className='detail-number'>{flags}</span>
      </div>
      <div className='user-info detail'>
        Correct: <span className='detail-number'>{correct}</span>
      </div>
    </div>
    <SignInOut />
  </nav>
)

Nav.propTypes = {
  flags: PropTypes.number.isRequired,
  correct: PropTypes.number.isRequired,
  displayName: PropTypes.string
}

export default Nav
