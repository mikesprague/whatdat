import swal from 'sweetalert2';
import { library, dom } from '@fortawesome/fontawesome-svg-core';
import {
  faCamera, faSync,
} from '@fortawesome/pro-solid-svg-icons';
import {
  faCamera as faCameraLight, faWifiSlash,
} from '@fortawesome/pro-light-svg-icons';
import { reloadWindow } from './helpers';

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

export function initElementEventHandler(elementSelector, event, eventHandler) {
  const el = document.querySelector(elementSelector);
  el.addEventListener(event, eventHandler, false);
}

export function showInstallAlert() {
  const updateMessage = 'Latest Version Installed';
  const releaseNotesLink = '<a href="https://github.com/mikesprague/whatdat/releases/latest" rel="nofollow" target="_blank">View Release Notes</a>';
  localStorage.setItem('updateInstalled', JSON.stringify(1));
  swal.fire({
    title: 'What Dat?!?',
    text: `${updateMessage}`,
    confirmButtonText: 'Reload for Latest Updates',
    footer: `${releaseNotesLink}`,
    type: 'success',
    onClose: () => {
      reloadWindow();
    },
  });
}
