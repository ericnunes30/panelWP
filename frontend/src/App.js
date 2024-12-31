import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Importar páginas
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import SiteList from './pages/SiteList';
import Settings from './pages/Settings';
import Layout from './components/Layout';

// Importar contextos
import { AuthProvider } from './contexts/AuthContext';
import { SiteProvider } from './contexts/SiteContext';
import GlobalNotification from './components/GlobalNotification';

// Componente de rota protegida
const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token');
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Configuração do tema
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2', // Azul padrão do Material UI
    },
    secondary: {
      main: '#dc004e', // Rosa avermelhado
    },
    background: {
      default: '#f4f4f4',
      paper: '#ffffff'
    }
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // Remover texto em maiúsculas
        }
      }
    }
  }
});

function App() {
  useEffect(() => {
    const handleFocusError = (event) => {
      console.error('Blocked aria-hidden error:', {
        focusedElement: event.target,
        ancestorWithAriaHidden: event.target.closest('[aria-hidden="true"]')
      });
    };

    document.addEventListener('focus', handleFocusError, true);
    
    return () => {
      document.removeEventListener('focus', handleFocusError, true);
    };
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AuthProvider>
          <SiteProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
                <Route index element={<Dashboard />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="sites" element={<SiteList />} />
                <Route path="settings" element={<Settings />} />
              </Route>
              
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
            <GlobalNotification />
          </SiteProvider>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
