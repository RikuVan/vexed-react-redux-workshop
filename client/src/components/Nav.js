import React from 'react'
import PropTypes from 'prop-types'
import SignInOut from './Sign-in-out'
import './Nav.css'

const Nav = (
  {
    flags = 0,
    correct = 0,
    displayName,
    handleSignIn,
    handleSignOut,
    loading = false,
    userId
  }
) => (
  <nav className="Nav">
    <div className="Nav-item user-info">
      <div className="user-info detail">
        <strong>Richard</strong>
      </div>
      <div className="user-info detail">
        Total flags: <span className="detail-number">{flags}</span>
      </div>
      <div className="user-info detail">
        Correct: <span className="detail-number">{correct}</span>
      </div>
    </div>
    <SignInOut
      type={!userId ? 'SignIn' : 'SignOut'}
      onClickHandler={userId ? handleSignIn : handleSignOut}
      loading={false}
    />
  </nav>
)

Nav.propTypes = {
  flags: PropTypes.number,
  correct: PropTypes.number,
  displayName: PropTypes.string,
  userId: PropTypes.string,
  handleSignIn: PropTypes.func.isRequired,
  handleSignOut: PropTypes.func.isRequired
}

export default Nav

