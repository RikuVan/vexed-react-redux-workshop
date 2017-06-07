import React, {Component} from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import Loading from './Loading'
import Button from './Button'
import {signIn, getUser, isLoadingUser, signOut} from '../ducks/auth'
import './Sign-in-out.css'

const getButtonContent = (user, loading) => {
  if (loading) {
    return <Loading small />
  } else if (!user) {
    return (
      <span>
        <i className='fa fa-sign-in' /> Sign in
      </span>
    )
  }
  return (
    <span>
      <i className='fa fa-sign-out' /> Sign out
    </span>
  )
}

class SignInOut extends Component {
  state = {username: '', password: ''}

  handleInput = e => {
    const field = e.target.name
    const value = e.target.value
    this.setState({[field]: value})
  }

  signIn = () => {
    this.props.signIn({
      username: this.state.username,
      password: this.state.password
    })
    this.setState({username: '', password: ''})
  }

  signOut = () => this.props.signOut(null)

  render() {
    return (
      <div className='Sign-in-out'>
        {!this.props.user &&
          <form className='form'>
            <input
              className='Sign-in-out-input'
              type='text'
              name='username'
              placeholder='Username'
              required
              onChange={this.handleInput}
            />
            <input
              className='Sign-in-out-input'
              type='password'
              name='password'
              placeholder='Password'
              required
              onChange={this.handleInput}
            />
          </form>}
        <Button
          className={
            `block ${!this.props.user ? 'destructive' : ''}`
          }
          onClick={this.props.user ? this.signOut : this.signIn}
          type='white'
        >
          {getButtonContent(this.props.user, this.props.loading)}
        </Button>
      </div>
    )
  }
}

SignInOut.propTypes = {
  loading: PropTypes.bool,
  signIn: PropTypes.func.isRequired,
  signOut: PropTypes.func.isRequired,
  user: PropTypes.object
}

const mapStateToProps = state => ({
  user: getUser(state),
  loading: isLoadingUser(state)
})

export default connect(mapStateToProps, {signIn, signOut})(SignInOut)
