const CACHE_NAME = "almurad-app-v6";

const FILES = [
  "./",
  "./index.html",
  "./dashboard.html",
  "./products.html",
  "./debts.html",
  "./accounts.html",
  "./profits.html",
  "./manifest.json",
  "./almurad-logo.png",
  "./icon-192.png",
  "./icon-512.png"
];

// ================= INSTALL =================
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES))
  );
  self.skipWaiting();
});

// ================= ACTIVATE =================
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => k !== CACHE_NAME && caches.delete(k)))
    )
  );
  self.clients.claim();
});

// ================= FETCH =================
self.addEventListener("fetch", event => {

  const url = event.request.url;

  // ❌ لا تكاش صفحة الكاشير نهائيًا
  if (url.includes("cashier.html")) {
    return; // خلي المتصفح يتعامل وياها مباشرة
  }

  // صفحات HTML الأخرى → Network First
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then(res => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, copy);
          });
          return res;
        })
        .catch(() => caches.match(event.request) || caches.match("./dashboard.html"))
    );
    return;
  }

  // باقي الملفات (صور / css / js) → Cache First
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});
