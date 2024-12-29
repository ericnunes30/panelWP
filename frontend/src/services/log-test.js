import Logger from './logger';

function testLogging() {
  // Logs de diferentes níveis
  Logger.info('Iniciando teste de logging', { 
    context: 'Sistema de Logs', 
    timestamp: new Date().toISOString() 
  });

  Logger.warn('Este é um log de aviso', { 
    warningType: 'Teste', 
    severity: 'Médio' 
  });

  try {
    // Simulando um erro
    throw new Error('Erro de teste para logging');
  } catch (error) {
    Logger.error('Erro capturado durante teste', error, {
      errorContext: 'Teste de Sistema',
      additionalInfo: 'Log de erro completo'
    });
  }

  // Log de debug (só aparecerá se o nível de log for configurado para debug)
  Logger.debug('Log de debug', { 
    debugDetails: 'Informações detalhadas' 
  });
}

// Executar teste de logging
testLogging();
