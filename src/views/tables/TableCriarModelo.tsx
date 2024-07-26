import {
    Alert,
    AlertColor,
    Button,
    Card,
    CardActions,
    CardContent,
    CircularProgress,
    Divider,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    Snackbar,
    TextField,
    Typography
} from "@mui/material";
import { useRouter } from "next/router";

import {
    ChangeEvent,
    useEffect,
    useState
} from "react";

const TableCriarModelo = () => {
    // Status do Alerta
    const [statusAlert, setStatusAlert] = useState<AlertColor>("success");

    // SnackBar - Cards de Avisos
    const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
    const [textSnackBarAlert, setTextSnackBarAlert] = useState<string>('');
    // Dados de materiais do banco
    const [materials, setMaterials] = useState<any>([]);
    // Input - nome do modelo
    const [modelName, setModelName] = useState<string>('');
    // Selects - data dos select
    const [selectedMaterial1, setSelectedMaterial1] = useState<any>([]);
    const [selectedMaterial2, setSelectedMaterial2] = useState<any>([]);
    const [selectedMaterial3, setSelectedMaterial3] = useState<any>([]);
    const [selectedMaterial4, setSelectedMaterial4] = useState<any>([]);

    const [consumption1, setConsumption1] = useState<number>(0);
    const [consumption2, setConsumption2] = useState<number>(0);
    const [consumption3, setConsumption3] = useState<number>(0);
    const [consumption4, setConsumption4] = useState<number>(0);

    // Impostos Tratativas
    const [valorImposto, setValorImposto] = useState<number>(0);
    const [valorPrecoVenda, setValorPrecoVenda] = useState<number>(0);

    const [totalValue1, setTotalValue1] = useState<number>(0);
    const [totalValue2, setTotalValue2] = useState<number>(0);
    const [totalValue3, setTotalValue3] = useState<number>(0);
    const [totalValue4, setTotalValue4] = useState<number>(0);

    const [items1, setItems1] = useState<any[]>([]);
    const [items2, setItems2] = useState<any[]>([]);
    const [items3, setItems3] = useState<any[]>([]);
    const [items4, setItems4] = useState<any[]>([]);
    //Loading
    const [loading, setLoading] = useState(true);

    // Router Hook
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/material');
                if (!response.ok) {
                    throw new Error('Failed to fetch materials');
                }

                const data: any = [];
                const dataJson = await response.json();
                dataJson.map((item: any) => {
                    data.push({
                      id: item.id,
                      name: item.mater_prima_aviamentos,
                      unit: item.un_medida,
                      price: item.preco_unit_c_frete,
                    });
                });

                setMaterials(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching materials:', error);
                setLoading(false);
            }
        }

        fetchData();
    }, []);
    
    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    const handleModelNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setModelName(event.target.value)
    }

    // Ações da seleção da Materia Prima
    const handleMaterial1Change = async (event: SelectChangeEvent<number>) => {
        const material = materials.find((m: { id: number }) => m.id === parseInt(event.target.value as string))
        setSelectedMaterial1(material)
        setConsumption1(0)
        setTotalValue1(0)
    }
    const handleConsumption1Change = (event: ChangeEvent<HTMLInputElement>) => {
        const consumption = parseFloat(event.target.value) || 0
        setConsumption1(consumption)
        if (selectedMaterial1) {
          setTotalValue1(consumption * selectedMaterial1.price)
        }
    }
    const handleSaveItem1 = () => {
        if (selectedMaterial1 && consumption1 > 0) {
          const newItem = { ...selectedMaterial1, consumption: consumption1, total: totalValue1 }
          setItems1([...items1, newItem])
          setSelectedMaterial1(null)
          setConsumption1(0)
          setTotalValue1(0)
        }
    }
    const handleRemoveItem1 = (index: number) => {
        const newItems = [...items1]
        newItems.splice(index, 1)
        setItems1(newItems)
    }

    // Ações da seleção de Aviamentos
    const handleMaterial2Change = (event: SelectChangeEvent<number>) => {
        const material = materials.find((m: { id: number }) => m.id === parseInt(event.target.value as string))
        setSelectedMaterial2(material)
        setConsumption2(0)
        setTotalValue2(0)
    }
    const handleConsumption2Change = (event: ChangeEvent<HTMLInputElement>) => {
        const consumption = parseFloat(event.target.value) || 0
        setConsumption2(consumption)
        if (selectedMaterial2) {
          setTotalValue2(consumption * selectedMaterial2.price)
        }
    }
    const handleSaveItem2 = () => {
        if (selectedMaterial2 && consumption2 > 0) {
          const newItem = { ...selectedMaterial2, consumption: consumption2, total: totalValue2 }
          setItems2([...items2, newItem])
          setSelectedMaterial2(null)
          setConsumption2(0)
          setTotalValue2(0)
        }
    }
    const handleRemoveItem2 = (index: number) => {
        const newItems = [...items2]
        newItems.splice(index, 1)
        setItems2(newItems)
    }

    // Ações da seleção de Embalagens e Outros
    const handleMaterial3Change = (event: SelectChangeEvent<number>) => {
        const material = materials.find((m: { id: number }) => m.id === parseInt(event.target.value as string))
        setSelectedMaterial3(material)
        setConsumption3(0)
        setTotalValue3(0)
    }
    const handleConsumption3Change = (event: ChangeEvent<HTMLInputElement>) => {
        const consumption = parseFloat(event.target.value) || 0
        setConsumption3(consumption)
        if (selectedMaterial3) {
          setTotalValue3(consumption * selectedMaterial3.price)
        }
    }
    const handleSaveItem3 = () => {
        if (selectedMaterial3 && consumption3 > 0) {
          const newItem = { ...selectedMaterial3, consumption: consumption3, total: totalValue3 }
          setItems3([...items3, newItem])
          setSelectedMaterial3(null)
          setConsumption3(0)
          setTotalValue3(0)
        }
    }
    const handleRemoveItem3 = (index: number) => {
        const newItems = [...items3]
        newItems.splice(index, 1)
        setItems3(newItems)
    }
    
    // Ações da seleção de Mão de Obras
    const handleMaterial4Change = (event: SelectChangeEvent<number>) => {
        const material = materials.find((m: { id: number }) => m.id === parseInt(event.target.value as string))
        setSelectedMaterial4(material)
        setConsumption4(0)
        setTotalValue4(0)
    }
    const handleConsumption4Change = (event: ChangeEvent<HTMLInputElement>) => {
        const consumption = parseFloat(event.target.value) || 0
        setConsumption4(consumption)
        if (selectedMaterial4) {
          setTotalValue4(consumption * selectedMaterial4.price)
        }
    }
    const handleSaveItem4 = () => {
        if (selectedMaterial4 && consumption4 > 0) {
          const newItem = { ...selectedMaterial4, consumption: consumption4, total: totalValue4 }
          setItems4([...items4, newItem])
          setSelectedMaterial4(null)
          setConsumption4(0)
          setTotalValue4(0)
        }
    } 
    const handleRemoveItem4 = (index: number) => {
        const newItems = [...items4]
        newItems.splice(index, 1)
        setItems4(newItems)
    }

    // Trativas imposto e venda realizavel
    const handleValorImposto = (event: ChangeEvent<HTMLInputElement>) => {
        const imposto = parseFloat(event.target.value) || 0;
        setValorImposto(imposto);
    }

    const handleValorPrecoVEnda = (event: ChangeEvent<HTMLInputElement>) => {
        const precoVenda = parseFloat(event.target.value) || 0;
        setValorPrecoVenda(precoVenda);
    }

    // Submit
    const handleSubmit = async () => {
        if (
            items1.length === 0 &&
            items2.length === 0 &&
            items3.length === 0 &&
            items4.length === 0
        ) {
            setStatusAlert("error");
            setTextSnackBarAlert('Adicione pelo menos um material antes de gerar o pedido.');
            setSnackbarOpen(true);
            return;
        }

        if (valorImposto === 0 || valorPrecoVenda === 0) {
            setStatusAlert("error");
            setTextSnackBarAlert('Adicione os valores que estão faltando.');
            setSnackbarOpen(true);
            return;
        }

        const formData = {
          nome_modelo: modelName,
          valorImposto: valorImposto,
          valorPrecoVenda: valorPrecoVenda,
          materia_prima: items1.map(item => ({
            materia_prima_aviamentos: item.name,
            un_medida: item.unit,
            price: item.price,
            consumo_p_peca: item.consumption,
            price_total: item.total
          })),
          aviamentos: items2.map(item => ({
            materia_prima_aviamentos: item.name,
            un_medida: item.unit,
            price: item.price,
            consumo_p_peca: item.consumption,
            price_total: item.total
          })),
          embalagem_outros: items3.map(item => ({
            materia_prima_aviamentos: item.name,
            un_medida: item.unit,
            price: item.price,
            consumo_p_peca: item.consumption,
            price_total: item.total
          })),
          mao_de_obra: items4.map(item => ({
            materia_prima_aviamentos: item.name,
            un_medida: item.unit,
            price: item.price,
            consumo_p_peca: item.consumption,
            price_total: item.total
          }))
        }
    
        try {
          const response = await fetch('/api/add/modelo', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          });
    
          if (!response.ok) {
            throw new Error('Falha ao cadastrar o modelo');
          }
          
          setStatusAlert("success");
          setTextSnackBarAlert('Modelo cadastrado com sucesso!');
          setSnackbarOpen(true);
    
          router.push('/modelo');
        } catch (error) {
          console.error('Error ao cadastrar o modelo: ', error);
        }
    }

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
    console.log({ material: selectedMaterial2 });
    return(
        <Card>
            <CardContent>
                <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                    <TextField
                        fullWidth
                        label='Nome do Modelo'
                        value={modelName}
                        onChange={handleModelNameChange}
                        sx={{ marginBottom: 2 }}
                        required={true}
                    />
                    <Divider sx={{ margin: 2 }} />
                    {/* Materia Prima - Adicionar, Excluir e Visualizar */}
                    <Typography variant='body2' sx={{ marginBottom: 2 }}>
                        1. Matéria Prima
                    </Typography>
                    <Grid container spacing={5}>
                        <Grid item xs={12} sm={4}>
                            <FormControl fullWidth>
                                <InputLabel id='material1-label'>Selecionar Matéria Prima</InputLabel>
                                <Select
                                    labelId='material1-label'
                                    value={selectedMaterial1 ? selectedMaterial1.id : ''}
                                    onChange={handleMaterial1Change}
                                >
                                {materials && materials.map((material: any) => (
                                    <MenuItem key={material.id} value={material.id}>
                                        {material.name}
                                    </MenuItem>
                                ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                            <TextField
                                defaultValue={'unit'}
                                fullWidth
                                label='Unidade de Medida'
                                value={selectedMaterial1 ? selectedMaterial1.unit : ''}
                                InputProps={{ readOnly: true }}
                                required={true}
                            />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                            <TextField
                                defaultValue={0}
                                fullWidth
                                label='Preço Unitário'
                                value={selectedMaterial1 ? selectedMaterial1?.price?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : ''}
                                InputProps={{ readOnly: true }}
                                required={true}
                            />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                            <TextField
                                fullWidth
                                label="Consumo p/ Peça"
                                type="number"
                                defaultValue={0}
                                value={consumption1 === 0 ? '' : consumption1}
                                onChange={handleConsumption1Change}
                                inputProps={{ step: 0.01, min: 1 }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                            <TextField
                                defaultValue={0}
                                fullWidth
                                label='Valor Total'
                                value={totalValue1?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                InputProps={{ readOnly: true }}
                                required={true}
                            />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                            <Button
                                fullWidth
                                variant='contained'
                                color='primary'
                                onClick={handleSaveItem1}
                            >
                                Adicionar
                            </Button>
                        </Grid>
                    </Grid>
                    {items1.length > 0 && (
                        <div>
                            <Typography variant='body2' sx={{ marginTop: 4 }}>
                                Itens Adicionados:
                            </Typography>
                            {items1.map((item, index) => (
                                <Grid container spacing={2} key={index} sx={{ marginTop: 2 }}>
                                    <Grid item xs={12} sm={2}>
                                        {item.name}
                                    </Grid>
                                    <Grid item xs={12} sm={2}>
                                        Unit: {item.unit}
                                    </Grid>
                                    <Grid item xs={12} sm={2}>
                                        P.Unit: {item.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                    </Grid>
                                    <Grid item xs={12} sm={2}>
                                        Consumo: {item.consumption.toFixed(2)}
                                    </Grid>
                                    <Grid item xs={12} sm={2}>
                                        Total: {item.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                    </Grid>
                                    <Grid item xs={12} sm={1}>
                                        <Button
                                        variant='contained'
                                        color='secondary'
                                        onClick={() => handleRemoveItem1(index)}
                                        >
                                        Remover
                                        </Button>
                                    </Grid>
                                </Grid>
                            ))}
                        </div>
                    )}
                    <Divider sx={{ margin: 2 }} />
                    {/* Aviamentos */}
                    <Typography variant='body2' sx={{ marginBottom: 2 }}>
                        2. Aviamentos
                    </Typography>
                    <Grid container spacing={5}>
                        <Grid item xs={12} sm={4}>
                            <FormControl fullWidth>
                                <InputLabel id='material2-label'>Selecionar Aviamentos</InputLabel>
                                <Select
                                    labelId='material2-label'
                                    value={selectedMaterial2 ? selectedMaterial2.id : ''}
                                    onChange={handleMaterial2Change}
                                >
                                {materials && materials.map((material: any) => (
                                    <MenuItem key={material.id} value={material.id}>
                                        {material.name}
                                    </MenuItem>
                                ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                        <TextField
                            defaultValue={'unit'}
                            fullWidth
                            label='Unidade de Medida'
                            value={selectedMaterial2 ? selectedMaterial2.unit : ''}
                            InputProps={{ readOnly: true }}
                            required={true}
                        />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                            <TextField
                                defaultValue={0}
                                fullWidth
                                label='Preço Unitário'
                                value={selectedMaterial2 ? selectedMaterial2?.price?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : ''}
                                InputProps={{ readOnly: true }}
                                required={true}
                            />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                            <TextField
                                fullWidth
                                label="Consumo p/ Peça"
                                type="number"
                                defaultValue={0}
                                value={consumption2 === 0 ? '' : consumption2}
                                onChange={handleConsumption2Change}
                                inputProps={{ step: 0.01, min: 1 }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                            <TextField
                                defaultValue={0}
                                fullWidth
                                label='Valor Total'
                                value={totalValue2?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                InputProps={{ readOnly: true }}
                                required={true}
                            />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                        <Button
                            fullWidth
                            variant='contained'
                            color='primary'
                            onClick={handleSaveItem2}
                        >
                            Adicionar
                        </Button>
                        </Grid>
                    </Grid>
                    {items2.length > 0 && (
                        <div>
                            <Typography variant='body2' sx={{ marginTop: 4 }}>
                                Itens Adicionados:
                            </Typography>
                            {items2.map((item, index) => (
                                <Grid container spacing={2} key={index} sx={{ marginTop: 2 }}>
                                    <Grid item xs={12} sm={2}>
                                        {item.name}
                                    </Grid>
                                    <Grid item xs={12} sm={2}>
                                        Unit: {item.unit}
                                    </Grid>
                                    <Grid item xs={12} sm={2}>
                                        P.Unit: {item.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                    </Grid>
                                    <Grid item xs={12} sm={2}>
                                        Consumo: {item.consumption.toFixed(2)}
                                    </Grid>
                                    <Grid item xs={12} sm={2}>
                                        Total: {item.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                    </Grid>
                                    <Grid item xs={12} sm={1}>
                                        <Button
                                            variant='contained'
                                            color='secondary'
                                            onClick={() => handleRemoveItem2(index)}
                                        >
                                        Remover
                                        </Button>
                                    </Grid>
                                </Grid>
                            ))}
                        </div>
                    )}
                    <Divider sx={{ margin: 2 }} />
                    {/* Embalagem e Outros */}
                    <Typography variant='body2' sx={{ marginBottom: 2 }}>
                        3. Embalagem e Outros
                    </Typography>
                    <Grid container spacing={5}>
                        <Grid item xs={12} sm={4}>
                            <FormControl fullWidth>
                                <InputLabel id='material3-label'>Embalagem e Outros</InputLabel>
                                <Select
                                    labelId='material1-label'
                                    value={selectedMaterial3 ? selectedMaterial3.id : ''}
                                    onChange={handleMaterial3Change}
                                >
                                {materials && materials.map((material: any) => (
                                    <MenuItem key={material.id} value={material.id}>
                                        {material.name}
                                    </MenuItem>
                                ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                            <TextField
                                defaultValue={'unit'}
                                fullWidth
                                label='Unidade de Medida'
                                value={selectedMaterial3 ? selectedMaterial3.unit : ''}
                                InputProps={{ readOnly: true }}
                                required={true}
                            />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                            <TextField
                                defaultValue={0}
                                fullWidth
                                label='Preço Unitário'
                                value={selectedMaterial3 ? selectedMaterial3?.price?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : ''}
                                InputProps={{ readOnly: true }}
                                required={true}
                            />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                            <TextField
                                fullWidth
                                label="Consumo p/ Peça"
                                type="number"
                                defaultValue={0}
                                value={consumption3 === 0 ? '' : consumption3}
                                onChange={handleConsumption3Change}
                                inputProps={{ step: 0.01, min: 1 }}
                                />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                            <TextField
                                defaultValue={0}
                                fullWidth
                                label='Valor Total'
                                value={totalValue3?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                InputProps={{ readOnly: true }}
                                required={true}
                            />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                            <Button
                                fullWidth
                                variant='contained'
                                color='primary'
                                onClick={handleSaveItem3}
                            >
                                Adicionar
                            </Button>
                        </Grid>
                    </Grid>
                    {items3.length > 0 && (
                        <div>
                            <Typography variant='body2' sx={{ marginTop: 4 }}>
                                Itens Adicionados:
                            </Typography>
                            {items3.map((item, index) => (
                                <Grid container spacing={2} key={index} sx={{ marginTop: 2 }}>
                                    <Grid item xs={12} sm={2}>
                                        {item.name}
                                    </Grid>
                                    <Grid item xs={12} sm={2}>
                                        Unit: {item.unit}
                                    </Grid>
                                    <Grid item xs={12} sm={2}>
                                        P.Unit: {item.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                    </Grid>
                                    <Grid item xs={12} sm={2}>
                                        Consumo: {item.consumption.toFixed(2)}
                                    </Grid>
                                    <Grid item xs={12} sm={2}>
                                        Total: {item.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                    </Grid>
                                    <Grid item xs={12} sm={1}>
                                        <Button
                                            variant='contained'
                                            color='secondary'
                                            onClick={() => handleRemoveItem3(index)}
                                        >
                                        Remover
                                        </Button>
                                    </Grid>
                                </Grid>
                            ))}
                        </div>
                    )}
                    <Divider sx={{ margin: 2 }} />
                    {/* Mão de Obra */}
                    <Typography variant='body2' sx={{ marginBottom: 2 }}>
                        4. Mão de Obra
                    </Typography>
                    <Grid container spacing={5}>
                        <Grid item xs={12} sm={4}>
                            <FormControl fullWidth>
                                <InputLabel id='material4-label'>Mão de Obra</InputLabel>
                                <Select
                                    labelId='material4-label'
                                    value={selectedMaterial4 ? selectedMaterial4.id : ''}
                                    onChange={handleMaterial4Change}
                                >
                                {materials && materials.map((material: any) => (
                                    <MenuItem key={material.id} value={material.id}>
                                    {material.name}
                                    </MenuItem>
                                ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                        <TextField
                            defaultValue={'unit'}
                            fullWidth
                            label='Unidade de Medida'
                            value={selectedMaterial4 ? selectedMaterial4.unit : ''}
                            InputProps={{ readOnly: true }}
                            required={true}
                        />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                            <TextField
                                defaultValue={0}
                                fullWidth
                                label='Preço Unitário'
                                value={selectedMaterial4 ? selectedMaterial4?.price?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : ''}
                                InputProps={{ readOnly: true }}
                                required={true}
                            />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                            <TextField
                                fullWidth
                                label="Consumo p/ Peça"
                                type="number"
                                defaultValue={0}
                                value={consumption4 === 0 ? '' : consumption4}
                                onChange={handleConsumption4Change}
                                inputProps={{ step: 0.01, min: 1 }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                            <TextField
                                defaultValue={0}
                                fullWidth
                                label='Valor Total'
                                value={totalValue4?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                InputProps={{ readOnly: true }}
                                required={true}
                            />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                        <Button
                            fullWidth
                            variant='contained'
                            color='primary'
                            onClick={handleSaveItem4}
                        >
                            Adicionar
                        </Button>
                        </Grid>
                    </Grid>
                    {items4.length > 0 && (
                        <div>
                            <Typography variant='body2' sx={{ marginTop: 4 }}>
                                Itens Adicionados:
                            </Typography>
                            {items4.map((item, index) => (
                                <Grid container spacing={2} key={index} sx={{ marginTop: 2 }}>
                                    <Grid item xs={12} sm={2}>
                                        {item.name}
                                    </Grid>
                                    <Grid item xs={12} sm={2}>
                                        Unit: {item.unit}
                                    </Grid>
                                    <Grid item xs={12} sm={2}>
                                        P.Unit: {item.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                    </Grid>
                                    <Grid item xs={12} sm={2}>
                                        Consumo: {item.consumption.toFixed(2)}
                                    </Grid>
                                    <Grid item xs={12} sm={2}>
                                        Total: {item.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                    </Grid>
                                    <Grid item xs={12} sm={1}>
                                        <Button
                                            variant='contained'
                                            color='secondary'
                                            onClick={() => handleRemoveItem4(index)}
                                        >
                                        Remover
                                        </Button>
                                    </Grid>
                                </Grid>
                            ))}
                        </div>
                    )}
                    <Divider sx={{ margin: 5 }} />
                    {/* Outras Informações */}
                    <Typography variant='body2' sx={{ marginBottom: 2 }}>
                        Outras Informações
                    </Typography>
                    <Grid container spacing={5}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Imposto"
                                type="number"
                                defaultValue={0}
                                value={valorImposto === 0 ? '' : valorImposto}
                                onChange={handleValorImposto}
                                inputProps={{ step: 0.01, min: 1 }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Preço de venda"
                                type="number"
                                defaultValue={0}
                                value={valorPrecoVenda === 0 ? '' : valorPrecoVenda}
                                onChange={handleValorPrecoVEnda}
                                inputProps={{ step: 0.01, min: 1 }}
                            />
                        </Grid>
                    </Grid>
                    <Divider sx={{ margin: 2 }} />
                    <CardActions sx={{ justifyContent: 'flex-end' }}>
                        <Button variant='contained' color='primary' type='submit'>
                            Salvar Modelo
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

export default TableCriarModelo;