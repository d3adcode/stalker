import { Button } from 'rsuite'
import { Cell } from 'rsuite-table'
import 'rsuite-table/dist/css/rsuite-table.css'

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

export const EditActionCell = ({ rowData, dataKey, onClick, ...props }) => {
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

export const StartActionCell = ({ rowData, dataKey, onClick, ...props }) => {
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

export const ActionCell = ({ rowData, dataKey, onClick, ...props }) => {
  return (
    <Cell {...props} style={{ padding: '6px: 0' }}>
      <Button appearance="link" onClick={() => {
        onClick && onClick(rowData.id,'start')
        //clickFunctions.startClick && clickFunctions.startClick(rowData.id)
      }}>
        {'CLICK ME'}
      </Button>
      <Button appearance="link" onClick={() => {
        //clickFunctions.editClick && clickFunctions.editClick(rowData.id)
        onClick && onClick(rowData.id,'edit')
      }}>
        {rowData.editing ? 'Save' : 'Edit'}
      </Button>
    </Cell>
  )
}
