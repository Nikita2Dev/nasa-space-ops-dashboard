const tabButtons = document.querySelectorAll('.nav-tab');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const targetTab = btn.getAttribute('data-tab');
    
    tabButtons.forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');

    tabContents.forEach(content => {
      const supportedTabs = content.getAttribute('data-tab-content').split(' ');
      if (targetTab === 'overview' || supportedTabs.includes(targetTab)) {
        content.style.display = 'flex';
      } else {
        content.style.display = 'none';
      }
    });
  });
});

function updateUtcClock() {
  const clockEl = document.getElementById('utcClock');
  if (clockEl) {
    const now = new Date();
    const timeStr = now.toISOString().substring(11, 19);
    clockEl.textContent = `UTC ${timeStr}`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  updateUtcClock();
  setInterval(updateUtcClock, 1000);

  loadAPOD();
  loadNEO();
  loadWeather();
  loadEPIC(30);
  loadEONET();
  loadMediaLibrary('mars curiosity');
});
