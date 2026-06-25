import { loadJson } from './js/site.js';
import { scorePlanet } from './js/scoring.js';
import { renderExploreJournalHTML, bindExploreJournal } from './js/explore-journal.js';

const LIKERT = [
  { v: 1, label: '전혀 아니다' },
  { v: 2, label: '아니다' },
  { v: 3, label: '보통' },
  { v: 4, label: '그렇다' },
  { v: 5, label: '매우 그렇다' },
];

const ADVANCE_MS = 320;

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

async function main() {
  const data = await loadJson('./data/planet-items.json');
  const meta = await loadJson('./data/planet-types.json');
  const root = document.getElementById('app');
  let answers = {};
  let step = 0;
  let advancing = false;
  const items = data.items;

  function resetAll() {
    answers = {};
    step = 0;
    advancing = false;
    draw();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function renderQuestion(item) {
    const opts = LIKERT.map(
      (o) => `
      <label><input type="radio" name="q${item.id}" value="${o.v}" ${answers[item.id] === o.v ? 'checked' : ''} /> ${o.label}</label>
    `
    ).join('');
    return `<div class="q-card"><p class="q-text">${item.id}. ${item.text}</p><div class="likert">${opts}</div></div>`;
  }

  function bindQuestion(item) {
    root.querySelectorAll('input[type=radio]').forEach((inp) => {
      inp.addEventListener('change', () => {
        if (advancing) return;
        answers[item.id] = parseInt(inp.value, 10);
        advancing = true;
        setTimeout(() => {
          step++;
          advancing = false;
          draw();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, ADVANCE_MS);
      });
    });

    document.getElementById('reset-all')?.addEventListener('click', () => {
      if (Object.keys(answers).length === 0) return;
      if (confirm('모든 응답을 지우고 처음부터 다시 선택할까요?')) {
        resetAll();
      }
    });

    document.getElementById('next')?.addEventListener('click', () => {
      if (!answers[item.id]) {
        alert('응답을 선택해 주세요.');
        return;
      }
      step++;
      draw();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  function draw() {
    const total = items.length;
    const answered = Object.keys(answers).length;
    const pct = Math.round((answered / total) * 100);

    if (step >= total) {
      const r = scorePlanet(items, answers, meta);
      const p1 = meta.planets[r.primary];
      const p2 = meta.planets[r.secondary];

      const rows = meta.order
        .map((key) => {
          const p = meta.planets[key];
          return `
        <div class="type-pct-row">
          <span>${p.symbol} ${p.name}</span>
          <div class="type-pct-bar"><div class="type-pct-fill" style="width:${r.pct[key]}%;background:${p.color}"></div></div>
          <span>${r.pct[key]}%</span>
        </div>`;
        })
        .join('');

      const signLinks = [..new Set([..(p1.relatedSigns || []), ..(p2.relatedSigns || [])])]
        .map((id) => `<a class="btn btn-ghost" href="/sign?id=${id}">${SIGN_NAMES[id] || id}</a>`)
        .join('');

      const questions = [..(p1.exploreQuestions || []), ..(p2.exploreQuestions || [])]
        .slice(0, 2)
        .map((q) => `<li>${q}</li>`)
        .join('');

      const resultLabel = `${p1.name} · ${p2.name}`;
      root.innerHTML = `
        <p class="section-label">결과</p>
        <h2 style="font-family:var(--font-serif);font-size:1.5rem;margin-bottom:0.35rem;">
          <span style="color:${p1.color}">${p1.symbol} ${p1.name}</span>의 울림이 가장 크게 느껴집니다
        </h2>
        <p style="font-size:0.85rem;color:var(--muted);margin-bottom:0.75rem;">
          2순위: <span style="color:${p2.color}">${p2.symbol} ${p2.name}</span> (${r.pct[r.secondary]}%), 단정이 아닌 거울입니다.
        </p>
        <p style="font-size:0.9rem;line-height:1.65;margin-bottom:1rem;">
          <strong>${p1.archetype}</strong>. ${p1.gift} 다만 ${p1.shadow}
        </p>
        <div class="result-block">
          <h3>8행성 분포</h3>
          <div class="type-pct-grid">${rows}</div>
        </div>
        <div class="result-block">
          <h3>천문 한 줄</h3>
          <p style="font-size:0.88rem;line-height:1.6;">${p1.astronomy}</p>
        </div>
        ${p1.skyColorFact ? `
        <div class="result-block">
          <h3>색 · 천문</h3>
          <p style="font-size:0.88rem;line-height:1.6;">
            ${p1.skyColorLabel ? `<strong style="color:${p1.color}">${p1.skyColorLabel}</strong>. ` : ''}${p1.skyColorFact}
          </p>
          ${p1.hueNote ? `<p style="font-size:0.78rem;color:var(--muted);margin-top:0.35rem;">${p1.hueNote}</p>` : ''}
        </div>` : ''}
        <div class="result-block">
          <h3>탐구 질문</h3>
          <ul class="sign-questions">${questions}</ul>
        </div>
        ${renderExploreJournalHTML({ tool: '행성 거울', resultLabel })}
        <div class="tool-actions">
          ${signLinks}
          <a class="btn btn-ghost" href="/mbti">MBTI 탐구</a>
          <a class="btn btn-ghost" href="/enneagram">에니어그램</a>
          <button type="button" class="btn btn-ghost" id="retry">전항목 다시 선택하기</button>
        </div>
        <p class="disclaimer">${data.disclaimer} MBTI·별자리와의 교차는 울림일 뿐, 일치를 의미하지 않습니다.</p>
      `;
      bindExploreJournal(root, { tool: '행성 거울', resultLabel });
      document.getElementById('retry').onclick = resetAll;
      return;
    }

    const item = items[step];
    const hasAnswer = Boolean(answers[item.id]);

    root.innerHTML = `
      <div class="progress"><div class="progress-bar" style="width:${pct}%"></div></div>
      <p style="font-size:0.8rem;color:var(--muted);margin-bottom:0.75rem;">${step + 1} / ${total}</p>
      ${renderQuestion(item)}
      <div class="tool-actions">
        <button type="button" class="btn btn-gold" id="next" ${hasAnswer ? '' : 'disabled style="opacity:0.45;cursor:not-allowed;"'}>다음</button>
        <button type="button" class="btn btn-ghost" id="reset-all">전항목 다시 선택하기</button>
      </div>
    `;

    bindQuestion(item);
  }

  draw();
}

main();