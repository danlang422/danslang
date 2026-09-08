const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

const glassesWrap = document.getElementById('glassesWrap');
const speechBubble = document.getElementById('speechBubble');

if (glassesWrap && speechBubble) {
  let bubbleTimer;
  glassesWrap.addEventListener('mouseenter', () => {
    bubbleTimer = setTimeout(() => {
      speechBubble.classList.add('speech-bubble--pop');
      speechBubble.hidden = false;
    }, 650);
  });
  glassesWrap.addEventListener('mouseleave', () => {
    clearTimeout(bubbleTimer);
    speechBubble.hidden = true;
    speechBubble.classList.remove('speech-bubble--pop');
  });
  glassesWrap.addEventListener('click', () => {
    speechBubble.classList.add('speech-bubble--pop');
    speechBubble.hidden = false;
  });
}

// CASE STUDY IMAGE LIGHTBOX
const lightbox = document.getElementById('image-lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');

if (lightbox && lightboxImg) {
  document.querySelectorAll('.post-body img').forEach((img) => {
    img.addEventListener('click', () => {
      lightboxImg.src = img.currentSrc || img.src;
      lightboxImg.alt = img.alt || '';
      lightbox.showModal();
    });
  });

  lightboxClose?.addEventListener('click', () => lightbox.close());
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) lightbox.close();
  });
}