const tabButtons = document.querySelectorAll('.nav-tab');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const targetTab = btn.getAttribute('data-tab');
    
    tabButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

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

document.addEventListener('DOMContentLoaded', () => {
  loadAPOD();
  loadNEO();
  loadWeather();
  loadEPIC();
  loadEONET();
  loadMediaLibrary('mars curiosity');
});
