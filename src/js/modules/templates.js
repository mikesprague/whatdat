export const startMarkup = `
  <div class="text-center">
    <button class="btnStartApp btn btn-lg btn-danger mb-5 mt-5"><i class="fad fa-camera"></i> Start</button>
  </div>
  <p class="text-center">
    <em>
      <strong>PLEASE NOTE:</strong> What Dat?!? uses your devices's camera. You will
      be asked for permission if this is your first time using the app - this app
      will NOT work if you don't approve camera access.
    </em>
  </p>
`;

export const startOverButtonMarkup = `
  <div class="d-grid gap-2">
    <button type="button" class="btnStartOver btn btn-outline-primary w-100 btn-lg text-center mb-2 mt-3">
      Start Over
    </button>
  </div>
`;

export const cameraMarkup = `
  <div class="row">
    <div class="col">
      <div class="toggleModeSwitch checkbox switcher text-center">
        <label for="toggleMode">
          <small class="imageClassificationText text-muted">Image Classification&nbsp;&nbsp;&nbsp;&nbsp;</small>
          <input type="checkbox" id="toggleMode" value="objectDetection" checked>
          <span><small></small></span>
          <small class="objectDetectionText font-weight-bolder">Object Detection</small>
        </label>
      </div>
      <div class="d-grid gap-2">
        <button type="button" class="btnTakePhoto btn btn-outline-primary btn-lg text-center mb-3 mt-3 w-100">
          <i class="fad fa-fw fa-camera"></i> Take Photo
        </button>
      </div>
      <div class="results d-none mb-2"></div>
      <video class="player img-fluid center" autoplay title="Tap/click to take photo"></video>
      <div class="canvas-wrapper">
        <canvas class="canvas d-none"></canvas>
      </div>
      <img class="photo img-fluid d-none center" alt="image to identify">
    </div>
  </div>
`;

function getResultsTableMarkup(data, isMobilenet = false) {
  let tableRowMarkup = '';
  if (isMobilenet) {
    tableRowMarkup = data.map((prediction) => `
      <tr class="objectPrediction" data-bbox="">
        <td>
          ${prediction.className}
        </td>
        <td>
          ${Math.round(prediction.probability * 100)}%
        </td>
      </tr>
    `).join('\n');
  } else {
    tableRowMarkup = data.length ? data.map((prediction) => `
      <tr class="objectPrediction" data-bbox="${prediction.bbox.join()}">
        <td>
          ${prediction.class}
        </td>
        <td>
          ${Math.round(prediction.score * 100)}%
        </td>
      </tr>
    `).join('\n') : '';
  }

  return tableRowMarkup;
}

export function getNoResultsMarkup(detectionMode) {
  const noResultsString = detectionMode === 'objectDetection'
    ? 'Sorry, unable to identify any objects'
    : 'Sorry, unable to classify image';
  const noResultsMarkup = `
    <h3 class="lead-1 text-center">${noResultsString}</h3>
    <div class="center">
      ${startOverButtonMarkup}
    </div>
  `;

  return noResultsMarkup;
}

export function getResultsMarkup(data, isMobilenet = false) {
  const resultsTableMarkup = getResultsTableMarkup(data, isMobilenet);
  const firstPrediction = `${isMobilenet ? data[0].className.toLowerCase().split(', ')[0] : data[0].class.toLowerCase()}`;
  const startsWithVowel = firstPrediction.split('')[0].search(/[aeiou]/);
  const resultsMarkup = `
    <h2 class="lead-1 text-center">
      ${isMobilenet ? 'dat might be' : "dat's"} ${startsWithVowel === -1 ? 'a' : 'an'} ${firstPrediction}!
    </h2>
    <div class="center">
    <details>
      <summary class="text-muted text-center">
        All ${isMobilenet ? 'classifications' : 'objects identified'}
      </summary>
      <table class="table table-striped table-bordered table-hover">
        <thead>
          <tr>
            <th scope="col">Object</th>
            <th scope="col">Confidence Score</th>
          </tr>
        </thead>
        <tbody>
          ${resultsTableMarkup}
        </tbody>
      </table>
    </details>
    ${startOverButtonMarkup}
    </div>
  `;
  return resultsMarkup;
}
