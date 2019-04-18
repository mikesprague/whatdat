import '../scss/styles.scss';
import { register } from 'register-service-worker';
import bugsnag from '@bugsnag/js';
import LogRocket from 'logrocket';
import { isOnline } from './modules/helpers';
import { startMarkup } from './modules/templates';
import { startCamera } from './modules/camera';
import {
  populateElementWithMarkup,
  initElementEventHandler,
  initFontAwesomeIcons,
  showInstallAlert,
  showUpdatedToast,
} from './modules/ui';

LogRocket.init('skxlwh/whatdat');

window.bugsnagClient = bugsnag('723fa77654c41aae8632bace87a7939f');

bugsnag.beforeNotify = (data) => {
  /* eslint-disable no-param-reassign */
  data.metaData.sessionURL = LogRocket.sessionURL;
  /* eslint-enable no-param-reassign */
  return data;
};

register('/service-worker.js', {
  updated() { // updated(registration)
    // need to add some sort of notification and remove forced refresh
    console.log('What Dat?!? has been updated to the latest version.');
    showInstallAlert();
  },
  offline() {
    console.info('No internet connection found. App is running in offline mode.');
  },
  error(error) {
    console.error('Error during service worker registration:', error);
  },
});

window.addEventListener('offline', () => {
  // console.log('Browser offline');
  window.location.replace('/offline.html');
}, false);

window.addEventListener('online', () => {
  // console.log('Browser online');
  window.location.replace('/');
}, false);

function initApp() {
  populateElementWithMarkup('.app', startMarkup);
  initFontAwesomeIcons();
  initElementEventHandler('.btnStartApp', 'click', startCamera);
  showUpdatedToast();
}

function initOffline() {
  initFontAwesomeIcons();
}

document.onreadystatechange = (() => {
  if (document.readyState === 'interactive') {
    if (isOnline()) {
      initApp();
    } else {
      initOffline();
    }
  }
});
