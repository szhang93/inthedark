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
var io = socketIo(server)
io.origins('*:*') // Allows cors
io.on('connection', (socket) => {
  console.log('a user connected');
});






server.listen(port)
