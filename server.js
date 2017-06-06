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

server.get('/api/users', isAuthorized)
server.use('/api', apiRouter)
server.post('/login', (req, res) => {
  const {username, password} = req.body
  const user = data.users[username]
  if (user && user.password === password) {
    const expires = moment().add('days', 7).valueOf()
    const token = jwt.encode({
      iss: username,
      exp: expires
    }, server.get('jwtTokenSecret'))
    res.json({
      token,
      expires
    })
  } else {
    res.send(401)
  }
})

server.use(express.static('./public'))

server.listen(3001)

function isAuthorized(req, res, next) {
  console.log(req.params, res)
  const token = (req.body && req.body.access_token) ||
    (req.query && req.query.access_token) || req.headers['x-access-token']
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
