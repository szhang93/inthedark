const http = require('http')
const bodyParser = require('body-parser')
const express = require('express')
var sessions = require('./sessions')
var randomNames = require('./randomNames')
var db = require('./db')
var cors = require('cors')
var socketIo = require('socket.io')
var cron = require('node-cron')

// Port
const port = process.env.PORT || 8080
const app = express()
// For parsing json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))

// Allow cross origin
// Currently allows any origin.
app.use(cors({
  origin: "*",
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
/*
 * query: session_id
 * response: count
 */
app.get('/user_count', sessions.getSessionUserCount)
/*
 * body: user_alias
 * body: session_id
 */
app.put('/user_with_alias', sessions.createUserWithAlias)
app.get('/random_user_alias', randomNames.genUserAlias)
app.get('/random_room', randomNames.genSessionName)


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
  // Obtain user_id, alias, etc
  const user_id = socket.handshake.query.user_id
  const user_alias = socket.handshake.query.user_alias
  const room = socket.handshake.query.room

  // Emit message to the room that someone has joined
  io.emit(room, {
    type: msgCode.CONNECTION,
    message: `${user_alias} joined the chat`
  })

  // Receive a message
  socket.on("bubble", (msg) => {
    io.emit(msg.room, {
      type: msgCode.MESSAGE,
      user_alias: msg.user_alias,
      message: msg.message,
      color : msg.color,
      time_stamp: msg.time_stamp
    })
  })

  // Emit that someone has disconnected.
  // Also, check to see if the room is empty.
  socket.on('disconnect', (socket) => {
    console.log(user_alias, " has disconnected")
    io.emit(room, {
      type: msgCode.DISCONNECT,
      message: `${user_alias} has disconnected`
    })

    // Delete the user from database and delete session if empty
    sessions.deleteUser(user_alias, room, () => {
      sessions._getSessionUserCount(room, (count) => {
        if (count == 0) {
          sessions.deleteSession(session_id)
        }
      })
    })
  })
})

cron.schedule('0 0 0-23 * * *', () => {
  // Scouts for empty sessions and deletes them every day
  sessions.deleteEmptySessions()
});




server.listen(port)
