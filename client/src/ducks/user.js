import {takeEvery} from 'redux-saga/effects'
import {getOr} from '../helpers'

// -----------------------
//       actions
// -----------------------

const SIGNIN = 'user/SIGNIN'
const SIGNOUT = 'user/SIGNOUT'
const FETCH_USER = 'user/FETCH_USER'
const UPDATE_USER = 'user/UPDATE_USER'

// -----------------------
//     action creators
// -----------------------

export const signIn = () => ({type: SIGNIN})
export const signOut = () => ({type: SIGNOUT})
export const updateUser = user => ({type: UPDATE_USER, user})

// -----------------------
//        reducer
// -----------------------

const defaultUser = {
  loading: false,
  token: null
}

export default function reducer(user = defaultUser, action) {
  switch (action.type) {
    case SIGNIN:
      return {...user, loading: true}
    default:
      return user
  }
}

// -----------------------
//        selectors
// -----------------------

export const getUser = state => getOr('user', {}, state)

// -----------------------
//        sagas
// -----------------------

function* doAuth({username, password}) {
  return
}

export function* watchUser() {
  yield takeEvery(SIGNIN, doAuth)
}
