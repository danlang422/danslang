document.getElementById('year').textContent = new Date().getFullYear();

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
// HERE STORY MODAL
const hereStoryBtn = document.getElementById('hereStoryBtn');
const hereStoryModal = document.getElementById('here-story-modal');
const hereStoryClose = document.getElementById('hereStoryClose');

if (hereStoryBtn && hereStoryModal) {
  hereStoryBtn.addEventListener('click', () => hereStoryModal.showModal());
  hereStoryClose?.addEventListener('click', () => hereStoryModal.close());
  hereStoryModal.addEventListener('click', (e) => {
    if (e.target === hereStoryModal) hereStoryModal.close();
  });
}