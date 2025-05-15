import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// Register service worker only if not in StackBlitz environment
if ('serviceWorker' in navigator && !navigator.userAgent.includes('StackBlitz')) {
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