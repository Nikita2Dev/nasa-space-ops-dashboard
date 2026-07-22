let epicImagesCache = [];
let epicPreloadMap = new Map();
let epicCurrentIdx = 0;
let epicPlayInterval = null;

const epicTypeSelect = document.getElementById('epicTypeSelect');
const epicTimelineSlider = document.getElementById('epicTimelineSlider');
const btnEpicPlay = document.getElementById('btnEpicPlay');
const epicSpeedSelect = document.getElementById('epicSpeedSelect');

if (epicTypeSelect) {
  epicTypeSelect.addEventListener('change', () => loadEPIC());
}

async function loadEPIC() {
  const type = epicTypeSelect ? epicTypeSelect.value : 'natural';
  const url = `https://api.nasa.gov/EPIC/api/${type}?api_key=${API_KEY}`;
  
  document.getElementById('epicLoading').style.display = 'block';
  document.getElementById('epicContent').style.display = 'none';

  stopEpicPlay();

  try {
    const data = await apiFetch(url);

    if (!data || data.length === 0) throw new Error('No EPIC frames returned');

    epicImagesCache = data;
    epicCurrentIdx = 0;

    if (epicTimelineSlider) {
      epicTimelineSlider.max = data.length - 1;
      epicTimelineSlider.value = 0;
    }

    document.getElementById('epicLoading').style.display = 'none';
    document.getElementById('epicContent').style.display = 'flex';
    document.getElementById('statEpicDate').textContent = `${data.length} Frames`;

    preloadEpicImages(type);
    renderEpicFrame(type);
  } catch (err) {
    console.error('EPIC Error:', err);
    document.getElementById('epicLoading').innerHTML = `<p style="color: var(--danger-red);">Failed to load EPIC Earth frames.</p>`;
  }
}

function preloadEpicImages(type) {
  epicPreloadMap.clear();
  epicImagesCache.forEach(frame => {
    const dateParts = frame.date.split(" ")[0].replaceAll("-", "/");
    const imgUrl = `https://api.nasa.gov/EPIC/archive/${type}/${dateParts}/png/${frame.image}.png?api_key=${API_KEY}`;
    const img = new Image();
    img.decoding = 'async';
    img.src = imgUrl;
    epicPreloadMap.set(frame.image, img);
  });
}

function renderEpicFrame(type = epicTypeSelect ? epicTypeSelect.value : 'natural') {
  if (epicImagesCache.length === 0) return;
  const current = epicImagesCache[epicCurrentIdx];

  const dateParts = current.date.split(" ")[0].replaceAll("-", "/");
  const imgUrl = `https://api.nasa.gov/EPIC/archive/${type}/${dateParts}/png/${current.image}.png?api_key=${API_KEY}`;

  const epicImgEl = document.getElementById('epicImg');
  if (epicImgEl) epicImgEl.src = imgUrl;

  const frameCounter = document.getElementById('epicFrameCounter');
  if (frameCounter) frameCounter.textContent = `${epicCurrentIdx + 1} / ${epicImagesCache.length}`;
  if (epicTimelineSlider) epicTimelineSlider.value = epicCurrentIdx;

  const coords = current.centroid_coordinates || { lat: 0, lon: 0 };
  const latStr = coords.lat > 0 ? `${coords.lat.toFixed(2)}°N` : `${Math.abs(coords.lat).toFixed(2)}°S`;
  const lonStr = coords.lon > 0 ? `${coords.lon.toFixed(2)}°E` : `${Math.abs(coords.lon).toFixed(2)}°W`;
  
  document.getElementById('hudCoords').textContent = `Lat: ${latStr}, Lon: ${lonStr}`;
  document.getElementById('hudTime').textContent = current.date.split(" ")[1] || '';

  document.getElementById('epicCoords').textContent = `${latStr}, ${lonStr}`;
  document.getElementById('epicDate').textContent = current.date;
}

if (epicTimelineSlider) {
  epicTimelineSlider.addEventListener('input', (e) => {
    epicCurrentIdx = parseInt(e.target.value, 10);
    renderEpicFrame();
  });
}

function startEpicPlay() {
  if (epicPlayInterval) clearInterval(epicPlayInterval);
  const speed = parseInt(epicSpeedSelect ? epicSpeedSelect.value : '500', 10) || 500;
  if (btnEpicPlay) {
    btnEpicPlay.innerHTML = `
      <svg class="icon-svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
      Pause
    `;
    btnEpicPlay.classList.replace('btn-primary', 'btn-outline');
  }
  
  epicPlayInterval = setInterval(() => {
    epicCurrentIdx = (epicCurrentIdx + 1) % epicImagesCache.length;
    renderEpicFrame();
  }, speed);
}

function stopEpicPlay() {
  if (epicPlayInterval) {
    clearInterval(epicPlayInterval);
    epicPlayInterval = null;
  }
  if (btnEpicPlay) {
    btnEpicPlay.innerHTML = `
      <svg class="icon-svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
      Play Globe
    `;
    btnEpicPlay.classList.replace('btn-outline', 'btn-primary');
  }
}

if (btnEpicPlay) {
  btnEpicPlay.addEventListener('click', () => {
    if (epicPlayInterval) {
      stopEpicPlay();
    } else {
      startEpicPlay();
    }
  });
}

if (epicSpeedSelect) {
  epicSpeedSelect.addEventListener('change', () => {
    if (epicPlayInterval) startEpicPlay();
  });
}

const btnEpicPrev = document.getElementById('btnEpicPrev');
if (btnEpicPrev) {
  btnEpicPrev.addEventListener('click', () => {
    stopEpicPlay();
    if (epicImagesCache.length === 0) return;
    epicCurrentIdx = (epicCurrentIdx - 1 + epicImagesCache.length) % epicImagesCache.length;
    renderEpicFrame();
  });
}

const btnEpicNext = document.getElementById('btnEpicNext');
if (btnEpicNext) {
  btnEpicNext.addEventListener('click', () => {
    stopEpicPlay();
    if (epicImagesCache.length === 0) return;
    epicCurrentIdx = (epicCurrentIdx + 1) % epicImagesCache.length;
    renderEpicFrame();
  });
}
