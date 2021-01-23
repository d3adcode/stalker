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

export const EditCell = ({ rowData, dataKey, onChange, ...props }) => {
  const editing = rowData.editing
  return (
    <Cell {...props} className={editing ? 'table-content-editing' : ''}>
      {editing ? (
        <input
          className="rs-input"
          defaultValue={rowData[dataKey]}
          onChange={event => {
            onChange && onChange(rowData.id, dataKey, event.target.value)
          }}
        />
      ) : (
        <span className="table-content-edit-span">{rowData[dataKey]}</span>
      )}
    </Cell>
  )
}

const EditActionCell = ({ rowData, dataKey, onClick, ...props }) => {
  return (
    <Cell {...props} style={{ padding: '6px 0' }}>
      <Button
        appearance="link"
        onClick={() => {
          onClick && onClick(rowData.id)
        }}
      >
        {rowData.editing ? 'Save' : 'Edit'}
      </Button>
    </Cell>
  )
}

const StartActionCell = ({ rowData, dataKey, onClick, ...props }) => {
  return (
    <Cell {...props}>
      <Button appearance="link" onClick={() => {
        onClick && onClick(rowData.id)
      }}>
        {'CLICK ME'}
      </Button>
    </Cell>
  )
}

export async function getServerSideProps() {
  let serverData = {}

  await fetch('http://localhost:3000/api/session-controller',{
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  })
  .then(response => response.json())
  .then(data => {
    serverData.sessions = data
  })
  .catch(error => {console.log(`caught: ${error}`)})

  await fetch('http://localhost:3000/api/task-controller',{
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
  //console.log(`serverData: ${JSON.stringify(serverData,null,2)}`)
  const [data, setData] = useState(serverData)

  const handleChange = (id, key, value) => {
    let nextData = Object.assign([], data)
    nextData.tasks.find(item => item.id === id)[key] = value
    setData(nextData)
  }

  const handleEditState = id => {
    let nextData = Object.assign([], data)
    let activeItem = nextData.tasks.find(item => item.id === id)
    //activeItem.editing = activeItem.editing ? null : 'EDIT'
    activeItem.editing = !activeItem.editing
    setData(nextData)
  }

  const handleStart = id => {
    //const nextData = Object.assign([], data)
    let newData = {...data}
    let row = newData.tasks[id]
    //let newRow = newData.tasks[id]

    let newRow = new Task(row.id,row.task,null,!row.selected,false,0,row.total)
    newData.tasks[id] = newRow

    //(new Session(row.id,null,newRow.selected ? 'start' : 'stop')).save()

    if (newRow && newRow.selected) {
      let timerObj = {id: row.id}

      // can't be arrow function because we have to bind timerObj
      let timer = (function() {
        let newData = {...data}
        let row = newData.tasks[this.id]

        console.log(row)

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

  return (
    <Table data={data.tasks} width={1200} height={1000}
      rowClassName={row => {
        return row && row.selected ? 'active-row' : ''
      }}>

      <Column flexGrow={1}>
        <HeaderCell>Task</HeaderCell>
        <EditCell dataKey="task" onChange={handleChange} />
      </Column>

      <Column flexGrow={1}>
        <HeaderCell>ID</HeaderCell>
        <Cell dataKey="id"/>
      </Column>

      <Column flexGrow={1}>
        <HeaderCell>TASK</HeaderCell>
        <Cell dataKey="task"/>
      </Column>

      <Column flexGrow={1}>
        <HeaderCell>LAST_MODIFIED</HeaderCell>
        <Cell dataKey="last_modified"/>
      </Column>

      <Column flexGrow={1}>
        <HeaderCell>SELECTED</HeaderCell>
        <Cell dataKey="selected"/>
      </Column>

      <Column flexGrow={1}>
        <HeaderCell>CURRENT</HeaderCell>
        <Cell dataKey="current"/>
      </Column>

      <Column flexGrow={1}>
        <HeaderCell>TOTAL</HeaderCell>
        <Cell dataKey="total"/>
      </Column>

      <Column flexGrow={1}>
        <HeaderCell>Action</HeaderCell>
        <EditActionCell dataKey="id" onClick={handleEditState} />
      </Column>

      <Column flexGrow={1}>
        <HeaderCell>Start</HeaderCell>
        <StartActionCell dataKey="id" onClick={handleStart}/> 
      </Column>

    </Table>
  )
})
