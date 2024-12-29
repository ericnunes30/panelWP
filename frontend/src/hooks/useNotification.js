import { useState, useCallback } from 'react';

// Hook para gerenciar notificações
function useNotification() {
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'info'
  });

  // Mostrar notificação
  const showNotification = useCallback((message, severity = 'info') => {
    setNotification({
      open: true,
      message,
      severity
    });
  }, []);

  // Fechar notificação
  const handleCloseNotification = useCallback(() => {
    setNotification(prev => ({ ...prev, open: false }));
  }, []);

  return {
    notification,
    showNotification,
    handleCloseNotification
  };
}

export default useNotification;
