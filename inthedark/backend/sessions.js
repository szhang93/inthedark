var db = require('./db')
/*
* req.body:
* name: "some_name"
*/
// create session with room name, and store into database if unique.
exports.createSession = (req, res) => {
  console.log("------------calling createSession--------------------")
  session_id = req.body.session_id
  console.log(session_id)
  if(session_id == undefined) {
    console.log("Name ", session_id, " is undefined.")
    res.status(200).json({"success":false, "id":null})
    return
  }
  // Check if name exists in database already
  var query = `SELECT COUNT(*) AS count FROM sessions
  WHERE session_id = '${session_id}'`
  db.query(query, (err, result) => {
   if (err) {
     console.log(err)
   }
   if (result[0].count > 0) {
     console.log("Name ", session_id, " already exists.")
     res.json({"success":false, "user_id":null})
   }
   else {
     var query = `INSERT INTO sessions (session_id)
      VALUES ('${session_id}')`
      db.query(query, (err, result) => {
        if (err) {
          console.log(err)
        }
        console.log("Inserted new session into db")

         query = `INSERT INTO users (session_id)
         VALUES ('${session_id}')`
         db.query(query, (err, result) => {
           if (err) {
             console.log(err)
           }
           console.log("Inserted new user into db")

           query = `SELECT lAST_INSERT_ID() AS user_id`
           db.query(query, (err, result) => {
             if (err) {
               console.log(err)
             }
             console.log("Retrieved last inserted id: ", result[0].user_id)
             res.json({"success":true, "user_id":result[0].user_id})
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
  db.query(query, (err, result) => {
    if (err) {
      console.log(err)
      res.json({"success":false, "user_alias":null})
    }
    else{
      console.log("Succesfully set user ", user_id, " with alias ", user_alias)
      res.json({"success":true, "user_alias":user_alias})
    }
  })
}
