const app_cache = "app-cache";
// aca van todos los archivos necesarios para que la pagina funcione, van a ser "cacheados"
const cache_assets = [
  //paginas
  "index.html",
  "site.webmanifest",
  "sobre-nosotros.html",
  "icons/favicon-256.png",
  "img/captures/captura_mobile.jpeg",
  "img/captures/captura_wide.jpeg",
  "soporte.html",
  "costos.html",
  "offline.html",
  "programar-envio.html",
  "mis-envios.html",
  "404.html",
  "js/main.js",
  "js/tailwind.js",
  "img/costo.jpeg",
  "img/envios.jpg",
  "img/home-banner.jpg",
  "img/mapa.jpg",
  "img/sobre-nosotros.jpg",
  "img/soporte.jpg",
  "db/costos.json",
  "db/db.js",
  "js/costos.js",
  "js/envios.js",
  "js/programarEnvio.js",
  "js/soporte.js",
  "utils/checkLluvia.js",
];

self.addEventListener("install", (event) => {
  console.log("Service worker installed");
  //evita el periodo de espera del navegador
  self.skipWaiting();

  event.waitUntil(
    caches.open(app_cache).then((cache) => {
      cache.addAll(cache_assets).catch((e) => console.log(e));
    })
  );
});

//como el service worker es un intermediario, necesita estar al tanto de todas las
//comunicaciones realizadas, por lo que agregamos un event listener "fetch" en el SW
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }
      //si no esta en cache copiamos la solicitud original
      const request_original = event.request.clone();
      return fetch(request_original)
        .then((response) => {
          //si la respuesta es un error, no quremos almacenarla en cache
          if (!response || response.status != 200) {
            // si la request con error estaba trayendo una img le devolvemos un place holder
            if (request_original.destination == "image") {
              return fetch("/img/placeholder.jpg").then((placeHolder) => {
                return placeHolder;
              });
            } else {
              // si no era una imagen, devolvemos un html mostrando el error correspondiente
              return fetch("404.html").then((err) => {
                return err;
              });
            }
          }
          // si no dio error llegamos a este punto, donde verificamos que la request sea
          // del tipo GET
          if (request_original.method == "GET") {
            //clonamos la respuesta para guardarla en cache
            const nueva_info_cache = response.clone();
            caches.open(app_cache).then((cache) => {
              //una vez obtenemos la respuesta de la promesa del meotodo open (osea, la info del cache)
              // utilizamos el metodo put para guardar la nueva informacion
              cache.put(request_original, nueva_info_cache);
            });
          }
          // ahora que ya guardamos la respuesta en cache, podemos devolversela al ususario
          return response;
        })
        .catch((e) => console.log(e, "request:", request_original));
    })
  );
});
