import React from 'react';
import { Snackbar, Alert } from '@mui/material';
import { useSiteContext } from '../contexts/SiteContext';

const GlobalNotification = () => {
  const { 
    notification, 
    handleCloseNotification 
  } = useSiteContext();

  return (
    <Snackbar
      open={notification.open}
      autoHideDuration={6000}
      onClose={handleCloseNotification}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert
        onClose={handleCloseNotification}
        severity={notification.severity}
        sx={{ width: '100%' }}
      >
        {notification.message}
      </Alert>
    </Snackbar>
  );
};

export default GlobalNotification;
