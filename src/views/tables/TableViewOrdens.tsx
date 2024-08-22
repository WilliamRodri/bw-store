import { Box, Button, CircularProgress, Divider, IconButton, Modal, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography } from "@mui/material";
import { DeleteEmpty, Eye, Pencil, Plus } from "mdi-material-ui";
import { Fragment, useEffect, useState } from "react";

const TableViewOrdens = () => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const colunasTabelaOrdem = [
        { id: 'id', label: '#', minWidth: 66, align: 'left' as const },
        { id: 'client_id', label: 'CLIENTE', minWidth: 100, align: 'left' as const },
        { id: 'product', label: 'PRODUTO', minWidth: 150, align: 'left' as const },
        { id: 'status', label: 'STATUS', minWidth: 150, align: 'left' as const },
        { id: 'order_date', label: 'DATA', minWidth: 150, align: 'left' as const },
        { id: 'actions', label: 'AÇÕES', minWidth: 170, align: 'right' as const },
    ];
    const [openViewOrder, setOpenViewOrder] = useState<boolean>(false);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [openConfirmModal, setOpenConfirmModal] = useState<boolean>(false);
    const [selectedDeleteOrder, setSelectedDeleteOrder] = useState<any>(null);
    const [openAddOrder, setOpenAddOrder] = useState<boolean>(false);
    const [openEditOrder, setOpenEditOrder] = useState<boolean>(false);

    const [orders, setOrders] = useState<any>([]);
    const [clients, setClients] = useState<any[]>([]);
    const [paymentMethods, setPaymentMethods] = useState<any[]>([]);

    const [newOrder, setNewOrder] = useState<any>({
        client_id: '',
        product: '',
        status: '',
        order_date: '',
        description: '',
        date_start: '',
        date_end: '',
        materials: '',
        payment: '',
        observation: '',
        conditions: ''
    });

    const [orderToEdit, setOrderToEdit] = useState<any>({
        client_id: '',
        product: '',
        status: '',
        order_date: '',
        description: '',
        date_start: '',
        date_end: '',
        materials: '',
        payment: '',
        observation: '',
        conditions: ''
    });

    const statusOrder: any = [
        {
            id: 0,
            text: "ATIVO"
        },
        {
            id: 1,
            text: "CANCELADO"
        },
        {
            id: 2,
            text: "PENDENTE"
        }
    ]

    // Ajuste da filtragem para considerar o valor da venda em diferentes formatos
    const filteredRows = orders.filter((order: any) =>
        order.id.toString().includes(searchTerm.toLowerCase()) ||
        order.status.toString().includes(searchTerm.toLowerCase()) ||
        new Date(order.order_date).toLocaleDateString('pt-BR').includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/ordens`);
                const responseClients = await fetch(`/api/clientes`);
                const responsePayments = await fetch(`/api/vendas`);

                const data = await response.json();
                const dataClients = await responseClients.json();
                const dataPaymentMethods = await responsePayments.json();

                setOrders(data.orders);
                setClients(dataClients.clients);
                setPaymentMethods(dataPaymentMethods.paymentMethod);
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

    const handleOpenViewOrder = (order: any) => {
        setSelectedOrder(order);
        setOpenViewOrder(true);
    }

    const handleOpenConfirmModal = (orderId: any) => {
        setSelectedDeleteOrder(orderId);
        setOpenConfirmModal(true);
    }

    const handleOpenCloseAddOrder = () => {
        setOpenAddOrder(false);
        setNewOrder({
            client: '',
            product: '',
            status: '',
            order_date: '',
            description: '',
            date_start: '',
            date_end: '',
            materials: '',
            payment: '',
            observation: '',
            conditions: ''
        })
    }
    
    const handleOpenCloseEditOrder = () => {
        setOpenEditOrder(false);
        setOrderToEdit({
            client: '',
            product: '',
            status: '',
            order_date: '',
            description: '',
            date_start: '',
            date_end: '',
            materials: '',
            payment: '',
            observation: '',
            conditions: ''
        })
    }

    const handleDeleteOrder = async () => {
        if (selectedDeleteOrder == null) return;
        
        try {
            const response = await fetch(`/api/delete/ordens/${selectedDeleteOrder}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                location.replace('/ordens')
            } else {
                console.error('Failed to delete the order');
            }
        } catch (error) {
            console.error('Error deleting the order:', error);
        } finally {
            setOpenConfirmModal(false);
        }
    }

    const [errorsAddOrder, setErrorsAddOrder] = useState({
        client_id: false,
        payment: false,
        order_date: false,
        product: false,
        status: false,
    });
    console.error(errorsAddOrder);

    const validateFieldsAddOrder = () => {
        const newErrors = {
            client_id: newOrder.client_id === "",
            payment: newOrder.payment === "",
            order_date: newOrder.order_date === "",
            product: newOrder.product === "",
            status: newOrder.status === ""
        };
    
        setErrorsAddOrder(newErrors);
    
        // Retorna true se todos os campos forem válidos (sem erros)
        return !Object.values(newErrors).includes(true);
    };  

    const [errorsEditOrder, setErrorsEditOrder] = useState<any>({
        client_id: false,
        payment: false,
        order_date: false,
        product: false,
        status: false,
    });

    const validateFieldsEditOrder = () => {
        const newErrors: any = {
            client_id: orderToEdit.client_id === "",
            payment: orderToEdit.payment === "",
            order_date: orderToEdit.order_date === "",
            product: orderToEdit.product === "",
            status: orderToEdit.status === ""
        };
    
        setErrorsEditOrder(newErrors);
    
        // Retorna true se todos os campos forem válidos (sem erros)
        return !Object.values(newErrors).includes(true);
    };
    console.error(errorsEditOrder);

    const handleSaveOrder = async () => {
        if (validateFieldsAddOrder()) {
            const randomNumber = Math.floor(Math.random() * 10000);
            const randomCode = randomNumber.toString().padStart(4, '0');
            const status = 
                newOrder.status == "0" ? "ATIVO" :
                newOrder.status == "1" ? "CANCELADO" :
                newOrder.status == "2" ? "PENDENTE" :
                "0";
            const combinedData = {
                id: randomCode,
                client_id: newOrder.client_id,
                product: newOrder.product,
                status: status,
                order_date: newOrder.order_date,
                description: newOrder.description,
                materials: newOrder.materials,
                payment_id: newOrder.payment,
                observation: newOrder.observation,
                conditions: newOrder.conditions,
                date_start: newOrder.date_start,
                date_end: newOrder.date_end
            }
            try {
                setLoading(true);

                const response = await fetch(`/api/ordens/insertOrden/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(combinedData),
                });

                if (!response.ok) {
                    console.error('Failed to generate the sale');
                    alert('Erro ao gerar a venda. Por favor, tente novamente.');
                } else {
                    location.replace('/ordens')
                }

            } catch (error) {
                console.error('Error fetching data:', error);
                alert('Erro ao gerar a ordem. Por favor, tente novamente.');
            } finally {
                setOpenAddOrder(false);
                setLoading(false);
            }
        } else {
            alert("Preencha todos os campos obrigatorios corretamente!");
        }
    }

    const formatDateToMySQL = (dateString: any) => {
        const date = new Date(dateString);
        // Converte para o formato YYYY-MM-DD HH:MM:SS
        return date.toISOString().slice(0, 19).replace('T', ' ');
    };

    const handleSaveEditOrder = async () => {
        if (validateFieldsEditOrder()) {
            const status = 
                orderToEdit.status == "0" ? "ATIVO" :
                orderToEdit.status == "1" ? "CANCELADO" :
                orderToEdit.status == "2" ? "PENDENTE" :
                "0";

            const combinedData = {
                client_id: orderToEdit.client_id,
                product: orderToEdit.product,
                status: status,
                order_date: formatDateToMySQL(orderToEdit.order_date),
                description: orderToEdit.description,
                materials: orderToEdit.materials,
                payment_id: orderToEdit.payment,
                observation: orderToEdit.observation,
                conditions: orderToEdit.conditions,
                date_start: formatDateToMySQL(orderToEdit.date_start),
                date_end: formatDateToMySQL(orderToEdit.date_end)
            };
            try {
                setLoading(true);
                const response = await fetch(`/api/update/orden/${orderToEdit.id}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(combinedData),
                });

                if (!response.ok) {
                    console.error('Failed to update the order');
                    alert('Erro ao atualizar a ordem. Por favor, tente novamente.');
                } else {
                    location.replace('/ordens')
                }

            } catch (error) {
                console.error('Error fetching data:', error);
                alert('Erro ao atualizar a ordem. Por favor, tente novamente.');
            } finally {
                setOpenEditOrder(false);
                setLoading(false);
            }
        } else {
            alert("Preencha todos os campos obrigatorios corretamente!");
        }
    }

    const handleEditOrder = (order: any) => {
        setOpenEditOrder(true);
        setOrderToEdit(order);
    }

    return(
        <Fragment>
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TextField
                    label="PESQUISAR ORDEM"
                    variant="outlined"
                    fullWidth
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ margin: '10px 20px' }}
                />
                <Button variant="contained" startIcon={<Plus />} style={{ margin: '10px 20px' }} onClick={() => setOpenAddOrder(true)}>
                    GERAR NOVA ORDEM
                </Button>
                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                        <CircularProgress />
                    </div>
                ) : (
                    <TableContainer sx={{ maxHeight: 440 }} >
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                    {colunasTabelaOrdem.map((column: any) => (
                                        <TableCell key={column.id} align={column.align} sx={{ minWidth: column.minWidth }}>
                                            {column.label}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {orders.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={colunasTabelaOrdem.length}>
                                            <Typography variant="body2" sx={{ marginTop: 2 }}>
                                                <strong>AINDA NÃO FOI REALIZADA NENHUMA ORDEM!</strong>
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((order: any, rowIndex: any) => (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={rowIndex}>
                                            {colunasTabelaOrdem.map((column) => {
                                                const value = order[column.id];
                                                return (
                                                    <TableCell key={column.id} align={column.align}>
                                                        {
                                                            column.id === 'client_id' ? (
                                                                clients.find((client: any) => client.id === order.client_id)?.name || 'Cliente não encontrado'
                                                            )
                                                            :
                                                            column.id === 'product' ? (value)
                                                            :
                                                            column.id === 'status' ?
                                                                (order?.status === "ATIVO" ?
                                                                (<div style={{ color: "#80FF7C" }}>{value}</div>) :
                                                                order?.status === "PENDENTE" ?
                                                                (<div style={{ color: "yellow" }}>{value}</div>) :
                                                                order?.status === "CANCELADO" ?
                                                                (<div style={{ color: "#FF7C7C" }}>{value}</div>) :
                                                                (<div>{value}</div>)
                                                            )
                                                            :
                                                            column.id === 'order_date' ? new Date(value).toLocaleDateString('pt-BR')
                                                            :
                                                            column.id === 'actions' ? (
                                                                <Fragment>
                                                                    <IconButton onClick={() => handleOpenViewOrder(order)}>
                                                                        <Eye />
                                                                    </IconButton>
                                                                    {order.status !== "CANCELADO" ? (
                                                                        <>
                                                                            <IconButton onClick={() => handleEditOrder(order)}>
                                                                                <Pencil />
                                                                            </IconButton>
                                                                            <IconButton onClick={() => handleOpenConfirmModal(order.id)}>
                                                                                <DeleteEmpty />
                                                                            </IconButton>
                                                                        </>
                                                                    ) : ('')}
                                                                </Fragment>
                                                            )
                                                            : value
                                                        }
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

            {/* MODAL PARA GERAR NOVA ORDEM */}
            <Modal
                open={openAddOrder}
                onClose={() => setOpenAddOrder(false)}
                aria-labelledby="new-sale-modal-title"
                aria-describedby="new-sale-modal-description"
            >
                <Box
                    sx={{
                        width: {
                            xs: '90%',
                            sm: 400,
                            md: 500,
                        },
                        maxHeight: '80vh',
                        bgcolor: 'background.paper',
                        padding: {
                            xs: 2,
                            sm: 3,
                            md: 4,
                        },
                        margin: 'auto',
                        marginTop: {
                            xs: '10%',
                            sm: '5%',
                        },
                        borderRadius: 1,
                        boxShadow: 24,
                        overflowY: 'auto',
                    }}
                >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography id="new-sale-modal-title" variant="h6" component="h2">
                            GERANDO ORDEM DE SERVIÇO
                        </Typography>
                        <Button variant="contained" color="primary" onClick={handleOpenCloseAddOrder}>
                            CANCELAR
                        </Button>
                    </Box>
                    <Divider />
                    <TextField
                        required
                        select
                        value={newOrder.client_id}
                        onChange={(e) => setNewOrder({ ...newOrder, client_id: e.target.value })}
                        fullWidth
                        margin="normal"
                        SelectProps={{
                            native: true,
                        }}
                    >
                        <option value="">SELECIONE UM CLIENTE</option>
                        {clients.map((client: any) => (
                            <option key={client.id} value={client.id}>{client.name}</option>
                        ))}
                    </TextField>
                    <TextField
                        required
                        select
                        value={newOrder.payment}
                        onChange={(e) => setNewOrder({ ...newOrder, payment: e.target.value })}
                        fullWidth
                        margin="normal"
                        SelectProps={{
                            native: true,
                        }}
                    >
                        <option value="">SELECIONE UMA FORMA DE PAGAMENTO</option>
                        {paymentMethods.map(paymentMethod => (
                            <option key={paymentMethod.id} value={paymentMethod.id}>{paymentMethod.type_payment}</option>
                        ))}
                    </TextField>
                    <Divider />
                    <TextField
                        required
                        type="date"
                        label="DATA DA ORDEM"
                        value={newOrder.order_date}
                        onChange={(e) => setNewOrder({ ...newOrder, order_date: e.target.value })}
                        fullWidth
                        margin="normal"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <Divider />
                    <TextField
                        required
                        label="PRODUTO"
                        value={newOrder.product}
                        onChange={(e) => setNewOrder({ ...newOrder, product: e.target.value })}
                        fullWidth
                        margin="normal"
                        inputProps={{ min: 0 }}
                    />
                    <Divider />
                    <TextField
                        label="MATERIAIS"
                        value={newOrder.materials}
                        onChange={(e) => setNewOrder({ ...newOrder, materials: e.target.value })}
                        fullWidth
                        margin="normal"
                        inputProps={{ min: 0 }}
                    />
                    <Divider />
                    <TextField
                        label="CONDIÇÕES"
                        value={newOrder.conditions}
                        onChange={(e) => setNewOrder({ ...newOrder, conditions: e.target.value })}
                        fullWidth
                        margin="normal"
                        inputProps={{ min: 0 }}
                    />
                    <Divider />
                    <TextField
                        label="DESCRIÇÃO DO SERVIÇO"
                        value={newOrder.description}
                        onChange={(e) => setNewOrder({ ...newOrder, description: e.target.value })}
                        fullWidth
                        margin="normal"
                        inputProps={{ min: 0 }}
                    />
                    <Divider />
                    <TextField
                        label="OBSERVAÇÃO DO SERVIÇO OU PRODUTO"
                        value={newOrder.observation}
                        onChange={(e) => setNewOrder({ ...newOrder, observation: e.target.value })}
                        fullWidth
                        margin="normal"
                        inputProps={{ min: 0 }}
                    />
                    <Divider />
                    <TextField
                        type="date"
                        label="DATA DE INÍCIO"
                        value={newOrder.date_start}
                        onChange={(e) => setNewOrder({ ...newOrder, date_start: e.target.value })}
                        fullWidth
                        margin="normal"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <Divider />
                    <TextField
                        type="date"
                        label="PREVISÃO DE ENTREGA"
                        value={newOrder.date_end}
                        onChange={(e) => setNewOrder({ ...newOrder, date_end: e.target.value })}
                        fullWidth
                        margin="normal"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <Divider />
                    <TextField
                        required
                        select
                        value={newOrder.status}
                        onChange={(e) => setNewOrder({ ...newOrder, status: e.target.value })}
                        fullWidth
                        margin="normal"
                        SelectProps={{
                            native: true,
                        }}
                    >
                        <option value="">SELECIONE UM STATUS</option>
                        {statusOrder.map((status: any) => (
                            <option key={status.id} value={status.id}>{status.text}</option>
                        ))}
                    </TextField>
                    <Divider />
                    <Button variant="contained" color="primary" onClick={handleSaveOrder}>
                        FINALIZAR ORDEM
                    </Button>
                </Box>
            </Modal>

            {/* MODAL PARA EDITAR ORDEM */}
            <Modal
                open={openEditOrder}
                onClose={() => setOpenEditOrder(false)}
                aria-labelledby="new-sale-modal-title"
                aria-describedby="new-sale-modal-description"
            >
                <Box
                    sx={{
                        width: {
                            xs: '90%',
                            sm: 400,
                            md: 500,
                        },
                        maxHeight: '80vh',
                        bgcolor: 'background.paper',
                        padding: {
                            xs: 2,
                            sm: 3,
                            md: 4,
                        },
                        margin: 'auto',
                        marginTop: {
                            xs: '10%',
                            sm: '5%',
                        },
                        borderRadius: 1,
                        boxShadow: 24,
                        overflowY: 'auto',
                    }}
                >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography id="new-sale-modal-title" variant="h6" component="h2">
                            EDITANDO ORDEM DE SERVIÇO
                        </Typography>
                        <Button variant="contained" color="primary" onClick={handleOpenCloseEditOrder}>
                            CANCELAR
                        </Button>
                    </Box>
                    <Divider />
                    <TextField
                        required
                        select
                        value={orderToEdit.client_id}
                        onChange={(e) => setOrderToEdit({ ...orderToEdit, client_id: e.target.value })}
                        fullWidth
                        margin="normal"
                        SelectProps={{
                            native: true,
                        }}
                    >
                        <option value="">SELECIONE UM CLIENTE</option>
                        {clients.map((client: any) => (
                            <option key={client.id} value={client.id}>{client.name}</option>
                        ))}
                    </TextField>
                    <TextField
                        required
                        select
                        value={orderToEdit.payment}
                        onChange={(e) => setOrderToEdit({ ...orderToEdit, payment: e.target.value })}
                        fullWidth
                        margin="normal"
                        SelectProps={{
                            native: true,
                        }}
                    >
                        <option value="">SELECIONE UMA FORMA DE PAGAMENTO</option>
                        {paymentMethods.map(paymentMethod => (
                            <option key={paymentMethod.id} value={paymentMethod.id}>{paymentMethod.type_payment}</option>
                        ))}
                    </TextField>
                    <Divider />
                    <TextField
                        required
                        type="date"
                        label="DATA DA ORDEM"
                        value={orderToEdit.order_date}
                        onChange={(e) => setOrderToEdit({ ...orderToEdit, order_date: e.target.value })}
                        fullWidth
                        margin="normal"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <Divider />
                    <TextField
                        required
                        label="PRODUTO"
                        value={orderToEdit.product}
                        onChange={(e) => setOrderToEdit({ ...orderToEdit, product: e.target.value })}
                        fullWidth
                        margin="normal"
                        inputProps={{ min: 0 }}
                    />
                    <Divider />
                    <TextField
                        label="MATERIAIS"
                        value={orderToEdit.materials}
                        onChange={(e) => setOrderToEdit({ ...orderToEdit, materials: e.target.value })}
                        fullWidth
                        margin="normal"
                        inputProps={{ min: 0 }}
                    />
                    <Divider />
                    <TextField
                        label="CONDIÇÕES"
                        value={orderToEdit.conditions}
                        onChange={(e) => setOrderToEdit({ ...orderToEdit, conditions: e.target.value })}
                        fullWidth
                        margin="normal"
                        inputProps={{ min: 0 }}
                    />
                    <Divider />
                    <TextField
                        label="DESCRIÇÃO DO SERVIÇO"
                        value={orderToEdit.description}
                        onChange={(e) => setOrderToEdit({ ...orderToEdit, description: e.target.value })}
                        fullWidth
                        margin="normal"
                        inputProps={{ min: 0 }}
                    />
                    <Divider />
                    <TextField
                        label="OBSERVAÇÃO DO SERVIÇO OU PRODUTO"
                        value={orderToEdit.observation}
                        onChange={(e) => setOrderToEdit({ ...orderToEdit, observation: e.target.value })}
                        fullWidth
                        margin="normal"
                        inputProps={{ min: 0 }}
                    />
                    <Divider />
                    <TextField
                        type="date"
                        label="DATA DE INÍCIO"
                        value={orderToEdit.date_start}
                        onChange={(e) => setOrderToEdit({ ...orderToEdit, date_start: e.target.value })}
                        fullWidth
                        margin="normal"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <Divider />
                    <TextField
                        type="date"
                        label="PREVISÃO DE ENTREGA"
                        value={orderToEdit.date_end}
                        onChange={(e) => setOrderToEdit({ ...orderToEdit, date_end: e.target.value })}
                        fullWidth
                        margin="normal"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <Divider />
                    <TextField
                        required
                        select
                        value={orderToEdit.status}
                        onChange={(e) => setOrderToEdit({ ...orderToEdit, status: e.target.value })}
                        fullWidth
                        margin="normal"
                        SelectProps={{
                            native: true,
                        }}
                    >
                        <option value="">SELECIONE UM STATUS</option>
                        {statusOrder.map((status: any) => (
                            <option key={status.id} value={status.id}>{status.text}</option>
                        ))}
                    </TextField>
                    <Divider />
                    <Button variant="contained" color="primary" onClick={handleSaveEditOrder}>
                        SALVAR ORDEM
                    </Button>
                </Box>
            </Modal>

            {/* MODAL DE DETALHES DA ORDEM */}
            <Modal
                open={openViewOrder}
                onClose={() => setOpenViewOrder(false)}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Box
                    sx={{
                        width: { xs: '90%', sm: '80%', md: '60%', lg: '50%' },
                        bgcolor: 'background.paper',
                        padding: 4,
                        margin: 'auto',
                        marginTop: "5%",
                        borderRadius: 1,
                        maxHeight: '80vh',
                        overflowY: 'auto'
                    }}
                >
                    <Typography id="modal-title" variant="h6" component="h2">
                        DETALHES DA ORDEM - #{selectedOrder?.id}
                    </Typography>
                    <Divider sx={{ marginY: 2 }} />

                    <TextField
                        label="CLIENTE"
                        fullWidth
                        multiline
                        variant="outlined"
                        value={clients.find((client: any) => client.id === selectedOrder?.client_id)?.name || 'Cliente não encontrado'}
                        sx={{ marginBottom: 2 }}
                    />
                    <TextField
                        label="PRODUTO"
                        fullWidth
                        multiline
                        variant="outlined"
                        value={selectedOrder?.product}
                        sx={{ marginBottom: 2 }}
                    />
                    <TextField
                        label="STATUS"
                        fullWidth
                        multiline
                        variant="outlined"
                        value={selectedOrder?.status}
                        sx={{ marginBottom: 2 }}
                    />
                    <TextField
                        label="DATA"
                        fullWidth
                        multiline
                        variant="outlined"
                        value={new Date(selectedOrder?.order_date).toLocaleDateString('pt-BR')}
                        sx={{ marginBottom: 2 }}
                    />
                    
                    <TextField
                        label="DESCRIÇÃO"
                        fullWidth
                        multiline
                        variant="outlined"
                        value={selectedOrder?.description}
                        sx={{
                            marginBottom: 2,
                            '& .MuiInputBase-root': {
                                minHeight: '80px',
                                alignItems: 'flex-start'
                            },
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'rgba(0, 0, 0, 0.23)'
                            }
                        }}
                        InputProps={{
                            sx: { 
                                height: 'auto', 
                                overflowY: 'auto' 
                            }
                        }}
                    />
                    <TextField
                        label="INÍCIO"
                        fullWidth
                        multiline
                        variant="outlined"
                        value={new Date(selectedOrder?.date_start).toLocaleDateString('pt-BR')}
                        sx={{ marginBottom: 2 }}
                    />
                    <TextField
                        label="FIM"
                        fullWidth
                        multiline
                        variant="outlined"
                        value={new Date(selectedOrder?.date_end).toLocaleDateString('pt-BR')}
                        sx={{ marginBottom: 2 }}
                    />
                    <TextField
                        label="MATERIAIS"
                        fullWidth
                        multiline
                        variant="outlined"
                        value={selectedOrder?.materials}
                        sx={{ marginBottom: 2 }}
                    />
                    <TextField
                        label="PAGAMENTO"
                        fullWidth
                        multiline
                        variant="outlined"
                        value={
                            selectedOrder?.payment_id == 4 ? ('PIX') :
                            selectedOrder?.payment_id == 2 ? ('CARTÃO') :
                            selectedOrder?.payment_id == 1 ? ('DINHEIRO') :
                            ''
                        }
                        sx={{ marginBottom: 2 }}
                    />
                    <TextField
                        label="OBSERVAÇÕES"
                        fullWidth
                        multiline
                        variant="outlined"
                        value={selectedOrder?.observation}
                        sx={{ marginBottom: 2 }}
                    />
                    <TextField
                        label="CONDIÇÕES"
                        fullWidth
                        multiline
                        variant="outlined"
                        value={selectedOrder?.conditions}
                        sx={{ marginBottom: 2 }}
                    />

                    <Divider sx={{ marginY: 2 }} />
                    <Button onClick={() => setOpenViewOrder(false)} sx={{ marginTop: 2 }}>
                        Fechar
                    </Button>
                </Box>
            </Modal>

            {/* MODAL PARA CONFIRMA EXCLUSÃO */}
            <Modal
                open={openConfirmModal}
                onClose={() => setOpenConfirmModal(false)}
                aria-labelledby="confirm-modal-title"
                aria-describedby="confirm-modal-description"
            >
                <Box sx={{ width: 400, bgcolor: 'background.paper', padding: 4, margin: 'auto', marginTop: '20%', borderRadius: 1 }}>
                    <Typography id="confirm-modal-title" variant="h6" component="h2">
                        Confirmar Cancelamento
                    </Typography>
                    <Typography variant="body1" sx={{ marginTop: 2 }}>
                        Tem certeza de que deseja cancelar a ordem de serviço?
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
                        <Button onClick={() => setOpenConfirmModal(false)} sx={{ marginRight: 1 }}>
                            Cancelar
                        </Button>
                        <Button variant="contained" color="error" onClick={handleDeleteOrder}>
                            Prosseguir
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </Fragment>
    );
}

export default TableViewOrdens;