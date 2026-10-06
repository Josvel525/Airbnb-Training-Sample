'use strict';

// Change this version when publishing updated HTML, icons or app files.
const VERSION = '2026-10-06-v1';
const BASE = new URL(self.registration.scope);
const PREFIX = `airbnb-ui:${BASE.pathname}:`;
const SHELL_CACHE = `${PREFIX}shell:${VERSION}`;
const MEDIA_CACHE = `${PREFIX}media:${VERSION}`;
const APP_URL = new URL('./index.html', BASE).href;
const SHELL_URLS = [
  './index.html', './manifest.webmanifest', './icons/icon.svg',
  './icons/icon-192.png', './icons/icon-512.png', './icons/apple-touch-icon.png'
].map(path => new URL(path, BASE).href);
const MEDIA_ORIGINS = new Set([
  'https://cdn.screenshottocode.com',
  'https://fonts.googleapis.com',
  'https://fonts.gstatic.com'
]);

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(SHELL_CACHE);
    await cache.addAll(SHELL_URLS.map(url => new Request(url, {cache:'reload'})));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.filter(name => name.startsWith(PREFIX) &&
      name !== SHELL_CACHE && name !== MEDIA_CACHE).map(name => caches.delete(name)));
    await self.clients.claim();
  })());
});

// Navigation uses the network first so published HTML updates appear online.
async function loadApp(request) {
  const cache = await caches.open(SHELL_CACHE);
  try {
    const response = await fetch(request);
    if (!response.ok) throw new Error('App is temporarily unavailable');
    try { await cache.put(APP_URL, response.clone()); } catch (_) {}
    return response;
  } catch (_) {
    return (await cache.match(APP_URL)) || new Response(
      'Connect to the internet and reopen the app once to enable offline access.',
      {status:503, headers:{'Content-Type':'text/plain; charset=utf-8'}}
    );
  }
}

async function cachedFile(request, cacheName, limit) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok || response.type === 'opaque') {
    try {
      await cache.put(request, response.clone());
      if (limit) {
        const keys = await cache.keys();
        await Promise.all(keys.slice(0, Math.max(0, keys.length - limit)).map(key => cache.delete(key)));
      }
    } catch (_) { /* The live response still works if device storage is full. */ }
  }
  return response;
}

self.addEventListener('fetch', event => {
  const {request} = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin === BASE.origin && request.mode === 'navigate' &&
      (url.pathname === BASE.pathname || url.pathname === new URL(APP_URL).pathname)) {
    event.respondWith(loadApp(request));
  } else if (SHELL_URLS.includes(url.href)) {
    event.respondWith(cachedFile(request, SHELL_CACHE));
  } else if (MEDIA_ORIGINS.has(url.origin)) {
    // Viewed photos and downloaded fonts become available on later offline visits.
    event.respondWith(cachedFile(request, MEDIA_CACHE, 64));
  }
});
