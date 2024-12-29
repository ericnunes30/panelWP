import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api'
});

// Serviço de Usuários
export const userService = {
  async register(userData) {
    const response = await api.post('/users/register', userData);
    return response.data;
  },

  async login(credentials) {
    const response = await api.post('/users/login', credentials);
    return response.data;
  },

  async updateUser(id, updateData) {
    const response = await api.put(`/users/${id}`, updateData);
    return response.data;
  }
};

// Serviço de Sites
export const siteService = {
  async addSite(siteData) {
    const response = await api.post('/sites', siteData);
    return response.data;
  },

  async getSites() {
    const response = await api.get('/sites');
    return response.data;
  },

  async removeSite(siteId) {
    await api.delete(`/sites/${siteId}`);
  },

  async updateSite(siteId, siteData) {
    const response = await api.put(`/sites/${siteId}`, siteData);
    return response.data;
  }
};

// Função para testar conexão com site WordPress
export const testWordPressConnection = async (siteUrl, username, password) => {
  try {
    // Detectar o melhor método de autenticação
    const authResult = await api.post('/wordpress-auth/detect', {
      siteUrl,
      username,
      password
    });

    return {
      success: true,
      method: authResult.data.method,
      token: authResult.data.token || null,
      userId: authResult.data.userId || null,
      username: authResult.data.username || authResult.data.user
    };
  } catch (error) {
    console.error('Erro de conexão:', error);
    return {
      success: false,
      error: error.message || 'Erro desconhecido'
    };
  }
};

// Função para verificar suporte a JWT
export const checkJWTSupport = async (siteUrl) => {
  const response = await api.get('/wordpress-auth/jwt-support', {
    params: {
      siteUrl
    }
  });
  return response.data;
};

// Função para renovar token
export const refreshToken = async (siteUrl, token) => {
  const response = await api.post('/wordpress-auth/refresh-token', {
    siteUrl,
    token
  });
  return response.data;
};

// Função para salvar sites no localStorage
export const saveSites = (sites) => {
  localStorage.setItem('wpSites', JSON.stringify(sites));
};

// Função para carregar sites do localStorage
export const loadSites = () => {
  const sites = localStorage.getItem('wpSites');
  return sites ? JSON.parse(sites) : [];
};

export default api;
