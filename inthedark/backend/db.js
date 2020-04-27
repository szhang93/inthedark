const mysql = require('mysql')
// Connect to database
var con = mysql.createConnection({
  connectionLimit:30,
  host: "localhost",
  user: "boxy",
  password: "boxy",
  database: "inthedark"
})
con.connect((err)=>{
  if(err) throw err;
  console.log("database connected");
})

module.exports = con
