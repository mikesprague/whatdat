import '@babel/polyfill';
// import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';
// import * as cocoSsd from '@tensorflow-models/coco-ssd';

/* eslint-disable max-len */
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
const appFrame = document.querySelector('.app');
let streaming = false;

/* eslint-disable no-undef */
const constraints = {
  audio: false,
  video: {
    facingMode: 'environment',
  },
};
/* eslint-disable no-undef */

const startMarkup = `
  <div class="text-center"><button class="btnStartApp btn btn-large btn-danger text-center rounded-circle mb-5"><i class="fas fa-camera"></i></button></div>
  <p class="text-center"><strong><em>Note: this app uses your phone's camera and you will be asked for permission if this is your first time using the app</em></strong></p>
`;

const startOverButtonMarkup = `
  <button type="button" class="btnStartOver btn btn-outline-primary btn-block btn-lg text-center mb-2 mt-3">Start Over</button>
`;

const cameraMarkup = `
  <div class="row">
    <div class="col">
      <button type="button" class="btnTakePhoto btn btn-outline-primary btn-block btn-lg text-center mb-3"><i class="fal fa-camera"></i> Take Photo</button>
      <div class="results d-none mb-2"></div>
      <video class="player img-fluid center" autoplay title="Tap/click to take photo"></video>
      <canvas class="canvas d-none"></canvas>
      <img class="photo img-fluid d-none center" alt="The screen capture will appear in this box.">
    </div>
  </div>
`;

const enableButton = (btnSelector, btnText = '') => {
  const button = document.querySelector(btnSelector);
  // console.log(button);
  button.removeAttribute('disabled');
  button.innerHTML = btnText;
};

const disableButton = (btnSelector, btnText = '') => {
  const button = document.querySelector(btnSelector);
  // console.log(button);
  button.innerHTML = btnText;
  button.setAttribute('disabled', true);
};

function takePhoto() {
  const canvas = document.querySelector('.canvas');
  const photo = document.querySelector('.photo');
  const player = document.querySelector('.player');
  const context = canvas.getContext('2d');
  const screenWidth = player.offsetWidth;
  const screenHeight = player.offsetHeight;

  canvas.width = screenWidth;
  canvas.height = screenHeight;
  context.drawImage(player, 0, 0, player.offsetWidth, player.offsetWidth * player.offsetHeight / player.offsetWidth);
  const data = canvas.toDataURL('image/png');
  photo.setAttribute('src', data);
  photo.setAttribute('style', 'width: 100%; height: auto;');
}

function clearPhoto() {
  const context = canvas.getContext('2d');
  context.fillStyle = '#aaa';
  context.fillRect(0, 0, canvas.width, canvas.height);
  const data = canvas.toDataURL('image/png');
  photo.setAttribute('src', data);
}

function startCamera() {
  appFrame.innerHTML = cameraMarkup;

  const player = document.querySelector('.player');
  const canvas = document.querySelector('.canvas');
  const photo = document.querySelector('.photo');
  const results = document.querySelector('.results');
  const btnTakePhoto = document.querySelector('.btnTakePhoto');

  navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
    player.srcObject = stream;
    player.play();
    player.setAttribute('style', 'width: 100%; height: auto;');
  }).catch((error) => {
    console.error('We have a problem', error);
  });

  player.addEventListener('canplay', () => {
    if (!streaming) {
      canvas.setAttribute('width', player.offsetWidth);
      canvas.setAttribute('height', player.offsetHeight);
      streaming = true;
    }
  }, false);

  async function takePhotoClickHandler() {
    takePhoto();
    player.srcObject.getVideoTracks().forEach(track => track.stop());
    player.classList.add('d-none');
    photo.classList.remove('d-none');
    results.classList.remove('d-none');
    disableButton('.btnTakePhoto', '<i class="fas fa-sync fa-spin"></i> identifying ...');
    try {
      const model1 = await mobilenet.load(1, 1.0);
      const predictions1 = await model1.classify(photo, 10);
      const resultsMarkup = predictions1.map(prediction => `
          <tr>
            <td>
              ${Math.round(prediction.probability * 100)}%
            </td>
            <td>
              ${prediction.className}
            </td>
          </tr>
        `).join('\n');
      btnTakePhoto.classList.add('d-none');
      results.innerHTML = `
        <h2 class="lead-1 text-center">dat's a ${predictions1[0].className.toLowerCase().replace(', ', '/')}!</h2>
        <div class="center">
        <details>
          <summary class="text-muted text-center">Expand to view full results</summary>
          <table class="table table-striped table-bordered table-hover">
            <thead>
              <tr>
                <th scope="col">Probability</th>
                <th scope="col">Prediction</th>
              </tr>
            </thead>
            <tbody>
              ${resultsMarkup}
            </tbody>
          </table>
        </details>
        </div>
      `;
      photo.insertAdjacentHTML('afterend', startOverButtonMarkup);
      const btnStartOver = document.querySelector('.btnStartOver');
      btnStartOver.addEventListener('click', () => {
        window.location.reload(true);
      });
      // const model2 = await cocoSsd.load('mobilenet_v2');
      // const predictions2 = await model2.detect(photo);
      // console.log(predictions2);
    } catch (error) {
      console.error(error);
      results.textContent = error;
    }
  }

  btnTakePhoto.addEventListener('click', () => {
    takePhotoClickHandler();
  });
  player.addEventListener('click', () => {
    takePhotoClickHandler();
  });
}

function initApp() {
  appFrame.innerHTML = startMarkup;
  const btnStartApp = document.querySelector('.btnStartApp');
  btnStartApp.addEventListener('click', () => {
    startCamera();
  });
}

initApp();
