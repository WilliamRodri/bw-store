import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button, List, ListItem } from '@mui/material';

const ProductSelectionModal = ({ open, onClose, onSelectProduct, products }: any) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [quantity, setQuantity] = useState(1);

    const filteredProducts = products.filter((product: any) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleProductSelect = (product: any) => {
        setSelectedProduct(product);
        setQuantity(1); // Reset quantity to 1
    };

    const handleAddProduct = () => {
        if (selectedProduct) {
            onSelectProduct({ ...selectedProduct, quantity });
            setSelectedProduct(null);
            setQuantity(1);
            onClose();
        }
    };

    return (
        <Modal open={open} onClose={onClose} aria-labelledby="new-sale-modal-title" aria-describedby="new-sale-modal-description">
            <Box sx={{ width: 500, bgcolor: 'background.paper', padding: 4, margin: 'auto', marginTop: '5%', borderRadius: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6">SELECIONAR PRODUTOS</Typography>
                    <Button variant="contained" color="primary" onClick={onClose}>
                        FECHAR
                    </Button>
                </Box>
                <TextField
                    label="PESQUISAR"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                {selectedProduct && (
                    <Box sx={{ marginY: 2 }}>
                        <Typography>Quantidade:</Typography>
                        <TextField
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(parseInt(e.target.value))}
                            fullWidth
                            margin="normal"
                            inputProps={{ min: 1 }} // Impede a seleção de quantidades menores que 1
                        />
                        <Button variant="contained" color="primary" onClick={handleAddProduct}>
                            Adicionar Produto
                        </Button>
                    </Box>
                )}
                <List>
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((product: any) => (
                            product.stock > 0 ? (
                                <ListItem key={product.id} button onClick={() => handleProductSelect(product)}>
                                    <Typography>{product.name} - R$ {product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} - QTD: {product.stock}</Typography>
                                </ListItem>
                            ) : null
                        ))
                    ) : (
                        <Typography>Sem produtos disponíveis</Typography>
                    )}
                </List>
            </Box>
        </Modal>
    );
};

export default ProductSelectionModal;