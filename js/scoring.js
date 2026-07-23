/** 별빛연구소 — MBTI·에니어그램 채점 (vanilla) */

export function scoreMbti(items, answers) {
  const axes = { EI: { E: 0, I: 0 }, SN: { S: 0, N: 0 }, TF: { T: 0, F: 0 }, JP: { J: 0, P: 0 } };

  for (const item of items) {
    const value = answers[item.id];
    if (!value) continue;
    const [a, b] = item.axis === 'EI' ? ['E', 'I'] : item.axis === 'SN' ? ['S', 'N'] : item.axis === 'TF' ? ['T', 'F'] : ['J', 'P'];
    const pole = item.pole;
    const other = pole === a ? b : a;
    let v = item.reverse ? 6 - value : value;
    axes[item.axis][pole] += v;
    axes[item.axis][other] += 6 - v;
  }

  function pct(axis, p1, p2) {
    const t = axes[axis][p1] + axes[axis][p2];
    if (t === 0) return { [p1]: 50, [p2]: 50, borderline: true };
    const p1pct = Math.round((axes[axis][p1] / t) * 100);
    const p2pct = 100 - p1pct;
    return {
      [p1]: p1pct,
      [p2]: p2pct,
      borderline: p1pct >= 49 && p1pct <= 51,
      letter: p1pct >= p2pct ? p1 : p2,
    };
  }

  const ei = pct('EI', 'E', 'I');
  const sn = pct('SN', 'S', 'N');
  const tf = pct('TF', 'T', 'F');
  const jp = pct('JP', 'J', 'P');

  const code = ei.letter + sn.letter + tf.letter + jp.letter;

  return {
    code,
    axes: { EI: ei, SN: sn, TF: tf, JP: jp },
    borderline: [ei, sn, tf, jp].some((x) => x.borderline),
  };
}

export function scoreEnneagram(items, answers, meta) {
  const scores = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };

  for (const item of items) {
    const value = answers[item.id];
    if (!value) continue;
    scores[item.type] += value;
  }

  const total = Object.values(scores).reduce((a, b) => a + b, 0) || 1;
  const pct = {};
  for (let t = 1; t <= 9; t++) {
    pct[t] = Math.round((scores[t] / total) * 100);
  }

  let core = 1;
  for (let t = 2; t <= 9; t++) {
    if (scores[t] > scores[core]) core = t;
  }

  const left = core === 1 ? 9 : core - 1;
  const right = core === 9 ? 1 : core + 1;
  const wing = scores[left] >= scores[right] ? left : right;
  const wingLabel = `${core}w${wing}`;

  const centerList = (c) => (Array.isArray(c) ? c : (c?.types || []));
  const gut = centerList(meta.centers?.gut);
  const heart = centerList(meta.centers?.heart);
  const head = centerList(meta.centers?.head);
  const pickBest = (arr) => arr.reduce((best, t) => (scores[t] > scores[best] ? t : best), arr[0]);
  const tritype = [pickBest(gut), pickBest(heart), pickBest(head)].join('');
  const tritypeParts = {
    gut: pickBest(gut),
    heart: pickBest(heart),
    head: pickBest(head),
  };

  return { scores, pct, core, wing, wingLabel, tritype, tritypeParts };
}

export function getCurrentSign(signs, date = new Date()) {
  const m = date.getMonth() + 1;
  const d = date.getDate();

  function inRange(sign) {
    const [sm, sd] = sign.monthStart;
    const [em, ed] = sign.monthEnd;
    if (sm < em || (sm === em && sd <= ed)) {
      const afterStart = m > sm || (m === sm && d >= sd);
      const beforeEnd = m < em || (m === em && d <= ed);
      return afterStart && beforeEnd;
    }
    return m > sm || (m === sm && d >= sd) || m < em || (m === em && d <= ed);
  }

  return signs.find(inRange) || signs[0];
}

/** 이달의 하늘 — sky-calendar.json 항목 */
export function getSkyCalendarEntry(entries, date = new Date()) {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  return (
    entries.find((e) => e.year === y && e.month === m)
    || entries.find((e) => e.month === m)
    || null
  );
}

export function scoreEquinoxQuiz(items, answers, tiers) {
  let score = 0;
  const review = [];

  for (const item of items) {
    const chosen = answers[item.id];
    const correct = chosen === item.correct;
    if (correct) score++;
    else {
      review.push({
        id: item.id,
        text: item.text,
        chosen,
        correct: item.correct,
        explain: item.explain,
        zodiacBridge: item.zodiacBridge,
      });
    }
  }

  const tier =
    tiers.find((t) => score >= t.min && score <= t.max) ||
    tiers[tiers.length - 1];

  return { score, total: items.length, tier, review };
}

export function scorePlanet(items, answers, meta) {
  const scores = {};
  for (const key of meta.order) scores[key] = 0;

  for (const item of items) {
    const value = answers[item.id];
    if (!value) continue;
    const v = item.reverse ? 6 - value : value;
    scores[item.planet] += v;
  }

  const total = Object.values(scores).reduce((a, b) => a + b, 0) || 1;
  const pct = {};
  for (const key of meta.order) {
    pct[key] = Math.round((scores[key] / total) * 100);
  }

  const ordered = [...meta.order].sort((a, b) => scores[b] - scores[a]);
  const primary = ordered[0];
  const secondary = ordered[1];

  return { scores, pct, primary, secondary, ordered };
}