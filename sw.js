const CACHE_NAME = "almurad-app-v9";

const FILES = [
  "./",
  "./index.html",
  "./cashier.html",
  "./products.html",
  "./debts.html",
  "./accounts.html",
  "./profits.html",
  "./manifest.json",
  "./almurad-logo.png"
];

// INSTALL
self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES))
  );
  self.skipWaiting();
});

// ACTIVATE
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => k !== CACHE_NAME && caches.delete(k)))
    )
  );
  self.clients.claim();
});

// FETCH (Offline First)
self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(res => {
      return res || fetch(e.request).catch(() =>
        caches.match("./index.html")
      );
    })
  );
});
