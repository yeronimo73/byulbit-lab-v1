/** 별빛연구소 — 탐구 일지 (localStorage, 브라우저 로컬) */

const STORAGE_KEY = 'byulbit-explore-journal';
const MAX_ENTRIES = 20;

export function loadJournalEntries() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

export function saveJournalEntry({ tool, resultLabel, note }) {
  const trimmed = (note || '').trim();
  if (!trimmed) return { ok: false, reason: 'empty' };

  const entry = {
    id: `${Date.now()}`,
    date: new Date().toISOString().slice(0, 10),
    tool,
    resultLabel: resultLabel || '',
    note: trimmed.slice(0, 200),
  };

  const next = [entry, ...loadJournalEntries()].slice(0, MAX_ENTRIES);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return { ok: true, entry };
}

function renderRecentList(entries) {
  if (!entries.length) {
    return '<p class="explore-journal__empty">아직 기록이 없습니다.</p>';
  }
  return `<ul class="explore-journal__history">${entries
    .slice(0, 5)
    .map(
      (e) => `
    <li>
      <span class="explore-journal__hist-date">${e.date}</span>
      <span class="explore-journal__hist-tool">${e.tool}</span>
      ${e.resultLabel ? `<span class="explore-journal__hist-result">${e.resultLabel}</span>` : ''}
      <p class="explore-journal__hist-note">${e.note}</p>
    </li>`
    )
    .join('')}</ul>`;
}

export function renderExploreJournalHTML({ tool, resultLabel, hint }) {
  const recent = loadJournalEntries();
  const hintText =
    hint ||
    '퀴즈 결과는 그날의 거울입니다. 한 문장만 남기면 이 기기에 저장됩니다(최대 ' + MAX_ENTRIES + '건).';
  return `
    <aside class="explore-journal" data-journal-tool="${tool}" data-journal-result="${resultLabel || ''}">
      <h3>오늘의 울림 한 줄</h3>
      <p class="explore-journal__hint">${hintText}</p>
      <label class="explore-journal__label" for="journal-note">탐구 일지</label>
      <textarea id="journal-note" class="explore-journal__input" rows="2" maxlength="200" placeholder="지금 가장 울리는 것을 한 줄로 적어 보세요."></textarea>
      <div class="explore-journal__actions">
        <button type="button" class="btn btn-gold" id="journal-save">기록하기</button>
        <span class="explore-journal__saved" id="journal-saved" hidden>저장됨</span>
      </div>
      <details class="explore-journal__details">
        <summary>최근 기록 (${recent.length})</summary>
        <div id="journal-history">${renderRecentList(recent)}</div>
      </details>
    </aside>`;
}

export function bindExploreJournal(root, { tool, resultLabel }) {
  const aside = root.querySelector('.explore-journal');
  if (!aside) return;

  const saveBtn = aside.querySelector('#journal-save');
  const input = aside.querySelector('#journal-note');
  const saved = aside.querySelector('#journal-saved');
  const history = aside.querySelector('#journal-history');

  saveBtn?.addEventListener('click', () => {
    const res = saveJournalEntry({ tool, resultLabel, note: input?.value });
    if (!res.ok) {
      input?.focus();
      return;
    }
    if (saved) {
      saved.hidden = false;
      setTimeout(() => { saved.hidden = true; }, 2200);
    }
    if (input) input.value = '';
    if (history) history.innerHTML = renderRecentList(loadJournalEntries());
    const details = aside.querySelector('.explore-journal__details');
    if (details) {
      const sum = details.querySelector('summary');
      if (sum) sum.textContent = `최근 기록 (${loadJournalEntries().length})`;
    }
  });
}