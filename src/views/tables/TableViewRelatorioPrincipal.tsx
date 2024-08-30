import React, { useState, useEffect } from "react";
import { Card, CardContent, CircularProgress, Typography, Box, Select, MenuItem, FormControl, InputLabel, Divider } from "@mui/material";

const TableViewRelatorioPrincipal = () => {
    const [filter, setFilter] = useState<number>(0);
    const [data, setData] = useState<any>(null);
    const [dataGeral, setDataGeral] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const valoresFiltro = [
        { nome: "HOJE", id: 0 },
        { nome: "ONTEM", id: 1 },
        { nome: "ESTA SEMANA", id: 2 },
        { nome: "ESTE MÊS", id: 3 },
        { nome: "ESTE ANO", id: 4 },
        { nome: "TODO PERÍODO", id: 5 },
    ];

    const handleFilterChange = (event: any) => {
        setFilter(event.target.value);
    };

    const fetchData = async (filterId: number) => {
        setLoading(true);
        try {
            const response = await fetch(`/api/dashboard/${filterId}`);
            if (!response.ok) {
                throw new Error("Erro ao buscar os dados");
            }
            const result = await response.json();
            setData(result);
        } catch (error) {
            console.error("Erro ao buscar os dados:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/dashboard/relatorioGeral');

                if (!response.ok) {
                    throw new Error("Erro ao buscar os dados");
                } else {
                    const data = await response.json();
                    setDataGeral(data);
                }
            } catch (error) {
                console.error("Erro ao buscar os dados:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    useEffect(() => {
        fetchData(filter);
    }, [filter]);

    return (
        <Box sx={{ padding: "10px" }}>
            <FormControl fullWidth sx={{ mb: 4 }}>
                <InputLabel id="filter-label">FILTRAR POR</InputLabel>
                <Select
                    labelId="filter-label"
                    value={filter}
                    label="Filtrar por"
                    onChange={handleFilterChange}
                >
                    {valoresFiltro.map((item, index) => (
                        <MenuItem key={index} value={item.id}>
                            {item.nome}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {loading ? (
                    <CircularProgress />
                ) : (
                    <>
                        <Divider />
                        <Box sx={{ width: '100%', mb: 4 }}>
                            <Typography variant="h6" sx={{ mb: 2 }}>RELATÓRIO DE VENDAS</Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                                <Card variant="outlined" sx={{ flex: '1 1 calc(25% - 16px)', minWidth: '200px', mb: 2 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
                                        <CardContent>
                                            <Typography variant="body2">BRUTO</Typography>
                                            <Typography variant="h5">
                                                {data?.totalVendas != null ? data?.totalVendas?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : "R$ 0,00"}
                                            </Typography>
                                        </CardContent>
                                    </Box>
                                </Card>
                                <Card variant="outlined" sx={{ flex: '1 1 calc(25% - 16px)', minWidth: '200px', mb: 2 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
                                        <CardContent>
                                            <Typography variant="body2">LUCRO</Typography>
                                            <Typography variant="h5">
                                                {data?.totalLucro?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                            </Typography>
                                        </CardContent>
                                    </Box>
                                </Card>
                                <Card variant="outlined" sx={{ flex: '1 1 calc(25% - 16px)', minWidth: '200px', mb: 2 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
                                        <CardContent>
                                            <Typography variant="body2">TOTAL</Typography>
                                            <Typography variant="h5">{Math.round(data?.qtdVendas)}</Typography>
                                        </CardContent>
                                    </Box>
                                </Card>
                            </Box>
                        </Box>

                        <Divider />

                        <Box sx={{ width: '100%' }}>
                            <Typography variant="h6" sx={{ mb: 2 }}>RELATÓRIO DE ORDENS DE SERVIÇOS (OS)</Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                                <Card variant="outlined" sx={{ flex: '1 1 calc(25% - 16px)', minWidth: '200px', mb: 2 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
                                        <CardContent>
                                            <Typography variant="body2">TOTAL</Typography>
                                            <Typography variant="h5">{Math.round(data?.totalOrdens)}</Typography>
                                        </CardContent>
                                    </Box>
                                </Card>
                                <Card variant="outlined" sx={{ flex: '1 1 calc(25% - 16px)', minWidth: '200px', mb: 2 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
                                        <CardContent>
                                            <Typography variant="body2">LUCRO</Typography>
                                            <Typography variant="h5">
                                            {data?.totalLucroOrdens != null ? 
                                                data?.totalLucroOrdens.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 
                                                "R$ 0,00"}
                                            </Typography>
                                        </CardContent>
                                    </Box>
                                </Card>
                            </Box>
                        </Box>

                        <Divider />

                        <Box sx={{ width: '100%' }}>
                            <Typography variant="h6" sx={{ mb: 2 }}>RELATÓRIO GERAL (ESTÁTICOS)</Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                                <Card variant="outlined" sx={{ flex: '1 1 calc(25% - 16px)', minWidth: '200px', mb: 2 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
                                        <CardContent>
                                            <Typography variant="body2">T. PRD CADASTRADOS</Typography>
                                            <Typography variant="h5">{dataGeral?.productsLength}</Typography>
                                        </CardContent>
                                    </Box>
                                </Card>
                                <Card variant="outlined" sx={{ flex: '1 1 calc(25% - 16px)', minWidth: '200px', mb: 2 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
                                        <CardContent>
                                            <Typography variant="body2">T. DE CLIENTES</Typography>
                                            <Typography variant="h5">
                                                {dataGeral?.clientsLength}
                                            </Typography>
                                        </CardContent>
                                    </Box>
                                </Card>
                                <Card variant="outlined" sx={{ flex: '1 1 calc(25% - 16px)', minWidth: '200px', mb: 2 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
                                        <CardContent>
                                            <Typography variant="body2">T. DE VENDAS</Typography>
                                            <Typography variant="h5">
                                                {dataGeral?.salesLength}
                                            </Typography>
                                        </CardContent>
                                    </Box>
                                </Card>
                                <Card variant="outlined" sx={{ flex: '1 1 calc(25% - 16px)', minWidth: '200px', mb: 2 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
                                        <CardContent>
                                            <Typography variant="body2">T. DE OS PENDENTES</Typography>
                                            <Typography variant="h5">
                                                {dataGeral?.orderLength}
                                            </Typography>
                                        </CardContent>
                                    </Box>
                                </Card>
                            </Box>
                        </Box>
                    </>
                )}
            </Box>
        </Box>
    );
};

export default TableViewRelatorioPrincipal;