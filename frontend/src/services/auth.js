import { encrypt, decrypt } from '../utils/encryption';
import { testWordPressConnection } from './api';
import ValidationService from '../utils/validation';

// Chave para armazenamento seguro no localStorage
const STORAGE_KEY = 'wp_sites_encrypted';

// Classe de serviço de autenticação
class AuthService {
  // Salvar site com credenciais criptografadas
  static async addSite(siteData) {
    try {
      // Validar dados do site
      const validatedSite = ValidationService.validateSiteData(siteData);

      // Testar conexão primeiro
      const connectionResult = await testWordPressConnection(
        validatedSite.url, 
        validatedSite.username, 
        validatedSite.password
      );

      if (!connectionResult.success) {
        throw new Error(connectionResult.error || 'Falha na conexão');
      }

      // Recuperar sites existentes
      const sites = this.getSites();

      // Verificar se o site já existe
      const existingSite = sites.find(site => site.url === validatedSite.url);
      if (existingSite) {
        throw new Error('Este site já está cadastrado');
      }

      // Preparar dados para salvar
      const siteToSave = {
        id: Date.now().toString(),
        name: validatedSite.name,
        url: validatedSite.url,
        username: validatedSite.username,
        status: 'conectado',
        token: connectionResult.token
      };

      // Criptografar e salvar
      const encryptedSites = encrypt([...sites, siteToSave]);
      localStorage.setItem(STORAGE_KEY, encryptedSites);

      return siteToSave;
    } catch (error) {
      console.error('Erro ao adicionar site:', error);
      throw error;
    }
  }

  // Recuperar sites salvos
  static getSites() {
    const encryptedSites = localStorage.getItem(STORAGE_KEY);
    if (!encryptedSites) return [];

    try {
      return decrypt(encryptedSites);
    } catch (error) {
      console.error('Erro ao descriptografar sites:', error);
      return [];
    }
  }

  // Remover site
  static removeSite(siteId) {
    const sites = this.getSites();
    const updatedSites = sites.filter(site => site.id !== siteId);
    
    // Salvar sites atualizados
    const encryptedSites = encrypt(updatedSites);
    localStorage.setItem(STORAGE_KEY, encryptedSites);

    return updatedSites;
  }

  // Realizar login em um site específico
  static async loginToSite(siteId) {
    const sites = this.getSites();
    const site = sites.find(s => s.id === siteId);

    if (!site) {
      throw new Error('Site não encontrado');
    }

    // Aqui você pode adicionar lógica adicional de login
    // Por exemplo, abrir o site em uma nova janela ou fazer login programaticamente
    window.open(site.url + '/wp-admin', '_blank');

    return site;
  }

  // Método para atualizar token de um site
  static async refreshSiteToken(siteId) {
    const sites = this.getSites();
    const siteIndex = sites.findIndex(s => s.id === siteId);

    if (siteIndex === -1) {
      throw new Error('Site não encontrado');
    }

    const site = sites[siteIndex];

    try {
      // Tentar renovar o token
      const connectionResult = await testWordPressConnection(
        site.url, 
        site.username, 
        // Aqui você precisaria de uma forma segura de recuperar a senha original
        // Isso pode envolver armazenamento seguro adicional ou solicitação ao usuário
      );

      if (!connectionResult.success) {
        throw new Error('Falha ao renovar token');
      }

      // Atualizar token
      sites[siteIndex].token = connectionResult.token;

      // Salvar sites atualizados
      const encryptedSites = encrypt(sites);
      localStorage.setItem(STORAGE_KEY, encryptedSites);

      return sites[siteIndex];
    } catch (error) {
      console.error('Erro ao atualizar token:', error);
      throw error;
    }
  }
}

export default AuthService;
