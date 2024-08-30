import { Box, Button, CircularProgress, Divider, FormControl, InputLabel, MenuItem, Modal, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography, IconButton } from "@mui/material";
import { DeleteEmpty, Eye, Pencil, Plus } from "mdi-material-ui";
import { Fragment, useEffect, useState } from "react";

const TableStickyHeader = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [loading, setLoading] = useState<boolean>(true);
  const [openConfirmModalDelete, setOpenConfirmModalDelete] = useState<boolean>(false);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);
  const [openAddProductModal, setOpenAddProductModal] = useState<boolean>(false);
  const [openEditProductModal, setOpenEditProductModal] = useState<boolean>(false);
  const [openEyeProductModal, setOpenEyeProductModal] = useState<boolean>(false);
  const [openCategoriesModal, setOpenCategoriesModal] = useState<boolean>(false);
  const [openAddCategory, setOpenAddCategory] = useState<boolean>(false);

  const [productToEdit, setProductToEdit] = useState<any>({
    name: '',
    description: '',
    image: '',
    category_id: '',
    price: '',
    cost: '',
    stock: ''
  });

  const [productToAdd, setProductToAdd] = useState<any>({
    name: '',
    description: '',
    image: '',
    category_id: '',
    price: '',
    cost: '',
    stock: ''
  });

  const [productToEye, setProductToEye] = useState<any>({
    name: '',
    description: '',
    image: '',
    category_id: '',
    price: '',
    cost: '',
    stock: ''
  });

  const [categoryToAdd, setCategoryToAdd] = useState<any>({
    name: ""
  });

  const colunasTabelaProdutos = [
    { id: 'id', label: '#', minWidth: 66, align: 'left' as const },
    { id: 'name', label: 'NOME', minWidth: 100, align: 'left' as const },
    { id: 'price', label: 'PREÇO', minWidth: 150, align: 'left' as const },
    { id: 'cost', label: 'CUSTO', minWidth: 150, align: 'left' as const },
    { id: 'stock', label: 'ESTOQUE', minWidth: 150, align: 'left' as const },
    { id: 'actions', label: 'AÇÕES', minWidth: 170, align: 'right' as const },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/produtos`);
        const responseCategories = await fetch(`/api/categorias`);

        const data = await response.json();
        const dataCategorias = await responseCategories.json();

        setProducts(data.products);
        setCategories(dataCategorias.categories);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredRows = products.filter(product =>
    product.id.toString().includes(searchTerm.toLowerCase()) ||
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAddProductModal = () => {
    setOpenAddProductModal(true);
  }

  const handleOpenEyeCategoriesModal = () => {
    setOpenCategoriesModal(true);
  }

  const handleCloseEyeCategoriesModal = () => {
    setOpenCategoriesModal(false);
  }

  const handleOpenAddCategoryModal = () => {
    setOpenAddCategory(true);
  }

  const handleCloseAddProductModal = () => {
    setOpenAddProductModal(false);
  }

  const handleCloseAddCategory = () => {
    setOpenAddCategory(false);
  }

  const handleCloseEyeProductModal = () => {
    setOpenEyeProductModal(false);
  }

  const handleOpenConfirmModalDelete = (id: number) => {
    setOpenConfirmModalDelete(true);
    setProductToDelete(id);
  }

  const handleCloseConfirmModalDelete = () => {
    setOpenConfirmModalDelete(false);
    setProductToDelete(null);
  };

  const handleOpenConfirmModalEdit = (product: any) => {
    setOpenEditProductModal(true);
    setProductToEdit(product);
  }

  const handleOpenEyeModal = (product: any) => {
    setOpenEyeProductModal(true);
    setProductToEye(product);
  }

  const handleCloseConfirmModalEdit = () => {
    setOpenEditProductModal(false);
    setProductToEdit({
      name: '',
      description: '',
      category_id: '',
      price: '',
      cost: '',
      stock: ''
    });
  }

  const handleDeleteProduct = async () => {
    if (productToDelete === null) return;

    try {
      const response = await fetch(`/api/delete/produtos/${productToDelete}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        setProducts(products.filter(product => product.id !== productToDelete));
      } else {
        console.error('Failed to delete the product');
      }
    } catch (error) {
      console.error('Error deleting the sale:', error);
    } finally {
      handleCloseConfirmModalDelete();
    }
  };

  const handleSaveEditProduct = async () => {
    const data = {
      name: productToEdit?.name,
      description: productToEdit?.description,
      image: productToEdit?.image,
      category_id: productToEdit?.category_id,
      price: productToEdit?.price,
      cost: productToEdit?.cost,
      stock: productToEdit?.stock
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/update/produtos/${productToEdit?.id}`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        setProducts(products.filter(product => product.id !== productToDelete));
        location.reload();
      } else {
        console.error('Failed to update the product');
      }
      
    } catch (error) {
      console.error('Error update data:', error);
    } finally {
      setLoading(false);
      setOpenEditProductModal(false);
      setProductToEdit({
        name: '',
        description: '',
        category_id: '',
        price: '',
        cost: '',
        stock: ''
      });
    }
  }

  const [errors, setErrors] = useState({
    name: false,
    category_id: false,
    price: false,
    cost: false,
    stock: false
  });

  const [errorsCategory, setErrorsCategory] = useState({
    name: false
  });

  const validateFields = () => {
    const newErrors = {
      name: productToAdd.name === "",
      category_id: productToAdd.category_id === 0 || productToAdd.category_id === "",
      price: productToAdd.price === "",
      cost: productToAdd.cost === "",
      stock: productToAdd.stock === "" || productToAdd.stock < 0
    }

    setErrors(newErrors);
    
    // Retorna true se todos os campos forem válidos (sem erros)
    return !Object.values(newErrors).includes(true);
  }

  const validateFieldsCategory = () => {
    const newErrors = {
      name: categoryToAdd.name === ""
    }

    setErrorsCategory(newErrors);

    return !Object.values(newErrors).includes(true);
  }

  function convertLink(link: string) {
    if (link.includes('dl=0')) {
      return link.replace('dl=0', 'raw=1');
    }

    return link;
  }

  const handleSaveAddProduct = async () => {
    if (validateFields()) {
      const data = await productToAdd;
      
      const combinedData = {
        name: data.name,
        description: data.description,
        category_id: data.category_id,
        price: parseFloat(data.price),
        stock: data.stock,
        cost: parseFloat(data.cost),
        status: 'visible',
        image: convertLink(data.image)
      };
      
      try {
        setLoading(true);
        const response = await fetch(`/api/products/insertProduct/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(combinedData),
        });

        if (!response.ok) {
            console.error('Failed to generate the product');
            alert('Erro ao cadastrar o Produto, Por favor, Tente Novamente.');
        } else {
          location.reload();
        }

      } catch (error) {
        console.error('Error add data:', error);
        alert('Erro ao cadastrar o produto, Por favor tente novamente.');
      } finally {
          setOpenAddProductModal(false);
          setLoading(false);
      }
    } else {
      alert("Por favor, preencha todos os campos obrigatórios.");
    }
  }

  const handleSaveAddCategory = async () => {
    if (validateFieldsCategory()) {
      try {
        const data = await categoryToAdd;
  
        setLoading(true);
  
        const combinedData = {
          name: data.name,
          description: ""
        };
  
        const response = await fetch(`/api/categorias/insertCategoria/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(combinedData),
        });
  
        if (!response.ok) {
          console.error('Failed to generate the category', response.statusText);
          alert('Erro ao cadastrar a Categoria, Por favor, Tente Novamente.');
          return;
        } else {
          location.reload();
        }
  
      } catch (error) {
        console.error('Error adding category:', error);
        alert('Erro ao cadastrar a categoria, Por favor tente novamente.');
      } finally {
        setOpenAddCategory(false);
        setLoading(false);
      }
    } else {
      alert("Por favor, preencha todos os campos obrigatórios.");
    }
  };  

  const deleteCategory = async (id: any) => {
    if (id === null) return;

    try {
      const response = await fetch(`/api/delete/categorias/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        setCategories(categories.filter(category => category.id !== id));
      } else {
        console.error('Failed to delete the category');
      }
    } catch (error) {
      console.error('Error deleting the category:', error);
    }
  }

  console.error({ errors })
  console.error({ errorsCategory })

  return (
    <Fragment>
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TextField
          label="PESQUISAR VENDA"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ margin: '10px 20px' }}
        />
        <Button variant="contained" startIcon={<Plus />} style={{ margin: '10px 20px' }} onClick={() => handleOpenAddProductModal()}>
          CADASTRAR NOVO PRODUTO
        </Button>
        <Button variant="contained" startIcon={<Eye />} style={{ margin: '10px 20px' }} onClick={() => handleOpenEyeCategoriesModal()}>
          VISUALIZAR CATEGORIAS
        </Button>
        <Typography variant="subtitle2" style={{ margin: '10px 20px' }}>{products.length} PRODUTOS</Typography>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
            <CircularProgress />
          </div>
        ) : (
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {colunasTabelaProdutos.map((column) => (
                    <TableCell key={column.id} align={column.align} sx={{ minWidth: column.minWidth }}>
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {products.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={colunasTabelaProdutos.length}>
                      <Typography variant="body2" sx={{ marginTop: 2 }}>
                        <strong>AINDA NÃO FOI CADASTRADO NENHUM PRODUTO!</strong>
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((product, rowIndex) => (
                    <TableRow hover role="checkbox" tabIndex={-1} key={rowIndex}>
                      {colunasTabelaProdutos.map((column) => {
                        const value = product[column.id];
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {
                              column.id === 'id' ? (
                                `#${value}`
                              ) : column.id === 'name' ? (value) :
                                column.id === 'price' ? (`${parseFloat(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`) :
                                  column.id === 'cost' ? (`${parseFloat(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`) :
                                    column.id === 'stock' ? (value) :
                                      column.id === 'actions' ? (
                                        <Fragment>
                                          <IconButton onClick={() => handleOpenEyeModal(product)}>
                                            <Eye />
                                          </IconButton>
                                          <IconButton onClick={() => handleOpenConfirmModalEdit(product)}>
                                            <Pencil />
                                          </IconButton>
                                          <IconButton onClick={() => handleOpenConfirmModalDelete(product.id)}>
                                            <DeleteEmpty />
                                          </IconButton>
                                        </Fragment>
                                      ) : value}
                          </TableCell>
                        )
                      })}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[10, 25, 50]}
              component="div"
              count={filteredRows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Linhas por página"
              labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count !== -1 ? count : `mais de ${to}`}`}
              getItemAriaLabel={(type) => {
                if (type === 'first') {
                  return 'Primeira página';
                }
                if (type === 'previous') {
                  return 'Página anterior';
                }
                if (type === 'next') {
                  return 'Próxima página';
                }
                if (type === 'last') {
                  return 'Última página';
                }
                return '';
              }}
            />
          </TableContainer>
        )}
      </Paper>

      {/* MODAL DE VISUALIZAÇÃO DE CONFIRMAÇÃO DE DELETAR PRODUTO */}
      <Modal
        open={openConfirmModalDelete}
        onClose={handleCloseConfirmModalDelete}
        aria-labelledby="confirm-modal-title"
        aria-describedby="confirm-modal-description"
      >
        <Box sx={{ width: 400, bgcolor: 'background.paper', padding: 4, margin: 'auto', marginTop: '20%', borderRadius: 1 }}>
          <Typography id="confirm-modal-title" variant="h6" component="h2">
            CONFIRMA EXCLUSÃO
          </Typography>
          <Divider sx={{ marginY: 2 }} />
          <Typography id="confirm-modal-description" sx={{ mt: 2 }}>
            Você tem certeza que deseja excluir este produto?
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
            <Button variant="contained" color="error" onClick={handleDeleteProduct}>
              EXCLUIR
            </Button>
            <Button onClick={handleCloseConfirmModalDelete} sx={{ marginLeft: 2 }}>
              CANCELAR
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* MODAL PARA EDITAR PRODUTO */}
      <Modal
        open={openEditProductModal}
        onClose={handleCloseConfirmModalEdit}
        aria-labelledby="edit-modal-title"
        aria-describedby="edit-modal-description"
      >
        <Box sx={{
            width: 400,
            bgcolor: 'background.paper',
            padding: 4,
            margin: 'auto',
            marginTop: '5%',
            borderRadius: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}>
          <Typography id="edit-modal-title" variant="h6" component="h2">
            EDITANDO PRODUTO
          </Typography>
          <Divider />
          <TextField
            label="NOME"
            value={productToEdit.name}
            onChange={(e) => setProductToEdit({ ...productToEdit, name: e.target.value })}
          />
          <TextField
            label="DESCRIÇÃO"
            value={productToEdit.description}
            onChange={(e) => setProductToEdit({ ...productToEdit, description: e.target.value })}
          />
          <TextField
            label="LINK DA IMAGEM"
            value={productToEdit.image}
            onChange={(e) => setProductToEdit({ ...productToEdit, image: e.target.value })}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>CATEGORIA</InputLabel>
            <Select
              value={productToEdit.category_id}
              onChange={(e) => setProductToEdit({ ...productToEdit, category_id: e.target.value})}
            >
              {categories.map(category => (
                <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="PREÇO"
            type="number"
            value={productToEdit.price}
            onChange={(e) => setProductToEdit({ ...productToEdit, price: e.target.value })}
          />
          <TextField
            label="CUSTO"
            type="number"
            value={productToEdit.cost}
            onChange={(e) => setProductToEdit({ ...productToEdit, cost: e.target.value })}
          />
          <TextField
            label="ESTOQUE"
            type="number"
            value={productToEdit.stock}
            onChange={(e) => setProductToEdit({ ...productToEdit, stock: e.target.value })}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
            <Button variant="contained" onClick={handleSaveEditProduct}>
              SALVAR ALTERAÇÕES
            </Button>
            <Button onClick={handleCloseConfirmModalEdit} sx={{ marginLeft: 2 }}>
              CANCELAR
            </Button>
          </Box>
        </Box>
      </Modal>
      
      {/* MODAL PARA CADASTRAR PRODUTO */}
      <Modal
        open={openAddProductModal}
        onClose={handleCloseAddProductModal}
        aria-labelledby="edit-modal-title"
        aria-describedby="edit-modal-description"
      >
        <Box sx={{
          width: 400,
          bgcolor: 'background.paper',
          padding: 4,
          margin: 'auto',
          marginTop: '5%',
          borderRadius: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}>
          <Typography id="edit-modal-title" variant="h6" component="h2">
            CADASTRANDO NOVO PRODUTO
          </Typography>
          <Divider />
          <TextField
            label="NOME"
            required
            onChange={(e) => setProductToAdd({ ...productToAdd, name: e.target.value })}
          />
          <TextField
            label="DESCRIÇÃO"
            onChange={(e) => setProductToAdd({ ...productToAdd, description: e.target.value })}
          />
          <TextField
            label="LINK DA IMAGEM"
            onChange={(e) => setProductToAdd({ ...productToAdd, image: e.target.value })}
          />
          <FormControl fullWidth margin="normal" required>
            <InputLabel>CATEGORIA</InputLabel>
            <Select
              onChange={(e) => setProductToAdd({ ...productToAdd, category_id: e.target.value })}
            >
              {categories.map(category => (
                <MenuItem style={{ overflowY: "auto" }} key={category.id} value={category.id}>{category.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="PREÇO"
            type="number"
            required
            onChange={(e) => setProductToAdd({ ...productToAdd, price: e.target.value })}
          />
          <TextField
            label="CUSTO"
            type="number"
            required
            onChange={(e) => setProductToAdd({ ...productToAdd, cost: e.target.value })}
          />
          <TextField
            label="ESTOQUE"
            type="number"
            onChange={(e) => setProductToAdd({ ...productToAdd, stock: e.target.value })}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
            <Button 
              variant="contained" 
              onClick={handleSaveAddProduct}
            >
              CADASTRAR
            </Button>
            <Button onClick={handleCloseAddProductModal} sx={{ marginLeft: 2 }}>
              CANCELAR
            </Button>
          </Box>
        </Box>
      </Modal>

        {/* MODAL PARA VISUALIZAR DETALHES DE PRODUTO */}
        <Modal
          open={openEyeProductModal}
          onClose={handleCloseEyeProductModal}
          aria-labelledby="edit-modal-title"
          aria-describedby="edit-modal-description"
        >
          <Box sx={{
            width: '90%',
            maxWidth: 600,
            bgcolor: 'background.paper',
            padding: 4,
            margin: 'auto',
            marginTop: '5%',
            borderRadius: 1,
            display: 'flex',
            flexDirection: 'column',
          }}>
            {/* Título da Modal */}
            <Typography id="edit-modal-title" variant="h6" component="h2" align="center" gutterBottom>
              VISUALIZANDO PRODUTO
            </Typography>
            <Divider />

            {/* Layout para Imagem e Informações */}
            <Box sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2,
              marginTop: 2,
            }}>
              <Box sx={{
                flex: '1 1 200px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden',
                padding: 1,
                marginBottom: { xs: 2, sm: 0 },
              }}>
                {productToEye?.image ? (
                  <img
                    src={productToEye.image}
                    alt={'AQUI E PRA TER UMA IMAGEM NÉ?'}
                    style={{
                      width: '100%',
                      height: 'auto',
                      objectFit: 'cover',
                    }}
                  />
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    Sem imagem cadastrada!
                  </Typography>
                )}
              </Box>

              {/* Informações do Produto */}
              <Box sx={{
                flex: '1 1 300px',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              }}>
                <TextField
                  label="NOME"
                  value={productToEye?.name}
                  fullWidth
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <TextField
                  label="DESCRIÇÃO"
                  value={productToEye?.description}
                  fullWidth
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <TextField
                  label="LINK DA IMAGEM"
                  value={productToEye?.image}
                  fullWidth
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <TextField
                  label="CATEGORIA"
                  value={
                    categories.find((category) => category.id === productToEye.category_id)?.name || ""
                  }
                  fullWidth
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <TextField
                  label="PREÇO"
                  value={productToEye?.price}
                  fullWidth
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <TextField
                  label="CUSTO"
                  value={productToEye?.cost}
                  fullWidth
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <TextField
                  label="ESTOQUE"
                  value={productToEye?.stock}
                  fullWidth
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Box>
            </Box>

            {/* Botão de Fechar */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
              <Button onClick={handleCloseEyeProductModal} sx={{ marginLeft: 2 }}>
                FECHAR
              </Button>
            </Box>
          </Box>
        </Modal>

      {/* MODAL PARA VISUALIAR CATEGORIAS E REALIZAR AÇÕES */}
      <Modal
        open={openCategoriesModal}
        onClose={handleCloseEyeCategoriesModal}
        aria-labelledby="edit-modal-title"
        aria-describedby="edit-modal-description"
      >
        <Box sx={{
          width: 400,
          bgcolor: 'background.paper',
          padding: 4,
          margin: 'auto',
          marginTop: '5%',
          borderRadius: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}>
          <Typography id="edit-modal-title" variant="h6" component="h2">
            VISUALIZANDO CATEGORIAS
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleOpenAddCategoryModal()}
          >
            ADICIONAR CATEGORIA
          </Button>
          <Divider />
          <Box
            sx={{
              maxHeight: "400px",
              overflowY: "auto",
              padding: "10px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            {categories.map((category: any) => (
              <Box
                key={category?.id}
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <TextField
                  fullWidth
                  label="NOME"
                  value={category?.name}
                  sx={{
                    flexGrow: 1, 
                  }}
                />
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => deleteCategory(category.id)}
                >
                  EXCLUIR CATEGORIA
                </Button>
              </Box>
            ))}
          </Box>
          <Divider />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
            <Button onClick={handleCloseEyeCategoriesModal} sx={{ marginLeft: 2 }}>
              FECHAR
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* MODAL PARA CADASTRAR CATEGORIA */}
      <Modal
        open={openAddCategory}
        onClose={handleCloseAddCategory}
        aria-labelledby="edit-modal-title"
        aria-describedby="edit-modal-description"
      >
        <Box sx={{
          width: 400,
          bgcolor: 'background.paper',
          padding: 4,
          margin: 'auto',
          marginTop: '5%',
          borderRadius: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}>
          <Typography id="edit-modal-title" variant="h6" component="h2">
            CADASTRANDO NOVA CATEGORIA
          </Typography>
          <Divider />
          <TextField
            label="NOME DA CATEGORIA"
            required
            onChange={(e) => setCategoryToAdd({ ...categoryToAdd, name: e.target.value })}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
            <Button 
              variant="contained" 
              onClick={handleSaveAddCategory}
            >
              CADASTRAR
            </Button>
            <Button onClick={handleCloseAddCategory} sx={{ marginLeft: 2 }}>
              CANCELAR
            </Button>
          </Box>
        </Box>
      </Modal>
    </Fragment>
  );
}

export default TableStickyHeader;