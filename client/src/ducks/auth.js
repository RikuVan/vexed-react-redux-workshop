import {race, take, call, put, all} from 'redux-saga/effects'
import {getOr} from '../helpers'
import {request} from './api-requests'
import {resetRound} from './rounds'

// -----------------------
//       actions
// -----------------------

const SIGN_IN = 'user/SIGN_IN'
const SIGN_OUT = 'user/SIGN_OUT'
export const AUTH_SUCCESS = 'user/AUTH_SUCCESS'
const UPDATE_USER = 'user/UPDATE_USER'
const AUTHENTICATE = 'user/AUTHENTICATE'

// -----------------------
//     action creators
// -----------------------

export const signIn = payload => ({type: SIGN_IN, payload})
export const signOut = error => ({type: SIGN_OUT, error})
export const updateUser = user => ({type: UPDATE_USER, user})
export const authSuccess = payload => ({type: AUTH_SUCCESS, payload})
export const authenticate = () => ({type: AUTHENTICATE})

// -----------------------
//        reducer
// -----------------------

const defaultUser = {
  loading: false,
  user: null,
  error: null,
  displayName: null
}

export default function reducer(userState = defaultUser, action) {
  switch (action.type) {
    case SIGN_IN:
      return {...userState, loading: true}
    case AUTH_SUCCESS:
      return {
        ...userState,
        loading: false,
        error: null,
        ...action.payload
      }
    case SIGN_OUT:
      return {
        ...defaultUser,
        loading: false,
        error: action.error
      }
    default:
      return userState
  }
}

// -----------------------
//        selectors
// -----------------------

export const getUser = state => getOr('auth.user', null, state)
export const isLoadingUser = state => getOr('auth.loading', null, state)
export const getUserDisplayName = state => getOr('auth.user.displayName', null, state)
export const isAuthorized = state => {
  const id = getOr('auth.user.id', null, state)
  return !!id
}
export const getUserId = state => getOr('auth.user.id', null, state)

// -----------------------
//        sagas
// -----------------------

function* authorize(endpoint, credentialsOrToken) {
  const {response} = yield race({
    response: call(
      request,
      {
        action: 'post',
        endpoint,
        payload: credentialsOrToken
      }),
    signout: take(SIGN_OUT)
  })
  const {token, error} = response

  if (token) {
    yield call(setAuthToken, token)
    yield put(authSuccess(response))
  }
  if (error) {
    yield call(removeAuth, error.response.data)
  }
}

function* watchSignIn() {
  while (true) {
    const {payload} = yield take(SIGN_IN)
    if (payload) {
      yield call(authorize, 'login', payload)
    }
  }
}

function* removeAuth(error) {
  yield all([
    put(signOut(error)),
    call(removeAuthToken),
    put(resetRound())
  ])
}

function* watchSignOut() {
  while (true) {
    yield take(SIGN_OUT)
    yield all([
      call(removeAuthToken),
      put(resetRound())
    ])
  }
}

function* watchAuthentication() {
  while (true) {
    yield take(AUTHENTICATE)
    const token = yield call(getAuthToken)
    if (token) {
      yield call(authorize, 'auth', {token})
    } else {
      call(removeAuth, null)
    }
  }
}

export function* watchAuth() {
  yield all([
    watchSignIn(),
    watchSignOut(),
    watchAuthentication()
  ])
}

// -----------------------
//      side effects
// -----------------------

export function getAuthToken() {
  const token = localStorage.getItem('token')
  return token ? JSON.parse(token) : null
}

function setAuthToken(token) {
  localStorage.setItem('token', JSON.stringify(token))
}

function removeAuthToken() {
  localStorage.removeItem('token')
}

