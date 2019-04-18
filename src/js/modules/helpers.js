import { register } from 'register-service-worker';

export function canonical() {
  return `https://${window.location.hostname}/`;
}

export function isOnline() {
  return navigator.onLine;
}

export function reloadWindow() {
  window.location.reload(true);
}

export function registerServiceWorker() {
  register('/service-worker.js', {
    // ready() {
    //   console.log('Service worker is active.');
    // },
    // registered(registration) {
    //   console.log('Service worker has been registered.', registration);
    // },
    // cached(registration) {
    //   console.log('Content has been cached for offline use.', registration);
    // },
    // updatefound(registration) {
    //   console.log('New content is downloading.', registration);
    // },
    updated() { // updated(registration)
      console.log('New content has been downloaded.');
    },
    offline() {
      console.info('No internet connection found. App is running in offline mode.');
    },
    error(error) {
      console.error('Error during service worker registration:', error);
    },
  });
}
