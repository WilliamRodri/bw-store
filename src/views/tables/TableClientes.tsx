import { Box, Button, CircularProgress, Divider, IconButton, Modal, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography } from "@mui/material";
import { DeleteEmpty, Pencil, Plus } from "mdi-material-ui";
import { Fragment, useEffect, useState } from "react";

const TableClientes = () => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [loading, setLoading] = useState<boolean>(true);
    const [clientes, setClientes] = useState<any>([]);
    const [sales, setSales] = useState<any>([]);
    const [openModalDelete, setOpenModalDelete] = useState<boolean>(false);
    const [clientToDelete, setClientToDelete] = useState<number | null>(null);

    // Editar Cliente
    const [openEditClientModal, setOpenEditClientModal] = useState<boolean>(false);
    const [clientToEdit, setClientToEdit] = useState<any>({
        name: '',
        email: '',
        phone: '',
        cpf: '',
        address: ''
    });
    
    // Cadastrar cliente
    const [openAddClientModal, setOpenAddClientModal] = useState<any>(false);
    const [clienteToAdd, setClienteToAdd] = useState<any>({
        name: '',
        email: '',
        phone: '',
        cpf: '',
        address: ''
    });

    const handleOpenAddClientModal = () => {
        setOpenAddClientModal(true);
    }

    const handleCloseAddClientModal = () => {
        setOpenAddClientModal(false);
    }
    
    const [errors, setErrors] = useState({
        name: false,
        phone: false
    });

    const validateFields = () => {
        const newErrors = {
            name: clienteToAdd.name === "",
            phone: clienteToAdd.phone === ""
        }
    
        setErrors(newErrors);
        
        // Retorna true se todos os campos forem válidos (sem erros)
        return !Object.values(newErrors).includes(true);
    }

    const [errorsEdit, setErrorsEdit] = useState({
        name: false,
        phone: false
    });

    const validateFieldsEdit = () => {
        const newErrors = {
            name: clientToEdit.name === "",
            phone: clientToEdit.phone === ""
        }
    
        setErrors(newErrors);
        
        // Retorna true se todos os campos forem válidos (sem erros)
        return !Object.values(newErrors).includes(true);
    }

    const handleSaveClient = async () => {
        if (validateFields()) {
            const data = await clienteToAdd;

            const combinedData = {
                name: data.name,
                email: data.email,
                phone: data.phone,
                cpf: data.cpf,
                address: data.address
            };

            try {
                setLoading(true);
                const response = await fetch(`/api/clients/insertCliente/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(combinedData),
                });
        
                if (!response.ok) {
                    console.error('Failed to generate the client');
                    alert('Erro ao cadastrar o Cliente, Por favor, Tente Novamente.');
                } else {
                  location.reload();
                }

            } catch (error) {
                console.error('Error add data:', error);
                alert('Erro ao cadastrar o cliente, Por favor tente novamente.');
            } finally {
                setOpenAddClientModal(false);
                setLoading(false);
            }
        } else {
            alert("Por favor, preencha todos os campos obrigatórios.");
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/clientes/`);
                const responseSales = await fetch(`/api/vendas/`);

                const data = await response.json();
                const dataSales = await responseSales.json();

                setClientes(data.clients);
                setSales(dataSales.sales);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage);
    };
    
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const filteredRows = clientes.filter((cliente: any) =>
        cliente.id.toString().includes(searchTerm.toLowerCase()) ||
        cliente.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const colunasTabelaProdutos = [
        { id: 'id', label: '#', minWidth: 66, align: 'left' as const },
        { id: 'name', label: 'NOME', minWidth: 100, align: 'left' as const },
        { id: 'email', label: 'EMAIL', minWidth: 150, align: 'left' as const },
        { id: 'phone', label: 'TELEFONE', minWidth: 150, align: 'left' as const },
        { id: 'cpf', label: 'CPF', minWidth: 150, align: 'left' as const },
        { id: 'address', label: 'ENDREÇO', minWidth: 150, align: 'left' as const },
        { id: 'sales', label: 'COMPRAS(TOTAL)', minWidth: 150, align: 'left' as const },
        { id: 'actions', label: 'AÇÕES', minWidth: 170, align: 'right' as const },
    ];

    const deleteCliente = async (id: any) => {
        if (id === null) return;
    
        try {
          const response = await fetch(`/api/delete/clientes/${id}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            }
          });
    
          if (response.ok) {
            setClientes(clientes.filter((cliente: any) => cliente.id !== id));
            setOpenModalDelete(false);
          } else {
            console.error('Failed to delete the client');
          }
        } catch (error) {
          console.error('Error deleting the client:', error);
        }
    }

    const handleOpenModalDelete = (id: any) => {
        setClientToDelete(id);
        setOpenModalDelete(true);
    }

    const handleCloseModalDelete = () => {
        setOpenModalDelete(false);
    }

    const handleCloseClientEditModal = () => {
        setOpenEditClientModal(false);
        setClientToEdit({
            name: '',
            email: '',
            phone: '',
            cpf: '',
            address: ''
        })
    }

    const handleOpenClientEditModal = (client: any) => {
        setOpenEditClientModal(true);
        setClientToEdit(client);
    }

    const handleSaveEditClient = async () => {
        const data = {
            name: clientToEdit.name,
            email: clientToEdit.email,
            phone: clientToEdit.phone,
            cpf: clientToEdit.cpf,
            address: clientToEdit.address
        }

        if (validateFieldsEdit()) {
            try {
                setLoading(true);
                const response = await fetch(`/api/update/clientes/${clientToEdit?.id}`, {
                    method: 'POST',
                    body: JSON.stringify(data),
                    headers: {
                      'Content-Type': 'application/json',
                    }
                  });
            
                  if (response.ok) {
                    setClientes(clientes.filter((cliente: any) => cliente.id !== clientToEdit));
                    location.reload();
                  } else {
                    console.error('Failed to update the client');
                  }
            } catch (error) {
                console.error('Error update data:', error);
            } finally {
                setLoading(false);
                setOpenEditClientModal(false);
                setClientToEdit({
                    name: '',
                    email: '',
                    phone: '',
                    cpf: '',
                    address: ''
                });
            }
        } else {
            alert("Por favor, preencha todos os campos obrigatórios.");
        }
    }

    return(
        <Fragment>
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TextField
                    label="PESQUISAR CLIENTE"
                    variant="outlined"
                    fullWidth
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ margin: '10px 20px' }}
                />
                <Button variant="contained" startIcon={<Plus />} style={{ margin: '10px 20px' }} onClick={() => handleOpenAddClientModal()}>
                    CADASTRAR NOVO CLIENTE
                </Button>
                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                        <CircularProgress />
                    </div>
                ) : (
                    <TableContainer sx={{ maxHeight: 440 }}>
                        <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                            {colunasTabelaProdutos.map((column) => (
                                <TableCell key={column.id} align={column.align} sx={{ minWidth: column.minWidth }}>
                                    {column.label}
                                </TableCell>
                            ))}
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {clientes.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={colunasTabelaProdutos.length}>
                                <Typography variant="body2" sx={{ marginTop: 2 }}>
                                    <strong>AINDA NÃO FOI REALIZADA NENHUMA VENDA!</strong>
                                </Typography>
                                </TableCell>
                            </TableRow>
                            ) : (
                            filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((cliente: any, rowIndex: any) => (
                                <TableRow hover role="checkbox" tabIndex={-1} key={rowIndex}>
                                    {colunasTabelaProdutos.map((column) => {
                                        const value = cliente[column.id];
                                        return (
                                            <TableCell key={column.id} align={column.align}>
                                                {column.id === 'id' ? (
                                                    `#${value}`
                                                ) : column.id === 'name' ? (
                                                    value
                                                ) : column.id === 'email' ? (
                                                    value
                                                ) : column.id === 'phone' ? (
                                                    value
                                                ) : column.id === 'cpf' ? (
                                                    value
                                                ) : column.id === 'address' ? (
                                                    value
                                                ) : column.id === 'sales' ? (
                                                    (() => {
                                                        let totalSales = 0;
                                                        sales.forEach((sale: any) => {
                                                            if (sale.client_id === cliente.id) {
                                                                totalSales++;
                                                            }
                                                        });
                                                        return totalSales;
                                                    })()
                                                ) : column.id === 'actions' ? (
                                                    <Fragment>
                                                        {cliente.id !== 1 && (
                                                            <>
                                                                <IconButton onClick={() => handleOpenClientEditModal(cliente)}>
                                                                    <Pencil />
                                                                </IconButton>
                                                                <IconButton onClick={() => handleOpenModalDelete(cliente.id)}>
                                                                    <DeleteEmpty />
                                                                </IconButton>
                                                            </>
                                                        )}
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
                    </TableContainer>
                )}
            </Paper>

            {/* MODAL PARA CADASTRAR CLIENTE */}
            <Modal
                open={openAddClientModal}
                onClose={handleCloseAddClientModal}
                aria-labelledby="edit-modal-title"
                aria-describedby="edit-modal-description"
            >
                <Box sx={{
                width: 400,
                bgcolor: 'background.paper',
                padding: 4,
                margin: 'auto',
                marginTop: '5%',
                borderRadius: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                }}>
                <Typography id="edit-modal-title" variant="h6" component="h2">
                    CADASTRANDO NOVO CLIENTE
                </Typography>
                <Divider />
                <TextField
                    label="NOME"
                    required
                    onChange={(e) => setClienteToAdd({ ...clienteToAdd, name: e.target.value })}
                />
                <TextField
                    label="EMAIL"
                    onChange={(e) => setClienteToAdd({ ...clienteToAdd, email: e.target.value })}
                />
                <TextField
                    label="TELEFONE"
                    type="number"
                    required
                    onChange={(e) => setClienteToAdd({ ...clienteToAdd, phone: e.target.value })}
                />
                <TextField
                    label="CPF"
                    type="number"
                    onChange={(e) => setClienteToAdd({ ...clienteToAdd, cpf: e.target.value })}
                />
                <TextField
                    label="ENDEREÇO"
                    onChange={(e) => setClienteToAdd({ ...clienteToAdd, address: e.target.value })}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                    <Button 
                        variant="contained" 
                        onClick={handleSaveClient}
                    >
                        CADASTRAR
                    </Button>
                    <Button onClick={handleCloseAddClientModal} sx={{ marginLeft: 2 }}>
                        CANCELAR
                    </Button>
                </Box>
                </Box>
            </Modal>

            {/* MODAL PARA EDITAR CLIENTE */}
            <Modal
                open={openEditClientModal}
                onClose={handleCloseClientEditModal}
                aria-labelledby="edit-modal-title"
                aria-describedby="edit-modal-description"
            >
                <Box sx={{
                    width: 400,
                    bgcolor: 'background.paper',
                    padding: 4,
                    margin: 'auto',
                    marginTop: '5%',
                    borderRadius: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                }}>
                <Typography id="edit-modal-title" variant="h6" component="h2">
                    EDITANDO CLIENTE
                </Typography>
                <Divider />
                <TextField
                    label="NOME"
                    required
                    value={clientToEdit.name}
                    onChange={(e) => setClientToEdit({ ...clientToEdit, name: e.target.value })}
                />
                <TextField
                    label="EMAIL"
                    value={clientToEdit.email}
                    onChange={(e) => setClientToEdit({ ...clientToEdit, email: e.target.value })}
                />
                <TextField
                    label="TELEFONE"
                    type="number"
                    required
                    value={clientToEdit.phone}
                    onChange={(e) => setClientToEdit({ ...clientToEdit, phone: e.target.value })}
                />
                <TextField
                    label="CPF"
                    type="number"
                    value={clientToEdit.cpf}
                    onChange={(e) => setClientToEdit({ ...clientToEdit, cpf: e.target.value })}
                />
                <TextField
                    label="ENDEREÇO"
                    value={clientToEdit.address}
                    onChange={(e) => setClientToEdit({ ...clientToEdit, address: e.target.value })}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                    <Button variant="contained" onClick={handleSaveEditClient}>
                        SALVAR ALTERAÇÕES
                    </Button>
                    <Button onClick={handleCloseClientEditModal} sx={{ marginLeft: 2 }}>
                        CANCELAR
                    </Button>
                </Box>
                </Box>
            </Modal>

            {/* MODAL PARA CONFIRMA EXCLUSÃO */}
            <Modal
                open={openModalDelete}
                onClose={handleCloseModalDelete}
                aria-labelledby="confirm-modal-title"
                aria-describedby="confirm-modal-description"
            >
                <Box sx={{ width: 400, bgcolor: 'background.paper', padding: 4, margin: 'auto', marginTop: '20%', borderRadius: 1 }}>
                    <Typography id="confirm-modal-title" variant="h6" component="h2">
                        Confirmar Exclusão
                    </Typography>
                    <Typography variant="body1" sx={{ marginTop: 2 }}>
                        Tem certeza de que deseja excluir o cliente?
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
                        <Button onClick={handleCloseModalDelete} sx={{ marginRight: 1 }}>
                            Cancelar
                        </Button>
                        <Button variant="contained" color="error" onClick={() => deleteCliente(clientToDelete)}>
                            Excluir
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </Fragment>
    )
}

export default TableClientes;