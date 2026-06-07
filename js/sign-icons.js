/**
 * 별빛연구소 12성도 마크 — 성도 점·선 기반 (유니코드/이모지 미사용)
 * 각 별자리 고유 색(sign.color) + 금색 주성
 */

const MAPS = {
  aries: {
    stars: [[24, 9], [13, 19], [35, 19], [19, 30], [29, 37]],
    lines: [[0, 1], [0, 2], [1, 3], [2, 3], [3, 4]],
    anchor: 0,
  },
  taurus: {
    stars: [[11, 27], [19, 17], [29, 15], [37, 21], [31, 31], [17, 33]],
    lines: [[0, 1], [1, 2], [2, 3], [1, 4], [4, 5], [2, 5]],
    anchor: 2,
  },
  gemini: {
    stars: [[15, 9], [15, 21], [15, 33], [33, 9], [33, 21], [33, 33], [24, 21]],
    lines: [[0, 1], [1, 2], [3, 4], [4, 5], [1, 6], [4, 6]],
    anchor: 6,
  },
  cancer: {
    stars: [[10, 23], [17, 14], [24, 12], [31, 15], [36, 23], [28, 30], [16, 29]],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [2, 5], [1, 6], [5, 6]],
    anchor: 2,
  },
  leo: {
    stars: [[24, 24], [24, 10], [34, 15], [38, 26], [31, 37], [17, 37], [11, 27], [14, 16]],
    lines: [[0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7]],
    anchor: 0,
  },
  virgo: {
    stars: [[24, 8], [24, 17], [24, 26], [24, 36], [14, 21], [34, 29], [17, 38]],
    lines: [[0, 1], [1, 2], [2, 3], [1, 4], [2, 5], [3, 6], [5, 6]],
    anchor: 0,
  },
  libra: {
    stars: [[10, 27], [24, 18], [38, 27], [24, 33], [24, 40]],
    lines: [[0, 1], [1, 2], [1, 3], [3, 4]],
    anchor: 1,
  },
  scorpio: {
    stars: [[8, 12], [16, 15], [24, 19], [31, 25], [35, 33], [37, 40]],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5]],
    anchor: 3,
  },
  sagittarius: {
    stars: [[12, 36], [18, 29], [24, 23], [30, 17], [36, 9], [39, 6]],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5]],
    anchor: 2,
  },
  capricorn: {
    stars: [[12, 37], [19, 27], [27, 19], [35, 13], [32, 31], [21, 35]],
    lines: [[0, 1], [1, 2], [2, 3], [1, 4], [0, 5], [4, 5]],
    anchor: 2,
  },
  aquarius: {
    stars: [[13, 10], [21, 10], [29, 10], [17, 21], [25, 21], [15, 33], [24, 37], [33, 33]],
    lines: [[0, 1], [1, 2], [0, 3], [2, 4], [3, 5], [4, 7], [5, 6], [6, 7]],
    anchor: 6,
  },
  pisces: {
    stars: [[10, 19], [17, 13], [24, 17], [31, 24], [31, 32], [24, 36], [17, 32], [10, 26]],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 0]],
    anchor: 2,
  },
};

function starDot(x, y, r, fill) {
  return `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"/>`;
}

function buildSvg(id, accent, sizeClass = '') {
  const map = MAPS[id] || MAPS.gemini;
  const gid = `sig-${id}`;
  const lines = map.lines
    .map(([a, b]) => {
      const [x1, y1] = map.stars[a];
      const [x2, y2] = map.stars[b];
      return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${accent}" stroke-width="1.35" stroke-linecap="round"/>`;
    })
    .join('');

  const dots = map.stars
    .map(([x, y], i) => {
      const isAnchor = i === map.anchor;
      const r = isAnchor ? 2.35 : 1.45;
      const fill = isAnchor ? '#ffd84d' : '#ece8f8';
      return starDot(x, y, r, fill);
    })
    .join('');

  const extra = sizeClass ? ` ${sizeClass}` : '';

  return `<svg class="sign-mark${extra}" viewBox="0 0 48 48" aria-hidden="true" focusable="false">
    <defs>
      <linearGradient id="${gid}-bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#1a1f30"/>
        <stop offset="100%" stop-color="#0c0e16"/>
      </linearGradient>
      <radialGradient id="${gid}-glow" cx="50%" cy="38%" r="58%">
        <stop offset="0%" stop-color="${accent}" stop-opacity="0.28"/>
        <stop offset="100%" stop-color="${accent}" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="48" height="48" rx="13" fill="url(#${gid}-bg)"/>
    <rect width="48" height="48" rx="13" fill="url(#${gid}-glow)"/>
    <rect x="0.75" y="0.75" width="46.5" height="46.5" rx="12.25" fill="none" stroke="${accent}" stroke-width="1" stroke-opacity="0.42"/>
    <g>${lines}</g>
    <g>${dots}</g>
  </svg>`;
}

function buildBareSvg(id, accent, sizeClass = '') {
  const map = MAPS[id] || MAPS.gemini;
  const lines = map.lines
    .map(([a, b]) => {
      const [x1, y1] = map.stars[a];
      const [x2, y2] = map.stars[b];
      return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${accent}" stroke-width="1.6" stroke-linecap="round" stroke-opacity="0.92"/>`;
    })
    .join('');

  const dots = map.stars
    .map(([x, y], i) => {
      const isAnchor = i === map.anchor;
      const r = isAnchor ? 2.6 : 1.65;
      const fill = isAnchor ? '#ffd84d' : '#ece8f8';
      return starDot(x, y, r, fill);
    })
    .join('');

  const extra = sizeClass ? ` ${sizeClass}` : '';

  return `<svg class="sign-mark sign-mark--bare${extra}" viewBox="0 0 48 48" aria-hidden="true" focusable="false">
    <g>${lines}</g>
    <g>${dots}</g>
  </svg>`;
}

export function signIconMarkup(id, accent = '#6ec8c8', sizeClass = '') {
  return buildSvg(id, accent, sizeClass);
}

/** Detail page — constellation only, no card background */
export function signSymbolMarkup(id, accent = '#6ec8c8', sizeClass = 'sign-mark--detail') {
  return buildBareSvg(id, accent, sizeClass);
}