import fetch from 'isomorphic-fetch'

function Task (id,task,last_modified,selected,editing,current,total) {
  this.id = id
  this.task = task
  this.last_modified = last_modified || (new Date()).toISOString()
  this.selected = selected
  this.editing = editing
  this.current = current
  this.total = total

  this.save = () => {
    if (!this.id) {
      fetch('/api/controllers/task-controller',{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task: this
        })
      })
      .then(response => response.json())
      .then(data => {
        console.log('Task saved')
        console.log(data)
        this.id = data.id
      })
      .catch(error => {console.log(`caught: ${error}`)})
    }
    else { // PUT = UPDATE
      fetch('/api/controllers/task-controller',{
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task: this
        })
      })
      .then(response => response.json())
      .then(data => {
        console.log('Task updated')
        console.log(data)
        this.id = data.id
      })
      .catch(error => {console.log(`caught: ${error}`)})
    }
  }
}

const getTasks = async () => {
  let response = await fetch('http://localhost:3000/api/controllers/task-controller',{
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  })
  .catch(error => {
    console.log(`caught: ${error}`)
    return []
  })

  let result = await response.json()
  .catch(error => {
    console.log(`caught: ${error}`)
    return []
  })

  return result
}

export {
  Task,
  getTasks
}
