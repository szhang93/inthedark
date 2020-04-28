const http = require('http')
const bodyParser = require('body-parser')
const express = require('express')
var sessions = require('./sessions')
var db = require('./db')

// Port
const port = process.env.PORT || 8080
const app = express()
// For parsing json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))

// API endpoints
// ------------------------------------------------
/*
 * body: session_id [String] [Unique]
 * response: user_id [String] [Unique]
 */
app.post('/create-session', sessions.createSession)
/*
 * body: user_id [String] [Unique]
 * body: user_alias [String]
 */
app.post('/set-user-alias', sessions.setUserAlias)


app.listen(port)
