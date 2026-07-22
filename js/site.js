import { signIconMarkup } from './sign-icons.js';
import { renderInfographicPoster } from './infographic-poster.js';
import { applyBubbleText } from './bubble-text.js';

export async function loadJson(path) {
  const res = await fetch(path);
  return res.json();
}

export function initNav() {
  const toggle = document.getElementById('nav-toggle');
  const drawer = document.getElementById('nav-drawer');
  if (!toggle || !drawer) return;

  const close = () => {
    drawer.classList.remove('is-open');
    document.body.classList.remove('nav-open');
    toggle.setAttribute('aria-expanded', 'false');
  };

  toggle.addEventListener('click', () => {
    const open = !drawer.classList.contains('is-open');
    drawer.classList.toggle('is-open', open);
    document.body.classList.toggle('nav-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  drawer.querySelectorAll('a').forEach((a) => a.addEventListener('click', close));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });
}

export function initPopup() {
  const KEY = 'byulbit_v1_popup_20260728';
  const popup = document.getElementById('seminar-popup');
  const backdrop = document.getElementById('popup-backdrop');
  if (!popup || !backdrop) return;

  const setOpen = (open) => {
    popup.classList.toggle('is-open', open);
    backdrop.classList.toggle('is-open', open);
    popup.setAttribute('aria-hidden', open ? 'false' : 'true');
    document.body.classList.toggle('popup-open', open);
  };

  const dismissed = () => {
    try {
      const until = localStorage.getItem(KEY);
      return until && Date.now() < parseInt(until, 10);
    } catch { return false; }
  };

  document.getElementById('popup-close')?.addEventListener('click', () => setOpen(false));
  backdrop.addEventListener('click', () => setOpen(false));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && popup.classList.contains('is-open')) setOpen(false);
  });
  document.getElementById('popup-today')?.addEventListener('click', () => {
    try {
      const end = new Date();
      end.setHours(23, 59, 59, 999);
      localStorage.setItem(KEY, String(end.getTime()));
    } catch {}
    setOpen(false);
  });

  if (!dismissed()) setTimeout(() => setOpen(true), 800);
}

export function renderSignCards(signs, container) {
  container.innerHTML = signs.map((s) => {
    const thumbInner = s.thumb
      ? `<img src="${s.thumb}" alt="${s.nameKo} 썸네일" loading="lazy" />`
      : signIconMarkup(s.id, s.color);
    return `
    <a class="card sign-card" href="/sign?id=${s.id}" style="--accent:${s.color}">
      <div class="thumb thumb--img sign-card__thumb">${thumbInner}</div>
      <div class="card-top">
        <span class="card-sym" aria-hidden="true">${signIconMarkup(s.id, s.color)}</span>
        <h3 class="sign-card__title-row">
          <span class="sign-card__name" data-name="${s.nameKo}"></span>
          <span class="sign-card__period">${s.period}</span>
        </h3>
      </div>
      <p>${s.summary}</p>
      <div class="card-more">자세히 읽기</div>
    </a>`;
  }).join('');

  container.querySelectorAll('.sign-card__name').forEach((el) => {
    const card = el.closest('.sign-card');
    const accent = card?.style.getPropertyValue('--accent') || '#6ec8c8';
    applyBubbleText(el, el.dataset.name || '', accent.trim(), { size: 'sign' });
  });
}

export function renderInfographics(items, details, container, quizByInfoId = {}) {
  container.innerHTML = items.map((item) => {
    const thumbInner = item.thumb
      ? `<img src="${item.thumb}" alt="${item.title} 썸네일" loading="lazy" />`
      : renderInfographicPoster(item, details[item.id], { compact: true });
    const quiz = quizByInfoId[item.id];
    const quizLink = quiz
      ? `<a class="info-card__quiz" href="/tools/${quiz.slug}">지식 퀴즈</a>`
      : item.quizSlug
        ? `<a class="info-card__quiz" href="/tools/${item.quizSlug}">탐구 시작</a>`
        : '';
    return `
    <article class="card info-card">
      <a class="info-card__main" href="/infographic?id=${item.id}">
        <div class="thumb thumb--img">${thumbInner}</div>
        <div class="card-period">${item.date}</div>
        <h3>${item.title}</h3>
        <p>${item.teaser}</p>
      </a>
      <div class="info-card__actions">
        <a class="card-more" href="/infographic?id=${item.id}">인포그래픽 보기</a>
        ${quizLink}
      </div>
    </article>`;
  }).join('');
}