var db = require('./db')
/*
* req.body:
* name: "some_name"
*/
// create session with room name, and store into database if unique.
exports.createSession = (req, res) => {
  console.log(req.body)
  // Initial values
  session_id = req.body.name
  console.log(session_id)
  if(session_id == undefined) {
    res.sendStatus(200)
    return
  }
  var query = `INSERT INTO sessions (session_id)
   VALUES ('${session_id}')`
   db.query(query, (err, result) => {
     if(err) throw err
     console.log("Inserted new session into db")

      query = `INSERT INTO users (session_id)
      VALUES ('${session_id}')`
      db.query(query, (err, result) => {
        if(err) throw err
        console.log("Inserted new user into db")

        query = `SELECT lAST_INSERT_ID()`
        db.query(query, (err, result) => {
          if(err) throw err
          console.log("Retrieved last inserted id: ", result[0])
          res.send(result[0])
        })
      })
   })

}
