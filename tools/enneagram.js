import { loadJson } from '../js/site.js';
import { scoreEnneagram } from '../js/scoring.js';
import { renderExploreJournalHTML, bindExploreJournal } from '../js/explore-journal.js';

const LIKERT = [
  { v: 1, label: '전혀 아니다' },
  { v: 2, label: '아니다' },
  { v: 3, label: '보통' },
  { v: 4, label: '그렇다' },
  { v: 5, label: '매우 그렇다' },
];

const ADVANCE_MS = 320;

function centerMeta(meta, key) {
  const c = meta.centers?.[key];
  if (!c) return { label: key, summary: '' };
  if (Array.isArray(c)) return { label: key, summary: '', types: c };
  return c;
}

function listHtml(items) {
  if (!items?.length) return '';
  return `<ul class="ennea-list">${items.map((x) => `<li>${x}</li>`).join('')}</ul>`;
}

function questionsHtml(items) {
  if (!items?.length) return '';
  return `<ol class="ennea-questions">${items.map((x) => `<li>${x}</li>`).join('')}</ol>`;
}

function renderResult(r, meta, data) {
  const coreInfo = meta.types[r.core] || {};
  const center = centerMeta(meta, coreInfo.center);
  const wingName = meta.types[r.wing]?.name || '';
  const tp = r.tritypeParts || {};
  const tGut = meta.types[tp.gut];
  const tHeart = meta.types[tp.heart];
  const tHead = meta.types[tp.head];

  const rows = [1, 2, 3, 4, 5, 6, 7, 8, 9].map((t) => `
    <div class="type-pct-row">
      <span>${t} ${meta.types[t]?.name || ''}</span>
      <div class="type-pct-bar"><div class="type-pct-fill" style="width:${r.pct[t]}%"></div></div>
      <span>${r.pct[t]}%</span>
    </div>
  `).join('');

  const resultLabel = `유형 ${r.core} ${coreInfo.name || ''}`;

  const motivationBlock = (coreInfo.coreMotivation || coreInfo.coreFear) ? `
    <div class="result-block">
      <h3>동기와 불편</h3>
      ${coreInfo.coreMotivation ? `<p class="ennea-p"><strong>끌리는 방향</strong> — ${coreInfo.coreMotivation}</p>` : ''}
      ${coreInfo.coreFear ? `<p class="ennea-p"><strong>불편해지기 쉬운 지점</strong> — ${coreInfo.coreFear}</p>` : ''}
    </div>` : '';

  const dualBlock = (coreInfo.strengths?.length || coreInfo.shadow?.length) ? `
    <div class="result-block ennea-dual">
      <div>
        <h3>빛 · 자원</h3>
        ${listHtml(coreInfo.strengths)}
      </div>
      <div>
        <h3>그림자 · 패턴</h3>
        ${listHtml(coreInfo.shadow)}
      </div>
    </div>` : '';

  const wingBlock = `
    <div class="result-block">
      <h3>날개 · 트라이타입</h3>
      <p class="ennea-p"><strong>${r.wingLabel}</strong>
        ${wingName ? ` · 옆 유형 ${r.wing} ${wingName}` : ''}
        <span class="ennea-muted"> (참고 렌즈, 우열 아님)</span>
      </p>
      ${coreInfo.wingHint ? `<p class="ennea-p">${coreInfo.wingHint}</p>` : ''}
      <p class="ennea-p" style="margin-top:0.75rem;"><strong>트라이타입 ${r.tritype}</strong></p>
      <p class="ennea-p ennea-muted">
        장 ${tp.gut || '—'} ${tGut?.name || ''} ·
        심 ${tp.heart || '—'} ${tHeart?.name || ''} ·
        두 ${tp.head || '—'} ${tHead?.name || ''}
        — 각 센터에서 점수가 가장 높았던 유형의 조합입니다.
      </p>
    </div>`;

  const growthBlock = (coreInfo.growthQuestions?.length || coreInfo.mirrorPractice) ? `
    <div class="result-block">
      <h3>성장 질문 · 짧은 실습</h3>
      ${questionsHtml(coreInfo.growthQuestions)}
      ${coreInfo.mirrorPractice ? `<p class="ennea-practice">${coreInfo.mirrorPractice}</p>` : ''}
    </div>` : '';

  return `
    <p class="section-label">결과</p>
    <h2 class="ennea-result-title">${resultLabel}</h2>
    ${center.label ? `<p class="ennea-center-badge">${center.label}${center.summary ? ` · ${center.summary}` : ''}</p>` : ''}
    <p class="ennea-summary">${coreInfo.summary || ''}</p>
    ${motivationBlock}
    ${dualBlock}
    ${wingBlock}
    ${growthBlock}
    <div class="result-block">
      <h3>9유형 점수 분포</h3>
      <div class="type-pct-grid">${rows}</div>
    </div>
    ${renderExploreJournalHTML({ tool: '에니어그램', resultLabel })}
    ${meta.limits ? `<aside class="ennea-limits"><h3>한계 · 읽는 태도</h3><p>${meta.limits}</p></aside>` : ''}
    <p class="disclaimer">${data.disclaimer || '비공식 자가탐구 도구이며 임상 진단이 아닙니다.'}</p>
    <p class="ennea-links">
      <a class="btn btn-ghost" href="/tools/enneagram-guide#type-${r.core}">유형 ${r.core} 안내</a>
      <a class="btn btn-ghost" href="/tools/enneagram-guide">9유형 전체</a>
      <a class="btn btn-ghost" href="/research">연구 허브</a>
      <a class="btn btn-ghost" href="/">홈</a>
    </p>
    <div class="tool-actions">
      <button type="button" class="btn btn-ghost" id="retry">전항목 다시 선택하기</button>
    </div>
  `;
}

