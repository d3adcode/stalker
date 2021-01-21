export default function Task (id,task,last_modified,active,current,total) {
  this.id = id
  this.task = task
  this.last_modified = last_modified || (new Date()).toISOString()
  this.active = active
  this.current = current
  this.total = total

  this.save = () => {
    if (!this.id) {
      fetch('/api/task-controller',{
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
      fetch('/api/task-controller',{
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
