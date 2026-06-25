import { loadJson } from './site.js';
import { scoreEquinoxQuiz } from './scoring.js';
import { buildInfographicCatalog, resolveQuizVisual, prefetchImage } from './infographic-resolver.js';
import {
  renderIntroPanel,
  renderSectionPanel,
  renderQuizVisualFigure,
  renderResultEmbed,
} from './quiz-infographic-panel.js';
import { renderExploreJournalHTML, bindExploreJournal } from './explore-journal.js';

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

function choiceLabel(item, id) {
  return item.choices.find((c) => c.id === id)?.text || id;
}

function sectionForItem(sections, itemId) {
  if (!sections?.length) return null;
  return sections.find((s) => itemId >= s.from && itemId <= s.to) || null;
}

function isSectionStart(sections, itemId) {
  const sec = sectionForItem(sections, itemId);
  return sec && sec.from === itemId;
}

export async function runKnowledgeQuiz({ dataPath, rootId = 'app' }) {
  const data = await loadJson(dataPath);
  const [{ items: infoItems }, details] = await Promise.all([
    loadJson('../data/infographics.json'),
    loadJson('../data/infographic-details.json'),
  ]);
  const catalog = buildInfographicCatalog(infoItems);
  const infoItem = catalog[data.meta.infographicId];
  const detail = details[data.meta.infographicId];
  const sections = data.meta.sections || [];

  const root = document.getElementById(rootId);
  let answers = {};
  let step = 0;
  let phase = 'intro';
  let sectionAck = false;
  let advancing = false;
  const quizItems = data.items;

  function resetAll() {
    answers = {};
    step = 0;
    phase = 'intro';
    sectionAck = false;
    advancing = false;
    draw();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function renderQuestion(item) {
    const visual = resolveQuizVisual(item, data.meta, catalog);
    const panel = visual ? renderQuizVisualFigure(visual, { priority: step === 0 ? 'high' : 'low' }) : '';
    const chip = item.contextChip
      ? `<span class="quiz-context-chip">${item.contextChip}</span>`
      : '';
    const opts = item.choices
      .map(
        (c) => `
      <label><input type="radio" name="q${item.id}" value="${c.id}" ${answers[item.id] === c.id ? 'checked' : ''} /> ${c.text}</label>
    `
      )
      .join('');
    return `<div class="q-card${visual ? ' q-card--with-visual' : ''}">
      ${panel}
      ${chip}
      <p class="q-text">${item.id}. ${item.text}</p>
      <div class="mcq">${opts}</div>
    </div>`;
  }

  function bindQuestion(item) {
    const nextItem = quizItems[step + 1];
    if (nextItem) {
      const nv = resolveQuizVisual(nextItem, data.meta, catalog);
      if (nv?.src) prefetchImage(nv.src);
    }

    root.querySelectorAll('input[type=radio]').forEach((inp) => {
      inp.addEventListener('change', () => {
        if (advancing) return;
        answers[item.id] = inp.value;
        advancing = true;
        setTimeout(() => {
          step++;
          sectionAck = false;
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
      sectionAck = false;
      draw();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  function draw() {
    if (phase === 'intro') {
      root.innerHTML = renderIntroPanel(infoItem, detail, data.disclaimer);
      document.getElementById('quiz-start')?.addEventListener('click', () => {
        phase = 'question';
        sectionAck = false;
        draw();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
      return;
    }

    const total = quizItems.length;

    if (step >= total) {
      const r = scoreEquinoxQuiz(quizItems, answers, data.tiers);
      const labels = data.meta.signLabels || {};
      const reviewHtml =
        r.review.length === 0
          ? '<p style="font-size:0.9rem;color:var(--teal);">모든 문항을 맞혔습니다.</p>'
          : `<div class="review-list">${r.review
              .map((w) => {
                const src = quizItems.find((i) => i.id === w.id);
                return `
            <div class="review-item">
              <p class="review-q">${w.id}. ${w.text}</p>
              <p class="review-a">선택: ${choiceLabel(src, w.chosen)}</p>
              <p class="review-a">정답: ${choiceLabel(src, w.correct)}</p>
              <p class="review-explain">${w.explain}</p>
              ${w.zodiacBridge ? `<p class="review-bridge">${w.zodiacBridge}</p>` : ''}
            </div>`;
              })
              .join('')}</div>`;

      const signLinks = (data.meta.relatedSigns || [])
        .map(
          (id) =>
            `<a class="btn btn-ghost" href="/sign?id=${id}">${labels[id] || SIGN_NAMES[id] || id} 탐구</a>`
        )
        .join('');

      const quizTitle = data.meta.title || '지식 퀴즈';
      const resultLabel = `${quizTitle} · ${r.score}/${r.total} · ${r.tier.label}`;
      const journalHint =
        '점수와 정답을 넘어, 오늘 가장 기억에 남는 천문 사실이나 거울 질문을 한 줄로 적어 보세요. 이 기기에만 저장됩니다.';

      root.innerHTML = `
        <p class="section-label">결과</p>
        <span class="tier-badge">${r.tier.label}</span>
        <h2 style="font-family:var(--font-serif);font-size:1.6rem;margin:0.5rem 0 0.25rem;">${r.score} / ${r.total}</h2>
        <p style="font-size:0.9rem;line-height:1.7;margin-bottom:1.25rem;">${r.tier.summary}</p>
        <div class="result-block">
          <h3>오답 해설</h3>
          ${reviewHtml}
        </div>
        ${renderExploreJournalHTML({
          tool: '지식 퀴즈',
          resultLabel,
          hint: journalHint,
        })}
        <div class="result-block">
          <h3>인포그래픽에서 이어가기</h3>
          ${renderResultEmbed(infoItem, detail)}
          <div class="tool-actions" style="margin-top:1rem;">
            <a class="btn btn-gold" href="/infographic?id=${data.meta.infographicId}">전체 인포그래픽 보기</a>
            ${signLinks}
            <a class="btn btn-ghost" href="/knowledge">지식 퀴즈 목록</a>
            <button type="button" class="btn btn-ghost" id="retry">다시 풀기</button>
          </div>
        </div>
        <p class="disclaimer">${data.disclaimer}</p>
      `;
      bindExploreJournal(root, { tool: '지식 퀴즈', resultLabel });
      document.getElementById('retry').onclick = resetAll;
      return;
    }

    const item = quizItems[step];
    const sec = sectionForItem(sections, item.id);

    if (sec && isSectionStart(sections, item.id) && !sectionAck) {
      root.innerHTML = `
        <div class="progress"><div class="progress-bar" style="width:${Math.round((Object.keys(answers).length / total) * 100)}%"></div></div>
        <p style="font-size:0.8rem;color:var(--muted);margin-bottom:0.75rem;">섹션 · ${step + 1} / ${total}</p>
        ${renderSectionPanel(sec, detail, infoItem)}
      `;
      document.getElementById('section-continue')?.addEventListener('click', () => {
        sectionAck = true;
        draw();
      });
      return;
    }

    const answered = Object.keys(answers).length;
    const pct = Math.round((answered / total) * 100);
    const hasAnswer = Boolean(answers[item.id]);

    root.innerHTML = `
      <div class="progress"><div class="progress-bar" style="width:${pct}%"></div></div>
      <p style="font-size:0.8rem;color:var(--muted);margin-bottom:0.75rem;">${step + 1} / ${total}${sec ? ` · ${sec.title}` : ''}</p>
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