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
  Divider
} from '@mui/material';

function Settings() {
  const [language, setLanguage] = useState('pt-BR');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [apiKeyVisibility, setApiKeyVisibility] = useState(false);
  const [theme, setTheme] = useState('light');

  const handleSaveSettings = () => {
    // Lógica para salvar configurações
    console.log('Configurações salvas:', {
      language,
      notificationsEnabled,
      apiKeyVisibility,
      theme
    });
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Configurações do Panel WP
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
