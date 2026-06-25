/** 행성 거울 탐구, 목적·8행성 인포그래픽 렌더 */

const SIGN_NAMES = {
  aries: '양자리',
  taurus: '황소자리',
  gemini: '쌍둥이자리',
  cancer: '게자리',
  leo: '사자자리',
  virgo: '처녀자리',
  libra: '천칭자리',
  scorpio: '전갈자리',
  sagittarius: '사수자리',
  capricorn: '염소자리',
  aquarius: '물병자리',
  pisces: '물고기자리',
};

function li(items) {
  return (items || []).map((t) => `<li>${t}</li>`).join('');
}

function archetypeChips(archetype) {
  return (archetype || '')
    .split('·')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => `<span class="planet-card__chip">${s}</span>`)
    .join('');
}

function renderPlanetCard(key, p) {
  const signs = (p.relatedSigns || [])
    .map((id) => `<a class="planet-card__sign" href="/sign?id=${id}">${SIGN_NAMES[id] || id}</a>`)
    .join('');
  const q = (p.exploreQuestions || [])[0] || '';

  return `
    <article class="planet-card" style="--planet:${p.color}" aria-labelledby="planet-${key}">
      <div class="planet-card__visual" aria-hidden="true">
        <span class="planet-card__orb" style="background:radial-gradient(circle at 35% 30%, color-mix(in srgb, ${p.color} 95%, white), color-mix(in srgb, ${p.color} 40%, #0a0a12))"></span>
        <span class="planet-card__symbol" style="color:${p.color}">${p.symbol}</span>
      </div>
      <header class="planet-card__head">
        <h3 id="planet-${key}"><span style="color:${p.color}">${p.symbol}</span> ${p.name}</h3>
        <div class="planet-card__chips">${archetypeChips(p.archetype)}</div>
      </header>
      <p class="planet-card__sky"><strong>하늘에서</strong> ${p.astronomy}</p>
      ${p.skyColorFact ? `
      <p class="planet-card__color">
        <strong>색 · 천문</strong>
        ${p.skyColorLabel ? `<span class="planet-card__color-label">${p.skyColorLabel}</span>. ` : ''}
        ${p.skyColorFact}
      </p>
      ${p.hueNote ? `<p class="planet-card__hue-note">${p.hueNote}</p>` : ''}` : ''}
      <div class="sign-duality planet-card__duality">
        <div class="sign-duality__col">
          <p><strong style="color:${p.color}">빛</strong> ${p.gift}</p>
        </div>
        <div class="sign-duality__col">
          <p><strong>그림자</strong> ${p.shadow}</p>
        </div>
      </div>
      ${signs ? `<p class="planet-card__signs">별자리 울림 ${signs}</p>` : ''}
      ${q ? `<p class="planet-card__q">「${q}」</p>` : ''}
    </article>`;
}

export function renderPlanetMirrorInfographic(meta, copy, { heroImage } = {}) {
  const planets = meta.order.map((key) => renderPlanetCard(key, meta.planets[key])).join('');
  const hero = heroImage
    ? `<img class="info-detail-img planet-mirror-hero" src="${heroImage}" alt="행성 거울 탐구. 8행성이 맥락이 되는 심리 거울" />`
    : '';

  return `
    ${hero}
    <article class="info-poster planet-mirror-purpose" style="--accent:#ffd84d">
      <header class="info-poster__head">
        <span class="info-poster__lab">별빛연구소</span>
        <span class="info-poster__badge">행성 거울 · 탐구 카드</span>
      </header>
      <h2 class="info-poster__title">${copy.purposeTitle}</h2>
      <p class="planet-mirror-lead">${copy.purposeLead}</p>
      <ul class="planet-mirror-bullets">${li(copy.purposeBullets)}</ul>
      <footer class="info-poster__foot">하늘은 맥락, 거울은 마음 · 점술이 아닌 자기이해용</footer>
    </article>

    <section class="planet-mirror-section">
      <p class="section-label">How it works</p>
      <h2 class="planet-mirror-h2">탐구 흐름</h2>
      <ol class="planet-flow">${(copy.flowSteps || []).map((s) => `<li>${s}</li>`).join('')}</ol>
    </section>

    <section class="planet-mirror-section">
      <p class="section-label">What you learn</p>
      <h2 class="planet-mirror-h2">이 탐구가 알려 주는 것</h2>
      <ul class="planet-learn">${li(copy.whatYouLearn)}</ul>
    </section>

    <section class="planet-mirror-section">
      <p class="section-label">Eight Mirrors</p>
      <h2 class="planet-mirror-h2">8행성 거울</h2>
      <p class="section-lead" style="margin-bottom:1rem;">각 행성은 천문 한 줄·겉보기 색 사실·심리 거울을 함께 봅니다. 하늘에서 보이는 빛과 카드 hue는 다를 수 있습니다. 퀴즈 전 미리 읽어 보세요.</p>
      <div class="planet-grid">${planets}</div>
    </section>

    <div class="about-box planet-guidance">
      <p class="planet-guidance__title">${copy.guidanceTitle || '안내'}</p>
      <p class="planet-guidance__text">${copy.guidanceText || ''}</p>
    </div>

    <p class="section-lead planet-cta-lead">준비되셨나요? 8행성 울림 분포를 확인해 보세요.</p>
    <div class="tool-actions planet-cta">
      <a class="btn btn-gold" href="/tools/planet-quiz">24문항 탐구 시작</a>
      <a class="btn btn-ghost" href="/">별빛연구소 홈</a>
    </div>
    <p class="disclaimer planet-disclaimer">${copy.disclaimer}</p>
  `;
}