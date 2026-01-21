const CACHE_VERSION = "v1";
const STATIC_CACHE = `static-${CACHE_VERSION}`;
const API_CACHE = `api-${CACHE_VERSION}`;

const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/icons/icon-256.png",
  "/icons/icon-512.png",
  "/src/assets/imgs/bg-login.jpg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(STATIC_CACHE);
      await cache.addAll(STATIC_ASSETS);
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.map((name) =>
          name === STATIC_CACHE || name === API_CACHE
            ? undefined
            : caches.delete(name),
        ),
      );
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") return;

  const url = new URL(request.url);

  if (url.pathname.startsWith("/api")) {
    event.respondWith(
      (async () => {
        try {
          const networkResp = await fetch(request);
          if (networkResp.ok) {
            const copy = networkResp.clone();
            const c = await caches.open(API_CACHE);
            await c.put(request, copy);
          }
          return networkResp;
        } catch {
          return new Response(null, { status: 503, statusText: "Offline" });
        }
      })(),
    );
    return;
  }

  event.respondWith(
    (async () => {
      const cached = await caches.match(request);
      if (cached) return cached;
      try {
        const resp = await fetch(request);
        if (resp && resp.ok) {
          const copy = resp.clone();
          const c = await caches.open(STATIC_CACHE);
          await c.put(request, copy);
        }
        return resp;
      } catch {
        return caches.match("/index.html");
      }
    })(),
  );
});
