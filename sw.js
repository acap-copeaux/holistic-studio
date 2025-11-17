// sw.js — Service worker simple pour Holistic Studio

const HS_CACHE = "holistic-studio-v1";
const HS_ASSETS = [
  "/holistic-studio/",
  "/holistic-studio/index.html",
  "/holistic-studio/css/main.css",
  "/holistic-studio/css/theme.css",
  "/holistic-studio/js/app.js",
  "/holistic-studio/js/utils.js"
];

// Installation : pré-cache des fichiers principaux
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(HS_CACHE).then(cache => cache.addAll(HS_ASSETS))
  );
});

// Activation : nettoyage des anciens caches
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== HS_CACHE)
          .map(key => caches.delete(key))
      )
    )
  );
});

// Fetch : stratégie cache-first avec fallback réseau
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(resp => {
      return resp || fetch(event.request);
    })
  );
});
