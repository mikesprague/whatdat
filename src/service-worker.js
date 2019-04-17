const VERSION = '0.0.1';
const CACHE_NAME = `whatdat-app-${VERSION}`;
const cacheAlways = [
  '.',
  './index.html',
  './offline.html',
  './images/whatdat-icon-64.png',
  './manifest.json',
  './css/styles.css',
  './js/bundle.js',
  './js/vendors~main.bundle.js',
  './js/vendors~main.bundle.js.gz',
];
const cacheWhenPossible = [
  'https://fonts.googleapis.com/css?family=Lato:300,400,700',
  'https://fonts.gstatic.com/s/lato/v15/S6u9w4BMUTPHh7USSwiPGQ3q5d0.woff2',
  'https://fonts.gstatic.com/s/lato/v15/S6u9w4BMUTPHh7USSwaPGQ3q5d0N7w.woff2',
  'https://fonts.gstatic.com/s/lato/v15/S6uyw4BMUTPHjxAwXiWtFCfQ7A.woff2',
  'https://fonts.gstatic.com/s/lato/v15/S6uyw4BMUTPHjx4wXiWtFCc.woff2',
  'https://fonts.gstatic.com/s/lato/v15/S6u9w4BMUTPHh6UVSwaPGQ3q5d0N7w.woff2',
  'https://fonts.gstatic.com/s/lato/v15/S6u9w4BMUTPHh6UVSwiPGQ3q5d0.woff2',
  './images/whatdat-icon-32.png',
  './images/whatdat-icon-48.png',
  './images/whatdat-icon-72.png',
  './images/whatdat-icon-96.png',
  './images/whatdat-icon-128.png',
  './images/whatdat-icon-512.png',
];

/* eslint-disable */
addEventListener('install', (installEvent) => {
  // console.info(`[SW] Begin Installing New Version ${CACHE_NAME}`);
  self.skipWaiting();
  // perform install steps
  installEvent.waitUntil(
    caches.open(CACHE_NAME)
    .then((staticCache) => {
      // Nice to have cached
      staticCache.addAll(cacheWhenPossible).then(() => {
        // console.info('[SW] Cached the 'nice to haves'');
      }); // end addAll/then
      // Must have cached
      return staticCache.addAll(cacheAlways).then(() => {
        // console.info('[SW] Cached the 'must haves'');
        // console.info(`[SW] Finished Updating ${CACHE_NAME}`);
      }); // end return addAll/then
    }) // end open then
  ); // end waitUntil
}); // end addEventListener

addEventListener('activate', (activateEvent) => {
  // console.info('[SW] Activate Started');
  activateEvent.waitUntil(
    caches.keys()
    .then((cacheNames) => {
      return Promise.all(
        cacheNames
        .filter(cacheName => cacheName !== CACHE_NAME)
        .map((cacheName) => {
          // console.info(`[SW] Deleted Old Version ${cacheName}`);
          return caches.delete(cacheName);
        }) // end map
      ); // end return Promise.all
    }) // end keys then
    .then(() => {
      // console.info('[SW] Activated');
      return clients.claim();
    }) // end then
  ); // end waitUntil
}); // end addEventListener

// intercept network requests
self.addEventListener('fetch', (event) => {
  // console.info('[SW] Fetch Started');
  event.respondWith(
    caches.match(event.request).then((response) => {
      // cache hit - return response
      if (response) {
        // console.info(`[SW] Served from Cache ${event.request.url}`);
        return response;
      }
      // clone the request because it's a one time use stream
      const fetchRequest = event.request.clone();
      // console.info(`[SW] Fetched ${event.request.url}`);
      return fetch(fetchRequest).then((response) => {
        // check if we received a valid response
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        // clone the response because it's a one time use stream
        const responseToCache = response.clone();
        event.waitUntil(
          caches.open(CACHE_NAME).then((cache) => {
            // console.info(`[SW] Added to Cache ${event.request.url}`);
            cache.put(event.request, responseToCache);
          })
        );
        return response;
      }).catch((error) => {
        console.log(error, event.request.url);
      });
    })
  );
});
