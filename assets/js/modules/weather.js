async function loadWeather() {
  const url = `https://api.nasa.gov/DONKI/notifications?type=all&api_key=${API_KEY}`;
  try {
    const data = await apiFetch(url);

    document.getElementById('weatherLoading').style.display = 'none';
    document.getElementById('statWeatherCount').textContent = `${data.length} Active`;

    const weatherList = document.getElementById('weatherList');
    weatherList.innerHTML = '';

    if (!data || data.length === 0) {
      weatherList.innerHTML = `<p style="font-size:13px; color: var(--text-muted);">No space weather alerts reported recently.</p>`;
      return;
    }

    data.slice(0, 6).forEach(item => {
      const div = document.createElement('div');
      div.className = 'donki-item';

      let badgeClass = 'badge-info';
      if (item.messageType.includes('FLR') || item.messageType.includes('CME')) badgeClass = 'badge-warning';
      if (item.messageType.includes('SEP') || item.messageType.includes('GST')) badgeClass = 'badge-danger';

      div.innerHTML = `
        <div class="donki-header">
          <span class="donki-type">
            <svg class="icon-svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
            ${item.messageType}
          </span>
          <span class="badge ${badgeClass}">${item.messageID || 'ALERT'}</span>
        </div>
        <div class="donki-time">
          <svg class="icon-svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          ${item.messageIssueTime}
        </div>
        <div class="donki-body">${item.messageBody ? item.messageBody.substring(0, 180) + '...' : 'No detailed body text available.'}</div>
      `;
      weatherList.appendChild(div);
    });

  } catch (err) {
    console.error('Weather Error:', err);
    document.getElementById('weatherLoading').innerHTML = `<p style="color: var(--danger-red);">Failed to load space weather alerts.</p>`;
  }
}
