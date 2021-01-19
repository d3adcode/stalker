export default function Task (id,task,last_modified,active,current,total) {
  this.id = id
  this.task = task
  this.last_modified = last_modified || (new Date()).toISOString()
  this.active = active
  this.current = current
  this.total = total
}
