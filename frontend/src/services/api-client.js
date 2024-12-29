import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

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
    const response = await api.delete(`/sites/${siteId}`);
    return response.data;
  }
};

export default api;
