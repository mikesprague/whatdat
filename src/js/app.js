import '../scss/styles.scss';
import LogRocket from 'logrocket';
import { startMarkup } from './modules/templates';
import { startCamera } from './modules/camera';
import {
  populateElementWithMarkup,
  initElementEventHandler,
  initFontAwesomeIcons,
} from './modules/ui';

LogRocket.init('skxlwh/whatdat');

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
