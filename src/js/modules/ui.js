import { dom, library } from '@fortawesome/fontawesome-svg-core';
import {
  faCamera,
  faRotate,
  faSync,
  faWifiSlash,
} from '@fortawesome/pro-duotone-svg-icons';
import swal from 'sweetalert2';
import tippy from 'tippy.js';
import { reloadWindow } from './helpers';

export function initFontAwesomeIcons() {
  library.add(faCamera, faSync, faWifiSlash, faRotate);
  dom.watch();
}

export function initTooltips() {
  tippy('.has-tooltip', {
    allowHTML: true,
    arrow: false,
    offset: [5, -32],
    hideOnClick: true,
    showOnCreate: false,
    touch: true,
    trigger: 'click', // mouseenter
  });
}

export function destroyTooltips() {
  Array.from(document.querySelectorAll('[data-tippy-root]')).map((tooltip) =>
    tooltip.remove()
  );
}

export function showTooltip(tooltipElement) {
  const el = document.querySelector(tooltipElement);
  el.click();
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
  // const releaseNotesLink = '<a href="https://github.com/mikesprague/whatdat/releases/latest" rel="nofollow" target="_blank">View Release Notes</a>';
  localStorage.setItem('updateInstalled', JSON.stringify(1));
  swal
    .fire({
      title: 'What Dat?!?',
      text: `${updateMessage}`,
      cancelButtonText: "No thanks, I'll do it later",
      confirmButtonText: 'Reload for Latest Updates',
      // footer: `${releaseNotesLink}`,
      showCancelButton: true,
      icon: 'success',
    })
    .then((result) => {
      if (result.value === true) {
        reloadWindow();
      }
    });
}

export function showUpdatedToast() {
  const hasUpdated = JSON.parse(localStorage.getItem('updateInstalled'));
  if (hasUpdated) {
    const releaseNotesLink =
      '<a href="https://github.com/mikesprague/whatdat/releases/latest" rel="nofollow" target="_blank">view changelog</a>';
    const Toast = swal.mixin({
      toast: true,
      position: 'top-end',
      showCloseButton: true,
      showConfirmButton: false,
      timer: 10000,
    });

    Toast.fire({
      icon: 'success',
      title: `Successfully updated (${releaseNotesLink})`,
    });
    localStorage.removeItem('updateInstalled');
  }
}

export function initToggleModeSwitch() {
  const toggleEl = document.querySelector('#toggleMode');
  toggleEl.addEventListener('change', () => {
    const icLabelText = document.querySelector('.imageClassificationText');
    const odLabelText = document.querySelector('.objectDetectionText');
    icLabelText.classList.toggle('font-weight-bolder');
    odLabelText.classList.toggle('font-weight-bolder');
    icLabelText.classList.toggle('text-muted');
    odLabelText.classList.toggle('text-muted');
    if (toggleEl.checked) {
      localStorage.setItem('detectionMode', JSON.stringify('objectDetection'));
    } else {
      localStorage.setItem(
        'detectionMode',
        JSON.stringify('imageClassification')
      );
    }
  });
  const detectionMode = JSON.parse(localStorage.getItem('detectionMode'));
  if (detectionMode === 'imageClassification') {
    toggleEl.click();
  }
}
