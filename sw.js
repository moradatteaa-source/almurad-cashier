const CACHE_NAME = "almurad-v2"; // غيرنا الإصدار

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll([
        "./",
        "./dashboard.html",
        "./products.html",
        "./cashier.html",
        "./debts.html",
        // ❌ لا تخزن accounts.html
        "./profits.html",
        "./manifest.json"
      ]);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  // 🚫 لا تستخدم الكاش لصفحة الحسابات
  if (event.request.url.includes("accounts")) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
