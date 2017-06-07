const express = require('express')
const jwt = require('jwt-simple')
const moment = require('moment')
const clone = require('clone')
const jsonServer = require('json-server')
const data = require('./db.json')
const apiRouter = jsonServer.router(clone(data))
const middlewares = jsonServer.defaults()

const bodyParser = require('body-parser')

const server = express()

server.use(bodyParser.json())
server.use(middlewares)
server.set('jwtTokenSecret', 'vexed')

// routes
server.get('/api/users', isAuthorized)
server.use('/api', apiRouter)
server.post('/auth', (req, res) => {
  const token = req.body.token
  if (token) {
    const {sub} = jwt.decode(token, server.get('jwtTokenSecret'))
    const user = data.users.filter(user => user.username === sub)[0]

    if (user) {
      return res.json({
        token,
        user: {
          id: user.id,
          displayName: user.displayName,
          flags: user.flags,
          totalCorrect: user.totalCorrect
        }
      })
    } else {
      res.send(401)
    }
  } else {
    res.send(401)
  }
})
server.post('/login', (req, res) => {
  const {username, password} = req.body
  const user = data.users.filter(user => user.username === username)[0]

  if (user && user.password === password) {
    const token = createToken(username)

    return res.json({
      token,
      user: {
        id: user.id,
        displayName: user.displayName,
        flags: user.flags,
        totalCorrect: user.totalCorrect
      }
    })
  } else {
    res.send(401)
  }
})

server.use(express.static('./public'))

server.listen(3001)

function createToken(username) {
  const expires = moment().add(7, 'days').valueOf()
  return jwt.encode({
    sub: username.toLowerCase(),
    exp: expires
  }, server.get('jwtTokenSecret'))
}

function isAuthorized(req, res, next) {
  const token = (req.body && req.body.token) || (req.query && req.query.token)
  if (token) {
    try {
      jwt.decode(token, server.get('jwtTokenSecret'))
      next()
    } catch (err) {
      return res.send(400)
    }
  } else {
    return res.send(400)
  }
}
