var db = require('./db')
var words = require('./words')

const TIMEOUT = 10
const genUserAliasQuery = (session_id) => {
  return new Promise((resolve, reject) => {
    const adverb = words.ADVERBS[Math.floor(Math.random() * words.ADVERBS.length)]
    const verb = words.VERBS[Math.floor(Math.random() * words.VERBS.length)]
    const noun = words.USER_NOUNS[Math.floor(Math.random() * words.USER_NOUNS.length)]
    const name = `${adverb}_${verb}_${noun}`
    var query = `SELECT COUNT (*) AS count FROM users
                WHERE users.session_id = '${session_id}'
                AND users.user_alias = '${name}'`
    const result = db.query(query, (err, result) => {
      if (err) {
        console.log(err)
        resolve(null)
      }
      else {
        if(result[0].count == 0) {
          resolve(name)
        }
        else{
          resolve(null)
        }
      }
    })
  })
}
const genUserAliases_ = async(session_id) => {
  var promises = []
  for(var i=0; i<TIMEOUT; i++) {
    promises.push(genUserAliasQuery(session_id))
  }
  const responses = await Promise.all(promises)
  return responses
}
// Attempts to generate random user alias that is not used in the session
// Note: Does not check whether session actually exists.
exports.genUserAlias = (req, res) => {
  console.log("------------calling genUserAlias--------------------")
  const session_id = req.query.session_id
  if(session_id == undefined) {
    console.log("session_id ", session_id, " is undefined.")
    res.status(400).end()
    return
  }

  genUserAliases_(session_id).then((response) => {
    var nameFound = false
    for(var i=0; i<response.length; i++) {
      if(response[i] != null) {
        nameFound = true
        res.status(200).json({"success":true, "name":response[i]})
        break
      }
    }
    if(!nameFound) {
      res.status(200).json({"success":false})
    }
  }).catch((err) => {
    console.log(err)
  })
}


const genSessionNameQuery = () => {
  return new Promise((resolve, reject) => {
    const adjective = words.ROOM_ADJECTIVES[Math.floor(Math.random() * words.ROOM_ADJECTIVES.length)]
    const verb = words.ROOM_VERBS[Math.floor(Math.random() * words.ROOM_VERBS.length)]
    const noun = words.ROOM_NOUNS[Math.floor(Math.random() * words.ROOM_NOUNS.length)]
    const name = `${adjective}_${verb}_${noun}`
    var query = `SELECT COUNT (*) AS count FROM sessions
                WHERE sessions.session_id = '${name}'`
    const result = db.query(query, (err, result) => {
      if (err) {
        console.log(err)
        resolve(null)
      }
      else {
        if(result[0].count == 0) {
          resolve(name)
        }
        else{
          resolve(null)
        }
      }
    })
  })
}
const genSessionNames_ = async() => {
  var promises = []
  for(var i=0; i<TIMEOUT; i++) {
    promises.push(genSessionNameQuery())
  }
  const responses = await Promise.all(promises)
  return responses
}
// Attempts to generate a random session name
exports.genSessionName = (req, res) => {
  console.log("------------calling genSessionName--------------------")

  genSessionNames_().then((response) => {
    var nameFound = false
    for(var i=0; i<response.length; i++) {
      if(response[i] != null) {
        nameFound = true
        res.status(200).json({"success":true, "name":response[i]})
        break
      }
    }
    if(!nameFound) {
      res.status(200).json({"success":false})
    }
  }).catch((err) => {
    console.log(err)
  })
}
