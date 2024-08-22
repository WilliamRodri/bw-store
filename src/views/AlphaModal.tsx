import React, { useState } from 'react';
import { Modal, Box, Typography, Button, Divider } from '@mui/material';

const AlphaModal = () => {
  const [open, setOpen] = useState(true);

  const handleClose = () => setOpen(false);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="alpha-modal-title"
      aria-describedby="alpha-modal-description"
    >
      <Box sx={{
        position: 'absolute', 
        top: '50%', 
        left: '50%', 
        transform: 'translate(-50%, -50%)', 
        width: 400, 
        bgcolor: 'background.paper', 
        p: 4
      }}>
        <Typography id="alpha-modal-title" variant="h6" component="h2">
          Versão Alpha
        </Typography>
        <Divider />
        <Typography id="alpha-modal-description" sx={{ mt: 2 }}>
          Este sistema está em versão alpha, podendo ocorrer bugs. 
          Esta versão é apenas para demonstração, permitindo ao usuário adicionar, ver, editar e deletar itens.
        </Typography>
        <Divider />
        <Button onClick={handleClose} sx={{ mt: 2 }} variant="contained" color="primary">
          Prosseguir
        </Button>
      </Box>
    </Modal>
  );
};

export default AlphaModal;