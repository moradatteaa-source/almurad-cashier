const CACHE_NAME = "almurad-app-v7";
const BASE = "/REPO_NAME"; // 👈 اسم الريبو

const FILES = [
  BASE + "/",
  BASE + "/index.html",
  BASE + "/dashboard.html",
  BASE + "/products.html",
  BASE + "/debts.html",
  BASE + "/accounts.html",
  BASE + "/profits.html",
  BASE + "/manifest.json",
  BASE + "/almurad-logo.png",
  BASE + "/icon-192.png",
  BASE + "/icon-512.png"
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

  // ❌ لا تكاش الكاشير نهائيًا
  if (url.includes("cashier.html")) {
    return;
  }

  // HTML → Network First
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
        .catch(() =>
          caches.match(event.request) ||
          caches.match(BASE + "/dashboard.html")
        )
    );
    return;
  }

  // Assets → Cache First
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});
