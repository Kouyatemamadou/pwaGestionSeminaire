import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Enregistrement du Service Worker
const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm('Nouvelle version disponible. Mettre à jour ?')) {
      updateSW(true);
    }
  },
  onOfflineReady() {
    console.log('Application prête pour une utilisation hors ligne');
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
