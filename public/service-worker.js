const PRECACHE = "precache-v1";
const RUNTIME = "runtime";
const DATACACHE = "datacache-v1";

const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/index.js",
  "/indexedDb.js",
  "/styles.css",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(PRECACHE)
      .then((cache) => {return cache.addAll(FILES_TO_CACHE)}) // might need to add return after arrow
      // .then(self.skipWaiting())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.url.includes("/api/")) {
    event.respondWith(
      caches
        .open(DATACACHE)
        .then((cachedResponse) => {
          return fetch(event.request).then((response) => {
            cachedResponse.put(event.request.url, response.clone());

            return response;
          });
        })
        .catch((err) => console.log(err))
    );
  }

  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request).then(response => {
        if(response) {
          return response
        } else if (event.request.headers.get("accept").includes("text/html")){
          return caches.match("/")
        }
      })
    })
  )

});
