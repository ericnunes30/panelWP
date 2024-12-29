import React from 'react';
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
  Tooltip
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  Link as LinkIcon,
  OpenInNew as OpenInNewIcon
} from '@mui/icons-material';
import { useSiteContext } from '../contexts/SiteContext';

function SiteList() {
  const { sites, removeSite } = useSiteContext();

  const handleRemoveSite = (siteUrl) => {
    removeSite(siteUrl);
  };

  const handleOpenSite = (siteUrl) => {
    window.open(siteUrl, '_blank');
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Lista de Sites Configurados
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
