import * as THREE from 'three';
import { createStarPointsMaterial } from './three-stars.js';

/** 2D constellation maps (48×48) → 3D hero overlay */
export const SIGN_CONSTELLATIONS = {
  aries: {
    stars: [[24, 8, 2.2], [14, 22, 1.6], [34, 22, 1.6], [24, 32, 1.8], [24, 40, 1.4]],
    lines: [[0, 1], [0, 2], [1, 3], [2, 3], [3, 4]],
  },
  taurus: {
    stars: [[10, 28, 1.5], [20, 20, 1.8], [30, 16, 2], [38, 22, 1.6], [32, 34, 1.5], [18, 36, 1.4]],
    lines: [[0, 1], [1, 2], [2, 3], [2, 4], [1, 5], [4, 5]],
  },
  gemini: {
    stars: [[16, 10, 1.8], [16, 22, 1.5], [16, 34, 1.6], [32, 10, 1.8], [32, 22, 1.5], [32, 34, 1.6], [24, 22, 1.2]],
    lines: [[0, 1], [1, 2], [3, 4], [4, 5], [1, 6], [4, 6]],
  },
  cancer: {
    stars: [[8, 24, 1.4], [16, 16, 1.6], [24, 14, 1.8], [32, 18, 1.6], [38, 26, 1.5], [30, 34, 1.4], [18, 32, 1.4]],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [3, 5], [1, 6], [5, 6]],
  },
  leo: {
    stars: [[24, 24, 2.6], [24, 10, 1.5], [34, 16, 1.4], [38, 28, 1.4], [30, 38, 1.4], [18, 38, 1.4], [10, 28, 1.4], [14, 16, 1.4]],
    lines: [[0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7]],
  },
  virgo: {
    stars: [[24, 8, 1.6], [24, 18, 1.4], [24, 28, 1.5], [24, 38, 1.6], [14, 22, 1.3], [34, 30, 1.3], [18, 40, 1.2]],
    lines: [[0, 1], [1, 2], [2, 3], [1, 4], [2, 5], [3, 6], [5, 6]],
  },
  libra: {
    stars: [[10, 28, 1.5], [24, 20, 1.8], [38, 28, 1.5], [24, 32, 1.4], [24, 40, 1.6]],
    lines: [[0, 1], [1, 2], [1, 3], [3, 4]],
  },
  scorpio: {
    stars: [[8, 12, 1.5], [16, 16, 1.6], [24, 20, 1.7], [30, 26, 1.6], [34, 34, 1.5], [36, 40, 1.8]],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5]],
  },
  sagittarius: {
    stars: [[12, 36, 1.6], [18, 30, 1.5], [24, 24, 1.7], [30, 18, 1.5], [36, 10, 1.8], [38, 6, 1.4]],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5]],
  },
  capricorn: {
    stars: [[12, 38, 1.5], [20, 28, 1.5], [28, 20, 1.7], [36, 14, 1.6], [32, 32, 1.4], [22, 36, 1.3]],
    lines: [[0, 1], [1, 2], [2, 3], [1, 4], [0, 5], [4, 5]],
  },
  aquarius: {
    stars: [[14, 10, 1.5], [22, 10, 1.4], [30, 10, 1.5], [18, 22, 1.4], [26, 22, 1.4], [16, 34, 1.5], [24, 38, 1.6], [32, 34, 1.5]],
    lines: [[0, 1], [1, 2], [0, 3], [2, 4], [3, 5], [4, 7], [5, 6], [6, 7]],
  },
  pisces: {
    stars: [[10, 20, 1.6], [18, 14, 1.4], [26, 18, 1.5], [34, 26, 1.6], [34, 34, 1.4], [26, 38, 1.5], [18, 34, 1.4], [10, 28, 1.6]],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 0]],
  },
};

/** Per-sign torus-knot params — Möbius-like twisted wireframes */
export const SIGN_WIRES = {
  aries: { p: 2, q: 1, radius: 1.15, tube: 0.38 },
  taurus: { p: 3, q: 2, radius: 1.1, tube: 0.36 },
  gemini: { p: 2, q: 3, radius: 1.05, tube: 0.32 },
  cancer: { p: 3, q: 4, radius: 1.05, tube: 0.34 },
  leo: { p: 5, q: 2, radius: 1.15, tube: 0.38 },
  virgo: { p: 4, q: 3, radius: 1.08, tube: 0.33 },
  libra: { p: 2, q: 5, radius: 1.12, tube: 0.35 },
  scorpio: { p: 3, q: 5, radius: 1.1, tube: 0.32 },
  sagittarius: { p: 4, q: 5, radius: 1.18, tube: 0.36 },
  capricorn: { p: 5, q: 3, radius: 1.06, tube: 0.34 },
  aquarius: { p: 6, q: 2, radius: 1.14, tube: 0.37 },
  pisces: { p: 3, q: 7, radius: 1.16, tube: 0.39 },
};

function mapStar(x, y, scale = 0.09) {
  return [(x - 24) * scale, (24 - y) * scale, 0];
}

export function buildConstellationGroup(signId, accentHex) {
  const data = SIGN_CONSTELLATIONS[signId] || SIGN_CONSTELLATIONS.gemini;
  const accent = new THREE.Color(accentHex);
  const group = new THREE.Group();

  const starVerts = [];
  const starColors = [];

  for (const [x, y] of data.stars) {
    const [sx, sy, sz] = mapStar(x, y);
    starVerts.push(sx, sy, sz + 0.15);
    starColors.push(accent.r, accent.g, accent.b);
  }

  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute('position', new THREE.Float32BufferAttribute(starVerts, 3));
  starGeo.setAttribute('color', new THREE.Float32BufferAttribute(starColors, 3));
  group.add(new THREE.Points(starGeo, createStarPointsMaterial({ size: 0.16, opacity: 1 })));

  const lineVerts = [];
  const lineColors = [];
  const mapped = data.stars.map(([x, y]) => mapStar(x, y));

  for (const [a, b] of data.lines) {
    const p1 = mapped[a];
    const p2 = mapped[b];
    lineVerts.push(p1[0], p1[1], p1[2] + 0.12, p2[0], p2[1], p2[2] + 0.12);
    lineColors.push(accent.r, accent.g, accent.b, accent.r, accent.g, accent.b);
  }

  if (lineVerts.length) {
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(lineVerts, 3));
    lineGeo.setAttribute('color', new THREE.Float32BufferAttribute(lineColors, 3));
    group.add(
      new THREE.LineSegments(
        lineGeo,
        new THREE.LineBasicMaterial({
          vertexColors: true,
          transparent: true,
          opacity: 0.75,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        })
      )
    );
  }

  return group;
}

export function buildWireMesh(signId, accentHex) {
  const cfg = SIGN_WIRES[signId] || SIGN_WIRES.gemini;
  const geo = new THREE.TorusKnotGeometry(cfg.radius, cfg.tube, 200, 28, cfg.p, cfg.q);
  return new THREE.Mesh(
    geo,
    new THREE.MeshBasicMaterial({
      color: accentHex,
      wireframe: true,
      transparent: true,
      opacity: 0.92,
      depthWrite: false,
    })
  );
}