import React from 'react'
import PropTypes from 'prop-types'
import Loading from './Loading'
import Button from './Button'

const getButtonContent = (type, loading) => {
  if (loading) {
    return <Loading small />
  } else if (type === 'SignIn') {
    return (
      <span>
        <i className="fa fa-sign-in" /> Sign in
      </span>
    )
  }
  return (
    <span>
      <i className="fa fa-sign-out" /> Sign out
    </span>
  )
}

const SignInOut = ({type = 'SignIn', loading, onClickHandler}) => {
  return (
    <div className="SignInOut">
      <Button
        className={`block ${type === 'SignOut' ? 'destructive' : ''}`}
        onClick={onClickHandler}
        type="white"
      >
        {getButtonContent(type, loading)}
      </Button>
    </div>
  )
}

SignInOut.propTypes = {
  type: PropTypes.string,
  onClickHandler: PropTypes.func.isRequired,
  loading: PropTypes.bool
}

export default SignInOut
