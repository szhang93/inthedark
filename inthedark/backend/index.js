const http = require('http')
const bodyParser = require('body-parser')
const express = require('express')
var sessions = require('./sessions')
var db = require('./db')
var cors = require('cors')
var socketIo = require('socket.io')

// Port
const port = process.env.PORT || 8080
const app = express()
// For parsing json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))

// Allow cross origin
// Currently allows any origin.
app.use(cors({
  origin: "http://localhost:3000",
}))
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Credentials", "true")
  next()
})
const server = http.createServer(app);


// API endpoints
// ------------------------------------------------
/*
 * body: session_id [String] [Unique]
 */
app.post('/session', sessions.createSession)
/*
 * body: user_id [String] [Unique]
 * body: user_alias [String]
 */
app.put('/user_alias', sessions.setUserAlias)
/*
 * query: session_id [String] [Unique]
 */
app.get('/session_exists', sessions.sessionExists)
/*
 * query: session_id [String] [Unique]
 * response: user_id [Unique] [Number]
 */
app.post('/user', sessions.createUser)


// Socket functions
// ------------------------------------------------
const msgCode = {
  CONNECTION : 0,
  DISCONNECT : 1,
  MESSAGE : 2
}
var io = socketIo(server)
io.origins('*:*') // Allows cors
io.on('connection', (socket) => {
  user_id = socket.handshake.query.user_id
  user_alias = socket.handshake.query.user_alias
  room = socket.handshake.query.room
  console.log("user connected: ",user_id, user_alias, room)
  socket.emit(room, {
    type: msgCode.CONNECTION,
    user_alias: user_alias
  })

  socket.on("bubble", (msg) => {
    io.emit(msg.room, {
      type: msgCode.MESSAGE,
      user_alias: msg.user_alias,
      message: msg.message,
      color : msg.color,
      time_stamp: msg.time_stamp
    })
  })

  socket.on('disconnect', () => {
    socket.emit(room, {
      type: msgCode.DISCONNECT,
      user_alias: user_alias
    })
  })
})






server.listen(port)
