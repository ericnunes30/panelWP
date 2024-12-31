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
  const [openAddSiteModal, setOpenAddSiteModal] = useState(false);

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

  // Abrir modal de adicionar site
  const handleOpenAddSiteModal = () => {
    console.log('Abrindo modal de adicionar site');
    setOpenAddSiteModal(true);
  };

  // Fechar modal de adicionar site
  const handleCloseAddSiteModal = () => {
    setOpenAddSiteModal(false);
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
        api_key: siteData.apiKey
      });

      console.log('Resposta da API:', response.data); // Log para debug

      // Se chegou aqui é porque a requisição foi bem sucedida
      const newSite = {
        ...siteData,
        url: normalizedUrl,
        id: Date.now(), // ID temporário
        status: 'active',
        user: response.data // Salvar dados do usuário retornados pela API
      };

      setSites(prevSites => [...prevSites, newSite]);
      showNotification('Site adicionado com sucesso!', 'success');
      handleCloseAddSiteModal();
      return newSite;
    } catch (error) {
      console.error('Erro ao adicionar site:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Erro ao adicionar site';
      showNotification(errorMessage, 'error');
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
  const removeSite = async (siteUrl) => {
    try {
      setLoading(true);
      
      // Remover o site do estado
      setSites(prevSites => {
        const newSites = prevSites.filter(site => site.url !== siteUrl);
        
        // Simular um delay para mostrar o loading
        setTimeout(() => {
          setLoading(false);
          showNotification('Site removido com sucesso!', 'success');
        }, 500);
        
        return newSites;
      });

    } catch (error) {
      console.error('Erro ao remover site:', error);
      showNotification('Erro ao remover site', 'error');
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

  // Login em um site específico
  const loginToSite = async (site) => {
    try {
      setLoading(true);
      
      const apiEndpoint = `${site.url}/wp-json/panel-wp/v1/authenticate`;
      
      const response = await axios.post(apiEndpoint, {
        api_key: site.apiKey
      });

      // Atualizar o site com os dados do usuário
      const updatedSite = {
        ...site,
        user: response.data,
        status: 'active'
      };

      setSites(prevSites => 
        prevSites.map(s => s.url === site.url ? updatedSite : s)
      );

      showNotification('Login realizado com sucesso!', 'success');
      return updatedSite;
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Erro ao fazer login';
      showNotification(errorMessage, 'error');
      throw error;
    } finally {
      setLoading(false);
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
    openAddSiteModal,
    addSite,
    updateSite,
    removeSite,
    syncSites,
    loginToSite,
    handleCloseNotification,
    setCurrentUser,
    handleOpenAddSiteModal,
    handleCloseAddSiteModal
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
