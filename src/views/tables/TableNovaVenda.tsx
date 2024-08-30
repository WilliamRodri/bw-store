import { Box, Checkbox, CircularProgress, IconButton, Paper, TextField, Typography, Button, Divider } from "@mui/material";
import { CartOutline, DeleteCircleOutline } from "mdi-material-ui";
import { Fragment, useEffect, useState, useCallback } from "react";
import { debounce } from 'lodash';
import { useRouter } from "next/router";

const TableNovaVenda = () => {
    const [clients, setClients] = useState<any[]>([]);
    const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [visibleProductsCount, setVisibleProductsCount] = useState<number>(10);
    const router = useRouter();

    const getCurrentDate = () => {
        const now = new Date();
        return now.toISOString().split('T')[0];
    };

    const [newSale, setNewSale] = useState<any>({
        clientId: '1',
        paymentMethodId: '1',
        saleDate: getCurrentDate(),
        products: [],
        discount: 0,
        subtotal: 0,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/vendas`);
                const responseClients = await fetch(`/api/clientes`);

                const data = await response.json();
                const dataClients = await responseClients.json();

                const availableProducts = data.products.filter((product: any) => product.stock > 1);

                setPaymentMethods(data.paymentMethod);
                setProducts(availableProducts);
                setFilteredProducts(availableProducts);
                setClients(dataClients.clients);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleProductSelection = useCallback((product: any) => {
        const isSelected = newSale.products.some((p: any) => p.id === product.id);
        setNewSale((prevSale: any) => ({
            ...prevSale,
            products: isSelected
                ? prevSale.products.filter((p: any) => p.id !== product.id)
                : [...prevSale.products, { ...product, quantity: 1 }],
        }));
    }, [newSale.products]);

    const handleQuantityChange = useCallback((productId: any, quantity: number) => {
        setNewSale((prevSale: any) => ({
            ...prevSale,
            products: prevSale.products.map((product: any) =>
                product.id === productId ? { ...product, quantity } : product
            ),
        }));
    }, []);

    const debouncedSearch = useCallback(
        debounce((term: string) => {
            setFilteredProducts(products.filter(product => product.name.toLowerCase().includes(term.toLowerCase())));
        }, 300),
        [products]
    );

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        debouncedSearch(e.target.value);
    };

    const calculateSubtotal = useCallback(() => {
        const total = newSale.products.reduce((acc: number, product: any) => acc + (product.price * (product.quantity || 1)), 0);
        const subtotal = total - newSale.discount;
        setNewSale((prevSale: any) => ({
            ...prevSale,
            subtotal: subtotal < 0 ? 0 : subtotal,
        }));
    }, [newSale.products, newSale.discount]);

    useEffect(() => {
        calculateSubtotal();
    }, [calculateSubtotal]);

    const loadMoreProducts = () => {
        setVisibleProductsCount(prevCount => prevCount + 10);
    };

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
        return !Object.values(newErrors).includes(true);
    };

    const print = (id: any) => {
        router.push(`/vendas/print/${id}`);
    }

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
                setLoading(false);
            }
        } else {
            alert("Por favor, preencha todos os campos obrigatórios.");
        }
    }
    console.error(errors);
    return (
        <Fragment>
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Box sx={{ margin: "15px" }}>
                        <Divider />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
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
                                <option value="" disabled>SELECIONE UM CLIENTE</option>
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
                                <option value="" disabled>SELECIONE UMA FORMA DE PAGAMENTO</option>
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
                        </Box>
                        <Divider />
                        <TextField
                            label="PESQUISAR PRODUTOS"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            fullWidth
                            margin="normal"
                        />

                        <Box sx={{ maxHeight: '300px', overflowY: 'auto', marginTop: '10px', padding: '10px', borderRadius: '4px' }}>
                            {filteredProducts.slice(0, visibleProductsCount).map((product: any) => (
                                <Box key={product.id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Checkbox
                                            checked={newSale.products.some((p: any) => p.id === product.id)}
                                            onChange={() => handleProductSelection(product)}
                                        />
                                        <Typography>{product.name} - R$ {parseFloat(product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }))}</Typography>
                                    </Box>
                                    {newSale.products.some((p: any) => p.id === product.id) && (
                                        <TextField
                                            label="Quantidade"
                                            type="number"
                                            value={newSale.products.find((p: any) => p.id === product.id)?.quantity || 1}
                                            onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value))}
                                            sx={{ width: '100px' }}
                                        />
                                    )}
                                </Box>
                            ))}
                        </Box>

                        {filteredProducts.length > visibleProductsCount && (
                            <Button onClick={loadMoreProducts} variant="contained" color="primary" sx={{ marginTop: '10px' }}>
                                Carregar mais
                            </Button>
                        )}

                        <Typography variant="h6" sx={{ marginTop: '20px' }}>PRODUTOS SELECIONADOS</Typography>
                        <Box sx={{ marginTop: '10px', padding: '10px', borderRadius: '4px' }}>
                            {newSale.products.length > 0 ? (
                                newSale.products.map((product: any, index: any) => (
                                    <Box key={index} sx={{ border: '1px solid #DADADA', padding: "5px", display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 3, marginTop: 3, borderRadius: '4px' }}>
                                        <Typography>
                                            {product.name} - R$ {parseFloat(product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }))} - QTD: {product.quantity || 1}
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
                        </Box>
                        <Divider />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
                            <TextField
                                label="DESCONTO"
                                type="number"
                                value={newSale.discount}
                                onChange={(e) => setNewSale({ ...newSale, discount: parseFloat(e.target.value) || 0 })}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="SUBTOTAL"
                                value={newSale.subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                fullWidth
                                margin="normal"
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </Box>
                        <Divider />
                        <Button variant="contained" color="primary" onClick={handleSubmitNewSale}>
                            FINALIZAR VENDA <CartOutline sx={{ marginLeft: "10px" }} />
                        </Button>
                    </Box>
                )}
            </Paper>
        </Fragment>
    );
};

export default TableNovaVenda;