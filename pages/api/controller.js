const StormDB = require('stormdb')
import Task from '../../models/task'
import Session from '../../models/session'

const db = new StormDB(new StormDB.localFileEngine('db.json'),{
  async: true
})

db.default({
  tasks: [
    new Task(0,'stalker',null,false,0,0)
  ],
  sessions: []
})

export default (req, res) => {
  res.statusCode = 200
  //res.json({ name: 'John Doe' })
  /*db.get('tasks')
    .push(new Task(1,'porkandbeans',null,false,0,0))
    .save()*/
  //res.json(db.get('tasks.0.id'))
  res.json(db.get('tasks').value())
}
