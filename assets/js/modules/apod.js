let currentApodData = null;
const apodDatePicker = document.getElementById('apodDatePicker');
const todayStr = new Date().toISOString().split('T')[0];

if (apodDatePicker) {
  apodDatePicker.value = todayStr;
  apodDatePicker.max = todayStr;
  apodDatePicker.addEventListener('change', (e) => loadAPOD(e.target.value));
}

const btnApodToday = document.getElementById('btnApodToday');
if (btnApodToday) {
  btnApodToday.addEventListener('click', () => {
    apodDatePicker.value = todayStr;
    loadAPOD(todayStr);
  });
}

const btnApodRandom = document.getElementById('btnApodRandom');
if (btnApodRandom) {
  btnApodRandom.addEventListener('click', () => {
    const start = new Date(1996, 0, 1).getTime();
    const end = new Date().getTime();
    const randomDate = new Date(start + Math.random() * (end - start)).toISOString().split('T')[0];
    apodDatePicker.value = randomDate;
    loadAPOD(randomDate);
  });
}

const btnViewFullHd = document.getElementById('btnViewFullHd');
if (btnViewFullHd) {
  btnViewFullHd.addEventListener('click', () => {
    if (currentApodData) {
      openModal(
        currentApodData.title,
        currentApodData.hdurl || currentApodData.url,
        `Date: ${currentApodData.date} | Copyright: ${currentApodData.copyright || 'NASA Public Domain'}`
      );
    }
  });
}

async function loadAPOD(dateStr = '') {
  document.getElementById('apodLoading').style.display = 'block';
  document.getElementById('apodContent').style.display = 'none';

  let url = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`;
  if (dateStr) url += `&date=${dateStr}`;

  try {
    const data = await apiFetch(url);
    currentApodData = data;

    document.getElementById('statApodTitle').textContent = data.title;
    document.getElementById('statApodDate').textContent = data.date;

    document.getElementById('apodTitle').textContent = data.title;
    document.getElementById('apodDate').textContent = data.date;
    document.getElementById('apodExplanation').textContent = data.explanation || 'No description provided.';
    document.getElementById('apodMediaType').textContent = (data.media_type || 'image').toUpperCase();

    const mediaContainer = document.getElementById('apodMediaContainer');
    if (data.media_type === 'video') {
      mediaContainer.innerHTML = `<iframe src="${data.url}" frameborder="0" allowfullscreen style="width:100%; height:100%; border:none;"></iframe>`;
    } else {
      mediaContainer.innerHTML = `<img id="apodImg" src="${data.url}" alt="${data.title}" loading="lazy" decoding="async" onerror="handleImgError(this)" />`;
    }

    document.getElementById('apodLoading').style.display = 'none';
    document.getElementById('apodContent').style.display = 'grid';
  } catch (err) {
    console.error('APOD Error:', err);
    document.getElementById('apodLoading').innerHTML = `<p style="color: var(--danger-red); padding: 12px;">Failed to load APOD. ${err.message}</p>`;
  }
}
