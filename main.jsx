// Aggiungi questo al file main.jsx

// Registra il service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/pwabuilder-sw.js')
      .then(registration => {
        console.log('Service Worker registrato con successo:', registration);
        
        // Forza l'aggiornamento del service worker
        registration.update();
      })
      .catch(error => {
        console.error('Errore durante la registrazione del Service Worker:', error);
      });
  });
}

// Rileva modalità PWA e applica fix per iOS
const isPWA = window.navigator.standalone || 
              window.matchMedia('(display-mode: standalone)').matches;

if (isPWA) {
  console.log('Esecuzione come PWA');
  
  // Aggiungi classe al body
  document.body.classList.add('ios-pwa-mode');
  
  // Fix per viewport height in iOS
  const fixIOSHeight = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };
  
  window.addEventListener('resize', fixIOSHeight);
  window.addEventListener('orientationchange', fixIOSHeight);
  fixIOSHeight();
  
  // Rileva e forza refresh per nuove versioni
  if (localStorage.getItem('app-version') !== '1.0.1') {
    localStorage.setItem('app-version', '1.0.1');
    
    // Svuota cache del service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        for (let registration of registrations) {
          registration.update();
        }
      });
    }
  }
}
