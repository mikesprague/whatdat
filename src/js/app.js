import '../scss/styles.scss';
import bugsnag from '@bugsnag/js';
import LogRocket from 'logrocket';
import { startMarkup } from './modules/templates';
import { startCamera } from './modules/camera';
import {
  populateElementWithMarkup,
  initElementEventHandler,
  initFontAwesomeIcons,
} from './modules/ui';

LogRocket.init('skxlwh/whatdat');

bugsnag.beforeNotify = (data) => {
  /* eslint-disable no-param-reassign */
  data.metaData.sessionURL = LogRocket.sessionURL;
  /* eslint-enable no-param-reassign */
  return data;
};

window.bugsnagClient = bugsnag('723fa77654c41aae8632bace87a7939f');

function initApp() {
  populateElementWithMarkup('.app', startMarkup);
  initFontAwesomeIcons();
  initElementEventHandler('.btnStartApp', 'click', startCamera);
}

document.onreadystatechange = (() => {
  if (document.readyState === 'interactive') {
    initApp();
  }
});
