import { Button, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, TablePagination, CircularProgress, Modal, Box, Checkbox, Divider } from "@mui/material";
import { DeleteCircleOutline, DeleteEmpty, Eye, Plus, Printer } from "mdi-material-ui";
import { useRouter } from "next/router";
import { Fragment, useEffect, useState } from "react";
import ProductSelectionModal from "./ProductSelectionModal";

const TableViewSales = () => {

    const [searchTerm, setSearchTerm] = useState<string>('');
    const [sales, setSales] = useState<any[]>([]);
    const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
    const [salesProducts, setSalesProducts] = useState<any[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [loading, setLoading] = useState<boolean>(true);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [selectedSale, setSelectedSale] = useState<any>(null);
    const [openConfirmModal, setOpenConfirmModal] = useState<boolean>(false);
    const [saleToDelete, setSaleToDelete] = useState<number | null>(null);
    const [returnsStock, setReturnsStock] = useState<boolean>(false);
    const [clients, setClients] = useState<any[]>([]);
    const router = useRouter();

    // Modal de "NOVA VENDA"
    const [openProductModal, setOpenProductModal] = useState(false);
    const [openNewSaleModal, setOpenNewSaleModal] = useState<boolean>(false);
    const [newSale, setNewSale] = useState<any>({
        clientId: '',
        paymentMethodId: '',
        saleDate: '',
        products: [],
        discount: 0,
        subtotal: 0,
    });

    const [errors, setErrors] = useState({
        clientId: false,
        paymentMethodId: false,
        saleDate: false,
        products: false,
    });
    const validateFields = () => {
        const newErrors = {
            clientId: newSale.clientId === "",
            paymentMethodId: newSale.paymentMethodId === "",
            saleDate: newSale.saleDate === "",
            products: newSale.products.length === 0,
        };
    
        setErrors(newErrors);
    
        // Retorna true se todos os campos forem válidos (sem erros)
        return !Object.values(newErrors).includes(true);
    };        

    const handleOpenNewSaleModal = () => {
        setOpenNewSaleModal(true);
    };
    
    const handleCloseNewSaleModal = () => {
        setNewSale({
            clientId: '',
            paymentMethodId: '',
            saleDate: new Date().toISOString().split('T')[0],
            products: [],
            discount: 0,
            subtotal: 0,
        });
        setOpenNewSaleModal(false);
    };

    const handleSubmitNewSale = async () => {
        if (validateFields()) {
            const combinedData = {
                client: newSale.clientId,
                date: newSale.saleDate,
                paymentMethod: newSale.paymentMethodId,
                items: newSale.products.map((product: any) => ({
                    product_id: product.id,
                    quantity: product.quantity || 1,
                    discountProduct: product.discount || 0,
                })),
                discountSale: newSale.discount,
                subtotal: newSale.subtotal,
            };

            try {
                setLoading(true);
                const response = await fetch(`/api/sales/insertSale/`, {
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
                    const responseId = await response.json();
                    print(responseId.id);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                alert('Erro ao gerar a venda. Por favor, tente novamente.');
            } finally {
                setOpenNewSaleModal(false);
                setLoading(false);
            }
        } else {
            alert("Por favor, preencha todos os campos obrigatórios.");
        }
    };    
    
    useEffect(() => {
        const subtotal = newSale.products.reduce((acc: number, product: any) =>
            acc + (parseFloat(product.price) * (product.quantity || 1)), 0);

        const discountedSubtotal = subtotal - newSale.discount;

        setNewSale((prevSale: any) => ({
            ...prevSale,
            subtotal: discountedSubtotal > 0 ? discountedSubtotal : 0  // Não permitir que o subtotal seja negativo
        }));
    }, [newSale.products, newSale.discount]);        

    const handleAddProduct = (product: any) => {
        setNewSale((prevSale: any) => ({
            ...prevSale,
            products: [...prevSale.products, product]
        }));
    };

    const colunasTabelaVendas = [
        { id: 'id', label: '#', minWidth: 66, align: 'left' as const },
        { id: 'total', label: 'TOTAL', minWidth: 100, align: 'left' as const },
        { id: 'sale_date', label: 'DATA', minWidth: 150, align: 'left' as const },
        { id: 'payment_method_id', label: 'FORMA DE PAGAMENTO', minWidth: 150, align: 'left' as const },
        { id: 'actions', label: 'AÇÕES', minWidth: 170, align: 'right' as const },
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/vendas`);
                const responseClients = await fetch(`/api/clientes`);
                
                const data = await response.json();
                const dataClients = await responseClients.json();

                // Dados das Vendas
                setSales(data.sales);
                setPaymentMethods(data.paymentMethod);
                setSalesProducts(data.salesProducts);
                setProducts(data.products);

                // Dados dos Clientes
                setClients(dataClients.clients);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Ajuste da filtragem para considerar o valor da venda em diferentes formatos
    const filteredRows = sales.filter(sale =>
        sale.id.toString().includes(searchTerm.toLowerCase()) ||
        sale.total.toString().includes(searchTerm.toLowerCase()) ||
        new Date(sale.sale_date).toLocaleDateString('pt-BR').includes(searchTerm.toLowerCase()) ||
        paymentMethods.find(payment => payment.id === sale.payment_method_id)?.type_payment.toLowerCase().includes(searchTerm.toLowerCase()) || 
        false
    );

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleOpenModal = (sale: any) => {
        setSelectedSale(sale);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleOpenConfirmModal = (saleId: number) => {
        setSaleToDelete(saleId);
        setOpenConfirmModal(true);
    };

    const handleCloseConfirmModal = () => {
        setOpenConfirmModal(false);
        setSaleToDelete(null);
        setReturnsStock(false);
    };

    const handleDeleteSale = async () => {
        if (saleToDelete === null) return;

        try {
            const response = await fetch(`/api/delete/vendas/${saleToDelete}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ returnsStock: returnsStock ? 'on' : 'off' }),
            });

            if (response.ok) {
                setSales(sales.filter(sale => sale.id !== saleToDelete));
            } else {
                console.error('Failed to delete the sale');
            }
        } catch (error) {
            console.error('Error deleting the sale:', error);
        } finally {
            handleCloseConfirmModal();
        }
    };

    const getProductDetails = (saleId: number) => {
        return salesProducts
            .filter((item: any) => item.sale_id === saleId)
            .map((item: any) => {
                const product = products.find((prod: any) => prod.id === item.product_id);
                return product ? (
                    <Box key={item.id} sx={{ padding: 1, marginBottom: 1 }}>
                        <Typography><strong>Nome:</strong> {product.name}</Typography>
                        <Typography><strong>Descrição:</strong> {product.description}</Typography>
                        <Typography><strong>Quantidade:</strong> {item.quantity}</Typography>
                    </Box>
                ) : (
                    <Box key={item.id} sx={{ border: '1px solid rgb(214, 214, 214)', borderRadius: 1, padding: 1, marginBottom: 1 }}>
                        <Typography><strong>Produto não encontrado</strong></Typography>
                    </Box>
                );
            });
    };

    const print = (id: any) => {
        router.push(`/vendas/print/${id}`);
    }

    console.error({ errors });

    return (
        <Fragment>
            <Paper sx={{ width: '100%', overflow: 'hidden' }} >
                <TextField
                    label="PESQUISAR VENDA"
                    variant="outlined"
                    fullWidth
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ margin: '10px 20px' }}
                />
                <Button variant="contained" startIcon={<Plus />} style={{ margin: '10px 20px' }} onClick={handleOpenNewSaleModal}>
                    GERAR NOVA VENDA
                </Button>
                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                        <CircularProgress />
                    </div>
                ) : (
                    <TableContainer sx={{ maxHeight: 440 }} >
                        <Table stickyHeader aria-label="sticky table" >
                            <TableHead>
                                <TableRow>
                                    {colunasTabelaVendas.map((column) => (
                                        <TableCell key={column.id} align={column.align} sx={{ minWidth: column.minWidth }}>
                                            {column.label}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {sales.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={colunasTabelaVendas.length}>
                                            <Typography variant="body2" sx={{ marginTop: 2 }}>
                                                <strong>AINDA NÃO FOI REALIZADA NENHUMA VENDA!</strong>
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((sale, rowIndex) => (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={rowIndex}>
                                            {colunasTabelaVendas.map((column) => {
                                                const value = sale[column.id];
                                                return (
                                                    <TableCell key={column.id} align={column.align}>
                                                        {column.id === 'total' ? (
                                                            `${parseFloat(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`
                                                        ) : column.id === 'sale_date' ? (
                                                            new Date(value).toLocaleDateString('pt-BR')
                                                        ) : column.id === 'payment_method_id' ? (
                                                            paymentMethods.find((payment: any) => payment.id === value)?.type_payment || 'Não definido'
                                                        ) : column.id === 'actions' ? (
                                                            <Fragment>
                                                                <IconButton onClick={() => handleOpenModal(sale)}>
                                                                    <Eye />
                                                                </IconButton>
                                                                <IconButton onClick={() => print(sale.id)}>
                                                                    <Printer />
                                                                </IconButton>
                                                                <IconButton onClick={() => handleOpenConfirmModal(sale.id)}>
                                                                    <DeleteEmpty />
                                                                </IconButton>
                                                            </Fragment>
                                                        ) : value}
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

            <Modal
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Box sx={{ width: 400, bgcolor: 'background.paper', padding: 4, margin: 'auto', marginTop: '10%', borderRadius: 1 }}>
                    <Typography id="modal-title" variant="h6" component="h2">
                        DETALHES DA VENDA - {selectedSale?.id}
                    </Typography>
                    <Divider />
                    <Typography variant="body1"><strong>CLIENTE:</strong> {selectedSale?.client_id}</Typography>
                    <Typography variant="body1"><strong>TOTAL DA VENDA:</strong> {`${parseFloat(selectedSale?.total).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`}</Typography>
                    <Typography variant="body1"><strong>DATA DA VENDA:</strong> {new Date(selectedSale?.sale_date).toLocaleDateString('pt-BR')}</Typography>
                    <Divider />
                    <Box sx={{ marginTop: 2 }}>
                        <Typography variant="h6" component="h3">PRODUTOS DA COMPRA:</Typography>
                        {selectedSale && getProductDetails(selectedSale.id)}
                    </Box>
                    <Divider />
                    <Button onClick={handleCloseModal} sx={{ marginTop: 2 }}>
                        Fechar
                    </Button>
                </Box>
            </Modal>

            <Modal
                open={openConfirmModal}
                onClose={handleCloseConfirmModal}
                aria-labelledby="confirm-modal-title"
                aria-describedby="confirm-modal-description"
            >
                <Box sx={{ width: 400, bgcolor: 'background.paper', padding: 4, margin: 'auto', marginTop: '20%', borderRadius: 1 }}>
                    <Typography id="confirm-modal-title" variant="h6" component="h2">
                        Confirmar Exclusão
                    </Typography>
                    <Typography variant="body1" sx={{ marginTop: 2 }}>
                        Tem certeza de que deseja excluir a venda {saleToDelete}?
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 2 }}>
                        <Checkbox
                            checked={returnsStock}
                            onChange={(e) => setReturnsStock(e.target.checked)}
                        />
                        <Typography variant="body2">Devolver produtos ao estoque</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
                        <Button onClick={handleCloseConfirmModal} sx={{ marginRight: 1 }}>
                            Cancelar
                        </Button>
                        <Button variant="contained" color="error" onClick={handleDeleteSale}>
                            Excluir
                        </Button>
                    </Box>
                </Box>
            </Modal>

            <Modal
                open={openNewSaleModal}
                onClose={handleCloseNewSaleModal}
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
                            NOVA VENDA
                        </Typography>
                        <Button variant="contained" color="primary" onClick={() => handleCloseNewSaleModal()}>
                            CANCELAR
                        </Button>
                    </Box>
                    <Divider />
                    <TextField
                        select
                        value={newSale.clientId}
                        onChange={(e) => setNewSale({ ...newSale, clientId: e.target.value })}
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
                        select
                        value={newSale.paymentMethodId}
                        onChange={(e) => setNewSale({ ...newSale, paymentMethodId: e.target.value })}
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
                    <TextField
                        type="date"
                        label="DATA DA VENDA"
                        value={newSale.saleDate}
                        onChange={(e) => setNewSale({ ...newSale, saleDate: e.target.value })}
                        fullWidth
                        margin="normal"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <Divider />
                    <Box sx={{ marginTop: 2 }}>
                        <Typography variant="h6">PRODUTOS</Typography>
                        <Button variant="contained" color="primary" sx={{ marginTop: "10px", marginBottom: "10px" }} onClick={() => setOpenProductModal(true)}>
                            ADICIONAR PRODUTO
                        </Button>

                        {newSale.products.length > 0 ? (
                            newSale.products.map((product: any, index: any) => (
                                <Box key={index} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 3, marginTop: 3 }}>
                                    <Typography>
                                        {product.name} - R$ {product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} - QTD: {product.quantity || 1}
                                    </Typography>
                                    <IconButton color="error" onClick={() => {
                                        setNewSale((prevSale: any) => ({
                                            ...prevSale,
                                            products: prevSale.products.filter((_: any, i: number) => i !== index),
                                        }));
                                    }}>
                                        <DeleteCircleOutline />
                                    </IconButton>
                                </Box>
                            ))
                        ) : (
                            <Typography>SEM PRODUTOS SELECIONADOS</Typography>
                        )}

                        <ProductSelectionModal
                            open={openProductModal}
                            onClose={() => setOpenProductModal(false)}
                            onSelectProduct={handleAddProduct}
                            products={products}
                        />
                    </Box>
                    <Divider />
                    <TextField
                        type="number"
                        label="DESCONTO (R$)"
                        value={newSale.discount}
                        onChange={(e) => setNewSale({ ...newSale, discount: parseFloat(e.target.value) })}
                        fullWidth
                        margin="normal"
                        inputProps={{ min: 0 }}
                    />
                    <Typography variant="h6">SUBTOTAL: R$ {newSale.subtotal.toFixed(2)}</Typography>
                    <Button variant="contained" color="primary" onClick={handleSubmitNewSale}>
                        FINALIZAR VENDA
                    </Button>
                </Box>
            </Modal>
        </Fragment>
    );
};

export default TableViewSales;