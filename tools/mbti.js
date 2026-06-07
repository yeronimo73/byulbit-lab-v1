import { loadJson } from '../js/site.js';
import { scoreMbti } from '../js/scoring.js';
import { renderExploreJournalHTML, bindExploreJournal } from '../js/explore-journal.js';

const LIKERT = [
  { v: 1, label: '전혀 아니다' },
  { v: 2, label: '아니다' },
  { v: 3, label: '보통' },
  { v: 4, label: '그렇다' },
  { v: 5, label: '매우 그렇다' },
];

const ADVANCE_MS = 320;

function renderAxis(axisKey, axis) {
  const keys = axisKey === 'EI' ? ['E', 'I'] : axisKey === 'SN' ? ['S', 'N'] : axisKey === 'TF' ? ['T', 'F'] : ['J', 'P'];
  const pA = axis[keys[0]];
  const pB = axis[keys[1]];
  const bl = axis.borderline ? '<span class="borderline-tag">경계형</span>' : '';
  return `
    <div class="axis-row">
      <div class="axis-label"><span>${keys[0]} ${pA}%</span><span>${keys[1]} ${pB}%</span></div>
      <div class="axis-bar" role="img" aria-label="${keys[0]} ${pA}%, ${keys[1]} ${pB}%">
        <div class="axis-fill-a" style="width:${pA}%"></div>
        <div class="axis-fill-b" style="width:${pB}%"></div>
      </div>
      ${bl}
    </div>`;
}

async function main() {
  const data = await loadJson('../data/mbti-items.json');
  const types = await loadJson('../data/mbti-types.json');
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
      const result = scoreMbti(items, answers);
      const type = types[result.code] || { name: result.code, summary: '' };
      const resultLabel = `${result.code} ${type.name}`;
      root.innerHTML = `
        <p class="section-label">결과</p>
        <h2 style="font-family:var(--font-serif);font-size:1.75rem;margin-bottom:0.25rem;">${resultLabel}</h2>
        ${result.borderline ? '<p style="font-size:0.8rem;color:var(--violet);margin-bottom:1rem;">일부 축이 경계형(49~51%)입니다. 비율을 함께 읽어 주세요.</p>' : ''}
        <div class="result-block">
          <h3>4축 비율</h3>
          ${renderAxis('EI', result.axes.EI)}
          ${renderAxis('SN', result.axes.SN)}
          ${renderAxis('TF', result.axes.TF)}
          ${renderAxis('JP', result.axes.JP)}
        </div>
        <p style="font-size:0.9rem;line-height:1.7;">${type.summary}</p>
        ${renderExploreJournalHTML({ tool: 'MBTI', resultLabel })}
        <p class="disclaimer">${data.disclaimer}</p>
        <div class="tool-actions">
          <button type="button" class="btn btn-ghost" id="retry">전항목 다시 선택하기</button>
        </div>
      `;
      bindExploreJournal(root, { tool: 'MBTI', resultLabel });
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