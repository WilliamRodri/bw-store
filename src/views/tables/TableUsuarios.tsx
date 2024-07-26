import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Paper, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography } from "@mui/material";
import { Check, Close, DeleteEmpty, Plus, SquareEditOutline } from "mdi-material-ui";
import { ChangeEvent, Fragment, useEffect, useState } from "react";
import withAuth from "src/lib/withAuth";

interface Column {
  id: 'id' | 'username' | 'password' | 'actions';
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: 'username', align: 'right', label: 'Username' },
  { id: 'password', label: 'Password', align: 'right' },
  { id: 'actions', label: 'Ações', minWidth: 170, align: 'right' },
];

interface Data {
  _id: string;
  username: string;
  password: string;
  [key: string]: any;
}

function createData(
  _id: string,
  username: string,
  password: string,
): Data {
  return { _id, username, password };
}

const TableUsuarios = () => {
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusCreate, setStatusCreate] = useState<boolean>(false);
  const [rows, setRows] = useState<Data[]>([]);
  const [editingRowIndex, setEditingRowIndex] = useState<number | null>(null);
  const [editingRow, setEditingRow] = useState<Data | null>(null);

  const [textSnackBarAlert, setTextSnackBarAlert] = useState<string>('');
  const [errors, setErrors] = useState<{ username?: boolean; password?: boolean }>({});
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState<boolean>(false);
  const [deleteRowIndex, setDeleteRowIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/usuarios');
        const dataJson = await response.json();

        const formattedData = dataJson.map((item: any) =>
          createData(
            item._id,
            item.username,
            item.password,
          )
        );

        setRows(formattedData);
      } catch (error) {
        console.error('Error fetching data', error);
      }
    }

    fetchData();
  }, []);

  const handleAddRow = () => {
    setStatusCreate(true);
    const newRow = createData('', '', '');
    setRows([newRow, ...rows]);
    setEditingRowIndex(0);
    setEditingRow(newRow);
  };

  const handleInputChange = (event: any) => {
    if (editingRow) {
      const { name, value } = event.target;
      const updatedRow = { ...editingRow, [name]: value };
      setEditingRow(updatedRow);
    }
  };

  const handleSave = async () => {
    if (editingRowIndex !== null && editingRow) {
      let { username, password } = editingRow;

            const newErrors: { username?: boolean; password?: boolean } = {};
            if (!username) newErrors.username = true;
            if (!password) newErrors.password = true;
            setErrors(newErrors);

      if (Object.keys(newErrors).length === 0) {
        if (statusCreate) {
          try {
            const response = await fetch('/api/add/usuario', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(editingRow),
            });

            if (!response.ok) {
              throw new Error('Failed to add user');
            }

            setTextSnackBarAlert('Usuário cadastrado com sucesso!');
            setSnackbarOpen(true);
            setStatusCreate(false);

            const newUser = await response.json();
            const updatedRows = [...rows];
            updatedRows[editingRowIndex] = newUser;
            setRows(updatedRows);
            setEditingRowIndex(null);
            setEditingRow(null);
          } catch (error) {
            console.error('Error adding user: ', error);
          }
        } else {
          try {
            const response = await fetch('/api/update/usuario', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(editingRow),
            });

            if (!response.ok) {
              throw new Error('Failed to update user');
            }

            setTextSnackBarAlert('Usuário atualizado com sucesso!');
            setSnackbarOpen(true);

            const updatedRows = [...rows];
            updatedRows[editingRowIndex] = editingRow;
            setRows(updatedRows);
            setEditingRowIndex(null);
            setEditingRow(null);
          } catch (error) {
            console.error('Error updating user: ', error);
          }
        }
      }
    }
  };

  const handleCancelCreate = () => {
    setStatusCreate(false);
    const updatedRows = [...rows];
    updatedRows.shift();
    setEditingRowIndex(null);
    setRows(updatedRows);
  };

  const handleEdit = (index: number) => {
    setStatusCreate(false);
    setEditingRowIndex(index);
    setEditingRow(rows[index]);
  };

  const handleDelete = (index: number) => {
    setDeleteRowIndex(index);
    setConfirmDeleteOpen(true);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleCloseDeleteModal = () => {
    setConfirmDeleteOpen(false);
    setDeleteRowIndex(null);
  };

  const confirmDelete = async () => {
    if (deleteRowIndex !== null) {
      try {
        const id = rows[deleteRowIndex]._id;

        const response = await fetch(`/api/delete/usuario/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete user');
        }

        const updatedRows = [...rows];
        updatedRows.splice(deleteRowIndex, 1);
        setRows(updatedRows);
        setTextSnackBarAlert('Usuário deletado com sucesso!');
        setSnackbarOpen(true);
      } catch (error) {
        console.error('Error deleting user: ', error);
      } finally {
        setConfirmDeleteOpen(false);
        setDeleteRowIndex(null);
      }
    }
  };

  return (
    <Fragment>
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TextField
          label="Pesquisar Usuário"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ margin: '10px 20px' }}
        />
        <Button variant="contained" startIcon={<Plus />} onClick={handleAddRow} style={{ margin: '10px 20px' }}>
          Cadastrar Usuário
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
                      <strong>Ainda sem nenhum usuário cadastrado!</strong>
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
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
                              <TextField
                                name={column.id}
                                value={editingRow ? (editingRow[column.id] as string) : ''}
                                onChange={handleInputChange}
                                fullWidth
                                error={column.id === 'username' && errors.username}
                                type={column.id === 'password' ? 'password' : 'text'}
                              />
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
          count={rows.length}
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
        <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleCloseSnackbar}>
          <Alert severity="success" onClose={handleCloseSnackbar}>
            {textSnackBarAlert}
          </Alert>
        </Snackbar>
        <Dialog open={confirmDeleteOpen} onClose={handleCloseDeleteModal}>
          <DialogTitle>Confirmação de Ação</DialogTitle>
          <DialogContent>
            Tem certeza que deseja excluir este usuário?
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
      </Paper>
    </Fragment>
  );
}

export default withAuth(TableUsuarios);