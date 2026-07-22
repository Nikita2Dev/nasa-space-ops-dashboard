const imageModal = document.getElementById('imageModal');
const modalImg = document.getElementById('modalImg');
const modalTitle = document.getElementById('modalTitle');
const modalSubtext = document.getElementById('modalSubtext');
const modalDownload = document.getElementById('modalDownload');
const btnModalClose = document.getElementById('btnModalClose');

function openModal(title, imgSrc, subtext) {
  modalTitle.textContent = title;
  modalImg.src = imgSrc;
  modalSubtext.textContent = subtext || '';
  modalDownload.href = imgSrc;
  imageModal.classList.add('active');
}

if (btnModalClose) {
  btnModalClose.addEventListener('click', () => {
    imageModal.classList.remove('active');
  });
}

if (imageModal) {
  imageModal.addEventListener('click', (e) => {
    if (e.target === imageModal) {
      imageModal.classList.remove('active');
    }
  });
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && imageModal && imageModal.classList.contains('active')) {
    imageModal.classList.remove('active');
  }
});
