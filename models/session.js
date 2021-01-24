import fetch from 'isomorphic-fetch'

export default function Session(task_id,create_date,session_type) {
  this.id = null
  this.task_id = task_id
  // ISOString representing date which session was started or ended
  this.create_date = create_date || (new Date()).toISOString()
  this.session_type = session_type

  this.save = () => {
    if (!this.id) {
      fetch('/api/controllers/session-controller',{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session: this
        })
      })
      .then(response => response.json())
      .then(data => {
        console.log('Session saved')
        console.log(data)
        this.id = data.id
      })
      .catch(error => {console.log(`caught: ${error}`)})
    }
    else { // PUT = UPDATE
      fetch('/api/controllers/session-controller',{
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session: this
        })
      })
      .then(response => response.json())
      .then(data => {
        console.log('Session saved')
        console.log(data)
        this.id = data.id
      })
      .catch(error => {console.log(`caught: ${error}`)})
    }
  }

}
