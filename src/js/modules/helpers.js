export function canonical() {
  return `https://${window.location.hostname}/`;
}

export function isOnline() {
  return navigator.onLine;
}

export function reloadWindow() {
  window.location.reload(true);
}

export function reportError(error) {
  const debug = process.env.NODE_ENV === 'development';
  if (debug) {
    console.error(error);
  } else {
    /* eslint-disable no-undef */
    bugsnagClient.notify(error);
    /* eslint-enable no-undef */
  }
}
