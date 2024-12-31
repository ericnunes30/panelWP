import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  IconButton,
  Chip,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  InputAdornment,
  Alert
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  Link as LinkIcon,
  OpenInNew as OpenInNewIcon,
  AddCircle as AddCircleIcon
} from '@mui/icons-material';
import { useSiteContext } from '../contexts/SiteContext';

function SiteList() {
  const { 
    sites, 
    removeSite, 
    addSite, 
    openAddSiteModal, 
    handleCloseAddSiteModal,
    handleOpenAddSiteModal 
  } = useSiteContext();
  const [newSiteUrl, setNewSiteUrl] = useState('');
  const [newSiteApiKey, setNewSiteApiKey] = useState('');
  const [addSiteError, setAddSiteError] = useState('');

  const handleRemoveSite = (siteUrl) => {
    removeSite(siteUrl);
  };

  const handleOpenSite = (siteUrl) => {
    window.open(siteUrl, '_blank');
  };

  const handleAddSite = async () => {
    try {
      // Validar URL
      if (!newSiteUrl.startsWith('http://') && !newSiteUrl.startsWith('https://')) {
        setAddSiteError('A URL deve começar com http:// ou https://');
        return;
      }

      // Remover barra final se existir
      const cleanUrl = newSiteUrl.endsWith('/') 
        ? newSiteUrl.slice(0, -1) 
        : newSiteUrl;

      await addSite({
        url: cleanUrl,
        apiKey: newSiteApiKey
      });

      setNewSiteUrl('');
      setNewSiteApiKey('');
      setAddSiteError('');
    } catch (err) {
      setAddSiteError(err.message || 'Erro ao adicionar site');
    }
  };

  return (
    <Container maxWidth="lg">
      {/* Modal de Adicionar Site */}
      <Dialog 
        open={openAddSiteModal} 
        onClose={handleCloseAddSiteModal}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Adicionar Novo Site</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="URL do Site"
            type="url"
            fullWidth
            variant="outlined"
            value={newSiteUrl}
            onChange={(e) => setNewSiteUrl(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LinkIcon />
                </InputAdornment>
              ),
            }}
            placeholder="https://exemplo.com.br"
          />
          <TextField
            margin="dense"
            label="Chave de API"
            type="password"
            fullWidth
            variant="outlined"
            value={newSiteApiKey}
            onChange={(e) => setNewSiteApiKey(e.target.value)}
            sx={{ mt: 2 }}
          />
          {addSiteError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {addSiteError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddSiteModal} color="secondary">
            Cancelar
          </Button>
          <Button 
            onClick={handleAddSite} 
            color="primary" 
            variant="contained"
            disabled={!newSiteUrl || !newSiteApiKey}
          >
            Adicionar
          </Button>
        </DialogActions>
      </Dialog>

      <Typography variant="h4" gutterBottom sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
        Lista de Sites Configurados
        <IconButton 
          color="primary" 
          sx={{ ml: 2 }}
          onClick={() => handleOpenAddSiteModal()}
        >
          <AddCircleIcon />
        </IconButton>
      </Typography>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Site</TableCell>
              <TableCell>URL</TableCell>
              <TableCell>Usuário</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sites.map((site) => (
              <TableRow key={site.id}>
                <TableCell>{site.siteName}</TableCell>
                <TableCell>{site.url}</TableCell>
                <TableCell>{site.user.display_name}</TableCell>
                <TableCell>
                  <Chip 
                    label="Autenticado" 
                    color="success" 
                    size="small" 
                  />
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Abrir Site">
                    <IconButton onClick={() => handleOpenSite(site.url)}>
                      <OpenInNewIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Remover Site">
                    <IconButton onClick={() => handleRemoveSite(site.url)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {sites.length === 0 && (
        <Typography 
          variant="body1" 
          color="textSecondary" 
          align="center" 
          sx={{ mt: 4 }}
        >
          Nenhum site configurado. Adicione um site para começar.
        </Typography>
      )}
    </Container>
  );
}

export default SiteList;
