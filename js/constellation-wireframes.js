import * as THREE from 'three';
import { mergeGeometries } from 'https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/utils/BufferGeometryUtils.js';

/** 성도 그래프 — 월별 fallback (단일 케이지 와이어프레임) */
export const HERO_CONSTELLATIONS = {
  gemini: null,
  aries: {
    stars: [
      [0.1, 0.95, 0], [-0.35, 0.55, 0], [-0.7, 0.15, 0], [-0.45, -0.25, 0], [0.2, -0.15, 0], [0.55, 0.35, 0],
    ],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0]],
  },
  taurus: {
    stars: [
      [-0.75, 0.35, 0], [-0.35, 0.75, 0], [0.05, 0.85, 0], [0.45, 0.65, 0], [0.75, 0.25, 0],
      [0.35, -0.15, 0], [-0.15, -0.2, 0], [-0.55, 0.05, 0],
    ],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 0], [2, 7]],
  },
  cancer: {
    stars: [
      [-0.55, 0.45, 0], [0, 0.75, 0], [0.55, 0.45, 0], [0.65, -0.05, 0],
      [0.2, -0.45, 0], [-0.2, -0.45, 0], [-0.65, -0.05, 0],
    ],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 0], [1, 4], [1, 5]],
  },
  leo: {
    stars: [
      [0.55, 0.85, 0], [0.15, 0.95, 0], [-0.35, 0.75, 0], [-0.75, 0.35, 0],
      [-0.65, -0.15, 0], [-0.25, -0.55, 0], [0.25, -0.45, 0], [0.65, -0.05, 0], [0.35, 0.45, 0],
    ],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 0], [1, 8], [8, 7]],
  },
  virgo: {
    stars: [
      [0, 0.95, 0], [-0.15, 0.55, 0], [0.1, 0.15, 0], [0.45, -0.25, 0],
      [0.15, -0.65, 0], [-0.35, -0.55, 0], [-0.55, -0.1, 0], [-0.35, 0.35, 0],
    ],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 0], [1, 7]],
  },
  libra: {
    stars: [
      [-0.65, 0.15, 0], [-0.25, 0.55, 0], [0.25, 0.55, 0], [0.65, 0.15, 0],
      [0.35, -0.35, 0], [-0.35, -0.35, 0], [0, 0.05, 0],
    ],
    lines: [[0, 1], [1, 2], [2, 3], [1, 6], [2, 6], [0, 5], [3, 4], [4, 5]],
  },
  scorpio: {
    stars: [
      [-0.75, 0.55, 0], [-0.45, 0.75, 0], [-0.05, 0.65, 0], [0.35, 0.35, 0],
      [0.65, -0.05, 0], [0.75, -0.45, 0], [0.55, -0.85, 0], [0.25, -0.95, 0],
    ],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7]],
  },
  sagittarius: {
    stars: [
      [-0.15, -0.75, 0], [0.05, -0.35, 0], [0.25, 0.05, 0], [0.45, 0.45, 0],
      [0.15, 0.75, 0], [-0.35, 0.55, 0], [-0.55, 0.15, 0], [-0.25, -0.25, 0],
    ],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [2, 5], [5, 6], [6, 7], [7, 0]],
  },
  capricorn: {
    stars: [
      [-0.55, 0.65, 0], [-0.25, 0.35, 0], [0.05, 0.05, 0], [0.45, -0.15, 0],
      [0.65, -0.45, 0], [0.35, -0.75, 0], [-0.15, -0.55, 0], [-0.45, -0.15, 0],
    ],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 0], [2, 7]],
  },
  aquarius: {
    stars: [
      [-0.7, 0.45, 0], [-0.35, 0.55, 0], [0, 0.5, 0], [0.35, 0.55, 0], [0.7, 0.45, 0],
      [-0.45, 0.05, 0], [0.05, 0, 0], [0.45, 0.05, 0], [-0.25, -0.45, 0], [0.25, -0.45, 0],
    ],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [1, 5], [2, 6], [3, 7], [5, 6], [6, 7], [5, 8], [7, 9], [8, 9]],
  },
  pisces: {
    stars: [
      [-0.75, 0.25, 0], [-0.45, 0.55, 0], [-0.15, 0.35, 0], [0.15, 0.15, 0],
      [0.45, -0.05, 0], [0.75, 0.15, 0], [0.55, -0.45, 0], [0.25, -0.65, 0],
      [-0.25, -0.55, 0], [-0.55, -0.35, 0],
    ],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [4, 8], [8, 9], [9, 0]],
  },
};

