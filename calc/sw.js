const CACHE_NAME = 'calc-v28';

const FILES_TO_CACHE = [
  '/calc/',
  '/calc/index.html',
  '/calc/style.css',
  '/calc/app.js',
  '/calc/manifest.json',
  '/calc/icon-192.png',
  '/calc/icon-512.png',

  /* ICONOS */
  '/calc/icons/backspace.svg',
  '/calc/icons/plusminus.svg'
];

/* ---------- INSTALL ---------- */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

/* ---------- ACTIVATE ---------- */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

/* ---------- FETCH ---------- */
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
