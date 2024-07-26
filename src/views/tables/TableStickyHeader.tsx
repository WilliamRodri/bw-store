import { useState, ChangeEvent, Fragment, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TablePagination from '@mui/material/TablePagination';
import { DeleteEmpty, SquareEditOutline, Check, Plus, Close } from 'mdi-material-ui';
import { Typography } from '@mui/material';

interface Column {
  id: 'mater_prima_aviamentos' | 'un_medida' | 'frete_fob' | 'preco_unit_c_frete' | 'fornecedor' | 'actions';
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: 'mater_prima_aviamentos', label: 'Nome', minWidth: 170 },
  { id: 'un_medida', align: 'right', label: 'Unidade de Medida', minWidth: 100 },
  {
    id: 'frete_fob',
    label: 'Imposto ICMS',
    minWidth: 170,
    align: 'right',
  },
  {
    id: 'preco_unit_c_frete',
    label: 'Preço Unitário',
    minWidth: 170,
    align: 'right',
    format: (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
  },
  { id: 'fornecedor', label: 'Fornecedor', minWidth: 170, align: 'right' },
  { id: 'actions', label: 'Ações', minWidth: 170, align: 'right' },
];

interface Data {
  _id: string;
  id: number;
  mater_prima_aviamentos: string;
  un_medida: string;
  preco_unit_s_frete: number;
  frete_fob: number;
  preco_unit_c_frete: number;
  fornecedor: string;
  [key: string]: any;
}

function createData(
  _id: string,
  id: number,
  mater_prima_aviamentos: string,
  un_medida: string,
  preco_unit_s_frete: number,
  frete_fob: number,
  preco_unit_c_frete: number,
  fornecedor: string
): Data {
  return { _id, id, mater_prima_aviamentos, un_medida, preco_unit_s_frete, frete_fob, preco_unit_c_frete, fornecedor };
}

const TableStickyHeader = () => {
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [rows, setRows] = useState<Data[]>([]);
  const [editingRowIndex, setEditingRowIndex] = useState<number | null>(null);
  const [editingRow, setEditingRow] = useState<Data | null>(null);
  const [statusCreate, setStatusCreate] = useState<boolean>(false);
  const [textSnackBarAlert, setTextSnackBarAlert] = useState<string>('');
  const [errors, setErrors] = useState<{ mater_prima_aviamentos?: boolean; un_medida?: boolean }>({});
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState<boolean>(false);
  const [deleteRowIndex, setDeleteRowIndex] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/material');
        const dataJson = await response.json();

        const formattedData = dataJson.map((item: any) =>
          createData(
            item._id,
            item.id,
            item.mater_prima_aviamentos,
            item.un_medida,
            item.preco_unit_s_frete,
            item.frete_fob,
            item.preco_unit_c_frete,
            item.fornecedor
          )
        );

        setRows(formattedData);
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };

    fetchData();
  }, []);

  const handleEdit = (index: number) => {
    setStatusCreate(false);
    setEditingRowIndex(index);
    setEditingRow(rows[index]);
  };

  const handleSave = async () => {
    if (editingRowIndex !== null && editingRow) {
      let { mater_prima_aviamentos, un_medida, preco_unit_s_frete, frete_fob, preco_unit_c_frete } = editingRow;

      // Validate required fields
      const newErrors: { mater_prima_aviamentos?: boolean; un_medida?: boolean } = {};
      if (!mater_prima_aviamentos) newErrors.mater_prima_aviamentos = true;
      if (!un_medida) newErrors.un_medida = true;
      setErrors(newErrors);

      // If there are no errors, proceed to save
      if (Object.keys(newErrors).length === 0) {
        const updatedRows = [...rows];
        if (frete_fob > 0) {
          const calc = (preco_unit_c_frete * frete_fob) / 100;
          preco_unit_c_frete += calc;
        }
        updatedRows[editingRowIndex] = {
          ...editingRow,
          preco_unit_s_frete: 0,
          frete_fob: frete_fob || 0,
          preco_unit_c_frete: preco_unit_c_frete || 0,
        };
        setRows(updatedRows);
        setEditingRowIndex(null);
        setEditingRow(null);
      }
    }

    if (statusCreate) {
      try {
        if (!editingRow) {
          throw new Error('Invalid row data');
        }
  
        const response = await fetch('/api/add/material', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(editingRow),
        });
  
        if (!response.ok) {
          throw new Error('Failed to add material');
        }
        
        setTextSnackBarAlert('Material adicionado com sucesso!');
        setSnackbarOpen(true);
      } catch (error) {
        console.error('Error adding material: ', error);
      }
    } else {
      try {
        if (!editingRow) {
          throw new Error('Invalid row data');
        }
  
        const response = await fetch('/api/update/material', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(editingRow),
        });
  
        if (!response.ok) {
          throw new Error('Failed to update material');
        }

        setTextSnackBarAlert('Material atualizado com sucesso!');
        setSnackbarOpen(true);
      } catch (error) {
        console.error('Error update material: ', error);
      }
    }
  };

  const handleCancelCreate = () => {
    setStatusCreate(false);
    const updatedRows = [...rows];
    updatedRows.shift();
    setEditingRowIndex(null);
    setRows(updatedRows);
  }

  const handleDelete = (index: number) => {
    setDeleteRowIndex(index);
    setConfirmDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (deleteRowIndex !== null) {
      try {
        const id = rows[deleteRowIndex]._id;
  
        const response = await fetch(`/api/delete/material/${id}`, {
          method: 'DELETE',
        });
  
        if (!response.ok) {
          throw new Error('Failed to delete material');
        }
  
        const updatedRows = [...rows];
        updatedRows.splice(deleteRowIndex, 1);
        setRows(updatedRows);
        setTextSnackBarAlert('Material deletado com sucesso!');
        setSnackbarOpen(true);
      } catch (error) {
        console.error('Error deleting material: ', error);
      } finally {
        setConfirmDeleteOpen(false);
        setDeleteRowIndex(null);
      }
    }
  };  

  const handleInputChange = (event: any) => {
    if (editingRow) {
      const { name, value } = event.target;
      const updatedRow = { ...editingRow, [name as string]: value };

      // Ensure numeric fields are validated
      if (['preco_unit_s_frete', 'frete_fob', 'preco_unit_c_frete'].includes(name as string)) {
        const numericValue = parseFloat(value as string);
        if (!isNaN(numericValue)) {
          setEditingRow({ ...updatedRow, [name as string]: numericValue });
        }

        // Calcula o imposto e atualiza o preço unitário com imposto
        if (name === 'frete_fob' && numericValue > 0) {
          const precoUnitario = editingRow.preco_unit_s_frete;
          const imposto = (numericValue * precoUnitario) / 100;
          const precoUnitarioComImposto = precoUnitario + imposto;
          setEditingRow({ ...updatedRow, preco_unit_c_frete: precoUnitarioComImposto });
        }

      } else {
        setEditingRow(updatedRow);
      }
    }
  };

  const handleAddRow = () => {
    setStatusCreate(true);
    const newRow = createData('', 0, '', '', 0, 0, 0, '');
    setRows([newRow, ...rows]);
    setEditingRowIndex(0);
    setEditingRow(newRow);
  };  

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleCloseDeleteModal = () => {
    setConfirmDeleteOpen(false);
    setDeleteRowIndex(null);
  };

  // Função para filtrar os resultados com base no termo de pesquisa
  const filteredRows = searchTerm.trim() === '' ? rows : rows.filter(row =>
    row.mater_prima_aviamentos.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Funções para manuseio de paginação
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Fragment>
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TextField
          label="Pesquisar Material"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ margin: '10px 20px' }}
        />
        <Button variant="contained" startIcon={<Plus />} onClick={handleAddRow} style={{ margin: '10px 20px' }}>
          Adicionar Material
        </Button>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
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
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11}>
                    <Typography variant="body2" sx={{ marginTop: 2 }}>
                      <strong>Ainda sem nenhum material cadastrado!</strong>
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
                  const isEditing = index === editingRowIndex;
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                      {columns.map(column => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.id === 'actions' ? (
                              isEditing ? (
                                <Fragment>
                                  <IconButton onClick={handleSave}>
                                    <Check />
                                  </IconButton>
                                  <IconButton onClick={handleCancelCreate}>
                                    <Close />
                                  </IconButton>
                                </Fragment>
                              ) : (
                                <Fragment>
                                  <IconButton onClick={() => handleEdit(index)}>
                                    <SquareEditOutline />
                                  </IconButton>
                                  <IconButton onClick={() => handleDelete(index)}>
                                    <DeleteEmpty />
                                  </IconButton>
                                </Fragment>
                              )
                            ) : isEditing ? (
                              column.id === 'un_medida' ? (
                                <Select
                                  name={column.id}
                                  value={editingRow ? editingRow[column.id] : ''}
                                  onChange={handleInputChange}
                                  fullWidth
                                  error={errors.un_medida}
                                >
                                  <MenuItem value="kg">KG</MenuItem>
                                  <MenuItem value="und">UND</MenuItem>
                                  <MenuItem value="mt">MT</MenuItem>
                                </Select>
                              ) : (
                                <TextField
                                  name={column.id}
                                  value={editingRow ? (editingRow[column.id] as string) : ''}
                                  onChange={handleInputChange}
                                  fullWidth
                                  error={column.id === 'mater_prima_aviamentos' && errors.mater_prima_aviamentos}
                                  InputProps={
                                    ['frete_fob', 'preco_unit_c_frete'].includes(column.id) ? { inputProps: { min: 0, step: 0.01 } } : {}
                                  }
                                  type={['frete_fob', 'preco_unit_c_frete'].includes(column.id) ? 'number' : 'text'}
                                />
                              )
                            ) : column.format && typeof value === 'number' ? (
                              column.format(value)
                            ) : (
                              value
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={filteredRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Linhas por página"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count !== -1 ? count : `mais de ${to}`}`}
          getItemAriaLabel={(type) => {
            if (type === 'first') {
              return 'Primeira página';
            }
            if (type === 'previous') {
              return 'Página anterior';
            }
            if (type === 'next') {
              return 'Próxima página';
            }
            if (type === 'last') {
              return 'Última página';
            }
            return '';
          }}
        />
      </Paper>
      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert severity="success" onClose={handleCloseSnackbar}>
          {textSnackBarAlert}
        </Alert>
      </Snackbar>
      <Dialog open={confirmDeleteOpen} onClose={handleCloseDeleteModal}>
        <DialogTitle>Confirmação de Ação</DialogTitle>
        <DialogContent>
          Tem certeza que deseja excluir este material?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteModal} color="primary">
            Cancelar
          </Button>
          <Button onClick={confirmDelete} color="primary" variant="contained">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};

export default TableStickyHeader;