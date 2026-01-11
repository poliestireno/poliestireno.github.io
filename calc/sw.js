self.addEventListener('install', e => {
e.waitUntil(
caches.open('calc-cache').then(cache => {
return cache.addAll([
'/calc/',
'/calc/index.html',
'/calc/style.css',
'/calc/app.js',
'/calc/manifest.json',
'/calc/icon-192.png',
'/calc/icon-512.png'
]);
})
);
});
self.addEventListener('fetch', e => {
e.respondWith(
caches.match(e.request).then(response => response || fetch(e.request))
);
});