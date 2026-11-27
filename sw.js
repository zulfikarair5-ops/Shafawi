// Shafawi service worker: keeps the app and the mushaf data available offline.
const VERSION = 'thebook-v17';
// Pustaka AI (transformers.js + enjin ONNX) disimpan berasingan supaya tidak dimuat turun semula setiap kali app dikemas kini.
const AILIB = 'shafawi-ailib-3.7.5';
const SHELL = ['./', 'index.html', 'styles.css', 'app.js', 'manifest.webmanifest',
  'data/quran.json', 'data/mushaf.json', 'data/hafs.ttf', 'icons/icon.svg', 'icons/apple-touch-icon.png',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/splash-1179x2556.png', 'icons/splash-1179x2556-gelap.png', 'icons/logo-penuh.svg', 'icons/wordmark.svg',
  'voice.js', 'voice-match.js', 'asr-worker.js'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    // Padam cache app versi lama sahaja. Model AI (transformers-cache) dan pustaka AI dikekalkan.
    .then(keys => Promise.all(keys.filter(k => k.startsWith('thebook-') && k !== VERSION).map(k => caches.delete(k))))
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
  if (url.host === 'cdn.jsdelivr.net' && url.pathname.startsWith('/npm/@huggingface/transformers@')) {
    e.respondWith(caches.open(AILIB).then(c => c.match(req).then(hit => hit || fetch(req).then(res => {
      if (res && res.ok) c.put(req, res.clone());
      return res;
    }))));
    return;
  }
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
