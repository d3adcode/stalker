//import Session from '../../models/session'
import DBService from './dbService'

DBService.init()

export default (req, res) => {
  let db = DBService.getDB()

  if (req.method === 'POST') {
    console.log(req.body)
    db.get('sessions').push(req.body.session).save()
    res.statusCode = 200
    res.json(db.get('sessions').value())
  }

  if (req.method === 'GET') {
    res.statusCode = 200
    res.json(db.get('sessions').value())
  }
}
