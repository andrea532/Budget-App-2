// Service worker per Progressive Web App
importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

// Aggiornata versione cache
const CACHE = "budget-app-cache-v2";
const offlineFallbackPage = "offline.html";

// Force aggiornamento e attivazione immediata 
self.addEventListener("install", event => {
  console.log('Installazione del service worker');
  self.skipWaiting(); // Forza l'attivazione immediata
  
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.add(offlineFallbackPage))
  );
});

self.addEventListener('activate', event => {
  console.log('Service worker attivato');
  
  // Claim clients immediatamente
  event.waitUntil(clients.claim());
  
  // Pulisci le vecchie cache
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(cacheName => cacheName !== CACHE)
          .map(cacheName => caches.delete(cacheName))
      );
    })
  );
});

// Attiva il navigation preload se supportato
if (workbox.navigationPreload.isSupported()) {
  workbox.navigationPreload.enable();
}

// Gestione delle richieste di navigazione
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const preloadResp = await event.preloadResponse;

        if (preloadResp) {
          return preloadResp;
        }

        const networkResp = await fetch(event.request);
        return networkResp;
      } catch (error) {
        // Se offline, mostra la pagina di fallback
        const cache = await caches.open(CACHE);
        const cachedResp = await cache.match(offlineFallbackPage);
        return cachedResp;
      }
    })());
  }
});

// Cache delle risorse statiche
workbox.routing.registerRoute(
  ({request}) => request.destination === 'style' || 
                request.destination === 'script' ||
                request.destination === 'font' ||
                request.destination === 'image',
  new workbox.strategies.CacheFirst({
    cacheName: 'static-resources',
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 giorni
      }),
    ],
  })
);
