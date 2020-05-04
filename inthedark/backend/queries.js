var db = require('./db')

// Table template

const dropSessionTable = "DROP TABLE sessions"

const createSessionTable =
"CREATE TABLE sessions (\
  session_id VARCHAR(100) NOT NULL,\
  PRIMARY KEY (session_id)\
  create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\
)"

const createUserTable =
"CREATE TABLE users (\
  user_id INT AUTO_INCREMENT,\
  PRIMARY KEY (user_id),\
  user_alias VARCHAR(100) NOT NULL,\
  session_id VARCHAR(100) NOT NULL,\
  FOREIGN KEY (session_id) REFERENCES sessions (session_id)\
  create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\
)"
