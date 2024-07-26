import { Button, Card, CardContent, CircularProgress, Divider, Grid, TextField, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const TableViewModelo = () => {
    // Loading
    const [loading, setLoading] = useState<boolean>(true);

    // Modelo data
    const [modelo, setModelo] = useState<any>(null);

    // Router hook
    const { query } = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            if (query.id) {
                try {
                    const idModelo = query.id;
                    const response = await fetch(`/api/view/modelo/${idModelo}`);

                    if (!response.ok) {
                        throw new Error('Failed to fetch modelo');
                    }

                    setModelo(await response.json());
                    setLoading(false);
                } catch (error) {
                    console.error('Error fetching modelo:', error);
                    setLoading(false);
                }
            }
        };

        fetchData();
    }, [query.id]);

    if (loading) {
        return (
            <Card>
                <CardContent>
                    <Grid container>
                        <CircularProgress />
                    </Grid>
                </CardContent>
            </Card>
        );
    }

    if (!modelo) {
        return (
            <Card>
                <CardContent>
                    <p>Modelo não encontrado</p>
                </CardContent>
            </Card>
        );
    }
    
    modelo.aviamentos.map((item: any) => {
        console.log(item);
    })
    
    return (
        <Card>
            <CardContent>
                <Grid container spacing={5}>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            label="Nome do Modelo"
                            value={modelo.nome_modelo}
                            sx={{ marginBottom: 2 }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            label="Valor de Imposto"
                            value={modelo.valorImposto?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            sx={{ marginBottom: 2 }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            label="Preço de Venda"
                            value={modelo.valorPrecoVenda?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            sx={{ marginBottom: 2 }}
                        />
                    </Grid>
                </Grid>
                <Divider sx={{ margin: 2 }} />
                {/* Materia Prima - Visualizar */}
                <Typography variant='body2' sx={{ marginBottom: 2 }}>
                    1. Matéria Prima
                </Typography>
                <Typography variant='body2' sx={{ marginTop: 4 }}>
                    Itens Adicionados:
                </Typography>
                {modelo.materia_prima.length === 0 ? (
                    <Typography variant='body2' sx={{ marginTop: 2 }}>
                        <strong>Nenhum item adicionado</strong>
                    </Typography>
                ) : (modelo.materia_prima.map((item: any, index: number) => (
                    <Grid container spacing={2} key={index} sx={{ marginTop: 2 }}>
                        <Grid item xs={12} sm={3}>
                            <strong>{item.mater_prima_aviamentos}</strong>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <strong>UNIDADE DE MEDIDA:</strong> {item.un_medida}
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <strong>CONSUMO P/ PEÇA:</strong> {item.consumo_p_peca}
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <strong>PREÇO UNITARIO:</strong> {item.preco_unit?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <strong>TOTAL:</strong> {item.preco_total?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </Grid>
                    </Grid>
                )))}
                <Divider sx={{ margin: 2 }} />
                {/* Aviamentos - Visualizar */}
                <Typography variant='body2' sx={{ marginBottom: 2 }}>
                    2. Aviamentos
                </Typography>
                <Typography variant='body2' sx={{ marginTop: 4 }}>
                    Itens Adicionados:
                </Typography>
                {modelo.aviamentos.length === 0 ? (
                    <Typography variant='body2' sx={{ marginTop: 2 }}>
                        <strong>Nenhum item adicionado</strong>
                    </Typography>
                ) : 
                (modelo.aviamentos.map((item: any, index: number) => (
                    <Grid container spacing={2} key={index} sx={{ marginTop: 2 }}>
                        <Grid item xs={12} sm={3}>
                            <strong>{item.mater_prima_aviamentos}</strong>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <strong>UNIDADE DE MEDIDA:</strong> {item.un_medida}
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <strong>CONSUMO P/ PEÇA:</strong> {item.consumo_p_peca}
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <strong>PREÇO UNITARIO:</strong> {item.preco_unit?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <strong>TOTAL:</strong> {item.preco_total?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </Grid>
                    </Grid>
                )))}
                <Divider sx={{ margin: 2 }} />
                {/* Embalagem e Outros - Visualizar */}
                <Typography variant='body2' sx={{ marginBottom: 2 }}>
                    3. Embalagem e Outros
                </Typography>
                <Typography variant='body2' sx={{ marginTop: 4 }}>
                    Itens Adicionados:
                </Typography>
                {modelo.embalagem_outros.length === 0 ? (
                    <Typography variant='body2' sx={{ marginTop: 2 }}>
                        <strong>Nenhum item adicionado</strong>
                    </Typography>
                ) : (
                    modelo.embalagem_outros.map((item: any, index: number) => (
                        <Grid container spacing={2} key={index} sx={{ marginTop: 2 }}>
                            <Grid item xs={12} sm={3}>
                                <strong>{item.mater_prima_aviamentos}</strong>
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <strong>UNIDADE DE MEDIDA:</strong> {item.un_medida}
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <strong>CONSUMO P/ PEÇA:</strong> {item.consumo_p_peca}
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <strong>PREÇO UNITARIO:</strong> {item.preco_unit?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <strong>TOTAL:</strong> {item.preco_total?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </Grid>
                        </Grid>
                    ))
                )}
                <Divider sx={{ margin: 2 }} />
                {/* Mão de Obra - Visualizar */}
                <Typography variant='body2' sx={{ marginBottom: 2 }}>
                    4. Mão de Obra
                </Typography>
                <Typography variant='body2' sx={{ marginTop: 4 }}>
                    Itens Adicionados:
                </Typography>
                {modelo.mao_de_obra.length === 0 ? (
                    <Typography variant='body2' sx={{ marginTop: 2 }}>
                        <strong>Nenhum item adicionado</strong>
                    </Typography>
                ) : (
                    modelo.mao_de_obra.map((item: any, index: number) => (
                        <Grid container spacing={2} key={index} sx={{ marginTop: 2 }}>
                            <Grid item xs={12} sm={3}>
                                <strong>{item.mater_prima_aviamentos}</strong>
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <strong>UNIDADE DE MEDIDA:</strong> {item.un_medida}
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <strong>CONSUMO P/ PEÇA:</strong> {item.consumo_p_peca}
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <strong>PREÇO UNITARIO:</strong> {item.preco_unit?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <strong>TOTAL:</strong> {item.preco_total?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </Grid>
                        </Grid>
                    ))
                )}
            </CardContent>
        </Card>
    );
};

export default TableViewModelo;