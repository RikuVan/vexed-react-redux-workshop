import {call, put, takeEvery} from 'redux-saga/effects'
import axios from 'axios'
import {updateUser} from './user'
import {getOr} from '../helpers'

// -----------------------
//       actions
// -----------------------

const FETCH = 'api/FETCH'
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

function* request({action, resource, endpoint = 'api'}) {
  try {
    const {data} = yield call(apiAction, action, `${endpoint}/${resource}`)
    if (endpoint === 'login' || resource === 'user') {
      yield put(updateUser(data))
    } else {
      yield put({type: COMPLETE, resource, data})
    }
  } catch (error) {
    yield put({type: COMPLETE, error})
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
    return axios[action](url, payload)
  }
  return axios[action](url)
}
