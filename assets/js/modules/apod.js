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
      if (currentApodData.media_type === 'video') {
        window.open(currentApodData.url, '_blank', 'noopener');
      } else {
        openModal(
          currentApodData.title,
          currentApodData.hdurl || currentApodData.url,
          `Date: ${currentApodData.date} | Copyright: ${currentApodData.copyright || 'NASA Public Domain'}`
        );
      }
    }
  });
}

function formatVideoEmbedUrl(url) {
  if (!url) return null;

  if (url.includes('youtube.com/watch')) {
    try {
      const videoId = new URL(url).searchParams.get('v');
      if (videoId) return `https://www.youtube.com/embed/${videoId}?rel=0`;
    } catch (e) {}
  }

  if (url.includes('youtu.be/')) {
    const videoId = url.split('youtu.be/')[1]?.split('?')[0];
    if (videoId) return `https://www.youtube.com/embed/${videoId}?rel=0`;
  }

  if (url.includes('youtube.com/embed') || url.includes('player.vimeo.com')) {
    return url;
  }

  return null;
}

async function loadAPOD(dateStr = '') {
  document.getElementById('apodLoading').style.display = 'block';
  document.getElementById('apodContent').style.display = 'none';

  let url = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&thumbs=true`;
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

    const btnViewFullHdEl = document.getElementById('btnViewFullHd');
    if (btnViewFullHdEl) {
      btnViewFullHdEl.textContent = data.media_type === 'video' ? 'Watch APOD Video ↗' : 'View High Res';
    }

    const mediaContainer = document.getElementById('apodMediaContainer');

    if (data.media_type === 'video') {
      const embedUrl = formatVideoEmbedUrl(data.url);
      const thumbUrl = data.thumbnail_url || SVG_FALLBACK;

      if (embedUrl) {
        mediaContainer.innerHTML = `<iframe src="${embedUrl}" title="${data.title}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="width:100%; height:100%; border:none;"></iframe>`;
      } else {
        mediaContainer.innerHTML = `
          <div style="position:relative; width:100%; height:100%; display:flex; align-items:center; justify-content:center; background:#030712;">
            <img src="${thumbUrl}" alt="${data.title}" style="width:100%; height:100%; object-fit:cover; opacity:0.8;" onerror="handleImgError(this)" />
            <a href="${data.url}" target="_blank" rel="noopener" class="btn btn-primary" style="position:absolute; gap:8px; box-shadow:0 4px 12px rgba(0,0,0,0.5);">
              <svg class="icon-svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
              Watch Video on APOD ↗
            </a>
          </div>
        `;
      }
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
