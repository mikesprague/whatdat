// import * as mobilenet from '@tensorflow-models/mobilenet';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import * as templates from './templates';
import * as ui from './ui';

export function clearPhoto() {
  const canvas = document.querySelector('.canvas');
  const context = canvas.getContext('2d');
  context.fillStyle = '#aaa';
  context.fillRect(0, 0, canvas.width, canvas.height);
  const data = canvas.toDataURL('image/png');
  const photo = document.querySelector('.photo');
  photo.setAttribute('src', data);
}

export function takePhoto() {
  const canvas = document.querySelector('.canvas');
  const photo = document.querySelector('.photo');
  const player = document.querySelector('.player');
  const context = canvas.getContext('2d');
  const playerWidth = player.offsetWidth;
  const playerHeight = player.offsetHeight;

  canvas.width = playerWidth;
  canvas.height = playerHeight;
  context.drawImage(player, 0, 0, playerWidth, playerWidth * playerHeight / playerWidth);
  const data = canvas.toDataURL('image/png');
  photo.setAttribute('src', data);
  photo.setAttribute('style', 'width: 100%; height: auto;');
}

export function stopVideoCamera(videoPlayerSelector) {
  const videoPlayer = document.querySelector(videoPlayerSelector);
  videoPlayer.srcObject.getVideoTracks().forEach(track => track.stop());
}

export async function startCamera() {
  ui.populateElementWithMarkup('.app', templates.cameraMarkup);

  let streaming = false;

  try {
    const player = document.querySelector('.player');
    const mediaDeviceConstraints = {
      audio: false,
      video: {
        facingMode: 'environment',
      },
    };
    const userMediaStream = await navigator.mediaDevices.getUserMedia(mediaDeviceConstraints);
    player.srcObject = userMediaStream;
    player.play();
    player.setAttribute('style', 'width: 100%; height: auto;');
  } catch (error) {
    /* eslint-disable no-undef */
    bugsnagClient.notify(error);
    /* eslint-enable no-undef */
  }

  const takePhotoClickHandler = async () => {
    takePhoto();

    stopVideoCamera('.player');
    ui.hideElement('.player');
    ui.showElement('.photo');
    ui.showElement('.results');
    ui.disableButton('.btnTakePhoto', '<i class="fas fa-sync fa-spin"></i> identifying ...');

    try {
      const photo = document.querySelector('.photo');
      // const model = await mobilenet.load(1, 1.0);
      // const predictions = await model.classify(photo, 10);

      const model = await cocoSsd.load('mobilenet_v2');
      const predictions = await model.detect(photo);
      const prediction = predictions[0];
      const canvas = document.querySelector('.canvas');
      const context = canvas.getContext('2d');
      const resultsMarkup = templates.getResultsMarkup(predictions);

      ui.hideElement('.photo');
      ui.showElement('.canvas');
      context.beginPath();
      context.rect(prediction.bbox[0], prediction.bbox[1], prediction.bbox[2], prediction.bbox[3]);
      context.strokeStyle = 'rgb(0, 0, 0)';
      context.stroke();
      context.fillStyle = 'rgba(255, 255, 255, 0.25)';
      context.fill();
      context.strokeStyle = 'rgb(255, 0, 0)';
      context.stroke();

      ui.hideElement('.btnTakePhoto');
      ui.populateElementWithMarkup('.results', resultsMarkup);
      ui.initElementEventHandler('.btnStartOver', 'click', startCamera);
    } catch (error) {
      /* eslint-disable no-undef */
      bugsnagClient.notify(error);
      /* eslint-enable no-undef */
    }
  };

  ui.initElementEventHandler('.player', 'canplay', () => {
    const player = document.querySelector('.player');
    const canvas = document.querySelector('.canvas');
    if (!streaming) {
      canvas.setAttribute('width', player.offsetWidth);
      canvas.setAttribute('height', player.offsetHeight);
      streaming = true;
    }
  });
  ui.initElementEventHandler('.btnTakePhoto', 'click', takePhotoClickHandler);
  ui.initElementEventHandler('.player', 'click', takePhotoClickHandler);
}
