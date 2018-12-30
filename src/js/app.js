import '@babel/polyfill';
import '@tensorflow/tfjs';
import '@tensorflow-models/mobilenet';

/* eslint-disable max-len */
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
const appFrame = document.querySelector('.frame');
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
  <p class="text-center text-muted small">What Dat?!? is 100% accurate 60% of the time</p>
`;

const startOverButtonMarkup = `
  <button type="button" class="btnStartOver btn btn-outline-primary btn-block btn-lg text-center mb-2 mt-1">Start Over</button>
`;

const cameraMarkup = `
  <div class="row">
    <div class="col">
      <button type="button" class="btnTakePhoto btn btn-outline-primary btn-block btn-lg text-center mb-3"><i class="fal fa-camera"></i> Take Photo</button>
      <div class="results d-none ml-2"></div>
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
      const model1 = await mobilenet.load();
      // const model2 = await cocoSsd.load();
      const predictions1 = await model1.classify(photo, 10);
      // const predictions2 = await model2.detect(photo);
      // `<li class="list-item">${predictions2[0].class} ${Math.round(predictions2[0].score * 100)}%</li>`
      const resultsMarkup = predictions1.map(prediction => `<li class="list-item">${prediction.className} ${Math.round(prediction.probability * 100)}%</li>`).join('\n');
      btnTakePhoto.classList.add('d-none');
      results.innerHTML = resultsMarkup + startOverButtonMarkup;
      const btnStartOver = document.querySelector('.btnStartOver');
      // console.log(predictions1);
      // console.log(predictions2);
      btnStartOver.addEventListener('click', () => {
        window.location.reload(true);
      });
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
