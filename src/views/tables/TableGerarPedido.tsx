import { Alert, AlertColor, Button, Card, CardActions, CardContent, Checkbox, CircularProgress, Divider, FormControl, Grid, IconButton, InputLabel, MenuItem, Select, SelectChangeEvent, Snackbar, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { DeleteEmpty } from "mdi-material-ui";
import { useRouter } from "next/router";
import { set } from "nprogress";
import { ChangeEvent, useEffect, useState } from "react";

const TableGerarPedido = () => {
    // Status do Alerta
    const [statusAlert, setStatusAlert] = useState<AlertColor>("success");

    //SnackBar
    const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
    const [textSnackBarAlert, setTextSnackBarAlert] = useState<string>('');
    // Modelos
    const [models, setModels] = useState<any>([]);
    // TextField - Identificação do Pedido
    const [modelName, setModelName] = useState<string>('');
    // Loading
    const [loading, setLoading] = useState<boolean>(true);
    // Data de modelos selecionados
    const [selectedModels, setSelectedModels] = useState<string[]>([]);
    // Data de modelos salvos na tabela
    const [itemsModelos, setItemsModelos] = useState<any>([]);
    // Estado para verificar se há modelos adicionados
    const [modelsAdded, setModelsAdded] = useState<boolean>(false);

    // Router Hook
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/modelo');
                if (!response.ok) {
                    throw new Error('Falha ao pesquisar os modelos');
                }

                const dataJson = await response.json();
                const data = dataJson.map((item: any) => ({
                    id: item.id,
                    nome_modelo: item.nome_modelo,
                    valorImposto: item.valorImposto,
                    valorPrecoVenda: item.valorPrecoVenda,
                    materia_prima: item.materia_prima,
                    aviamentos: item.aviamentos,
                    embalagem_outros: item.embalagem_outros,
                    mao_de_obra: item.mao_de_obra
                }));

                setModels(data);
                setLoading(false);
            } catch (error) {
                console.error('Error na busca dos modelos:', error);
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    // SnackBar - Avisos
    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    // TextField - Add Identificação do Pedido
    const handleModelNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setModelName(event.target.value);
    };

    // CheckBox - Adicionar modelos no estado
    const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>, modelId: string) => {
        if (event.target.checked) {
            setSelectedModels(prevSelected => [...prevSelected, modelId]);
        } else {
            setSelectedModels(prevSelected => prevSelected.filter(id => id !== modelId));
        }
    };

    // Button - Adicionar modelos selecionados na tabela
    const handleAddModels = () => {
        const data: any = selectedModels.map((modelId: string) => {
            const model = models.find((m: { id: string }) => m.id === modelId);
    
            if (!model) {
                return null;
            }
            return {
                id: model.id,
                name: model.nome_modelo,
                valorImposto: 0,
                valorPrecoVenda: 0,
                quantity: 0,
                maoDeObra: model.mao_de_obra,
                materiaPrima: model.materia_prima,
                aviamentos: model.aviamentos,
                impostos: (model?.valorImposto * model?.valorPrecoVenda) / 100,
                custoPedido: 0,
                pProducao: 0,
                pVenda: 0,
                mLucro: 0,
                lPeca: 0,
                lLiquido: 0,
                precoFinal: 0
            };
        }).filter(item => item !== null);
    
        setItemsModelos((prevModels: any[]) => {
            const newData = data.filter((newItem: { id: any; }) => !prevModels.some((prevItem: { id: any; }) => prevItem.id === newItem.id));
            return [...prevModels, ...newData];
        });

        // Atualiza o estado de modelos adicionados
        setModelsAdded(true);
    }

    // Input - Faz os cálculos com base no valor da quantidade que o usuário digita
    const handleQuantityChange = (index: number, quantity: number, item?: any) => {
        const newItemsModelos = [...itemsModelos];
        newItemsModelos[index].quantity = quantity;
    
        // Calcular o total de mão de obra
        const totalMaoDeObra = newItemsModelos[index].maoDeObra.reduce((acc: number, curr: any) => acc + curr.preco_total, 0) * quantity;
        newItemsModelos[index].maoDeObraTotal = totalMaoDeObra;
    
        // Calcular o total de matéria-prima
        const totalMateriaPrima = newItemsModelos[index].materiaPrima.reduce((acc: number, curr: any) => acc + curr.preco_total, 0) * quantity;
        newItemsModelos[index].materiaPrimaTotal = totalMateriaPrima;
    
        // Calcular o total de aviamentos
        const totalAviamentos = newItemsModelos[index].aviamentos.reduce((acc: number, curr: any) => acc + curr.preco_total, 0) * quantity;
        newItemsModelos[index].aviamentosTotal = totalAviamentos;
    
        // Calcular o total de impostos
        const idModeloSelected = newItemsModelos[index].id;
        const dataModeloSelected = models.filter((item: any) => item.id === idModeloSelected);
        const impostoModelo = dataModeloSelected[0].valorImposto;
        const valorPrecoVenda = dataModeloSelected[0].valorPrecoVenda;
        newItemsModelos[index].valorPrecoVenda = valorPrecoVenda;
        const calcImposto = (impostoModelo * valorPrecoVenda) / 100;
        const valorImposto = calcImposto * quantity;
        newItemsModelos[index].valorImposto = valorImposto;
    
        // Calcular preço final
        const precoFinal = valorPrecoVenda * quantity;
        newItemsModelos[index].precoFinal = precoFinal;
    
        // Calcular custo do pedido
        const custoPedido = totalMaoDeObra + totalMateriaPrima + totalAviamentos + valorImposto;
        newItemsModelos[index].custoPedido = custoPedido;

        // Atualizar o estado
        setItemsModelos(newItemsModelos);
    }           

    // Calcula o custo total para a produção de uma peça
    const calcularPrecoProducao = (item: any, index?: any) => {
        const totalMateriaPrima = item.materiaPrima?.reduce((acc: number, curr: any) => acc + curr.preco_total, 0);
        const totalAviamentos = item.aviamentos?.reduce((acc: number, curr: any) => acc + curr.preco_total, 0);
        const totalMaoDeObra = item.maoDeObra?.reduce((acc: number, curr: any) => acc + curr.preco_total, 0);

        // Calcular o imposto
        const imposto = item.impostos;
        const precoProducao = totalMateriaPrima + totalAviamentos + totalMaoDeObra + imposto;

        return precoProducao;
    };

    const calcularCustoPedido = (item: any) => {
        const custoPedido = item.maoDeObraTotal + item.materiaPrimaTotal + item.aviamentosTotal + item.valorImposto;
        return custoPedido;
    }

    const calcularLucroPeca = (item: any, index?: any) => {
        const precoVenda = item.valorPrecoVenda;
        const precoProducao = calcularPrecoProducao(item);
        const lucroPeca = precoVenda - precoProducao;

        return lucroPeca;
    }

    const calcularLucroLiquido = (item: any, index?: any) => {
        const precoFinal = item.precoFinal;
        const custoPedido = calcularCustoPedido(item);
        const lucroLiquido = precoFinal - custoPedido;

        return lucroLiquido;
    }

    const calcularMargemLucro = (item: any, index?: any): number => {
        const lucroPeca = calcularLucroPeca(item);
        const precoVenda = item.valorPrecoVenda;
    
        if (typeof precoVenda !== 'number' || precoVenda === 0) {
            return 0;
        }
    
        if (typeof lucroPeca !== 'number') {
            return 0;
        }
    
        const margemLucro = (lucroPeca / precoVenda) * 100;

        return margemLucro;
    }

    // Remover item da tabela
    const handleRemoveItem = (index: number) => {
        const newItemsModelos = [...itemsModelos];
        newItemsModelos.splice(index, 1);
        setItemsModelos(newItemsModelos);

        // Atualiza o estado de modelos adicionados
        setModelsAdded(newItemsModelos.length > 0);
    };

    // Form Submit
    const handleSubmit = async () => {
        // Verifica se há modelos adicionados
        if (!modelsAdded) {
            setStatusAlert("error");
            setTextSnackBarAlert('Adicione pelo menos um modelo antes de gerar o pedido.');
            setSnackbarOpen(true);
            return;
        }

        const formData = {
            identificacao_pedido: modelName,
            modelos: itemsModelos
        }

        try {
            const response = await fetch('/api/add/pedido', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
              });
        
              if (!response.ok) {
                throw new Error('Falha ao gerar o Pedido');
              }
              
              setStatusAlert("success");
              setTextSnackBarAlert('Pedido gerado com sucesso!');
              setSnackbarOpen(true);
        
              router.push('/pedido');
        } catch (error) {
            console.error('Error ao gerar o pedido: ', error);
        }
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

    return(
        <Card>
            <CardContent>
                <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                    <TextField
                        fullWidth
                        label='Nome do Pedido/Nome Coleção/ID da Coleção'
                        value={modelName}
                        onChange={handleModelNameChange}
                        sx={{ marginBottom: 2 }}
                        required={true}
                    />
                    <Divider sx={{ margin: 2 }} />
                    <Typography variant="h6">Adicionar Modelos</Typography>
                    <FormControl fullWidth sx={{ marginTop: 2, marginBottom: 2 }}>
                        <InputLabel id="models-dropdown-label">Modelos</InputLabel>
                        <Select
                            labelId="models-dropdown-label"
                            id="models-dropdown"
                            multiple
                            value={selectedModels}
                            fullWidth
                            renderValue={(selected) => selected.join(', ')}
                        >
                            {models.map((model: any) => (
                                <MenuItem key={model.id} value={model.id}>
                                    <Checkbox
                                        checked={selectedModels.indexOf(model.id) > -1}
                                        onChange={(event) => handleCheckboxChange(event, model.id)}
                                    />
                                    {model.nome_modelo}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Button variant='contained' color='primary' onClick={handleAddModels} sx={{ marginTop: 2 }}>
                        Adicionar Modelos
                    </Button>
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
                                    <TableCell>Ações</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {itemsModelos.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={11}>
                                            <Typography variant='body2' sx={{ marginTop: 2 }}>
                                                <strong>Nenhum modelo adicionado</strong>
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    itemsModelos.map((item: any, index: number) => (
                                        <TableRow key={index}>
                                            <TableCell><strong>{item.name}</strong></TableCell>
                                            <TableCell>
                                                <TextField
                                                    type="number"
                                                    size="small"
                                                    InputProps={{
                                                        inputProps: {
                                                            min: 1,
                                                            style: { width: 40 },
                                                        },
                                                    }}
                                                    value={item.quantity}
                                                    onChange={(e) => handleQuantityChange(index, Number(e.target.value), item)}
                                                />
                                            </TableCell>
                                            <TableCell>{!item.maoDeObraTotal ? 0 : item.maoDeObraTotal?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                                            <TableCell>{!item.materiaPrimaTotal ? 0 : item.materiaPrimaTotal?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                                            <TableCell>{!item.aviamentosTotal ? 0 : item.aviamentosTotal?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                                            <TableCell>{!item.valorImposto ? 0 : item.valorImposto?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                                            <TableCell>{!item.valorImposto ? 0 : calcularCustoPedido(item).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                                            <TableCell>{!item.valorImposto ? 0 : calcularPrecoProducao(item, index).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                                            <TableCell>{!item.valorImposto ? 0 :item.valorPrecoVenda.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                                            <TableCell>{!item.precoFinal ? 0 : item.precoFinal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                                            <TableCell>{!item.valorImposto ? 0 :calcularLucroLiquido(item, index).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                                            <TableCell>{!item.valorImposto ? 0 :calcularLucroPeca(item, index).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                                            <TableCell>{!item.valorImposto ? '0%' : (calcularMargemLucro(item, index) / 100).toLocaleString('pt-BR', { style: 'percent', maximumFractionDigits: 0 })}</TableCell>
                                            <TableCell>
                                                <IconButton onClick={() => handleRemoveItem(index)}>
                                                    <DeleteEmpty />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </Grid>
                    <Divider sx={{ margin: 5 }} />
                    <Grid sx={{ textAlign: 'end', marginRight: 7 }}>
                        <strong>Total do Pedido: </strong> {itemsModelos.reduce((total: any, item: any) => {
                            return total + item.precoFinal;
                        }, 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </Grid>
                    <Divider sx={{ margin: 5 }} />
                    <CardActions sx={{ justifyContent: 'flex-end' }}>
                        <Button variant='contained' color='primary' type='submit'>
                            Gerar Pedido
                        </Button>
                    </CardActions>
                </form>
            </CardContent>
            <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleCloseSnackbar}>
                <Alert severity={statusAlert} onClose={handleCloseSnackbar}>
                    {textSnackBarAlert}
                </Alert>
            </Snackbar>
        </Card>
    );
}

export default TableGerarPedido;