import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { Table, Column, HeaderCell, Cell } from 'rsuite-table'
import 'rsuite-table/dist/css/rsuite-table.css'
import React, { useState } from 'react'
import { differenceInSeconds } from 'date-fns'
import Task from '../models/task'
import Session from '../models/session'
import fetch from 'isomorphic-fetch'

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

  return (
    <Table data={data.tasks} width={700} height={1000}
      rowClassName={row => {
        return row && row.active ? 'active-row' : ''
      }}

      onRowClick={row => {
        let newData = {...data}
        let newRow = {...row}

        newRow = new Task(row.id,row.task,null,!row.active,0,row.total)
        newData.tasks[newRow.id] = newRow;

        (new Session(row.id,null,newRow.active ? 'start' : 'stop')).save()

        if (newRow && newRow.active) {
          let timerObj = {id: row.id}

          let timer = (function() {
            let newData = {...data}
            let row = newData.tasks[this.id]

            if (row.active) {
              row.current++
              row.total++

              setData(newData)

              // use setTimeout so we automatically stop timer once the row becomes inactive
              setTimeout(timer,1000)
             }
          }).bind(timerObj)

          // use setTimeout so we automatically stop timer once the row becomes inactive
          setTimeout(timer,1000);
        }

        setData(newData)
      }}>

      <Column width={100}>
        <HeaderCell>ID</HeaderCell>
        <Cell dataKey="id"/>
      </Column>
      <Column width={100}>
        <HeaderCell>TASK</HeaderCell>
        <Cell dataKey="task"/>
      </Column>
      <Column width={200}>
        <HeaderCell>LAST_MODIFIED</HeaderCell>
        <Cell dataKey="last_modified"/>
      </Column>
      <Column width={100}>
        <HeaderCell>ACTIVE</HeaderCell>
        <Cell dataKey="active"/>
      </Column>
      <Column width={100}>
        <HeaderCell>CURRENT</HeaderCell>
        <Cell dataKey="current"/>
      </Column>
      <Column width={100}>
        <HeaderCell>TOTAL</HeaderCell>
        <Cell dataKey="total"/>
      </Column>

    </Table>
  )
})
