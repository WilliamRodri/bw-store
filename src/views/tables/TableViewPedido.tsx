import { Card, CardContent, CircularProgress, Divider, Grid, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const TableViewPedido = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [pedido, setPedido] = useState<any>(null);
    const { query } = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            if (query.id) {
                try {
                    const idModelo = query.id;
                    const response = await fetch(`/api/view/pedido/${idModelo}`);

                    if (!response.ok) {
                        throw new Error('Failed to fetch pedido');
                    }

                    const data = await response.json();
                    setPedido(data);
                    setLoading(false);
                } catch (error) {
                    console.error('Error fetching pedido:', error);
                    setLoading(false);
                }
            }
        };

        fetchData();
    }, [query.id]);

    const calcularPrecoProducao = (item: any) => {
        let totalMateriaPrima = 0;
        let totalAviamentos = 0;
        let totalMaoDeObra = 0;
        let impostos = 0;

        item.materiaPrima.map((itemMateriaPrima: any) => {
            totalMateriaPrima += itemMateriaPrima.preco_total;
        });

        item.aviamentos.map((itemAviamentos: any) => {
            totalAviamentos += itemAviamentos.preco_total;
        });

        item.maoDeObra.map((itemMaoDeObra: any) => {
            totalMaoDeObra += itemMaoDeObra.preco_total;
        });

        impostos += item.impostos;

        const precoProducao = totalMateriaPrima + totalAviamentos + totalMaoDeObra + impostos;
        return precoProducao;
    }

    const calcularLucroLiquido = (item: any) => {
        return item.precoFinal - item.custoPedido;
    }

    const calcularLucroPeca = (item: any) => {
        return item.valorPrecoVenda - calcularPrecoProducao(item);
    }

    const calcularMargemLucro = (item: any): number => {
        const lucroPeca = calcularLucroPeca(item);
        const precoVenda = item.valorPrecoVenda;
        const margemLucro = (lucroPeca / precoVenda) * 100;
        return margemLucro;
    }

    const calcularTotalLiquido = () => {
        let total = 0;
        pedido.modelos.map((item: any) => {
            total += calcularLucroLiquido(item);
        });

        return total;
    }


    if (loading) {
        return (
            <Card>
                <CardContent>
                    <CircularProgress />
                </CardContent>
            </Card>
        );
    }

    if (!pedido) {
        return (
            <Card>
                <CardContent>
                    <Typography variant="body1">Pedido não encontrado</Typography>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardContent>
                <TextField
                    fullWidth
                    label="Nome do Pedido"
                    value={pedido.identificacao_pedido}
                    sx={{ marginBottom: 2 }}
                />
                <Divider sx={{ margin: 2 }} />
                <Grid style={{ overflowY: 'auto', width: '100%' }}>
                    <Table style={{ minWidth: '100px' }}>
                        <TableHead>
                            <TableRow>
                                <TableCell>N.Modelo</TableCell>
                                <TableCell>Qtd</TableCell>
                                <TableCell>M.Obra</TableCell>
                                <TableCell>M.Prima</TableCell>
                                <TableCell>Aviamentos</TableCell>
                                <TableCell>Impostos</TableCell>
                                <TableCell>C.Pedido</TableCell>
                                <TableCell>P.Produção</TableCell>
                                <TableCell>P.Venda</TableCell>
                                <TableCell>P.Final</TableCell>
                                <TableCell>L.Liquido</TableCell>
                                <TableCell>L.Peça</TableCell>
                                <TableCell>M.Lucro</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {pedido.modelos.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={10}>
                                        <Typography variant='body2'>
                                            <strong>Nenhum item adicionado</strong>
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                pedido.modelos.map((modelo: any, index: number) => (
                                    <TableRow key={index}>
                                        <TableCell>{modelo.name}</TableCell>
                                        <TableCell>{modelo.quantity}</TableCell>
                                        <TableCell>{(modelo.maoDeObraTotal ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                                        <TableCell>{(modelo.materiaPrimaTotal ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                                        <TableCell>{(modelo.aviamentosTotal ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                                        <TableCell>{(modelo.valorImposto ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                                        <TableCell>{(modelo.custoPedido ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                                        <TableCell>{(calcularPrecoProducao(modelo) ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                                        <TableCell>{(modelo.valorPrecoVenda ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                                        <TableCell>{(modelo.precoFinal ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                                        <TableCell>{(calcularLucroLiquido(modelo) ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                                        <TableCell>{(calcularLucroPeca(modelo) ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                                        <TableCell>{((calcularMargemLucro(modelo) ?? '0%') / 100).toLocaleString('pt-BR', { style: 'percent', maximumFractionDigits: 0 })}</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </Grid>
                <Divider sx={{ margin: 5 }} />
                    <Grid sx={{ textAlign: 'end', marginRight: 7 }}>
                        <strong>Total do Pedido: </strong> {pedido.modelos.reduce((total: any, item: any) => {
                            return total + item.precoFinal;
                        }, 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </Grid>
                    <Divider sx={{ margin: 2 }} />
                    <Grid sx={{ textAlign: 'end', marginRight: 7 }}>
                        <strong>Total do Líquido: </strong> {calcularTotalLiquido().toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </Grid>
            </CardContent>
        </Card>
    );
}

export default TableViewPedido;