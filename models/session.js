export default function Session(task_id,create_date,session_type) {
  this.task_id = task_id
  // ISOString representing date which session was started or ended
  this.create_date = create_date || (new Date()).toISOString()
  this.session_type = session_type
}
