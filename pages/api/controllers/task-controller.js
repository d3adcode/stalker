import DBService from '../services/dbService'

DBService.init()

export default (req, res) => {
  let db = DBService.getDB()

  if (req.method === 'GET') {
    if (req.body.id) { // single instance
      let session = db.get('tasks').value()[req.body.id]
      res.statusCode = 200
      res.json(session)
    }
    else { // all
      let sessions = db.get('tasks').value()
      res.statusCode = 200
      res.json(sessions)
    }
  }

  if (req.method === 'POST') {
    let bodyTask = req.body.task
    let index = req.body.index

    let tasks = db.get('tasks').value()
    tasks.splice(index+1,0,bodyTask)

    db.get('tasks').set(tasks)
    db.save()

    res.send(db.get('tasks').get(index).value())
  }

  if(req.method === 'PUT') {
    let bodyTask = req.body.task
    let tasks = db.get('tasks').value()
    let index = req.body.index ||
                tasks.findIndex(dbTask => dbTask.id === bodyTask.id)

    if (typeof index !== 'undefined' && index >= 0) {
      db.get('tasks').get(index).set(bodyTask)
      db.save()
      res.statusCode = 200
      res.json(db.get('tasks').get(index).value())
    }
    else {
      res.statusCode = 404
      res.json({})
    }
  }

}
