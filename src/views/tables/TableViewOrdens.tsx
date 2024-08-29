import { Box, Button, CircularProgress, Divider, IconButton, Modal, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography } from "@mui/material";
import { DeleteEmpty, ExportVariant, Eye, Pencil, Plus } from "mdi-material-ui";
import { useRouter } from "next/router";
import { parseCookies } from "nookies";
import { Fragment, useEffect, useState } from "react";
import exportPdf from "src/lib/exportPdf";

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

    const [orders, setOrders] = useState<any>([]);
    const [clients, setClients] = useState<any[]>([]);

    const router = useRouter();
    const cookies = parseCookies();
    const clientData = JSON.parse(cookies.clientData);
    console.log({
        ordens: clientData
    })

    // Ajuste da filtragem para considerar o valor da venda em diferentes formatos
    const filteredRows = orders
        .filter((order: any) =>
            order.id.toString().includes(searchTerm.toLowerCase()) ||
            order.status.toString().includes(searchTerm.toLowerCase()) ||
            new Date(order.order_date).toLocaleDateString('pt-BR').includes(searchTerm.toLowerCase())
        )
        .sort((a: any, b: any) => new Date(b.order_date).getTime() - new Date(a.order_date).getTime()); // Ordena da data mais recente para a mais antiga

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/ordens`);
                const responseClients = await fetch(`/api/clientes`);

                const data = await response.json();
                const dataClients = await responseClients.json();

                setOrders(data.orders);
                setClients(dataClients.clients);
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
                <Button variant="contained" startIcon={<Plus />} style={{ margin: '10px 20px' }} onClick={() => { router.push('/ordens/novo/') }}>
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
                                                                            <IconButton onClick={() => { router.push(`/ordens/editar/${order.id}`) }}>
                                                                                <Pencil />
                                                                            </IconButton>
                                                                            <IconButton onClick={() => handleOpenConfirmModal(order.id)}>
                                                                                <DeleteEmpty />
                                                                            </IconButton>
                                                                            <IconButton onClick={() => exportPdf(order, clientData)}>
                                                                                <ExportVariant />
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
                            labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
                        />
                    </TableContainer>
                )}
            </Paper>

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
    )
}

export default TableViewOrdens;