import React, { useState } from 'react';
import { 
  TextField, 
  Button, 
  Container, 
  Typography, 
  Box, 
  Alert,
  List,
  ListItem,
  ListItemText,
  IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSiteContext } from '../contexts/SiteContext';

const Login = () => {
  const { 
    sites, 
    authenticateSite, 
    removeSite, 
    loading, 
    error 
  } = useSiteContext();

  const [site, setSite] = useState('');
  const [apiKey, setApiKey] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await authenticateSite(site, apiKey);
      // Limpar campos após login
      setSite('');
      setApiKey('');
    } catch (err) {
      console.error('Erro de login', err);
    }
  };

  const handleRemoveSite = (siteUrl) => {
    removeSite(siteUrl);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        mt: 4 
      }}>
        <Typography variant="h4" gutterBottom>
          Gerenciador de Sites WordPress
        </Typography>

        {/* Formulário de Adição de Site */}
        <Box 
          component="form" 
          onSubmit={handleLogin} 
          sx={{ 
            width: '100%', 
            maxWidth: 500,
            mb: 3 
          }}
        >
          <TextField
            fullWidth
            margin="normal"
            label="URL do Site"
            value={site}
            onChange={(e) => setSite(e.target.value)}
            placeholder="https://seusite.com.br"
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Chave API"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            required
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loading ? 'Autenticando...' : 'Adicionar Site'}
          </Button>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </Box>

        {/* Lista de Sites Adicionados */}
        <Typography variant="h6" sx={{ mt: 2 }}>
          Sites Configurados
        </Typography>
        <List sx={{ width: '100%', maxWidth: 500 }}>
          {sites.map((siteItem, index) => (
            <ListItem
              key={index}
              secondaryAction={
                <IconButton 
                  edge="end" 
                  aria-label="delete"
                  onClick={() => handleRemoveSite(siteItem.url)}
                >
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemText
                primary={siteItem.url}
                secondary={`Usuário: ${siteItem.user?.display_name || 'Não identificado'}`}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Container>
  );
};

export default Login;
