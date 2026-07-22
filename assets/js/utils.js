function handleImgError(img) {
  img.onerror = null;
  img.src = SVG_FALLBACK;
}

async function apiFetch(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error('HTTP ' + res.status);
  return await res.json();
}

