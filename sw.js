// Japhe Farm — Onion Tracker — Service Worker
//
// Bump CACHE_NAME (e.g. v1 -> v2) any time you change index.html and want
// visitors to get the fresh version faster. Old caches are cleaned up
// automatically on the next visit after a bump.
const CACHE_NAME = "japhe-farm-v1";

// Same-origin files that make up the app itself.
const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png"
];

// External scripts the app needs. Cached separately since they're
// cross-origin (opaque responses — we can cache and serve them, just can't
// inspect their contents or status code).
const CDN_ASSETS = [
  "https://unpkg.com/react@18/umd/react.production.min.js",
  "https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"
];

self.addEventListener("install", function(event){
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache){
        return cache.addAll(APP_SHELL).then(function(){
          return Promise.all(CDN_ASSETS.map(function(url){
            return fetch(url, { mode: "cors" })
              .then(function(resp){ return cache.put(url, resp); })
              .catch(function(){
                // Some CDNs don't send CORS headers for opaque cross-origin
                // fetches — fall back to a no-cors request, which still works
                // for caching even though we can't inspect the response.
                return fetch(url, { mode: "no-cors" })
                  .then(function(resp){ return cache.put(url, resp); })
                  .catch(function(){ /* offline on first install — nothing to cache yet */ });
              });
          }));
        });
      })
      .then(function(){ return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function(event){
  event.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(
        keys.filter(function(key){ return key !== CACHE_NAME; })
            .map(function(key){ return caches.delete(key); })
      );
    }).then(function(){ return self.clients.claim(); })
  );
});

// Stale-while-revalidate: serve from cache instantly (works offline),
// and refresh the cache in the background whenever the network is available.
self.addEventListener("fetch", function(event){
  if(event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then(function(cached){
      const networkFetch = fetch(event.request)
        .then(function(networkResp){
          if(networkResp && (networkResp.ok || networkResp.type === "opaque")){
            const copy = networkResp.clone();
            caches.open(CACHE_NAME).then(function(cache){ cache.put(event.request, copy); });
          }
          return networkResp;
        })
        .catch(function(){
          // Offline and not cached: for page navigations, fall back to the
          // cached app shell so the app still opens instead of showing an error.
          if(event.request.mode === "navigate"){
            return caches.match("./index.html");
          }
          return cached;
        });

      return cached || networkFetch;
    })
  );
});
