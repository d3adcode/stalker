import Head from 'next/head'
import React, { useState } from 'react'
import { differenceInSeconds } from 'date-fns'
import { Task, getTasks } from '../models/task'
import { Session, getSessions } from '../models/session'
import { ActionCell, EditCell } from '../components/stalkerCell'
import { StalkerTable } from '../components/stalkerTable'
import { v4 as uuidv4 } from 'uuid';

export async function getServerSideProps() {
  let sessions = await getSessions()
  .catch(error => {
    console.log(`caught: ${error}`)
    return []
  })

  let tasks = await getTasks()
  .catch(error => {
    console.log(`caught: ${error}`)
    return []
  })

  return {
    props: {
      serverData: { 
        tasks: tasks,
        sessions: sessions 
      }
    } 
  }
}

export default React.memo(function Home({serverData}) {
  const [data, setData] = useState(serverData)

  const handleChange = (id, key, value) => {
    let nextData = Object.assign([], data)
    nextData.tasks.find(item => item.id === id)[key] = value
    setData(nextData)
  }

  const handleStart = id => {
    let nextData = {...data}
    let row = nextData.tasks[id]

    let newRow = new Task(row.id,row.task,null,!row.selected,false,0,row.total)
    nextData.tasks[id] = newRow

    //(new Session(row.id,null,newRow.selected ? 'start' : 'stop')).save()

    if (newRow && newRow.selected) {
      let timerObj = {id: row.id}

      // can't be arrow function because we have to bind timerObj
      let timer = (function() {
        let nextData = {...data}
        let row = nextData.tasks[this.id]

        if (row.selected) {
          row.current++
          row.total++

          setData(nextData)

          // use setTimeout so we automatically stop timer once the row becomes inactive
          setTimeout(timer,1000)
         }
      }).bind(timerObj)

      // use setTimeout so we automatically stop timer once the row becomes inactive
      setTimeout(timer,1000)
    }

    setData(nextData)
  }

  const handleEdit = async (id) => {
    let nextData = {...data}
    let task = nextData.tasks.find(task => task.id === id)

    task.editing = !task.editing // toggle editing/save
    if (!task.editing) { // done editing, now save
      await new Task().fromJSON(task).save()
    }
    setData(nextData)
  }

  const handleAdd = async (id) => {
    let nextData = {...data}
    let index = nextData.tasks.findIndex(task => task.id === id)
    let task = new Task(uuidv4(),'',null,false,true,0,0)

    await task.save(index+1).catch(error => {console.log(`caught: ${error}`)})

    nextData.tasks.splice(index+1,0,task)

    setData(nextData)
  }

  const handleEvent = (id,eventType) => {
    switch(eventType) {
      case 'start':
        handleStart(id)
        break
      case 'edit':
        handleEdit(id)
        break
      case 'add':
        handleAdd(id)
        break
      default:
        console.log('Unsupported handle event. How did we even get here???')
    }
  }

  return (
    <StalkerTable tasks={data.tasks} handleChange={handleChange} handleEvent={handleEvent}/>
  )
})
