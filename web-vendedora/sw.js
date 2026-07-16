/* Service worker mínimo para que el POS sea instalable como app en Android (PWA).
   Estrategia: network-first para no servir catálogos/precios viejos; el caché es solo
   un respaldo para que la interfaz cargue si se cae la conexión momentáneamente.
   Las llamadas a Supabase (/rest/v1/...) NUNCA se cachean. */
var CACHE = "pos-vendedora-v1";
var ASSETS = ["index.html", "styles.css", "app.js", "config.js", "manifest.json"];

self.addEventListener("install", function (e) {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(ASSETS); }).catch(function () {}));
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (k) { if (k !== CACHE) return caches.delete(k); }));
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", function (e) {
  var url = e.request.url;
  // No interceptar llamadas a la API de Supabase ni peticiones que no sean GET.
  if (e.request.method !== "GET" || url.indexOf("/rest/v1/") >= 0 || url.indexOf("supabase") >= 0) {
    return;
  }
  e.respondWith(
    fetch(e.request)
      .then(function (resp) {
        var copia = resp.clone();
        caches.open(CACHE).then(function (c) { c.put(e.request, copia); }).catch(function () {});
        return resp;
      })
      .catch(function () { return caches.match(e.request); })
  );
});
