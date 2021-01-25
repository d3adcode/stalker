import fetch from 'isomorphic-fetch'

export const getSessions = async () => {
  let response = await fetch('http://localhost:3000/api/controllers/session-controller',{
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
