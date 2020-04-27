// Modules
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




app.post('/create', sessions.createSession)


app.listen(port)
