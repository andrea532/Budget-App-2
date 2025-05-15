import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// Only register service worker in production and when not in StackBlitz
if (
  'serviceWorker' in navigator && 
  !window.location.hostname.includes('stackblitz') && 
  !navigator.userAgent.includes('StackBlitz') &&
  import.meta.env.PROD
) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/pwabuilder-sw.js')
      .then(registration => {
        console.log('Service Worker registrato con successo');
      })
      .catch(error => {
        console.error('Errore durante la registrazione del Service Worker:', error);
      });
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)