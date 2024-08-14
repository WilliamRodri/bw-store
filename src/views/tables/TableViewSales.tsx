import { Button, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, TablePagination, CircularProgress, Modal, Box, Checkbox, Divider } from "@mui/material";
import { DeleteCircleOutline, DeleteEmpty, EyeArrowRight, Plus, Printer } from "mdi-material-ui";
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
    const [openProductModal, setOpenProductModal] = useState<boolean>(false);
    const [openNewSaleModal, setOpenNewSaleModal] = useState<boolean>(false);
    const [newSale, setNewSale] = useState<any>({
        clientId: '',
        paymentMethodId: '',
        saleDate: new Date().toISOString().split('T')[0],
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
                    quantity: product.quantity || 1, // Defina um valor padrão se quantity estiver ausente
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
                    router.push('/sales'); // Atualiza a página para refletir a nova venda
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

    const handleAddProduct = (product: any, quantity: number) => {
        const updatedProduct = { ...product, quantity };
        setNewSale({
            ...newSale,
            products: [...newSale.products, updatedProduct]
        });
        setOpenProductModal(false);
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
                const responseClients = await fetch(`/api/usuarios`);
                
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
        router.push(`/sales/print/${id}`);
    }

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
                                                                    <EyeArrowRight />
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
                        Detalhes da Venda - {selectedSale?.id}
                    </Typography>
                    <Typography variant="body1"><strong>Cliente:</strong> {selectedSale?.client_id}</Typography>
                    <Typography variant="body1"><strong>Total:</strong> {`R$ ${parseFloat(selectedSale?.total).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`}</Typography>
                    <Typography variant="body1"><strong>Data:</strong> {new Date(selectedSale?.sale_date).toLocaleDateString('pt-BR')}</Typography>
                    <Typography variant="body1"><strong>Quantidade de Produtos:</strong> {salesProducts.filter((item: any) => item.sale_id === selectedSale?.id).length}</Typography>
                    <Box sx={{ marginTop: 2 }}>
                        <Typography variant="h6" component="h3">Produtos:</Typography>
                        {selectedSale && getProductDetails(selectedSale.id)}
                    </Box>
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
                            xs: '90%', // 90% da largura para telas pequenas
                            sm: 400, // 400px para telas médias
                            md: 500, // 500px para telas grandes
                        },
                        maxHeight: '80vh', // Limita a altura máxima da modal para 80% da altura da viewport
                        bgcolor: 'background.paper',
                        padding: {
                            xs: 2, // padding menor para telas pequenas
                            sm: 3, // padding médio para telas médias
                            md: 4, // padding maior para telas grandes
                        },
                        margin: 'auto',
                        marginTop: {
                            xs: '10%', // margem superior maior para centralizar em telas pequenas
                            sm: '5%',  // margem superior menor em telas médias e grandes
                        },
                        borderRadius: 1,
                        boxShadow: 24, // adiciona sombra para melhor visualização
                        overflowY: 'auto', // Adiciona rolagem vertical quando necessário
                        '&::-webkit-scrollbar': {
                            width: '8px', // Largura da barra de rolagem
                        },
                        '&::-webkit-scrollbar-track': {
                            background: 'transparent', // Fundo transparente
                        },
                        '&::-webkit-scrollbar-thumb': {
                            backgroundColor: '#ffffff', // Cor da barra de rolagem
                            borderRadius: '4px', // Borda arredondada
                        },
                        '&::-webkit-scrollbar-thumb:hover': {
                            backgroundColor: '#bdbdbd', // Cor ao passar o mouse
                        },
                    }}
                >
                    <Typography id="new-sale-modal-title" variant="h6" component="h2">
                        NOVA VENDA
                    </Typography>
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
                                    {product.name} - R$ {product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} - QTD: {product.quantity}
                                </Typography>
                                <IconButton
                                    color="error"
                                    onClick={() => {
                                        const updatedProducts = newSale.products.filter((_: any, i: any) => i !== index);
                                        setNewSale({ ...newSale, products: updatedProducts });
                                    }}
                                >
                                    <DeleteCircleOutline />
                                </IconButton>
                            </Box>
                        ))
                    ) : (
                        <Typography sx={{ marginTop: 3, marginBottom: 3 }}>NENHUM PRODUTO ADICIONADO</Typography>
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
                        label="DESCONTO"
                        value={newSale.discount}
                        onChange={(e) => setNewSale({ ...newSale, discount: parseFloat(e.target.value) || 0 })}
                        fullWidth
                        margin="normal"
                    />
                    <Typography variant="h6" sx={{ marginTop: 6, marginBottom: 5 }}>SUBTOTAL: {`${newSale.subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`}</Typography>
                    <Divider />
                    <Button variant="contained" color="primary" fullWidth sx={{ marginTop: 2 }} onClick={() => handleSubmitNewSale()}>
                        FINALIZAR VENDA
                    </Button>
                    <Button variant="contained" color="error" fullWidth sx={{ marginTop: 2 }} onClick={() => handleCloseNewSaleModal()}>
                        CANCELAR
                    </Button>
                </Box>
            </Modal>
        </Fragment>
    );
};

export default TableViewSales;