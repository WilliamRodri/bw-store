import { CircularProgress, Paper, Box, Divider, TextField, Button } from "@mui/material";
import { Fragment, useEffect, useState } from "react";

const TableEditarOrdem = ({ id }: { id: any }) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [clients, setClients] = useState<any[]>([]);
    const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
    const [orderToEdit, setOrderToEdit] = useState<any>({
        client_id: '',
        product: '',
        price: 0,
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
        },
        {
            id: 3,
            text: "FINALIZADO"
        }
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const responseOrders = await fetch(`/api/ordens/`);
                const responseClients = await fetch(`/api/clientes/`);
                const responsePayments = await fetch(`/api/vendas`);

                const dataOrders = await responseOrders.json();
                const dataClients = await responseClients.json();
                const dataPaymentMethods = await responsePayments.json();

                // Find the order to edit based on the id
                const orderToEdit = dataOrders.orders.find((order: any) => order.id === parseFloat(id));
                if (orderToEdit) {
                    setOrderToEdit(orderToEdit);
                } else {
                    console.error('Order not found');
                }

                setClients(dataClients.clients);
                setPaymentMethods(dataPaymentMethods.paymentMethod);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchData();
        }
    }, [id]);

    const [errorsEditOrder, setErrorsEditOrder] = useState<any>({
        client_id: false,
        price: false,
        payment: false,
        order_date: false,
        product: false,
        status: false,
    });
    console.error({ errorsEditOrder });

    const validateFieldsEditOrder = () => {
        const newErrors: any = {
            client_id: orderToEdit.client_id === "",
            price: orderToEdit.price === "",
            payment: orderToEdit.payment === "",
            order_date: orderToEdit.order_date === "",
            product: orderToEdit.product === "",
            status: orderToEdit.status === "" || orderToEdit.status === "50"
        };
    
        setErrorsEditOrder(newErrors);
        return !Object.values(newErrors).includes(true);
    };

    const formatDateToMySQL = (dateString: any) => {
        const date = new Date(dateString);
        return date.toISOString().slice(0, 19).replace('T', ' ');
    };

    const handleSaveEditOrder = async () => {
        if (validateFieldsEditOrder()) {
            const status = 
                orderToEdit.status == "0" ? "ATIVO" :
                orderToEdit.status == "1" ? "CANCELADO" :
                orderToEdit.status == "2" ? "PENDENTE" :
                orderToEdit.status == "3" ? "FINALIZADO" :
                "0";

            const combinedData = {
                client_id: orderToEdit.client_id,
                product: orderToEdit.product,
                price: orderToEdit.price,
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
                    location.replace('/ordens');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                alert('Erro ao atualizar a ordem. Por favor, tente novamente.');
            } finally {
                setLoading(false);
            }
        } else {
            alert("Preencha todos os campos obrigatorios corretamente!");
        }
    };

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
                                required
                                select
                                label={"CLIENTE"}
                                value={orderToEdit.client_id}
                                onChange={(e) => setOrderToEdit({ ...orderToEdit, client_id: e.target.value })}
                                fullWidth
                                margin="normal"
                                InputLabelProps={{
                                    shrink: true,
                                }}
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
                                required
                                select
                                label={"FORMA DE PAGAMENTO"}
                                value={orderToEdit.payment}
                                onChange={(e) => setOrderToEdit({ ...orderToEdit, payment: e.target.value })}
                                fullWidth
                                margin="normal"
                                InputLabelProps={{
                                    shrink: true,
                                }}
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
                                required
                                label="DATA DA ORDEM"
                                value={orderToEdit.order_date}
                                onChange={(e) => setOrderToEdit({ ...orderToEdit, order_date: e.target.value })}
                                fullWidth
                                margin="normal"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Box>
                        <Divider />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
                            <TextField
                                label={"STATUS"}
                                required
                                select
                                value={orderToEdit.status}
                                onChange={(e) => setOrderToEdit({ ...orderToEdit, status: e.target.value })}
                                fullWidth
                                margin="normal"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                SelectProps={{
                                    native: true,
                                }}
                            >
                                <option value="50" disabled>SELECIONE UM STATUS</option>
                                {statusOrder.map((status: any) => (
                                    <option key={status.id} value={status.id}>{status.text}</option>
                                ))}
                            </TextField>
                            <TextField
                                required
                                label="PREÇO"
                                type="number"
                                value={orderToEdit.price}
                                onChange={(e) => setOrderToEdit({ ...orderToEdit, price: e.target.value })}
                                fullWidth
                                margin="normal"
                            />
                        </Box>
                        <Divider />
                        <TextField
                            required
                            label="PRODUTO"
                            value={orderToEdit.product}
                            onChange={(e) => setOrderToEdit({ ...orderToEdit, product: e.target.value })}
                            fullWidth
                            margin="normal"
                            inputProps={{ min: 0 }}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <TextField
                            label="CONDIÇÕES"
                            value={orderToEdit.conditions}
                            onChange={(e) => setOrderToEdit({ ...orderToEdit, conditions: e.target.value })}
                            fullWidth
                            margin="normal"
                            inputProps={{ min: 0 }}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <Divider />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
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
                            <TextField
                                type="date"
                                label="DATA DE FIM"
                                value={orderToEdit.date_end}
                                onChange={(e) => setOrderToEdit({ ...orderToEdit, date_end: e.target.value })}
                                fullWidth
                                margin="normal"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Box>
                        <TextField
                            label="DESCRIÇÃO"
                            value={orderToEdit.description}
                            onChange={(e) => setOrderToEdit({ ...orderToEdit, description: e.target.value })}
                            fullWidth
                            margin="normal"
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <TextField
                            label="MATERIAIS"
                            value={orderToEdit.materials}
                            onChange={(e) => setOrderToEdit({ ...orderToEdit, materials: e.target.value })}
                            fullWidth
                            margin="normal"
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <TextField
                            label="OBSERVAÇÃO"
                            value={orderToEdit.observation}
                            onChange={(e) => setOrderToEdit({ ...orderToEdit, observation: e.target.value })}
                            fullWidth
                            margin="normal"
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <Box sx={{ marginTop: '20px' }}>
                            <Button variant="contained" color="primary" onClick={handleSaveEditOrder}>
                                Salvar
                            </Button>
                        </Box>
                    </Box>
                )}
            </Paper>
        </Fragment>
    );
};

export default TableEditarOrdem;