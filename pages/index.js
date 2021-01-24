import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { Table, Column, HeaderCell, Cell } from 'rsuite-table'
import { Button } from 'rsuite'
import 'rsuite-table/dist/css/rsuite-table.css'
import React, { useState } from 'react'
import { differenceInSeconds } from 'date-fns'
import Task from '../models/task'
import Session from '../models/session'
import fetch from 'isomorphic-fetch'
import { ActionCell, EditCell } from '../views/stalkerCell'
import { StalkerTable } from '../views/stalkerTable'

export async function getServerSideProps() {
  let serverData = {}

  await fetch('http://localhost:3000/api/controllers/session-controller',{
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  })
  .then(response => response.json())
  .then(data => {
    serverData.sessions = data
  })
  .catch(error => {console.log(`caught: ${error}`)})

  await fetch('http://localhost:3000/api/controllers/task-controller',{
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  })
  .then(response => response.json())
  .then(data => {
    serverData.tasks = data
  })
  .catch(error => {console.log(`caught: ${error}`)})

  return { props: { serverData } }
}

export default React.memo(function Home({serverData}) {
  const [data, setData] = useState(serverData)

  const handleChange = (id, key, value) => {
    let nextData = Object.assign([], data)
    nextData.tasks.find(item => item.id === id)[key] = value
    setData(nextData)
  }

  const handleEvent = (id,eventType) => {
    if (eventType === 'start') {
      let newData = {...data}
      let row = newData.tasks[id]

      let newRow = new Task(row.id,row.task,null,!row.selected,false,0,row.total)
      newData.tasks[id] = newRow

      //(new Session(row.id,null,newRow.selected ? 'start' : 'stop')).save()

      if (newRow && newRow.selected) {
        let timerObj = {id: row.id}

        // can't be arrow function because we have to bind timerObj
        let timer = (function() {
          let newData = {...data}
          let row = newData.tasks[this.id]

          if (row.selected) {
            row.current++
            row.total++

            setData(newData)

            // use setTimeout so we automatically stop timer once the row becomes inactive
            setTimeout(timer,1000)
           }
        }).bind(timerObj)

        // use setTimeout so we automatically stop timer once the row becomes inactive
        setTimeout(timer,1000)
      }

      setData(newData)
    }
    else if (eventType === 'add') {
    }
    else if (eventType === 'edit') {
      let nextData = Object.assign([], data)
      let activeItem = nextData.tasks.find(item => item.id === id)
      activeItem.editing = !activeItem.editing
      setData(nextData)
    }
  }

  return (
    <StalkerTable tasks={data.tasks} handleChange={handleChange} handleEvent={handleEvent}/>
  )
})
