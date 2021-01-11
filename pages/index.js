import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { Table, Column, HeaderCell, Cell } from 'rsuite-table'
import 'rsuite-table/dist/css/rsuite-table.css'
import React, { useState } from 'react'
import { differenceInSeconds } from 'date-fns'

export default React.memo(function Home() {
  const [data, setData] = useState({
    tasks: [
      {
        id: 0,
        task: "stalker",
        last_modified: (new Date()).toISOString(),
        active: false,
        current: 0,
        total: 0
      }
    ],
    sessions: []
    /* example session object
     * {
     * id: // task id,
     * date: // ISOString representing date which task session was started or ended,
     * type: // start or end
     * }
     */
  })

  return (
    <Table data={data.tasks} width={700} height={1000}
      rowClassName={row => {
        return row && row.active ? 'active-row' : ''
      }}
      onRowClick={row => {
        let newData = {...data}
        let newDate = new Date()
        let newRow = {...row}

        newRow.last_modified = (new Date()).toISOString()
        newRow.active = !row.active
        newRow.current = 0
        newData.tasks[newRow.id] = newRow

        newData.sessions.push({
          id: row.task,
          date: newDate.toISOString(),
          type: row.active ? 'stop' : 'start'
        })

        console.log(data.sessions)

        if (newRow && newRow.active) {
          let timerObj = {id: row.id}

          let timer = (function() {
            let newData = {...data}
            let row = newData.tasks[this.id]

            if (row.active) {
              row.current++
              row.total++

              setData(newData)

              setTimeout(timer,1000)
             }
          }).bind(timerObj)

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
