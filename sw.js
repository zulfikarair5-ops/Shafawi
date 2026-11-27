// Shafawi service worker: keeps the app and the mushaf data available offline.
const VERSION = 'thebook-v25';
const SHELL = ['./', 'index.html', 'styles.css', 'app.js', 'manifest.webmanifest',
  'data/quran.json', 'data/mushaf.json', 'data/hafs.ttf', 'icons/icon.svg', 'icons/apple-touch-icon.png',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/splash-1179x2556.png', 'icons/splash-1179x2556-gelap.png', 'icons/logo-penuh.svg', 'icons/wordmark.svg'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const isFont = url.host === 'fonts.googleapis.com' || url.host === 'fonts.gstatic.com' || url.host === 'cdn.jsdelivr.net';
  if (url.origin !== location.origin && !isFont) return;
  // App files: network first so updates arrive, cache as fallback for offline.
  // Big data and fonts: cache first.
  const cacheFirst = isFont || url.pathname.includes('/data/');
  e.respondWith(cacheFirst
    ? caches.match(req).then(hit => hit || fetch(req).then(res => store(req, res)))
    : fetch(req).then(res => store(req, res)).catch(() =>
        caches.match(req, { ignoreSearch: true }).then(hit => hit || caches.match('index.html'))));
});

function store(req, res) {
  if (res && (res.ok || res.type === 'opaque')) {
    const copy = res.clone();
    caches.open(VERSION).then(c => c.put(req, copy));
  }
  return res;
}
