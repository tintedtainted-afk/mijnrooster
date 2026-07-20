const CACHE_NAME = 'mijn-rooster-v12';
const APP_SHELL = [
    './',
    './index.html',
    './manifest.json',
    './icon.png',
    './apple-touch-icon.png',
    './icon-192.png',
    './icon-512.png'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
        )
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // Alleen eigen bestanden cachen; ICS-aanroepen naar externe servers gaan altijd rechtstreeks over het netwerk.
    if (url.origin !== self.location.origin) return;

    event.respondWith(
        caches.match(event.request).then((cached) => cached || fetch(event.request))
    );
});
