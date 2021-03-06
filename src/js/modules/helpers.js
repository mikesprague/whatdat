export function canonical() {
  return `https://${window.location.hostname}/`;
}

export function handleOffline() {
  window.location.replace('/offline.html');
}

export function handleOnline() {
  window.location.replace('/');
}

export function isOnline() {
  return navigator.onLine;
}

export function isProduction() {
  return window.location.hostname === 'whatdat.app';
}

export function reloadWindow() {
  window.location.reload(true);
}

export function handleError(error) {
  if (isProduction()) {
    /* eslint-disable no-undef */
    bugsnagClient.notify(error);
    /* eslint-enable no-undef */
  } else {
    /* eslint-disable no-console */
    console.error(error);
    /* eslint-enable no-console */
  }
  throw new Error(error);
}
