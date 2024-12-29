import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Drawer, 
  AppBar, 
  Toolbar, 
  List, 
  Typography, 
  Divider, 
  IconButton, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  CssBaseline,
  Avatar,
  Tooltip
} from '@mui/material';
import { 
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Dashboard as DashboardIcon,
  AddCircle as AddCircleIcon,
  List as ListIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import { 
  Link, 
  Routes, 
  Route, 
  useNavigate, 
  Navigate 
} from 'react-router-dom';

// Importar páginas
import Dashboard from '../pages/Dashboard';
import Login from '../pages/Login';
import SiteList from '../pages/SiteList';
import Settings from '../pages/Settings';

const drawerWidth = 280;
const miniDrawerWidth = 64;

export default function Layout() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    setIsAuthenticated(authStatus === 'true');

    if (!authStatus) {
      navigate('/login');
    }
  }, [navigate]);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  // Se não estiver autenticado, redirecionar para login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: 'background.paper',
          color: 'text.primary',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          width: `calc(100% - ${open ? drawerWidth : miniDrawerWidth}px)`,
          ml: `${open ? drawerWidth : miniDrawerWidth}px`,
          transition: (theme) => theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" noWrap component="div">
            Panel WP Connector
          </Typography>
          
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2 
          }}>
            <Tooltip title="Logout">
              <IconButton onClick={handleLogout}>
                <LogoutIcon />
              </IconButton>
            </Tooltip>
            <Avatar 
              sx={{ 
                width: 36, 
                height: 36, 
                bgcolor: 'primary.main' 
              }}
            >
              EA
            </Avatar>
          </Box>
        </Toolbar>
      </AppBar>
      
      <Drawer
        variant="permanent"
        sx={{
          width: open ? drawerWidth : miniDrawerWidth,
          flexShrink: 0,
          whiteSpace: 'nowrap',
          boxSizing: 'border-box',
          '& .MuiDrawer-paper': {
            overflowX: 'hidden',
            width: open ? drawerWidth : miniDrawerWidth,
            backgroundColor: 'background.default',
            borderRight: 'none',
            boxShadow: '2px 0 10px rgba(0,0,0,0.05)',
            transition: (theme) => theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
          }
        }}
      >
        <Toolbar
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            px: [1],
          }}
        >
          <IconButton onClick={toggleDrawer}>
            {open ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>
        </Toolbar>
        <Divider />
        <List>
          {[
            { 
              text: 'Dashboard', 
              icon: <DashboardIcon />, 
              path: '/' 
            },
            { 
              text: 'Adicionar Site', 
              icon: <AddCircleIcon />, 
              action: 'openAddSiteModal' 
            },
            { 
              text: 'Lista de Sites', 
              icon: <ListIcon />, 
              path: '/sites' 
            },
            { 
              text: 'Configurações', 
              icon: <SettingsIcon />, 
              path: '/settings' 
            }
          ].map((item) => (
            <ListItem 
              key={item.text}
              button 
              component={item.path ? Link : 'div'}
              to={item.path || undefined}
              onClick={item.action === 'openAddSiteModal' ? () => {
                const dashboardElement = document.querySelector('[data-testid="dashboard-add-site-button"]');
                if (dashboardElement) {
                  dashboardElement.click();
                }
              } : undefined}
              sx={{ 
                borderRadius: 2, 
                m: 1,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
                '&:hover': {
                  backgroundColor: 'action.hover'
                }
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                sx={{ 
                  opacity: open ? 1 : 0,
                  display: open ? 'block' : 'none'
                }} 
              />
            </ListItem>
          ))}
        </List>
      </Drawer>
      
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: 3, 
          mt: 8,
          width: `calc(100% - ${open ? drawerWidth : miniDrawerWidth}px)`,
          backgroundColor: 'background.default',
          ml: `${open ? drawerWidth : miniDrawerWidth}px`,
          transition: (theme) => theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/sites" element={<SiteList />} />
          <Route path="/settings" element={<Settings />} />
          {/* Redirecionar qualquer rota não encontrada para login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Box>
    </Box>
  );
};
