import '../scss/styles.scss';
import Bugsnag from '@bugsnag/js';
import LogRocket from 'logrocket';
import { register } from 'register-service-worker';
import { startCamera } from './modules/camera';
import {
  handleOffline,
  handleOnline,
  isOnline,
  isProduction,
  handleError,
} from './modules/helpers';
import { startMarkup } from './modules/templates';
import {
  populateElementWithMarkup,
  initElementEventHandler,
  initFontAwesomeIcons,
  showInstallAlert,
} from './modules/ui';

if (isProduction()) {
  LogRocket.init('skxlwh/whatdat');

  window.bugsnagClient = Bugsnag.start('723fa77654c41aae8632bace87a7939f');

  Bugsnag.beforeNotify = (data) => {
    /* eslint-disable no-param-reassign */
    data.metaData.sessionURL = LogRocket.sessionURL;
    /* eslint-enable no-param-reassign */
    return data;
  };
}

window.addEventListener('offline', () => {
  handleOffline();
}, false);

window.addEventListener('online', () => {
  handleOnline();
}, false);

register('/service-worker.js', {
  updated() { // updated(registration)
    // /* eslint-disable no-console */
    // console.log('What Dat?!? has been updated to the latest version.');
    // /* eslint-enable no-console */
    showInstallAlert();
  },
  offline() {
    /* eslint-disable no-console */
    console.info('No internet connection found. App is currently offline.');
    /* eslint-enable no-console */
  },
  error(error) {
    /* eslint-disable no-console */
    console.error('Error during service worker registration:', error);
    /* eslint-enable no-console */
    handleError(error);
  },
});

function initApp() {
  if (isOnline()) {
    populateElementWithMarkup('.app', startMarkup);
    initElementEventHandler('.btn-start-app', 'click', startCamera);
    const detectionMode = JSON.parse(localStorage.getItem('detectionMode'));
    if (!detectionMode) {
      localStorage.setItem('detectionMode', JSON.stringify('objectDetection'));
    }
  }
  initFontAwesomeIcons();
}

document.onreadystatechange = (() => {
  if (document.readyState === 'interactive') {
    initApp();
  }
});
