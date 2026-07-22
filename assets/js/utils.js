function handleImgError(img) {
  img.onerror = null;
  img.src = SVG_FALLBACK;
}

async function apiFetch(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error('HTTP ' + res.status);
  return await res.json();
}

function updateClock() {
  const now = new Date();
  const utcString = now.toUTCString().replace("GMT", "UTC");
  const clockEl = document.getElementById("utcClock");
  if (clockEl) clockEl.textContent = utcString;
}
setInterval(updateClock, 1000);
updateClock();
