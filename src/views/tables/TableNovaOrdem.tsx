import { CircularProgress, Paper, Box, Divider, TextField, Button } from "@mui/material";
import { Fragment, useEffect, useState } from "react";

const TableNovaOrdem = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [clients, setClients] = useState<any[]>([]);
    const [paymentMethods, setPaymentMethods] = useState<any[]>([]);

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

    const getCurrentDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const [newOrder, setNewOrder] = useState<any>({
        client_id: '1',
        product: '',
        price: 0,
        status: '0',
        order_date: getCurrentDate(),
        description: '',
        date_start: getCurrentDate(),
        date_end: getCurrentDate(),
        materials: '',
        payment: '1',
        observation: '',
        conditions: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const responseClients = await fetch(`/api/clientes`);
                const responsePayments = await fetch(`/api/vendas`);

                const dataClients = await responseClients.json();
                const dataPaymentMethods = await responsePayments.json();

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

    const [errorsAddOrder, setErrorsAddOrder] = useState({
        client_id: false,
        price: false,
        payment: false,
        order_date: false,
        product: false,
        status: false,
    });
    console.error(errorsAddOrder);

    const validateFieldsAddOrder = () => {
        const newErrors = {
            client_id: newOrder.client_id === "",
            price: newOrder.price === "",
            payment: newOrder.payment === "",
            order_date: newOrder.order_date === "",
            product: newOrder.product === "",
            status: newOrder.status === ""
        };
    
        setErrorsAddOrder(newErrors);
        return !Object.values(newErrors).includes(true);
    };

    const handleSaveOrder = async () => {
        if (validateFieldsAddOrder()) {
            const randomNumber = Math.floor(Math.random() * 10000);
            const randomCode = randomNumber.toString().padStart(4, '0');
            const status = 
                newOrder.status == "0" ? "ATIVO" :
                newOrder.status == "1" ? "CANCELADO" :
                newOrder.status == "2" ? "PENDENTE" :
                newOrder.status == "3" ? "FINALIZADO" :
                "0";
            const combinedData = {
                id: randomCode,
                client_id: newOrder.client_id,
                product: newOrder.product,
                price: newOrder.price,
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
                setLoading(false);
            }
        } else {
            alert("Preencha todos os campos obrigatorios corretamente!");
        }
    }

    return(
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
                                value={newOrder.client_id}
                                onChange={(e) => setNewOrder({ ...newOrder, client_id: e.target.value })}
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
                                required
                                select
                                label={"FORMA DE PAGAMENTO"}
                                value={newOrder.payment}
                                onChange={(e) => setNewOrder({ ...newOrder, payment: e.target.value })}
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
                                required
                                label="DATA DA ORDEM"
                                value={newOrder.order_date}
                                onChange={(e) => setNewOrder({ ...newOrder, order_date: e.target.value })}
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
                                value={newOrder.status}
                                onChange={(e) => setNewOrder({ ...newOrder, status: e.target.value })}
                                fullWidth
                                margin="normal"
                                SelectProps={{
                                    native: true,
                                }}
                            >
                                <option value="" disabled>SELECIONE UM STATUS</option>
                                {statusOrder.map((status: any) => (
                                    <option key={status.id} value={status.id}>{status.text}</option>
                                ))}
                            </TextField>
                            <TextField
                                required
                                label="PREÇO"
                                type="number"
                                value={newOrder.price}
                                onChange={(e) => setNewOrder({ ...newOrder, price: e.target.value })}
                                fullWidth
                                margin="normal"
                            />
                        </Box>
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
                        <TextField
                            label="CONDIÇÕES"
                            value={newOrder.conditions}
                            onChange={(e) => setNewOrder({ ...newOrder, conditions: e.target.value })}
                            fullWidth
                            margin="normal"
                            inputProps={{ min: 0 }}
                        />
                        <Divider />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
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
                        </Box>
                        <TextField
                            label="MATERIAIS"
                            value={newOrder.materials}
                            onChange={(e) => setNewOrder({ ...newOrder, materials: e.target.value })}
                            fullWidth
                            margin="normal"
                            inputProps={{ min: 0 }}
                        />
                        <TextField
                            label="DESCRIÇÃO DO SERVIÇO"
                            value={newOrder.description}
                            onChange={(e) => setNewOrder({ ...newOrder, description: e.target.value })}
                            fullWidth
                            margin="normal"
                            inputProps={{ min: 0 }}
                        />
                        <TextField
                            label="OBSERVAÇÃO DO SERVIÇO OU PRODUTO"
                            value={newOrder.observation}
                            onChange={(e) => setNewOrder({ ...newOrder, observation: e.target.value })}
                            fullWidth
                            margin="normal"
                            inputProps={{ min: 0 }}
                        />
                        <Divider />
                        <Button variant="contained" color="primary" onClick={handleSaveOrder}>
                            FINALIZAR ORDEM
                        </Button>
                    </Box>
                )}
            </Paper>
        </Fragment>
    );
}

export default TableNovaOrdem;