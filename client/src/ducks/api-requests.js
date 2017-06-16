import axios from 'axios'
import {getOr} from '../helpers.js'
import {call, put, takeEvery} from 'redux-saga/effects'
import {initialize} from './rounds'

// -----------------------
//       actions
// -----------------------
const FETCH_COUNTRIES = 'FETCH_COUNTRIES'
const FETCH_SUCCESS = 'FETCH_SUCCESS'
const FETCH_FAILURE = 'FETCH_FAILURE'
// -----------------------
//   action creators
// -----------------------
export const fetchCountries = () => ({type: FETCH_COUNTRIES})
export const fetchSuccess = (data) => ({type: FETCH_SUCCESS, data})
export const fetchFailure = (error) => ({type: FETCH_FAILURE, error})

// -----------------------
//        reducer
// -----------------------
const defaultRequest = {
  isLoading: false,
  error: null,
  data: null
}

export const apiRequest = (state = defaultRequest, action) => {
  switch (action.type) {
    case FETCH_COUNTRIES:
      return {...state, isLoading: true}
    case FETCH_SUCCESS:
      return {isLoading: false, error: null, data: action.data}
    case FETCH_FAILURE:
      return {...state, error: action.error}
    default:
      return state
  }
}

// -----------------------
//        selectors
// -----------------------
export const isLoading = state => getOr('apiRequests.isLoading', false, state)
export const getError = state => getOr('apiRequests.error', null, state)
export const getData = state => getOr('apiRequests.data', null, state)

// -----------------------
//        sagas
// -----------------------
function* fetch() {
  const response = yield call(apiAction, 'get', 'api/countries')
  try {
    yield put(fetchSuccess(response.data))
    yield put(initialize(response.data))
  } catch (err) {
    yield put(fetchFailure(err))
  }
}

export function* watchApiRequest() {
  yield takeEvery(FETCH_COUNTRIES, fetch)
}

// -----------------------
//      side effects
// -----------------------

// feel free to make this in a different way.
// But you probably want to isolate your api calls in a helper

export function apiAction(action, url, payload) { // eslint-disable-line no-unused-vars
  if (payload) {
    if (url.includes('login') || url.includes('auth')) {
      return axios[action](url, payload)
    }
    /* const token = getAuthToken()
    if (token) {
      return axios[action](`${url}?token=${token}`, payload)
    } */
  }
  return axios[action](url)
}
