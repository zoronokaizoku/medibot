
// Service Worker for offline capabilities
const CACHE_NAME = 'medical-assistant-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/offline.html',
  '/static/styles.css',
  '/static/script.js',
  '/static/offline.js',
  '/static/medical_responses.json'
];

// Install event - cache assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(ASSETS_TO_CACHE);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event - serve from cache if available, otherwise fetch from network
self.addEventListener('fetch', event => {
  // Special handling for the text-to-speech request
  if (event.request.url.includes('response.mp3')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          return response;
        })
        .catch(() => {
          // If offline, return a response indicating voice is unavailable
          return new Response(
            JSON.stringify({ error: 'Voice unavailable offline', message: 'Please go online to use voice features' }),
            { headers: { 'Content-Type': 'application/json' } }
          );
        })
    );
    return;
  }

  // Special handling for medical responses JSON file
  if (event.request.url.includes('medical_responses.json')) {
    event.respondWith(
      caches.match(event.request)
        .then(cachedResponse => {
          return cachedResponse || fetch(event.request)
            .then(networkResponse => {
              // Cache a copy of the response
              let responseClone = networkResponse.clone();
              caches.open(CACHE_NAME).then(cache => {
                cache.put(event.request, responseClone);
              });
              return networkResponse;
            });
        })
        .catch(() => {
          console.log('Failed to fetch medical responses');
        })
    );
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request).then(
          fetchResponse => {
            // Check if we received a valid response
            if(!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
              return fetchResponse;
            }
            
            // Clone the response
            const responseToCache = fetchResponse.clone();
            
            // Save the response to cache for future use
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
              
            return fetchResponse;
          }
        ).catch(() => {
          // Network failed, serve the offline page
          if (event.request.url.indexOf('.html') > -1) {
            return caches.match('/offline.html');
          }
        });
      })
  );
});
