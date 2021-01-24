import DBService from '../services/dbService'

DBService.init()

export default (req, res) => {
  let db = DBService.getDB()

  if (req.method === 'GET') {
    if (req.body.id) { // single instance
      let session = db.get('sessions').value()[req.body.id]
      res.statusCode = 200
      res.json(session)
    }
    else { // all
      let sessions = db.get('sessions').value()
      res.statusCode = 200
      res.json(sessions)
    }
  }

  if (req.method === 'POST') {
    let session = req.body.session
    // set id to the index in the sessions array
    session.id = db.get('sessions').value().length
    db.get('sessions').push(session).save()
    res.statusCode = 200
    res.json(session)
  }

  if(req.method === 'PUT') {
    let session = req.body.session
    db.get('sessions').set(req.body.id,session).save()
    res.statusCode = 200
    res.json(session)
  }

}
