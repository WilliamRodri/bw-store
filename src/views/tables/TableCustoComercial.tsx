// ** React Imports
import { useState, ChangeEvent } from 'react'

// ** MUI Imports
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { DeleteEmpty, Plus } from 'mdi-material-ui'

interface Column {
  id: 'name' | 'valor' | 'actions'
  label: string
  minWidth?: number
  align?: 'right'
}

const columns: readonly Column[] = [
  { id: 'name', label: 'Nome do Custo', minWidth: 170 },
  { id: 'valor', label: 'Valor do Custo (%)', minWidth: 170, align: 'right' },
  { id: 'actions', label: 'Ações', minWidth: 100, align: 'right' }
]

interface Data {
  name: string
  valor: string
  [key: string]: any;
}

const initialRows: Data[] = [
  { name: 'Custo 1', valor: '20%' },
  { name: 'Custo 2', valor: '30%' },
]

const TableCustoComercial = () => {
  // ** States
  const [page, setPage] = useState<number>(0)
  const [rowsPerPage, setRowsPerPage] = useState<number>(10)
  const [rows, setRows] = useState<Data[]>(initialRows)

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  const handleDelete = (index: number) => {
    const updatedRows = rows.filter((_, i) => i !== index)
    setRows(updatedRows)
  }

  const handleAddRow = () => {
    const newRow: Data = { name: '', valor: '' }
    setRows([newRow, ...rows])
  }

  const handleInputChange = (event: ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>, index: number) => {
    const { name, value } = event.target
    const updatedRows = [...rows]
    updatedRows[index] = { ...updatedRows[index], [name as string]: value }
    setRows(updatedRows)
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <Button variant="contained" startIcon={<Plus />} onClick={handleAddRow} style={{ margin: '10px 20px' }}>
        Adicionar Custo
      </Button>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label='sticky table'>
          <TableHead>
            <TableRow>
              {columns.map(column => (
                <TableCell key={column.id} align={column.align} sx={{ minWidth: column.minWidth }}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
              <TableRow hover role='checkbox' tabIndex={-1} key={index}>
                {columns.map(column => (
                  <TableCell key={column.id} align={column.align}>
                    {column.id === 'actions' ? (
                      <IconButton onClick={() => handleDelete(index)}>
                        <DeleteEmpty />
                      </IconButton>
                    ) : (
                      <TextField
                        name={column.id}
                        value={row[column.id]}
                        onChange={(event) => handleInputChange(event, index)}
                        fullWidth
                      />
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  )
}

export default TableCustoComercial;