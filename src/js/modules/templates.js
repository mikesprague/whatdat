export const startMarkup = `
  <div class="text-center">
    <button class="btnStartApp btn btn-large btn-danger text-center rounded-circle mb-5"><i class="fas fa-camera"></i></button>
  </div>
  <p class="text-center">
    <strong><em>
      NOTE: What Dat?!? uses your devices's camera. You will be asked for permission if this is your first
      time using the app - the app won't work if you don't approve camera access.
    </em></strong>
  </p>
`;

export const startOverButtonMarkup = `
  <button type="button" class="btnStartOver btn btn-outline-primary btn-block btn-lg text-center mb-2 mt-3">Start Over</button>
`;

export const cameraMarkup = `
  <div class="row">
    <div class="col">
      <button type="button" class="btnTakePhoto btn btn-outline-primary btn-block btn-lg text-center mb-3">
        <i class="fal fa-camera"></i> Take Photo
      </button>
      <div class="results d-none mb-2"></div>
      <video class="player img-fluid center" autoplay title="Tap/click to take photo"></video>
      <canvas class="canvas d-none"></canvas>
      <img class="photo img-fluid d-none center" alt="image to identify">
    </div>
  </div>
`;

function getResultsTableMarkup(data) {
  const tableRowMarkup = data.map(prediction => `
    <tr>
      <td>
        ${Math.round(prediction.probability * 100)}%
      </td>
      <td>
        ${prediction.className}
      </td>
    </tr>
  `).join('\n');

  return tableRowMarkup;
}

export function getResultsMarkup(data) {
  const resultsTableMarkup = getResultsTableMarkup(data);
  const firstPrediction = data[0].className.toLowerCase().split(',')[0];
  const startsWithVowel = firstPrediction.split('')[0].search(/[aeiou]/);
  const resultsMarkup = `
    <h2 class="lead-1 text-center">dat might be ${startsWithVowel === -1 ? 'a' : 'an'} ${firstPrediction}!</h2>
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
          ${resultsTableMarkup}
        </tbody>
      </table>
    </details>
    ${startOverButtonMarkup}
    </div>
  `;
  return resultsMarkup;
}
