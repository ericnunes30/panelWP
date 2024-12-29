import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// Criar contexto
const SiteContext = createContext();

// Provider do contexto
export const SiteProvider = ({ children }) => {
  const [sites, setSites] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Estado de notificação
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'info'
  });

  // Mostrar notificação
  const showNotification = (message, severity = 'info') => {
    setNotification({
      open: true,
      message,
      severity
    });
  };

  // Fechar notificação
  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  // Adicionar novo site
  const addSite = async (siteData) => {
    try {
      setLoading(true);
      
      // Normalizar a URL
      const normalizedUrl = siteData.url.replace(/\/+$/, ''); // Remove barras finais
      const apiEndpoint = `${normalizedUrl}/wp-json/panel-wp/v1/authenticate`;

      // Tentar autenticar com o site
      const response = await axios.post(apiEndpoint, {
        username: siteData.username,
        password: siteData.password
      });

      if (response.data.success) {
        const newSite = {
          ...siteData,
          url: normalizedUrl,
          id: Date.now(), // ID temporário
          status: 'active'
        };

        setSites(prevSites => [...prevSites, newSite]);
        showNotification('Site adicionado com sucesso!', 'success');
        return newSite;
      } else {
        throw new Error('Falha na autenticação com o site WordPress');
      }
    } catch (error) {
      console.error('Erro ao adicionar site:', error);
      showNotification(error.message || 'Erro ao adicionar site', 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Atualizar site
  const updateSite = async (siteId, updateData) => {
    try {
      setLoading(true);
      
      setSites(prevSites => 
        prevSites.map(site => 
          site.id === siteId ? { ...site, ...updateData } : site
        )
      );
      
      showNotification('Site atualizado com sucesso!', 'success');
    } catch (error) {
      console.error('Erro ao atualizar site:', error);
      showNotification(error.message || 'Erro ao atualizar site', 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Remover site
  const removeSite = async (siteId) => {
    try {
      setLoading(true);
      
      setSites(prevSites => prevSites.filter(site => site.id !== siteId));
      showNotification('Site removido com sucesso!', 'success');
    } catch (error) {
      console.error('Erro ao remover site:', error);
      showNotification(error.message || 'Erro ao remover site', 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sincronizar sites
  const syncSites = async () => {
    try {
      setLoading(true);
      
      const syncPromises = sites.map(async site => {
        try {
          const response = await axios.get(`${site.url}/wp-json/wp/v2/posts`);
          return {
            ...site,
            lastSync: new Date().toISOString(),
            status: 'active'
          };
        } catch (error) {
          return {
            ...site,
            lastSync: new Date().toISOString(),
            status: 'error'
          };
        }
      });

      const updatedSites = await Promise.all(syncPromises);
      setSites(updatedSites);
      
      showNotification('Sites sincronizados com sucesso!', 'success');
    } catch (error) {
      console.error('Erro ao sincronizar sites:', error);
      showNotification(error.message || 'Erro ao sincronizar sites', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Verificar status dos sites
  const checkSitesStatus = async () => {
    try {
      const statusPromises = sites.map(async site => {
        try {
          await axios.get(`${site.url}/wp-json`);
          return {
            ...site,
            status: 'active'
          };
        } catch (error) {
          return {
            ...site,
            status: 'error'
          };
        }
      });

      const updatedSites = await Promise.all(statusPromises);
      setSites(updatedSites);
    } catch (error) {
      console.error('Erro ao verificar status dos sites:', error);
    }
  };

  // Efeito para verificar status dos sites periodicamente
  useEffect(() => {
    const interval = setInterval(checkSitesStatus, 300000); // 5 minutos
    return () => clearInterval(interval);
  }, [sites]);

  const value = {
    sites,
    loading,
    error,
    notification,
    currentUser,
    addSite,
    updateSite,
    removeSite,
    syncSites,
    handleCloseNotification,
    setCurrentUser
  };

  return (
    <SiteContext.Provider value={value}>
      {children}
    </SiteContext.Provider>
  );
};

// Hook personalizado para usar o contexto
export const useSiteContext = () => {
  const context = useContext(SiteContext);
  if (!context) {
    throw new Error('useSiteContext deve ser usado dentro de um SiteProvider');
  }
  return context;
};
