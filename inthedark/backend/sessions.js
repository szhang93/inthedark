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
   }
   // session_id exists already. Return status 200.
   if (result[0].count > 0) {
     console.log("session_id ", session_id, " already exists.")
     res.status(200).json({"success":false, "user_id":null})
   }
   else {
     var query = `INSERT INTO sessions (session_id)
      VALUES ('${session_id}')`
      db.query(query, (err, result) => {
        if (err) {
          console.log(err)
          res.status(500).end()
        }
        console.log("Inserted new session into db")

         query = `INSERT INTO users (session_id)
         VALUES ('${session_id}')`
         db.query(query, (err, result) => {
           if (err) {
             console.log(err)
             res.status(500).end()
           }
           console.log("Inserted new user into db")

           query = `SELECT lAST_INSERT_ID() AS user_id`
           db.query(query, (err, result) => {
             if (err) {
               console.log(err)
               res.status(500).end()
             }
             console.log("Retrieved last inserted id: ", result[0].user_id)
             res.status(200).json({"success":true, "user_id":result[0].user_id})
           })
         })
      })
    }
  })
}

exports.setUserAlias = (req, res) => {
  console.log("------------calling setUserAlias--------------------")
  user_id = req.body.user_id
  user_alias = req.body.user_alias
  var query = `UPDATE users
  SET user_alias = '${user_alias}'
  WHERE user_id = ${user_id}`
  console.log("Attempting to set user ", user_id, " with alias ", user_alias)
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
  // This does not check whether user exists.
  db.query(query, (err, result) => {
    if (err) {
      console.log(err)
      res.status(500).end()
    }
    else{
      // Note: This doesn't check whether user exists.
      console.log("Succesfully set user ", user_id, " with alias ", user_alias)
      res.status(200).json({"success":true, "user_alias":user_alias})
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
