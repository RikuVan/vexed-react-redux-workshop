import axios from 'axios'
import {take, call, put} from 'redux-saga/effects';

// -----------------------
//       actions
// -----------------------

export const API_ACTION = 'api/ACTION';

// -----------------------
//   action creators
// -----------------------

export const apiRequestStart = payload => ({
  type: API_ACTION,
  payload: {...payload, phase: 'request'}
})

export const apiRequestSuccess = payload => ({
  type: API_ACTION,
  payload: {...payload, phase: 'success'}
})

export const apiGet = (key, url) => apiRequestStart({key, url, method: 'get'});

// -----------------------
//        reducer
// -----------------------

const initialState = {};

export default function (state = initialState, action) {
  if (action.type === API_ACTION) {
    const {payload} = action;
    const {key, phase} = payload;
    return {
      ...state,
      [key]: {
        ...state[key],
        error: payload.error || null,
        data: payload.error ? null : payload.data,
        status: phase
      }
    }
  }
  return state;
}

// -----------------------
//        selectors
// -----------------------

export const getApiData = key => state => (state.api[key] || {}).data

// -----------------------
//        sagas
// -----------------------

function* watchApi() {
  while (true) {
    const action = yield take(
      action => action.type === API_ACTION && action.payload.phase === 'request');
    const payload = action.payload;
    const resp = yield call(apiAction, payload.method, payload.url);
    yield put(apiRequestSuccess({...payload, data: resp.data}))
    // TODO error handling
  }
}

export const sagas = [
  watchApi(),
];

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
