// Service worker SI KERANG KAMPAK.
// __BUILD_ID__ diganti saat `npm run build` (vite.config.js) agar cache lama terhapus tiap rilis.
const CACHE = 'sikerang-__BUILD_ID__';
const SHELL = ['/', '/manifest.webmanifest', '/favicon.png', '/logo.png', '/pwa.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // API SIAPTUBA (lintas origin) dan foto ber-auth tidak pernah di-cache
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;

  // Halaman: utamakan jaringan agar selalu versi terbaru, cadangan offline dari cache
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put('/', copy));
          return response;
        })
        .catch(() => caches.match('/')),
    );
    return;
  }

  // Aset statis (nama berkas ber-hash): cache dulu
  event.respondWith(
    caches.match(request).then((cached) => cached ?? fetch(request).then((response) => {
      if (response.ok) {
        const copy = response.clone();
        caches.open(CACHE).then((cache) => cache.put(request, copy));
      }
      return response;
    })),
  );
});
