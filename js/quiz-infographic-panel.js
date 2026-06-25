import { renderInfographicPoster } from './infographic-poster.js';

export function renderQuizVisualFigure(resolved, { priority = 'auto' } = {}) {
  if (!resolved) return '';

  const fetchAttr = priority === 'high' ? 'fetchpriority="high"' : '';
  const loading = priority === 'high' ? 'eager' : 'lazy';
  const srcset = resolved.srcset
    ? Object.entries(resolved.srcset)
        .map(([w, url]) => `${url} ${w}`)
        .join(', ')
    : '';
  const sizes = srcset ? 'sizes="(max-width: 520px) 100vw, 720px"' : '';

  return `
    <figure class="quiz-visual" style="--quiz-accent:${resolved.accent || 'var(--violet)'}">
      <img src="${resolved.src}" ${srcset ? `srcset="${srcset}" ${sizes}` : ''}
        alt="${resolved.alt}" loading="${loading}" decoding="async" ${fetchAttr} />
      ${resolved.caption ? `<figcaption class="quiz-visual__caption">${resolved.caption}</figcaption>` : ''}
    </figure>`;
}

export function renderSectionPanel(section, detail, infoItem, { thumb = true } = {}) {
  const sky = detail?.sky?.[section.skyIdx] || '';
  const zodiac = detail?.zodiac?.[section.zodiacIdx] || '';
  const thumbHtml =
    thumb && infoItem?.thumb
      ? `<img class="quiz-section-panel__thumb" src="${infoItem.thumb}" alt="" loading="lazy" />`
      : '';

  return `
    <div class="quiz-section-panel" style="--quiz-accent:${infoItem?.color || 'var(--violet)'}">
      ${thumbHtml}
      <p class="quiz-section-panel__label">${section.title}</p>
      ${sky ? `<p class="quiz-section-panel__sky"><span>하늘</span> ${sky}</p>` : ''}
      ${zodiac ? `<p class="quiz-section-panel__zodiac"><span>별자리·심리</span> ${zodiac}</p>` : ''}
      <p class="quiz-section-panel__hint">다음 문항은 이 맥락을 기준으로 합니다.</p>
      <button type="button" class="btn btn-gold" id="section-continue">다음 문항으로</button>
    </div>`;
}

export function renderIntroPanel(infoItem, detail, disclaimer) {
  const poster = renderInfographicPoster(infoItem, detail, { compact: true });
  const thumb = infoItem.thumb
    ? `<img class="quiz-intro-card__thumb" src="${infoItem.thumb}" alt="${infoItem.title} 썸네일" loading="eager" fetchpriority="high" />`
    : '';

  return `
    <div class="quiz-intro-card" style="--quiz-accent:${infoItem.color}">
      ${thumb}
      <div class="quiz-intro-card__poster">${poster}</div>
      <p class="quiz-intro-card__teaser">${infoItem.teaser}</p>
      <p class="disclaimer" style="margin-top:0.75rem;border:none;padding:0;">${disclaimer}</p>
      <div class="tool-actions">
        <button type="button" class="btn btn-gold" id="quiz-start">탐구 시작</button>
        <a class="btn btn-ghost" href="/infographic?id=${infoItem.id}">한 장 카드 먼저 보기</a>
      </div>
    </div>`;
}

export function renderResultEmbed(infoItem, detail) {
  const questions = (detail?.questions || [])
    .map((q, i) => `<li>${i + 1}. ${q}</li>`)
    .join('');
  const thumb = infoItem.thumb
    ? `<img class="quiz-result-embed__thumb" src="${infoItem.thumb}" alt="" loading="lazy" />`
    : '';

  return `
    <div class="quiz-result-embed" style="--quiz-accent:${infoItem.color}">
      ${thumb}
      <h3 style="font-family:var(--font-serif);font-size:1.05rem;margin:0.5rem 0;">${infoItem.title}</h3>
      <p style="font-size:0.82rem;color:var(--muted);margin-bottom:0.65rem;">인포그래픽 탐구 질문</p>
      <ul class="sign-questions">${questions}</ul>
    </div>`;
}