const mysql = require('mysql')
const fs = require('fs')

/*
 * host
 * port
 * user
 * password
 * database
 */
var readDbInfo = () => {
  var arr = fs.readFileSync('db.info').toString().split('\n')
  var connection = {connectionLimit:30}
  try {
    connection['host'] = arr[0]
    connection['port'] = arr[1]
    connection['user'] = arr[2]
    connection['password'] = arr[3]
    connection['database'] = arr[4]
  }
  catch(err) {
    console.log("db.info may not be formatted correctly.")
  }
  return connection
}

// Connect to database
var con = mysql.createConnection(readDbInfo())
con.connect((err)=>{
  if(err) throw err;
  console.log("database connected");
})


module.exports = con
