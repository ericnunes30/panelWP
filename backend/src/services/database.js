import { Sequelize } from 'sequelize';
import Logger from './logger.js';

const sequelize = new Sequelize(
  process.env.DB_NAME || 'panel_wp',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || '123456',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false
  }
);

async function testConnection() {
  try {
    await sequelize.authenticate();
    Logger.info(' Conexão com o banco de dados estabelecida com sucesso.');
    return true;
  } catch (error) {
    Logger.error(' Erro ao conectar com o banco de dados:', error);
    return false;
  }
}

async function syncDatabase() {
  try {
    await sequelize.sync({
      force: true,
      alter: true
    }); 
    Logger.info(' Tabelas sincronizadas com sucesso!');
  } catch (error) {
    Logger.error(' Erro ao sincronizar banco de dados', error);
  }
}

export { sequelize, testConnection, syncDatabase };