async function main() {
  const data = await loadJson('../data/enneagram-items.json');
  const meta = await loadJson('../data/enneagram-types.json');
  const root = document.getElementById('app');
  let answers = {};
  let step = 0;
  let advancing = false;
  let started = false;
  const items = data.items;

  function resetAll() {
    answers = {};
    step = 0;
    advancing = false;
    started = false;
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

  function drawIntro() {
    const how = (meta.howToRead || []).map((line) => `<li>${line}</li>`).join('');
    const sources = (meta.sources || []).map((s) => (
      s.url
        ? `<li><a href="${s.url}" rel="noopener noreferrer">${s.label}</a></li>`
        : `<li>${s.label}</li>`
    )).join('');

    root.innerHTML = `
      <div class="ennea-intro">
        ${meta.about ? `<p class="ennea-about">${meta.about}</p>` : ''}
        ${how ? `<div class="result-block"><h3>결과 읽는 법</h3><ol class="ennea-questions">${how}</ol></div>` : ''}
        ${meta.limits ? `<aside class="ennea-limits"><h3>한계 · 면책</h3><p>${meta.limits}</p></aside>` : ''}
        ${sources ? `<div class="result-block"><h3>참고</h3><ul class="ennea-sources">${sources}</ul></div>` : ''}
        <p class="disclaimer">${data.disclaimer || ''}</p>
        <p class="ennea-links">
          <a class="btn btn-ghost" href="/tools/enneagram-guide">9유형 안내 먼저 보기</a>
        </p>
        <div class="tool-actions">
          <button type="button" class="btn btn-gold" id="start-ennea">63문항 시작</button>
        </div>
      </div>
    `;
    document.getElementById('start-ennea').onclick = () => {
      started = true;
      step = 0;
      draw();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
  }

  function draw() {
    if (!started) {
      drawIntro();
      return;
    }

    const total = items.length;
    const answered = Object.keys(answers).length;
    const pct = Math.round((answered / total) * 100);

    if (step >= total) {
      const r = scoreEnneagram(items, answers, meta);
      const coreInfo = meta.types[r.core];
      const resultLabel = `유형 ${r.core} ${coreInfo?.name || ''}`;
      root.innerHTML = renderResult(r, meta, data);
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
