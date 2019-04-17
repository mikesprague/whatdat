import { library, dom } from '@fortawesome/fontawesome-svg-core';
import {
  faCamera, faSync,
} from '@fortawesome/pro-solid-svg-icons';
import {
  faCamera as faCameraLight, faWifiSlash,
} from '@fortawesome/pro-light-svg-icons';

export function initFontAwesomeIcons() {
  library.add(
    faCamera,
    faCameraLight,
    faSync,
    faWifiSlash,
  );
  dom.watch();
}

export function populateElementWithMarkup(elementSelector, markupTemplate) {
  const el = document.querySelector(elementSelector);
  el.innerHTML = markupTemplate;
}

export function hideElement(elementSelector) {
  document.querySelector(elementSelector).classList.add('d-none');
}

export function showElement(elementSelector) {
  document.querySelector(elementSelector).classList.remove('d-none');
}

export function disableElement(elementSelector) {
  const el = document.querySelector(elementSelector);
  el.setAttribute('disabled', '');
}

export function enableElement(elementSelector) {
  const el = document.querySelector(elementSelector);
  el.removeAttribute('disabled');
}

export function enableButton(btnSelector, btnText = '') {
  populateElementWithMarkup(btnSelector, btnText);
  disableElement(btnSelector);
}

export function disableButton(btnSelector, btnText = '') {
  enableElement(btnSelector);
  populateElementWithMarkup(btnSelector, btnText);
}

export function reloadWindow() {
  window.location.reload(true);
}

export function initElementEventHandler(elementSelector, event, eventHandler) {
  const el = document.querySelector(elementSelector);
  el.addEventListener(event, eventHandler, false);
}
