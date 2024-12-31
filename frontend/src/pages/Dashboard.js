import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardActions, 
  Button, 
  IconButton,
  CircularProgress,
  Alert,
  Chip,
  Box,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment
} from '@mui/material';
import { 
  Add as AddIcon, 
  Login as LoginIcon, 
  Delete as DeleteIcon,
  Language as LanguageIcon,
  Security as SecurityIcon,
  CloudSync as CloudSyncIcon,
  Link as LinkIcon,
  OpenInNew as OpenInNewIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Importar hook de contexto
import { useSiteContext } from '../contexts/SiteContext';

function Dashboard() {
  const navigate = useNavigate();
  const { 
    sites, 
    loading, 
    error, 
    removeSite, 
    loginToSite, 
    addSite,
    openAddSiteModal,
    handleCloseAddSiteModal,
    handleOpenAddSiteModal
  } = useSiteContext();
  const [newSiteUrl, setNewSiteUrl] = useState('');
  const [newSiteApiKey, setNewSiteApiKey] = useState('');
  const [addSiteError, setAddSiteError] = useState('');

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

  const handleLogin = async (site) => {
    try {
      await loginToSite(site);
    } catch (err) {
      console.error('Erro ao fazer login:', err);
    }
  };

  const handleRemoveSite = async (siteUrl) => {
    try {
      await removeSite(siteUrl);
    } catch (err) {
      console.error('Erro ao remover site:', err);
    }
  };

  const handleOpenSite = (site) => {
    // Abre o site em uma nova janela
    window.open(site.url, '_blank');
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
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

      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Painel de Gerenciamento de Sites
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* Estatísticas Gerais */}
        <Grid item xs={12} md={4}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              borderRadius: 2,
              background: 'linear-gradient(145deg, #f0f4f8 0%, #e6eaf0 100%)'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LanguageIcon sx={{ mr: 2, color: 'primary.main' }} />
              <Typography variant="h6">Visão Geral</Typography>
            </Box>
            <Typography variant="body1">
              Total de Sites: <strong>{sites.length}</strong>
            </Typography>
            <Typography variant="body1">
              Sites Ativos: <strong>{sites.filter(site => site.user).length}</strong>
            </Typography>
          </Paper>
        </Grid>

        {/* Lista de Sites */}
        <Grid item xs={12} md={8}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              borderRadius: 2,
              background: 'linear-gradient(145deg, #ffffff 0%, #f4f4f4 100%)'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">Seus Sites</Typography>
              <Button 
                variant="contained" 
                color="primary" 
                startIcon={<AddIcon />}
                onClick={handleOpenAddSiteModal}
                data-testid="dashboard-add-site-button"
              >
                Adicionar Site
              </Button>
            </Box>

            {sites.length === 0 ? (
              <Alert severity="info">
                Você ainda não adicionou nenhum site. Clique em "Adicionar Site" para começar.
              </Alert>
            ) : (
              <Grid container spacing={2}>
                {sites.map((site, index) => (
                  <Grid item xs={12} key={index}>
                    <Card>
                      <Box sx={{ p: 2 }}>
                        <Typography variant="subtitle1">
                          {site.siteName || site.url}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                          <SecurityIcon sx={{ mr: 1, color: 'text.secondary' }} />
                          <Typography variant="body2">
                            Usuário: {site.user?.display_name || 'Não identificado'}
                          </Typography>
                        </Box>
                        <Chip 
                          label={site.user ? 'Conectado' : 'Desconectado'} 
                          color={site.user ? 'success' : 'default'}
                          size="small"
                          sx={{ mr: 2 }}
                        />
                        <IconButton 
                          color="primary" 
                          onClick={() => handleLogin(site)}
                          disabled={!site.user}
                        >
                          <LoginIcon />
                        </IconButton>
                        <IconButton 
                          color="primary" 
                          onClick={() => handleOpenSite(site)}
                        >
                          <OpenInNewIcon />
                        </IconButton>
                        <IconButton 
                          color="error" 
                          onClick={() => handleRemoveSite(site.url)}
                          disabled={loading}
                        >
                          {loading ? <CircularProgress size={24} /> : <DeleteIcon />}
                        </IconButton>
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Dashboard;
