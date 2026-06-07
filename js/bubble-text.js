/** BubbleText — 글자 호버 시 거리별 굵기·색 변화 (React 포트) */

const DISTANCE_CLASS = {
  0: 'bubble-text__char--d0',
  1: 'bubble-text__char--d1',
  2: 'bubble-text__char--d2',
};

export function applyBubbleText(el, text, accent = '#6ec8c8', options = {}) {
  if (!el) return;

  const { size = 'hero' } = options;
  const tokens = text.match(/\S+|\s+/g) || [];

  el.textContent = '';
  el.classList.add('bubble-text', `bubble-text--${size}`);
  el.style.setProperty('--bubble-accent', accent);

  let hoveredIndex = null;
  const spans = [];
  let charIndex = 0;

  tokens.forEach((token) => {
    const isSpace = /^\s+$/.test(token);
    const wordWrap = document.createElement('span');
    wordWrap.className = isSpace ? 'bubble-text__space' : 'bubble-text__word';

    [...token].forEach((char) => {
      const span = document.createElement('span');
      span.className = 'bubble-text__char bubble-text__char--base';
      span.textContent = char === ' ' ? '\u00A0' : char;
      const idx = charIndex;
      span.addEventListener('mouseenter', () => {
        hoveredIndex = idx;
        paint();
      });
      wordWrap.appendChild(span);
      spans.push(span);
      charIndex += 1;
    });

    el.appendChild(wordWrap);
  });

  el.addEventListener('mouseleave', () => {
    hoveredIndex = null;
    paint();
  });

  function paint() {
    spans.forEach((span, idx) => {
      const distance = hoveredIndex !== null ? Math.abs(hoveredIndex - idx) : null;
      span.className = 'bubble-text__char bubble-text__char--base';
      if (distance !== null && DISTANCE_CLASS[distance]) {
        span.classList.add(DISTANCE_CLASS[distance]);
      }
    });
  }
}