/**
 * AnimatedText (framer-motion) → vanilla port
 */

export function applyAnimatedText(el, text, accent = '#6ec8c8', options = {}) {
  if (!el) return;

  const {
    duration = 4,
    hoverEffect = true,
    size = 'hero',
    dark = '#141820',
    highlight = '#f4f2fa',
    gold = '#ffd84d',
  } = options;

  el.textContent = text;
  el.classList.add('animated-text', `animated-text--${size}`);
  if (hoverEffect) el.classList.add('animated-text--hover');

  const gradient = `linear-gradient(90deg, ${dark}, ${accent}, ${gold}, ${highlight}, ${accent}, ${dark})`;
  el.style.setProperty('--hero-grad', gradient);
  el.style.setProperty('--hero-grad-duration', `${duration}s`);
}

/** @deprecated use applyAnimatedText — kept for hero call sites */
export function applyAnimatedHeroText(el, text, accent, options = {}) {
  applyAnimatedText(el, text, accent, { ...options, size: 'hero' });
}