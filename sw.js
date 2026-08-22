const C = "awo-v2-phase2-v2";
const A = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icon.svg"
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(C)
      .then(cache => cache.addAll(A))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys =>
        Promise.all(
          keys
            .filter(key => key !== C)
            .map(key => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  e.respondWith(
    fetch(e.request)
      .then(response => {
        const copy = response.clone();
        caches.open(C).then(cache => {
          cache.put(e.request, copy);
        });
        return response;
      })
      .catch(() =>
        caches.match(e.request)
          .then(cached => cached || caches.match("./index.html"))
      )
  );
});
