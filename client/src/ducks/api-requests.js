import {call, put, takeEvery} from 'redux-saga/effects'
import axios from 'axios'
import {getOr} from '../helpers'
import {getAuthToken} from './auth'

// -----------------------
//       actions
// -----------------------

export const FETCH = 'api/FETCH'
const COMPLETE = 'api/COMPLETE'

// -----------------------
//   action creators
// -----------------------

export const getCountries = () => ({type: FETCH, action: 'get', resource: 'countries'})

// -----------------------
//        reducer
// -----------------------

export default function reducer(requests = {}, action = {}) {
  switch (action.type) {
    case FETCH: {
      return {
        ...requests,
        [action.resource]: {status: 'in_progress'}
      }
    }
    case COMPLETE: {
      return {
        ...requests,
        [action.resource]: {status: action.error ? 'error' : 'success', ...action}
      }
    }
    default: return requests
  }
}

// -----------------------
//        selectors
// -----------------------

export const isLoading = resource => state =>
  getOr(`api.${resource}.status`, false, state) === 'in_progress'

export const selectCountries = state => getOr('countries', {}, state)

// -----------------------
//        sagas
// -----------------------

export function* request({action, resource = '', endpoint = 'api', payload}) {
  try {
    const {data} = yield call(apiAction, action, `${endpoint}/${resource}`, payload)

    if (endpoint === 'login' || endpoint === 'auth') {
      return data
    }

    yield put({type: COMPLETE, resource, data})
    return data
  } catch (error) {
    yield put({type: COMPLETE, resource, error: error})
    return {error}
  }
}

export function* watchRequests() {
  yield takeEvery(FETCH, request)
}

// -----------------------
//      side effects
// -----------------------

function apiAction(action, url, payload) {
  if (payload) {
    if (url.includes('login') || url.includes('auth')) {
      return axios[action](url, payload)
    }
    const token = getAuthToken()
    if (token) {
      return axios[action](`${url}?token=${token}`, payload)
    }
    console.log('missing token')
  }
  return axios[action](url)
}
