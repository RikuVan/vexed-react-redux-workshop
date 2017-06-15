# React/Redux/Redux-saga Workshop: Project Vexed

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

## Getting Started

### Installations

- A recent version of [Node.js](https://nodejs.org/en/)
- [Yarn](https://yarnpkg.com/en/)

### Starting the app

- `yarn run install:all`  concurrently installs dependencies for the client and server--each has its own package.json
- `yarn start` concurrently starts the backend node server and the client server, both the client and server will reload when changes are made

### Api

All requests from the client (port 3000) are proxied to the backend (port 3001)

`/api/countries` returns an object of key value pairs, the key being a country code and the value the country name

`/api/users/{:id}` returns users and you can perform the usual crud operations (make sure the authorization check is disabled in server.js)

`/pictures/` serves pngs of each flag, with the names corresponding to the country codes lowercased, e.g. fi.png

You probably won't have time to use them but there is also auth endpoints

`/login` returns a token and user with if a valid username and password is given in the request body

`/auth` checks for a valid token in the body and returns a user and token

The database is not persistent

## The workshop

### TIPS
  * Clone the master branch to get started. But if you get stuck you can checkout the solution branch to peek at one way to do it.
  * We left a number of components for you since you may not have time to do everything from scratch but you may of course change them or make your own.
  * A very useful utility for avoiding null exceptions, `getOr` has been provided under `/helpers` to ease in making selectors; however, if you would like more, feel free to yarn install e.g. lodash or ramda.

### Sprint 1: THE BASIC QUIZ (REACT ONLY!)
  A user wants to see a random country flag and three possible choices of country names. The choices are radio
  buttons and the user can choose once.
  
  1. Make a request to the backend for the countries in the correct lifecycle hook and save the
  countries on the state of the component. You will also need to have additional state to handle the choices and correct answer,
  as well as some ui state.
  2. After pressing a button the user should understand that the round is finished as well as her success/failure.
  
### Sprint 2: REDUX, REACT-REDUX, AND REDUX-SAGA REFACTOR
  The user is not satisfied with just React; she has to complicate things. She wants 'ducks' with actions, action creators,
  sagas, side-effects, and maybe even selectors: one for api calls/ getting the countries and one for tracking the rounds, ie. the score.
  
  1. Hook up your reducers and sagas middleware to the redux store and then provide the store to your app.
  2. Make use of your fancy store with the help of react-redux `connect`. Move all your component state to the store and
  dispatch actions to your middleware and reducers instead of handling side-effects inside the component.
  3. Your sagas `take` actions to be dispatched and `put` new actions and `call` side effects to update your state as needed. 
  So your app does all the same stuff and is now three times as much code. An improvement...hmmm?
  
### Sprint 3: COUNTDOWN TIMER (REDUX-SAGA SHOWS ITS POWER)
  The user thrives on pressure and wants a countdown timer. If she doesn't answer in a give time, she is loses her chance until the next round.
  
  1. Now we can exploit redux sagas ability to handle complex user interactions and asynchronicity. We will need to have some helper
  functions/generators to tick away seconds and a way to cancel these if the user answers in time.
  2. We also want to see the result in the UI. You will need to use a number of flag checks in the render method to show just the right message
  to the user. Did time run out? Was the answer right or wrong? How do we tell them to start again?
  
### Sprint 4: AUTH AND ASYNC ROUNDS (PROBABLY NO TIME FOR THIS...HOMEWORK?)
  The user wants to log in so he or she can save her performances across sessions.
  
  1. The backend will provide a jwt to persist in local storage (or at least in the store). You will need to hook up the login form in the nav and
  send off the username and password to get this jwt back. We can then hit the `/auth` endpoint on refreshes of the app.
  Then you need to figure out how to handle logging out and showing all of this in the UI...yeah this is getting onerous.
  2. Finally, we would want to send our count of attempts--successful and total--to the backend to persist instead of just directly updating the reducer, 
  patching the user data and sending the updated data on to our reducer, if the request is successful.
  We probably only want to allow this if the token is passed along as a query param.
  3. Well if you get this far, well done!
  
### Resources:
  - [Workshop slides](https://rikuvan.github.io/vexed/)
  - [React docs](https://facebook.github.io/react/docs/)
  - [Ducks architecture](https://github.com/erikras/ducks-modular-redux)
  - [Redux Actions](https://facebook.github.io/react/docs/react-component.html)
  - [React redux](https://github.com/reactjs/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options)
  - [Redux with React and connect](http://redux.js.org/docs/basics/UsageWithReact.html)
  - [Redux Reducers](http://redux.js.org/docs/basics/Reducers.html)
  - [Middleware](http://redux.js.org/docs/advanced/Middleware.html)
  - [Higher Order Components](https://facebook.github.io/react/docs/higher-order-components.html)
  - [Redux-saga](https://redux-saga.js.org/)
  
  

 
  

