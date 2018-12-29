const appFrame = document.querySelector('.frame');
const photoWidth = 800;
const photoHeight = 600;
let streaming = false;

/* eslint-disable no-undef */
const constraints = {
  audio: false,
  video: {
    facingMode: 'environment',
  },
};
/* eslint-disable no-undef */

const startUi = `
  <div class="text-center"><button class="btnStartApp btn btn-large btn-danger text-center rounded-circle mb-5"><i class="fas fa-camera"></i></button></div>
  <p class="text-center"><strong><em>Note: this app uses your phone's camera and you will be asked for permission if this is your first time using the app</em></strong></p>
  <p class="text-center text-muted">This application is 100% accurate 60% of the time</p>
`;

const cameraUi = `
  <button type="button" class="btnTakePhoto btn btn-primary btn-block btn-lg text-center mb-3">Take Photo</button>
  <div class="row">
    <div class="col">
      <div class="results d-none"></div>
      <video class="player img-fluid" controls autoplay></video>
      <canvas class="canvas d-none"></canvas>
      <img class="photo img-fluid d-none" alt="The screen capture will appear in this box.">
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

  if (photoWidth && photoHeight) {
    canvas.width = photoWidth;
    canvas.height = photoHeight;
    context.drawImage(player, 0, 0, photoWidth, photoHeight);
    const data = canvas.toDataURL('image/png');
    photo.setAttribute('src', data);
  } else {
    clearphoto();
  }
}

function clearPhoto() {
  const context = canvas.getContext('2d');
  context.fillStyle = '#aaa';
  context.fillRect(0, 0, canvas.width, canvas.height);
  const data = canvas.toDataURL('image/png');
  photo.setAttribute('src', data);
}

function startCamera() {
  appFrame.innerHTML = cameraUi;

  const player = document.querySelector('.player');
  const canvas = document.querySelector('.canvas');
  const photo = document.querySelector('.photo');
  const results = document.querySelector('.results');
  const btnTakePhoto = document.querySelector('.btnTakePhoto');

  navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
    player.srcObject = stream;
    player.play();
  }).catch((error) => {
    console.error('We have a problem', error);
  });

  player.addEventListener('canplay', () => {
    if (!streaming) {
      canvas.setAttribute('width', photoWidth);
      canvas.setAttribute('height', photoHeight);
      streaming = true;
    }
  }, false);

  btnTakePhoto.addEventListener('click', async (clickEvent) => {
    takePhoto();
    player.srcObject.getVideoTracks().forEach(track => track.stop());
    player.classList.add('d-none');
    photo.classList.remove('d-none');
    results.classList.remove('d-none');
    disableButton('.btnTakePhoto', '<i class="fas fa-sync fa-spin"></i> identifying ...');
    const model1 = await mobilenet.load();
    const model2 = await cocoSsd.load();
    const predictions1 = await model1.classify(photo);
    const predictions2 = await model2.detect(photo);
    const resultsUi = `
    <ol>
      <li class="list-item">${predictions2[0].class} ${Math.round(predictions2[0].score * 100)}%</li>
      <li class="list-item">${predictions1[0].className} ${Math.round(predictions1[0].probability * 100)}%</li>
      <li class="list-item">${predictions1[1].className} ${Math.round(predictions1[1].probability * 100)}%</li>
      <li class="list-item">${predictions1[2].className} ${Math.round(predictions1[2].probability * 100)}%</li>
    </ol>
    <button type="button" class="btnStartOver btn btn-outline-primary btn-block btn-lg text-center mb-2 mt-1">Start Over</button>
    `;
    btnTakePhoto.classList.add('d-none');
    results.innerHTML = resultsUi;
    const btnStartOver = document.querySelector('.btnStartOver');
    // console.log(predictions1);
    // console.log(predictions2);
    btnStartOver.addEventListener('click', () => {
      window.location.reload(true);
    });
  });
}

function outputResults(data1, data2) {
  const newDiv = new Element('div');
}

function initApp() {
  appFrame.innerHTML = startUi;
  const btnStartApp = document.querySelector('.btnStartApp');
  btnStartApp.addEventListener('click', () => {
    startCamera();
  });
}

initApp();
