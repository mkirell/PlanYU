const CACHE_VERSION = "v1";
const STATIC_CACHE = `static-${CACHE_VERSION}`;
const API_CACHE = `api-${CACHE_VERSION}`;

const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/icons/icon-256.png",
  "/icons/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((names) =>
        Promise.all(
          names.map((name) => {
            if (name !== STATIC_CACHE && name !== API_CACHE)
              return caches.delete(name);
          })
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return event.respondWith(fetch(request));

  const url = new URL(request.url);

  if (url.pathname.startsWith("/api")) {
    event.respondWith(
      (async () => {
        try {
          const networkResp = await fetch(request);
          if (networkResp && networkResp.ok) {
            const copy = networkResp.clone();
            caches.open(API_CACHE).then((c) => c.put(request, copy));
          }
          return networkResp;
        } catch (e) {
          const cached = await caches.match(request);
          return (
            cached || new Response(null, { status: 503, statusText: "Offline" })
          );
        }
      })()
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(
      (cached) =>
        cached ||
        fetch(request)
          .then((resp) => {
            if (resp && resp.ok) {
              const copy = resp.clone();
              caches.open(STATIC_CACHE).then((c) => c.put(request, copy));
            }
            return resp;
          })
          .catch(() => caches.match("/index.html"))
    )
  );
});
