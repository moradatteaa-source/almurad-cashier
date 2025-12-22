const CACHE_NAME = "almurad-app-v4";

const FILES = [
  "./",
  "./dashboard.html",
  "./products.html",
  "./cashier.html",
  "./debts.html",
  "./accounts.html",
  "./profits.html",
  "./manifest.json"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES))
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => k !== CACHE_NAME && caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      // إذا موجود بالكاش افتحه
      if (cached) return cached;

      // إذا مو موجود → لا تطلب نت، رجّع dashboard
      if (event.request.mode === "navigate") {
        return caches.match("./dashboard.html");
      }

      // غير هيج رجّع رد فاضي
      return new Response("", { status: 200 });
    })
  );
});
