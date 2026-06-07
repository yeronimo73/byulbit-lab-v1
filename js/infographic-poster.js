/** 별빛연구소 — 인포그래픽 HTML 포스터 렌더 */

/** 인포 상세 본문용 3층 요약 (facts / light / mirror) */
export function renderInfographicLayers(detail, { accent = '#ffd84d' } = {}) {
  if (!Array.isArray(detail?.facts) || !detail.facts.length) return '';
  const list = (arr) => (arr || []).map((s) => `<li>${s}</li>`).join('');
  return `
    <section class="info-detail-layers" style="--accent:${accent}" aria-labelledby="info-layers-heading">
      <h2 id="info-layers-heading" class="info-detail-layers__title">별 · 빛 · 거울</h2>
      <p class="info-detail-layers__lead">인포그래픽 카드와 동일한 3층 구조입니다. 천문 사실·색채 연상·심리 거울을 구분해 읽습니다.</p>
      <div class="info-detail-layers__grid">
        <section>
          <h3>별 · 천문</h3>
          <ul>${list(detail.facts)}</ul>
        </section>
        <section>
          <h3>빛 · 색채</h3>
          <ul>${list(detail.light)}</ul>
        </section>
        <section class="info-detail-layers__mirror">
          <h3>거울 · 질문</h3>
          <ul>${list(detail.mirror)}</ul>
        </section>
      </div>
    </section>`;
}

export function renderInfographicPoster(item, detail, { compact = false } = {}) {
  const cls = compact ? 'info-poster info-poster--compact' : 'info-poster';
  const useLayers = Array.isArray(detail?.facts) && detail.facts.length > 0;
  const col1 = useLayers ? detail.facts : (detail?.sky || []);
  const col2 = useLayers ? detail.light : (detail?.zodiac || []);
  const col3 = useLayers ? detail.mirror : (detail?.questions || []);
  const h1 = useLayers ? '별 · 천문' : '하늘 맥락';
  const h2 = useLayers ? '빛 · 색채' : '별자리·심리';
  const h3 = useLayers ? '거울 · 질문' : '탐구 질문';
  const list = (arr) => (arr || []).map((s) => `<li>${s}</li>`).join('');

  return `
    <article class="${cls}" style="--accent:${item.color}">
      <header class="info-poster__head">
        <span class="info-poster__lab">별빛연구소</span>
        <span class="info-poster__badge">${detail?.badge || '탐구 카드'}</span>
      </header>
      <h2 class="info-poster__title">${item.title}</h2>
      <p class="info-poster__date">${item.date}</p>
      <div class="info-poster__grid">
        <section>
          <h3>${h1}</h3>
          <ul>${list(col1)}</ul>
        </section>
        <section>
          <h3>${h2}</h3>
          <ul>${list(col2)}</ul>
        </section>
        <section class="info-poster__q">
          <h3>${h3}</h3>
          <ul>${list(col3)}</ul>
        </section>
      </div>
      <footer class="info-poster__foot">점술이 아닌 자기이해용 · Starlight Research</footer>
    </article>
  `;
}