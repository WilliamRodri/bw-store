import React, { useState, useEffect } from "react";
import { Card, CardContent, CircularProgress, Typography, Box, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import dayjs from 'dayjs';

const TableViewRelatorioPrincipal = () => {
    const [filter, setFilter] = useState<any>("HOJE");
    const [vendas, setVendas] = useState<any[]>([]);
    const [produtos, setProdutos] = useState<any[]>([]);
    const [clientes, setClientes] = useState<any[]>([]);

    const valoresFiltro = [
        { nome: "HOJE" },
        { nome: "ONTEM" },
        { nome: "ESTA SEMANA" },
        { nome: "ESTE MÊS" },
        { nome: "ESTE ANO" },
        { nome: "TODO PERÍODO" },
        { nome: "PERSONALIZAR" },
    ];

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
                <Card variant="outlined" sx={{ flex: '1 1 calc(25% - 16px)', minWidth: '200px', mb: 2 }}>
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
                                value={0}
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
                            <Typography variant="body2" id="circular-progress-description"></Typography>
                            <Typography variant="h5">
                                
                            </Typography>
                        </CardContent>
                    </Box>
                </Card>
            </Box>
        </Box>
    );
}

export default TableViewRelatorioPrincipal;