import { loadJson } from './js/site.js';
import { scoreEnneagram } from './js/scoring.js';
import { renderExploreJournalHTML, bindExploreJournal } from './js/explore-journal.js';

const LIKERT = [
  { v: 1, label: '전혀 아니다' },
  { v: 2, label: '아니다' },
  { v: 3, label: '보통' },
  { v: 4, label: '그렇다' },
  { v: 5, label: '매우 그렇다' },
];

const ADVANCE_MS = 320;

async function main() {
  const data = await loadJson('./data/enneagram-items.json');
  const meta = await loadJson('./data/enneagram-types.json');
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
    const opts = LIKERT.map((o) => `
      <label><input type="radio" name="q${item.id}" value="${o.v}" ${answers[item.id] === o.v ? 'checked' : ''} /> ${o.label}</label>
    `).join('');
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
      const r = scoreEnneagram(items, answers, meta);
      const coreInfo = meta.types[r.core];
      const rows = [1, 2, 3, 4, 5, 6, 7, 8, 9].map((t) => `
        <div class="type-pct-row">
          <span>${t} ${meta.types[t].name}</span>
          <div class="type-pct-bar"><div class="type-pct-fill" style="width:${r.pct[t]}%"></div></div>
          <span>${r.pct[t]}%</span>
        </div>
      `).join('');

      const resultLabel = `유형 ${r.core} ${coreInfo.name}`;
      root.innerHTML = `
        <p class="section-label">결과</p>
        <h2 style="font-family:var(--font-serif);font-size:1.6rem;">${resultLabel}</h2>
        <p style="font-size:0.9rem;margin:0.75rem 0 1.25rem;">${coreInfo.summary}</p>
        <div class="result-block">
          <h3>날개 · 트라이타입</h3>
          <p style="font-size:0.95rem;margin-bottom:0.5rem;"><strong>${r.wingLabel}</strong> (날개)</p>
          <p style="font-size:0.95rem;"><strong>${r.tritype}</strong>. 선(8·9·1) · 심(2·3·4) · 복(5·6·7) 각 최고 유형</p>
        </div>
        <div class="result-block">
          <h3>9유형 점수 분포</h3>
          <div class="type-pct-grid">${rows}</div>
        </div>
        ${renderExploreJournalHTML({ tool: '에니어그램', resultLabel })}
        <p class="disclaimer">${data.disclaimer}</p>
        <div class="tool-actions">
          <button type="button" class="btn btn-ghost" id="retry">전항목 다시 선택하기</button>
        </div>
      `;
      bindExploreJournal(root, { tool: '에니어그램', resultLabel });
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