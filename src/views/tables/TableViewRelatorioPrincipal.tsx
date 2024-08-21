import React, { useState, useEffect } from "react";
import { Card, CardContent, CircularProgress, Typography, Box, Select, MenuItem, FormControl, InputLabel } from "@mui/material";

const TableViewRelatorioPrincipal = () => {
    const [filter, setFilter] = useState<number>(0); // Filtro inicial é "HOJE" (0)
    const [data, setData] = useState<any>(null);
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
        const selectedFilter = event.target.value;
        setFilter(selectedFilter);
    };

    const fetchData = async (filterId: number) => {
        setLoading(true);
        try {
            const response = await fetch(`/api/dashboard/${filterId}`);
            const result = await response.json();
            setData(result);
        } catch (error) {
            console.error("Erro ao buscar os dados:", error);
        } finally {
            setLoading(false);
        }
    };

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
                        <Card variant="outlined" sx={{ flex: '1 1 calc(25% - 16px)', minWidth: '200px', mb: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
                                <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                                    <CircularProgress
                                        variant="determinate"
                                        value={100}
                                        size={40}
                                        sx={{ color: '#e0e0e0' }}
                                    />
                                    <CircularProgress
                                        variant="determinate"
                                        value={100}
                                        size={40}
                                        aria-describedby="circular-progress-description"
                                        sx={{ color: 'primary.main', position: 'absolute', left: 0 }}
                                    />
                                </Box>
                                <CardContent>
                                    <Typography variant="body2">Total de Vendas</Typography>
                                    <Typography variant="h5">
                                        {data?.totalVendas != null ? data?.totalVendas?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : "R$ 0,00"}
                                    </Typography>
                                </CardContent>
                            </Box>
                        </Card>
                        <Card variant="outlined" sx={{ flex: '1 1 calc(25% - 16px)', minWidth: '200px', mb: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
                                <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                                    <CircularProgress
                                        variant="determinate"
                                        value={100}
                                        size={40}
                                        sx={{ color: '#e0e0e0' }}
                                    />
                                    <CircularProgress
                                        variant="determinate"
                                        value={100}
                                        size={40}
                                        aria-describedby="circular-progress-description"
                                        sx={{ color: 'primary.main', position: 'absolute', left: 0 }}
                                    />
                                </Box>
                                <CardContent>
                                    <Typography variant="body2">Total de Lucro</Typography>
                                    <Typography variant="h5">
                                        {data?.totalLucro?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                    </Typography>
                                </CardContent>
                            </Box>
                        </Card>
                        <Card variant="outlined" sx={{ flex: '1 1 calc(25% - 16px)', minWidth: '200px', mb: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
                                <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                                    <CircularProgress
                                        variant="determinate"
                                        value={100}
                                        size={40}
                                        sx={{ color: '#e0e0e0' }}
                                    />
                                    <CircularProgress
                                        variant="determinate"
                                        value={100}
                                        size={40}
                                        aria-describedby="circular-progress-description"
                                        sx={{ color: 'primary.main', position: 'absolute', left: 0 }}
                                    />
                                </Box>
                                <CardContent>
                                    <Typography variant="body2">Quantidade de Vendas</Typography>
                                    <Typography variant="h5">{Math.round(data?.qtdVendas)}</Typography>
                                </CardContent>
                            </Box>
                        </Card>
                    </>
                )}
            </Box>
        </Box>
    );
};

export default TableViewRelatorioPrincipal;