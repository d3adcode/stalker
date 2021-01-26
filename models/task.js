import fetch from 'isomorphic-fetch'

function Task (id,task,last_modified,selected,editing,current,total) {
  this.id = id
  this.task = task
  this.last_modified = last_modified || (new Date()).toISOString()
  this.selected = selected
  this.editing = editing
  this.current = current
  this.total = total

  this.fromJSON = JSON => {
    this.id = JSON.id,
    this.task = JSON.task
    this.last_modified = JSON.last_modified || (new Date()).toISOString()
    this.selected = JSON.selected
    this.editing = JSON.editing
    this.current = JSON.current
    this.total = JSON.total

    return this
  }

  this.remove = async (index) => {
    fetch('/api/controllers/task-controller',{
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        index: index,
        task: this
      })
    })
    .then(response => response.json())
    .then(data => {
      console.log('Task removed')
      console.log(data)
    })
    .catch(error => {console.log(`caught: ${error}`)})
  }

  this.save = async (index) => {
    if (typeof index !== 'undefined' && index >= 0) { // new instance
      fetch('/api/controllers/task-controller',{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          index: index,
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
