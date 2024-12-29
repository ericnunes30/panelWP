import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

console.log('Iniciando renderização do aplicativo...');

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

console.log('Renderização concluída.');
