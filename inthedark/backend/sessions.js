var db = require('./db')
/*
* req.body:
* name: "some_name"
*/
// create session with room name, and store into database if unique.
exports.createSession = (req, res) => {
  console.log("------------calling createSession--------------------")
  session_id = req.body.session_id
  console.log("Attempting to create session with ", session_id)
  if(session_id == undefined) {
    console.log("session_id ", session_id, " is undefined.")
    res.status(400).end()
    return
  }
  // Check if session_id exists in database already
  var query = `SELECT COUNT(*) AS count FROM sessions
  WHERE session_id = '${session_id}'`
  db.query(query, (err, result) => {
   if (err) {
     console.log(err)
     res.status(500).end()
     return
   }
   // session_id exists already. Return status 200.
   if (result[0].count > 0) {
     console.log("session_id ", session_id, " already exists.")
     res.status(200).json({"success":false})
   }
   else {
     var query = `INSERT INTO sessions (session_id)
      VALUES ('${session_id}')`
      db.query(query, (err, result) => {
        if (err) {
          console.log(err)
          res.status(500).end()
          return
        }
        console.log("Inserted new session into db")
        res.status(200).json({"success":true})
      })
    }
  })
}

exports.setUserAlias = (req, res) => {
  console.log("------------calling setUserAlias--------------------")
  user_id = req.body.user_id
  user_alias = req.body.user_alias
  session_id = req.body.session_id

  if(user_id == undefined) {
    console.log("user_id ", user_id, " is undefined.")
    res.status(400).end()
    return
  }
  if(user_alias == undefined) {
    console.log("user_alias ", user_alias, " is undefined.")
    res.status(400).end()
    return
  }
  var query = `SELECT COUNT(*) AS count FROM users JOIN sessions
  ON users.session_id = sessions.session_id AND users.session_id = '${session_id}'
  AND users.user_alias = '${user_alias}'`
  console.log("Checking if user_alias ", user_alias, " is unique in session ", session_id)
  db.query(query, (err, result) => {
    if (err) {
      console.log(err)
      res.status(500).end()
    }
    else {
      if (result[0].count > 0) {
        res.status(200).json({"success":false, "user_alias":null})
      }
      else {
        // This does not check whether user exists. User is assumed to exist.
        query = `UPDATE users
        SET user_alias = '${user_alias}'
        WHERE user_id = ${user_id}`
        console.log("Attempting to set user ", user_id, " with alias ", user_alias)
        db.query(query, (err, result) => {
          if (err) {
            console.log(err)
            res.status(500).end()
          }
          else{
            console.log("Succesfully set user ", user_id, " with alias ", user_alias)
            res.status(200).json({"success":true, "user_alias":user_alias})
          }
        })
      }
    }
  })
}

exports.sessionExists = (req, res) => {
  console.log("------------calling sessionExists--------------------")
  session_id = req.query.session_id
  if(session_id == undefined) {
    console.log("session_id ", session_id, " is undefined.")
    res.status(400).end()
    return
  }
  var query = `SELECT COUNT(*) AS count FROM sessions
  WHERE session_id = '${session_id}'`
  db.query(query, (err, result) => {
    if (err) {
      console.log(err)
      res.status(500).end()
      return
    }
    if (result[0].count > 0) {
      console.log("Session exists")
      res.status(200).json({"success":true})
    }
    else {
      console.log("Session does not exist")
      res.status(200).json({"success":false})
    }
  })
}
exports.createUser = (req, res) => {
  //CREATE USER
  session_id = req.query.session_id
  query = `INSERT INTO users (session_id)
  VALUES ('${session_id}')`
  db.query(query, (err, result) => {
    if (err) {
      console.log(err)
      res.status(500).end()
      return
    }
    console.log("Inserted new user into db")

    query = `SELECT lAST_INSERT_ID() AS user_id`
    db.query(query, (err, result) => {
      if (err) {
        console.log(err)
        res.status(500).end()
        return
      }
      console.log("Retrieved last inserted id: ", result[0].user_id)
      res.status(200).json({"success":true, "user_id":result[0].user_id})
    })
  })
}

// Get session count
exports.getSessionUserCount = (req, res) => {
  session_id = req.query.session_id
  query = `SELECT COUNT(*) AS count FROM sessions JOIN users
  ON sessions.session_id = users.session_id
  AND sessions.session_id = '${session_id}'`
  db.query(query, (err, result) => {
    if (err) {
      console.log(err)
      res.status(500).end()
    }
    else {
      res.status(200).json({"success":true, "count":result[0].count})
    }
  })
}

// Get session count
exports._getSessionUserCount = (session_id, cb) => {
  query = `SELECT COUNT(*) AS count FROM sessions JOIN users
  ON sessions.session_id = users.session_id
  AND sessions.session_id = '${session_id}'`
  db.query(query, (err, result) => {
    if (err) {
      console.log(err)
      if (cb) {cb(null)}
    }
    else {
      if (cb) {cb(result[0].count)}
    }
  })
}

// Delete user
exports.deleteUser = (user_id, cb) => {
  query = `DELETE FROM users WHERE user_id=${user_id}`
  db.query(query, (err, result) => {
    if (err) {
      console.log(err)
      if (cb) {cb(null)}
    }
    else {
      console.log("Deleted user: ", user_id)
      if (cb) {cb(user_id)}
    }
  })
}

// Delete session
exports.deleteSession = (session_id, cb) => {
  query = `DELETE FROM sessions WHERE session_id='${session_id}'`
  db.query(query, (err, result) => {
    if (err) {
      console.log(err)
      if (cb) {cb(null)}
    }
    else {
      console.log("Deleted session: ", session_id)
      if (cb) {cb(session_id)}
    }
  })
}

//BACKLOG
// Remove all inactive users
// Remove all inactive sessions
