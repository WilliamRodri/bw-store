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
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { DeleteEmpty, EyeArrowRight, Check, Plus, Pen } from 'mdi-material-ui';
import { Typography } from '@mui/material';


interface Column {
  id: 'nome_modelo' | 'actions';
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: 'nome_modelo', label: 'Nome', minWidth: 170 },
  { id: 'actions', label: 'Ações', minWidth: 170, align: 'right' },
];

interface Data {
  _id: string;
  id: number;
  nome_modelo: string;
  [key: string]: any;
}

function createData(
  _id: string,
  id: number,
  nome_modelo: string,
): Data {
  return { _id, id, nome_modelo };
}

const TablePedidos = () => {
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [rows, setRows] = useState<Data[]>([]);
  const [textSnackBarAlert, setTextSnackBarAlert] = useState<string>('');
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState<boolean>(false);
  const [deleteRowIndex, setDeleteRowIndex] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/pedidos');
        const dataJson = await response.json();
        const formattedData = dataJson.map((item: any) => 
          createData(
            item._id,
            item.id,
            item.identificacao_pedido,
          )
        );

        setRows(formattedData);
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };

    fetchData();
  }, []);

  const handleDelete = (index: number) => {
    setDeleteRowIndex(index);
    setConfirmDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (deleteRowIndex !== null) {
      try {
        const id = rows[deleteRowIndex]._id;
  
        const response = await fetch(`/api/delete/pedido/${id}`, {
          method: 'DELETE',
        });
  
        if (!response.ok) {
          throw new Error('Falha ao deletar o pedido');
        }
  
        const updatedRows = [...rows];
        updatedRows.splice(deleteRowIndex, 1);
        setRows(updatedRows);
        setTextSnackBarAlert('Pedido deletado com sucesso!');
        setSnackbarOpen(true);
      } catch (error) {
        console.error('Error ao deletar o pedido: ', error);
      } finally {
        setConfirmDeleteOpen(false);
        setDeleteRowIndex(null);
      }
    }
  }; 

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleCloseDeleteModal = () => {
    setConfirmDeleteOpen(false);
    setDeleteRowIndex(null);
  };

  const filteredRows = searchTerm.trim() === '' ? rows : rows.filter(row =>
    row.nome_modelo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Fragment>
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TextField
          label="Pesquisar Modelo"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ margin: '10px 20px' }}
        />
        <Button variant="contained" startIcon={<Plus />} style={{ margin: '10px 20px' }} href='/pedido/add'>
          Gerar Pedido
        </Button>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
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
                      <strong>Ainda nenhum pedido gerado!</strong>
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, rowIndex) => (
                  <TableRow hover role="checkbox" tabIndex={-1} key={rowIndex}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.id === 'actions' ? (
                            <Fragment>
                              <IconButton href={`/pedido/view/${row._id}`}>
                                <EyeArrowRight />
                              </IconButton>
                              <IconButton href={`/pedido/edit/${row._id}`}>
                                  <Pen />
                                </IconButton>
                              <IconButton onClick={() => handleDelete(rowIndex)}>
                                <DeleteEmpty />
                              </IconButton>
                            </Fragment>
                          ) : (
                            value
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert severity="success" onClose={handleCloseSnackbar}>
          {textSnackBarAlert}
        </Alert>
      </Snackbar>
      <Dialog open={confirmDeleteOpen} onClose={handleCloseDeleteModal}>
        <DialogTitle>Confirmação de Ação</DialogTitle>
        <DialogContent>
          Tem certeza que deseja excluir este pedido?
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

export default TablePedidos;