import Site from '../models/Site.js';
import Logger from './logger.js';

class SiteService {
  static async createSite(siteData) {
    try {
      const site = await Site.create(siteData);
      return site;
    } catch (error) {
      Logger.error('Erro ao criar site:', error);
      throw new Error('Erro ao criar site');
    }
  }

  static async getAllSites() {
    try {
      const sites = await Site.findAll();
      return sites;
    } catch (error) {
      Logger.error('Erro ao buscar sites:', error);
      throw new Error('Erro ao buscar sites');
    }
  }

  static async updateSite(id, updateData) {
    try {
      const site = await Site.findByPk(id);
      
      if (!site) {
        throw new Error('Site não encontrado');
      }

      await site.update(updateData);
      
      return site;
    } catch (error) {
      Logger.error('Erro ao atualizar site:', error);
      throw error;
    }
  }

  static async deleteSite(id) {
    try {
      const site = await Site.findByPk(id);
      
      if (!site) {
        throw new Error('Site não encontrado');
      }

      await site.destroy();
    } catch (error) {
      Logger.error('Erro ao deletar site:', error);
      throw error;
    }
  }
}

export default SiteService;
