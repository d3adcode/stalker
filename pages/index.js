import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { Table, Column, HeaderCell, Cell } from 'rsuite-table'
import 'rsuite-table/dist/css/rsuite-table.css'
import React, { useState } from 'react'
import { differenceInSeconds } from 'date-fns'

export default React.memo(function Home() {
  const [data, setData] = useState({
    tableData: [
      {
        id: 0,
        task: "stalker",
        last_modified: (new Date()).toISOString(),
        active: false,
        current: 0,
        total: 0
      }
    ]
  })

  return (
    <Table data={data.tableData} width={700} height={1000}
           rowClassName={rowData => {
             let activeRow = rowData && rowData.active ? 'active-row' : ''
             return rowData && rowData.active ? 'active-row' : ''
           }}
           onRowClick={rowData => {
             let newData = {...data}
             let newDate = new Date()
             let newRow = {...rowData}

             newRow.last_modified = (new Date()).toISOString()
             newRow.active = !rowData.active
             newRow.current = 0
             newData.tableData[newRow.id] = newRow

             if (newRow && newRow.active) {
               console.log('setting timer...')
               let timerObj = {id: rowData.id}

               let timer = (function() {
                 let newData = {...data}
                 let rowData = newData.tableData[this.id]

                 if (rowData.active) {
                   rowData.current++
                   rowData.total++

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
