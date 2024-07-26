import React, { useState } from "react";
import { Card, CardContent, CircularProgress, Typography, Box, Select, MenuItem, FormControl, InputLabel } from "@mui/material";

const TableViewRelatorioPrincipal = () => {
    const [filter, setFilter] = useState("");

    const dataRelatorio = [
        {
            "nome": "TOTAL DE VENDAS",
            "valor": "0,00",
            "valorCirucle": 0
        },
        {
            "nome": "LUCRO",
            "valor": "0,00",
            "valorCirucle": 0
        },
        {
            "nome": "PRODUTOS VENDIDOS",
            "valor": "0,00",
            "valorCirucle": 0
        },
        {
            "nome": "TOTAL DE VENDAS",
            "valor": "10,00",
            "valorCirucle": 10
        },
        {
            "nome": "TOTAL DE PRODUTOS (CADASTRADO)",
            "valor": "0,00",
            "valorCirucle": 0
        },
        {
            "nome": "TOTAL DE CLIENTES (CADASTRADO)",
            "valor": "0,00",
            "valorCirucle": 0
        },
        {
            "nome": "TOTAL DE VENDAS (TODO O PERÍODO)",
            "valor": "0,00",
            "valorCirucle": 0
        },
    ];

    const valoresFiltro = [
        {
            "nome": "HOJE"
        },
        {
            "nome": "ONTEM"
        },
        {
            "nome": "ESTA SEMANA"
        },
        {
            "nome": "ESTE MÊS"
        },
        {
            "nome": "ESTE ANO"
        },
        {
            "nome": "TODO PERÍODO"
        },
        {
            "nome": "PERSONALIZAR"
        },
    ]

    const handleFilterChange = (event: any) => {
        setFilter(event.target.value);
    };

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
                        <MenuItem key={index} value={item.nome}>{item.nome}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {dataRelatorio.map((data, index) => (
                    <Card key={index} variant="outlined" sx={{ flex: '1 1 calc(25% - 16px)', minWidth: '200px', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
                            <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                                <CircularProgress
                                    variant="determinate"
                                    value={100}
                                    size={40}
                                    sx={{
                                        color: '#e0e0e0',
                                    }}
                                />
                                <CircularProgress
                                    variant="determinate"
                                    value={data.valorCirucle}
                                    size={40}
                                    aria-describedby="circular-progress-description"
                                    sx={{
                                        color: 'primary.main',
                                        position: 'absolute',
                                        left: 0,
                                    }}
                                />
                            </Box>
                            <CardContent>
                                <Typography variant="body2" id="circular-progress-description">{data.nome}</Typography>
                                <Typography variant="h5">R$ {data.valor}</Typography>
                            </CardContent>
                        </Box>
                    </Card>
                ))}
            </Box>
        </Box>
    );
}

export default TableViewRelatorioPrincipal;