import { useState, useCallback } from 'react';

// Hook para gerenciar estados de carregamento
function useLoadingState() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Iniciar carregamento
  const startLoading = useCallback(() => {
    setIsLoading(true);
    setError(null);
  }, []);

  // Finalizar carregamento com sucesso
  const stopLoading = useCallback(() => {
    setIsLoading(false);
  }, []);

  // Tratar erro
  const handleError = useCallback((errorMessage) => {
    setIsLoading(false);
    setError(errorMessage);
  }, []);

  // Executar função com tratamento de carregamento
  const executeWithLoading = useCallback(async (asyncFunction) => {
    startLoading();
    try {
      const result = await asyncFunction();
      stopLoading();
      return result;
    } catch (err) {
      handleError(err.message);
      throw err;
    }
  }, [startLoading, stopLoading, handleError]);

  return {
    isLoading,
    error,
    startLoading,
    stopLoading,
    handleError,
    executeWithLoading
  };
}

export default useLoadingState;
