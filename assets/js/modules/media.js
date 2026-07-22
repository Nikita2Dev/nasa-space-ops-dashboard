async function loadMediaLibrary(query = 'mars curiosity') {
  const gallery = document.getElementById('mediaGallery');
  const loader = document.getElementById('mediaLoading');

  loader.style.display = 'block';
  gallery.style.display = 'none';

  const url = `https://images-api.nasa.gov/search?q=${encodeURIComponent(query)}&media_type=image`;

  try {
    const data = await apiFetch(url);

    loader.style.display = 'none';
    gallery.style.display = 'grid';
    gallery.innerHTML = '';

    const items = data.collection ? data.collection.items : [];
    if (items.length === 0) {
      gallery.innerHTML = `<p style="color: var(--text-muted); padding: 12px; grid-column: span 12;">No images found for "${query}". Try searching "Hubble", "James Webb", "Apollo", "Jupiter", or "Saturn".</p>`;
      return;
    }

    items.slice(0, 16).forEach(item => {
      const itemData = item.data ? item.data[0] : {};
      const links = item.links || [];
      const thumb = links[0] ? links[0].href : '';

      if (!thumb) return;

      const card = document.createElement('div');
      card.className = 'media-card';
      card.innerHTML = `
        <div class="img-wrapper">
          <img src="${thumb}" alt="${itemData.title || 'NASA Image'}" loading="lazy" decoding="async" onerror="handleImgError(this)" />
        </div>
        <div class="media-card-info">
          <strong>${itemData.title || 'NASA Space Photograph'}</strong>
          <span>
            <svg class="icon-svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            ${itemData.date_created ? itemData.date_created.split('T')[0] : 'NASA Archive'}
          </span>
        </div>
      `;

      card.addEventListener('click', () => {
        openModal(
          itemData.title || 'NASA Space Photograph',
          thumb.replace('~small.jpg', '~orig.jpg').replace('~thumb.jpg', '~medium.jpg'),
          `Center: ${itemData.center || 'NASA'} | Date: ${itemData.date_created ? itemData.date_created.split('T')[0] : 'N/A'}`
        );
      });

      gallery.appendChild(card);
    });

  } catch (err) {
    console.error('Media Library Error:', err);
    loader.style.display = 'none';
    gallery.style.display = 'grid';
    gallery.innerHTML = `<p style="color: var(--danger-red); grid-column: span 12;">Failed to load NASA media results.</p>`;
  }
}

function quickSearch(tag) {
  const searchQuery = document.getElementById('mediaSearchQuery');
  if (searchQuery) searchQuery.value = tag;
  loadMediaLibrary(tag);
}

const btnSearchMedia = document.getElementById('btnSearchMedia');
if (btnSearchMedia) {
  btnSearchMedia.addEventListener('click', () => {
    const q = document.getElementById('mediaSearchQuery').value.trim();
    if (q) loadMediaLibrary(q);
  });
}

const mediaSearchQuery = document.getElementById('mediaSearchQuery');
if (mediaSearchQuery) {
  mediaSearchQuery.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const q = e.target.value.trim();
      if (q) loadMediaLibrary(q);
    }
  });
}
