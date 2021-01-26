import { Table, Column, HeaderCell, Cell } from 'rsuite-table'
import { ActionCell, EditCell } from '../components/stalkerCell'
import { Task } from '../models/task'

export const StalkerTable = ({ tasks, handleChange, handleEvent, handleStart, ...props }) => {

  return (
    <Table data={tasks} width={1800} height={1000}
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
        <HeaderCell>Start/Edit/Add</HeaderCell>
        <ActionCell dataKey="id" onClick={handleEvent}/>
      </Column>

    </Table>
  )
}
