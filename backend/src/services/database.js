const { Sequelize } = require('sequelize');
const Logger = require('./logger');

const sequelize = new Sequelize(
  process.env.DB_NAME || 'panel_wp',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || '123456',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: (msg) => Logger.debug(msg)
  }
);

async function testConnection() {
  try {
    await sequelize.authenticate();
    Logger.info('🟢 Conexão com o banco de dados estabelecida com sucesso.');
    return true;
  } catch (error) {
    Logger.error('❌ Erro ao conectar com o banco de dados:', error);
    return false;
  }
}

async function syncDatabase() {
  try {
    Logger.info('Sincronizando modelos...');
    await sequelize.sync({ 
      force: true,
      alter: true
    }); 
    Logger.info('🟢 Tabelas sincronizadas com sucesso!');
  } catch (error) {
    Logger.error('❌ Erro ao sincronizar banco de dados', error);
  }
}

module.exports = { 
  sequelize, 
  testConnection, 
  syncDatabase 
};
