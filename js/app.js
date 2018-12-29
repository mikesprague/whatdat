const player = document.querySelector('.player');
const canvas = document.querySelector('.canvas');
const photo = document.querySelector('.photo');
const btnTakePhoto = document.querySelector('.btnTakePhoto');
const photoWidth = 512;

let photoHeight = 0;
let streaming = false;

/* eslint-disable no-undef */
const constraints = {
  audio: false,
  video: {
    facingMode: 'environment',
  },
};
/* eslint-disable no-undef */

console.log(navigator.mediaDevices);

function startCamera() {
  navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
    player.srcObject = stream;
    player.play();
  }).catch((error) => {
    console.error('We have a problem', error);
  });
}

player.addEventListener('canplay', () => {
  if (!streaming) {
    photoHeight = player.videoHeight / (player.videoWidth / photoWidth);
    player.setAttribute('width', photoWidth);
    player.setAttribute('height', photoHeight);
    canvas.setAttribute('width', photoWidth);
    canvas.setAttribute('height', photoHeight);
    console.log(photoHeight, photoWidth);
    streaming = true;
  }
}, false);

function takePhoto() {
  const context = canvas.getContext('2d');
  if (photoWidth && photoHeight) {
    canvas.width = photoWidth;
    canvas.height = photoHeight;
    context.drawImage(player, 0, 0, photoWidth, photoHeight);
    const data = canvas.toDataURL('image/png');
    photo.setAttribute('src', data);
    // photo.removeAttribute('hidden');
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

btnTakePhoto.addEventListener('click', async (clickEvent) => {
  takePhoto();
  const model1 = await mobilenet.load();
  const predictions1 = await model1.classify(photo);
  console.table(predictions1);
  const model2 = await cocoSsd.load();
  const predictions2 = await model2.detect(photo);
  console.table(predictions2);
});

startCamera();
