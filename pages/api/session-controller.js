//import Session from '../../models/session'
import DBService from './dbService'

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
      //console.log('session-controller: entered get all')
      let sessions = db.get('sessions').value()
      //console.log(sessions)
      res.json(sessions)
      /*console.log(db.get('sessions').value())
      res.statusCode = 200
      res.json(db.get('sessions').value())*/
    }
  }

  if (req.method === 'POST') {
    //console.log('Session post received')
    //console.log(req.body)
    let session = req.body.session
    //db.get('sessions').push(req.body.session).save()
    // set id to the index in the sessions array
    session.id = db.get('sessions').value().length
    db.get('sessions').push(session).save()
    res.statusCode = 200
    //res.json(db.get('sessions').value())
    res.json(session)
  }

  if(req.method === 'PUT') {
    let session = req.body.session
    //db.get('sessions').value()[req.body.id] = session
    db.get('sessions').set(req.body.id,session).save()
    res.statusCode = 200
    res.json(session)
  }

}
