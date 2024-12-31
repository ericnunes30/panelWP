import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Paper, 
  TextField, 
  Button, 
  Switch, 
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  Alert,
  IconButton
} from '@mui/material';
import { 
  AddCircle as AddCircleIcon,
  Link as LinkIcon 
} from '@mui/icons-material';
import { useSiteContext } from '../contexts/SiteContext';

function Settings() {
  const { 
    sites, 
    addSite, 
    openAddSiteModal, 
    handleCloseAddSiteModal,
    handleOpenAddSiteModal 
  } = useSiteContext();
  const [language, setLanguage] = useState('pt-BR');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [apiKeyVisibility, setApiKeyVisibility] = useState(false);
  const [theme, setTheme] = useState('light');
  const [newSiteUrl, setNewSiteUrl] = useState('');
  const [newSiteApiKey, setNewSiteApiKey] = useState('');
  const [addSiteError, setAddSiteError] = useState('');

  const handleSaveSettings = () => {
    // Lógica para salvar configurações
    console.log('Configurações salvas:', {
      language,
      notificationsEnabled,
      apiKeyVisibility,
      theme
    });
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
    <Container maxWidth="md">
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
        Configurações do Panel WP
        <IconButton 
          color="primary" 
          sx={{ ml: 2 }}
          onClick={() => handleOpenAddSiteModal()}
        >
          <AddCircleIcon />
        </IconButton>
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Configurações Gerais
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Idioma</InputLabel>
                  <Select
                    value={language}
                    label="Idioma"
                    onChange={(e) => setLanguage(e.target.value)}
                  >
                    <MenuItem value="pt-BR">Português (Brasil)</MenuItem>
                    <MenuItem value="en-US">English (US)</MenuItem>
                    <MenuItem value="es-ES">Español</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Tema</InputLabel>
                  <Select
                    value={theme}
                    label="Tema"
                    onChange={(e) => setTheme(e.target.value)}
                  >
                    <MenuItem value="light">Claro</MenuItem>
                    <MenuItem value="dark">Escuro</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Box sx={{ mt: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={notificationsEnabled}
                    onChange={(e) => setNotificationsEnabled(e.target.checked)}
                  />
                }
                label="Habilitar Notificações"
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={apiKeyVisibility}
                    onChange={(e) => setApiKeyVisibility(e.target.checked)}
                  />
                }
                label="Exibir Chaves de API"
              />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button 
              variant="contained" 
              color="primary"
              onClick={handleSaveSettings}
            >
              Salvar Configurações
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Settings;
