import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import './index.css'
import registerServiceWorker from './registerServiceWorker'
import {applyMiddleware, compose, createStore} from 'redux'
import {Provider} from 'react-redux'
import createSagaMiddleware from 'redux-saga'
import reducer from './reducer.js'

import rootSaga from './sagas'

const sagaMiddleware = createSagaMiddleware()
const middleware = [ sagaMiddleware ]
const enhancers = []
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const store = createStore(
  reducer,
  composeEnhancers(applyMiddleware(...middleware), ...enhancers),
)

sagaMiddleware.run(rootSaga)

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
)

registerServiceWorker()
