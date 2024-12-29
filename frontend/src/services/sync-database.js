import 'dotenv/config';
import { sequelize, syncDatabase } from './database';
import User from '../models/User';
import UserService from './user-service';
import Logger from './logger';

async function runSync() {
  try {
    // Sincronizar banco de dados
    await syncDatabase();

    // Criar usuário inicial de teste
    Logger.info('Criando usuário de teste...');
    await UserService.createUser({
      email: 'admin@painel.com',
      password: 'admin123',
      name: 'Administrador'
    });

    Logger.info('Usuário de teste criado com sucesso');

  } catch (error) {
    Logger.error('Erro ao sincronizar banco de dados', error);
  } finally {
    // Fechar conexão
    await sequelize.close();
  }
}

runSync();
