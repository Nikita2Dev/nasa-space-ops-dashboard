async function loadEONET() {
  const url = `https://eonet.gsfc.nasa.gov/api/v3/events?limit=8`;
  try {
    const data = await apiFetch(url);

    document.getElementById('eonetLoading').style.display = 'none';
    const events = data.events || [];
    document.getElementById('statEonetCount').textContent = events.length;

    const list = document.getElementById('eonetList');
    list.innerHTML = '';

    if (events.length === 0) {
      list.innerHTML = `<p style="font-size:12px; color: var(--text-muted);">No active Earth hazard events reported.</p>`;
      return;
    }

    events.forEach(ev => {
      const cat = ev.categories[0] ? ev.categories[0].title : 'Natural Event';
      const dateStr = ev.geometry && ev.geometry[0] ? ev.geometry[0].date.split('T')[0] : 'Recent';

      const item = document.createElement('div');
      item.className = 'eonet-item';
      item.innerHTML = `
        <div class="eonet-item-info">
          <h4>${ev.title}</h4>
          <p>
            <svg class="icon-svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            ${cat} &bull; Date: ${dateStr}
          </p>
        </div>
        <span class="badge badge-warning">${cat}</span>
      `;
      list.appendChild(item);
    });

  } catch (err) {
    console.error('EONET Error:', err);
    document.getElementById('eonetLoading').innerHTML = `<p style="color: var(--danger-red);">Failed to load Earth events.</p>`;
  }
}
