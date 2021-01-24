import DBService from '../services/dbService'

DBService.init()

export default (req, res) => {
  let db = DBService.getDB()

  if (req.method === 'POST') {
    console.log(req.body)
    db.get('tasks').push(req.body.task).save()
    res.statusCode = 200
    res.json(db.get('tasks').value())
  }

  if (req.method === 'GET') {
    res.statusCode = 200
    res.json(db.get('tasks').value())
  }
}
