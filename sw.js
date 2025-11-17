// sw.js — Cache simple pour Holistic Studio

const HS_CACHE = "holistic-studio-v1";
const HS_ASSETS = [
  "./",
  "./index.html",
  "./css/main.css",
  "./css/theme.css",
  "./js/app.js",
  "./js/utils.js",
  "./img/bear-totem.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(HS_CACHE).then(cache => cache.addAll(HS_ASSETS))
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== HS_CACHE)
          .map(k => caches.delete(k))
      )
    )
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(resp => resp || fetch(event.request))
  );
});
