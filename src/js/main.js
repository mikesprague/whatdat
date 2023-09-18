import Bugsnag from '@bugsnag/js';
import LogRocket from 'logrocket';
import { registerSW } from 'virtual:pwa-register';

import { startCamera } from './modules/camera';
import {
  handleError,
  handleOffline,
  handleOnline,
  isOnline,
  isProduction,
} from './modules/helpers';
import { startMarkup } from './modules/templates';
import {
  initElementEventHandler,
  initFontAwesomeIcons,
  populateElementWithMarkup,
  showInstallAlert,
} from './modules/ui';

import '../scss/styles.scss';

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

registerSW({
  onNeedRefresh() {
    showInstallAlert();
    // window.location.reload(true);
  },
  immediate: true,
});

window.addEventListener(
  'offline',
  () => {
    handleOffline();
  },
  false
);

window.addEventListener(
  'online',
  () => {
    handleOnline();
  },
  false
);

function initApp() {
  if (isOnline()) {
    populateElementWithMarkup('.app', startMarkup);
    initElementEventHandler('.btnStartApp', 'click', startCamera);
    const detectionMode = JSON.parse(localStorage.getItem('detectionMode'));
    if (!detectionMode) {
      localStorage.setItem('detectionMode', JSON.stringify('objectDetection'));
    }
  }
  initFontAwesomeIcons();
}

initApp();
