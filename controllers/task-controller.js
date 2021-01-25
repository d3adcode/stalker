import fetch from 'isomorphic-fetch'
import Task from '../models/task'

export const getTasks = async () => {
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
