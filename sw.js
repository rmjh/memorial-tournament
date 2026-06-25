/* Service worker for the Memorial Tournament PWA.
   Network-first so app code and published scores stay fresh; falls back to the
   cache when offline so the app still opens at the field with no signal. */
var CACHE = "mt-cache-v1";
var CORE = [
  "./", "./index.html",
  "./bracket/", "./bracket/index.html",
  "./all-game-times.html",
  "./tournament.js", "./nav.js", "./scores.json",
  "./manifest.webmanifest",
  "./favicon.png", "./apple-touch-icon.png",
  "./icon-192.png", "./icon-512.png", "./maskable-512.png"
];

self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) {
      // Don't fail the whole install if one optional asset 404s.
      return Promise.all(CORE.map(function (u) { return c.add(u).catch(function () {}); }));
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (k) { if (k !== CACHE) return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET") return;
  var url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // let cross-origin (GameChanger etc.) pass through

  e.respondWith(
    fetch(req).then(function (res) {
      if (res && res.status === 200 && res.type === "basic") {
        var copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put(req, copy); }).catch(function () {});
      }
      return res;
    }).catch(function () {
      return caches.match(req).then(function (hit) {
        return hit || caches.match("./index.html");
      });
    })
  );
});
