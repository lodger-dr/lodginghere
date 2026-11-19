// LodgeHere Service Worker — PWA Application Shell & Offline Strategy
const CACHE_NAME = 'lodgehere-shell-v1';

const STATIC_PRECACHE_URLS = [
  '/',
  '/offline.html',
  '/manifest.webmanifest',
  '/favicon.ico',
  '/icon-192.png',
  '/icon-512.png',
  '/apple-touch-icon.png',
  '/logo.png',
];

// Install: Cache essential application shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_PRECACHE_URLS).catch((err) => {
        console.warn('PWA Precache partial fail:', err);
      });
    })
  );
  self.skipWaiting();
});

// Activate: Clean up old cache versions
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch: Network-first for dynamic navigation, Cache-first for static assets
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Skip non-GET and cross-origin external API requests (e.g. Supabase, Map tiles)
  if (req.method !== 'GET') return;

  // Navigation requests (HTML Pages)
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).catch(async () => {
        const cached = await caches.match(req);
        if (cached) return cached;
        const offlinePage = await caches.match('/offline.html');
        return offlinePage || new Response('Offline', { status: 503, statusText: 'Offline' });
      })
    );
    return;
  }

  // Same-origin static assets (images, fonts, stylesheets, scripts)
  if (url.origin === self.location.origin) {
    if (
      url.pathname.startsWith('/_next/static/') ||
      url.pathname.match(/\.(png|jpg|jpeg|svg|ico|css|js|woff2)$/)
    ) {
      event.respondWith(
        caches.match(req).then((cached) => {
          if (cached) return cached;
          return fetch(req)
            .then((res) => {
              if (res && res.status === 200) {
                const clone = res.clone();
                caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
              }
              return res;
            })
            .catch(() => cached);
        })
      );
      return;
    }
  }

  // Default: Network with graceful catch
  event.respondWith(
    fetch(req).catch(() => caches.match(req))
  );
});
