import { testConnection } from './database.js';

console.log('Testando conexão com o banco de dados...');

testConnection()
  .then(success => {
    if (success) {
      process.exit(0);
    } else {
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('Erro ao testar conexão:', error);
    process.exit(1);
  });