const wireMat = (color, opacity) =>
  new THREE.LineBasicMaterial({
    color,
    transparent: true,
    opacity,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

function boxAt(w, h, d, x, y, z, rotZ = 0) {
  const g = new THREE.BoxGeometry(w, h, d);
  const m = new THREE.Matrix4().makeRotationZ(rotZ).setPosition(x, y, z);
  g.applyMatrix4(m);
  return g;
}

/** 쌍둥이자리 — 좌·우 몸통 + 가슴 연결 + 다리, 단일 메시 와이어프레임 */
function buildGeminiMonolith(accentHex, opacity) {
  const parts = [
    boxAt(0.44, 2.18, 0.54, -0.55, 0.08, 0),
    boxAt(0.44, 2.18, 0.54, 0.55, 0.08, 0),
    boxAt(0.62, 0.18, 0.4, 0, 0.36, 0),
    boxAt(0.16, 0.58, 0.16, -0.82, -0.92, -0.08, 0.32),
    boxAt(0.16, 0.58, 0.16, -0.28, -0.92, 0.06, -0.28),
    boxAt(0.16, 0.58, 0.16, 0.28, -0.92, -0.06, 0.28),
    boxAt(0.16, 0.58, 0.16, 0.82, -0.92, 0.08, -0.32),
  ];

  const merged = mergeGeometries(parts);
  merged.computeBoundingBox();
  const edges = new THREE.EdgesGeometry(merged, 4);
  const monolith = new THREE.LineSegments(edges, wireMat(accentHex, opacity));
  monolith.userData.isMonolith = true;
  return monolith;
}

/** 기타 별자리 — 성도를 한 덩어리 3D 케이지로 */
function buildSignCage(signId, accentHex, opacity, depth = 0.36) {
  const data = HERO_CONSTELLATIONS[signId] || HERO_CONSTELLATIONS.aries;
  const edges = new Set();
  const addEdge = (p1, p2) => {
    const k = `${p1.join(',')}|${p2.join(',')}`;
    const k2 = `${p2.join(',')}|${p1.join(',')}`;
    if (!edges.has(k) && !edges.has(k2)) edges.add(k);
  };

  const back = data.stars.map(([x, y, z]) => [x, y, z - depth]);

  for (const [a, b] of data.lines) {
    addEdge(data.stars[a], data.stars[b]);
    addEdge(back[a], back[b]);
    addEdge(data.stars[a], back[a]);
  }

  const verts = [];
  for (const key of edges) {
    const [s1, s2] = key.split('|');
    verts.push(...s1.split(',').map(Number), ...s2.split(',').map(Number));
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
  const cage = new THREE.LineSegments(geo, wireMat(accentHex, opacity));
  cage.userData.isMonolith = true;
  return cage;
}

export function buildConstellationWireframe(signId, accentHex, options = {}) {
  const { targetSize = 1.35, wireOpacity = 0.92 } = options;
  const group = new THREE.Group();

  const monolith =
    signId === 'gemini'
      ? buildGeminiMonolith(accentHex, wireOpacity)
      : buildSignCage(signId, accentHex, wireOpacity);

  group.add(monolith);

  const box = new THREE.Box3().setFromObject(group);
  const size = new THREE.Vector3();
  box.getSize(size);
  const maxDim = Math.max(size.x, size.y, size.z, 0.001);
  group.scale.setScalar(targetSize / maxDim);

  return group;
}