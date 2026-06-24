document.getElementById('year').textContent = new Date().getFullYear();

const glassesWrap = document.getElementById('glassesWrap');
const speechBubble = document.getElementById('speechBubble');

if (glassesWrap && speechBubble) {
  glassesWrap.addEventListener('mouseenter', () => { speechBubble.hidden = false; });
  glassesWrap.addEventListener('mouseleave', () => { speechBubble.hidden = true; });
  glassesWrap.addEventListener('click', () => { speechBubble.hidden = false; });
}
