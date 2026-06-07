import * as THREE from "three";
import { applyBubbleText } from "./bubble-text.js";

const STORAGE_KEY = "byulbit_bg_mode";

const VERTEX_SHADER = `
  void main() {
    gl_Position = vec4(position, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  uniform float iTime;
  uniform vec2 iResolution;

  #define NUM_OCTAVES 3

  float rand(vec2 n) {
    return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 ip = floor(p);
    vec2 u = fract(p);
    u = u * u * (3.0 - 2.0 * u);

    float res = mix(
      mix(rand(ip), rand(ip + vec2(1.0, 0.0)), u.x),
      mix(rand(ip + vec2(0.0, 1.0)), rand(ip + vec2(1.0, 1.0)), u.x),
      u.y
    );
    return res * res;
  }

  float fbm(vec2 x) {
    float v = 0.0;
    float a = 0.3;
    vec2 shift = vec2(100.0);
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
    for (int i = 0; i < NUM_OCTAVES; ++i) {
      v += a * noise(x);
      x = rot * x * 2.0 + shift;
      a *= 0.4;
    }
    return v;
  }

  void main() {
    vec2 shake = vec2(sin(iTime * 1.2) * 0.005, cos(iTime * 2.1) * 0.005);
    vec2 p = ((gl_FragCoord.xy + shake * iResolution.xy) - iResolution.xy * 0.5) / iResolution.y * mat2(6.0, -4.0, 4.0, 6.0);
    vec2 v;
    vec4 o = vec4(0.0);

    float f = 2.0 + fbm(p + vec2(iTime * 5.0, 0.0)) * 0.5;

    for (float i = 0.0; i < 35.0; i++) {
      v = p + cos(i * i + (iTime + p.x * 0.08) * 0.025 + i * vec2(13.0, 11.0)) * 3.5
        + vec2(sin(iTime * 3.0 + i) * 0.003, cos(iTime * 3.5 - i) * 0.003);
      float tailNoise = fbm(v + vec2(iTime * 0.5, i)) * 0.3 * (1.0 - (i / 35.0));
      vec4 auroraColors = vec4(
        0.1 + 0.3 * sin(i * 0.2 + iTime * 0.4),
        0.3 + 0.5 * cos(i * 0.3 + iTime * 0.5),
        0.7 + 0.3 * sin(i * 0.4 + iTime * 0.3),
        1.0
      );
      vec4 currentContribution = auroraColors
        / length(max(v, vec2(v.x * f * 0.015, v.y * 1.5)));
      currentContribution *= exp(sin(i * i + iTime * 0.8));
      float thinnessFactor = smoothstep(0.0, 1.0, i / 35.0) * 0.6;
      o += currentContribution * (1.0 + tailNoise * 0.8) * thinnessFactor;
    }

    o = tanh(pow(o / 100.0, vec4(1.6)));
    gl_FragColor = o * 1.5;
  }
`;

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function loadMode() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "stars" || saved === "aurora") return saved;
  } catch {}
  return "aurora";
}

function saveMode(mode) {
  try {
    localStorage.setItem(STORAGE_KEY, mode);
  } catch {}
}

function setBodyMode(mode) {
  document.body.dataset.bgMode = mode;
}

function createAurora(mount) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x0a0a0f, 1);
  mount.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const material = new THREE.ShaderMaterial({
    uniforms: {
      iTime: { value: 0 },
      iResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    },
    vertexShader: VERTEX_SHADER,
    fragmentShader: FRAGMENT_SHADER,
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
  scene.add(mesh);

  const reducedMotion = prefersReducedMotion();

  return {
    resize() {
      renderer.setSize(window.innerWidth, window.innerHeight);
      material.uniforms.iResolution.value.set(window.innerWidth, window.innerHeight);
    },
    tick(t) {
      if (!reducedMotion) material.uniforms.iTime.value += 0.016;
      renderer.render(scene, camera);
    },
    dispose() {
      mesh.geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    },
  };
}

function createStars(mount) {
  const mobile = window.innerWidth < 768;
  const STAR_COUNT = mobile ? 700 : 1200;
  const FIELD = 18;
  const CONNECT_DIST = 2.2;
  const MAX_LINES = mobile ? 350 : 600;
  const COLORS = [
    new THREE.Color("#ffd84d"),
    new THREE.Color("#6ec8c8"),
    new THREE.Color("#9b6ec8"),
  ];
  const ACCENT = new THREE.Color("#ffd84d");

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x0a0a0f, 1);
  mount.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#0a0a0f");
  scene.fog = new THREE.Fog("#0a0a0f", 10, 28);

  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 10;

  const positions = new Float32Array(STAR_COUNT * 3);
  const colors = new Float32Array(STAR_COUNT * 3);
  const velocities = new Float32Array(STAR_COUNT * 3);
  const half = FIELD / 2;

  for (let i = 0; i < STAR_COUNT; i++) {
    const i3 = i * 3;
    positions[i3] = (Math.random() - 0.5) * FIELD;
    positions[i3 + 1] = (Math.random() - 0.5) * FIELD;
    positions[i3 + 2] = (Math.random() - 0.5) * FIELD * 0.6;
    velocities[i3] = (Math.random() - 0.5) * 0.003;
    velocities[i3 + 1] = (Math.random() - 0.5) * 0.003;
    velocities[i3 + 2] = (Math.random() - 0.5) * 0.002;
    const c = COLORS[Math.floor(Math.random() * COLORS.length)];
    colors[i3] = c.r;
    colors[i3 + 1] = c.g;
    colors[i3 + 2] = c.b;
  }

  const pointsGeo = new THREE.BufferGeometry();
  pointsGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  pointsGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  scene.add(
    new THREE.Points(
      pointsGeo,
      new THREE.PointsMaterial({
        size: 0.04,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
    )
  );

  const linePositions = new Float32Array(MAX_LINES * 6);
  const lineColors = new Float32Array(MAX_LINES * 6);
  const linesGeo = new THREE.BufferGeometry();
  linesGeo.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
  linesGeo.setAttribute("color", new THREE.BufferAttribute(lineColors, 3));
  scene.add(
    new THREE.LineSegments(
      linesGeo,
      new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.22,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
    )
  );

  const mouse = { x: 0, y: 0 };
  const camTarget = { x: 0, y: 0 };
  const onMove = (e) => {
    const cx = "touches" in e && e.touches.length ? e.touches[0].clientX : e.clientX;
    const cy = "touches" in e && e.touches.length ? e.touches[0].clientY : e.clientY;
    mouse.x = (cx / window.innerWidth - 0.5) * 2;
    mouse.y = (cy / window.innerHeight - 0.5) * 2;
  };
  window.addEventListener("mousemove", onMove, { passive: true });
  window.addEventListener("touchmove", onMove, { passive: true });

  const step = STAR_COUNT > 800 ? 3 : 1;
  const distSq = CONNECT_DIST * CONNECT_DIST;
  const reducedMotion = prefersReducedMotion();

  return {
    resize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    },
    tick(t) {
      const pos = pointsGeo.attributes.position.array;
      const zHalf = half * 0.6;

      if (!reducedMotion) {
        for (let i = 0; i < STAR_COUNT; i++) {
          const i3 = i * 3;
          pos[i3] += velocities[i3] + Math.sin(t * 0.3 + i * 0.01) * 0.001;
          pos[i3 + 1] += velocities[i3 + 1] + Math.cos(t * 0.2 + i * 0.015) * 0.001;
          pos[i3 + 2] += velocities[i3 + 2];
          for (let axis = 0; axis < 3; axis++) {
            const limit = axis === 2 ? zHalf : half;
            if (pos[i3 + axis] > limit) pos[i3 + axis] = -limit;
            if (pos[i3 + axis] < -limit) pos[i3 + axis] = limit;
          }
        }
        pointsGeo.attributes.position.needsUpdate = true;
      }

      let lineCount = 0;
      const lp = linesGeo.attributes.position.array;
      const lc = linesGeo.attributes.color.array;

      for (let i = 0; i < STAR_COUNT && lineCount < MAX_LINES; i += step) {
        const i3 = i * 3;
        for (let j = i + step; j < STAR_COUNT && lineCount < MAX_LINES; j += step) {
          const j3 = j * 3;
          const dx = pos[i3] - pos[j3];
          const dy = pos[i3 + 1] - pos[j3 + 1];
          const dz = pos[i3 + 2] - pos[j3 + 2];
          const d2 = dx * dx + dy * dy + dz * dz;
          if (d2 < distSq) {
            const n = lineCount * 6;
            lp[n] = pos[i3];
            lp[n + 1] = pos[i3 + 1];
            lp[n + 2] = pos[i3 + 2];
            lp[n + 3] = pos[j3];
            lp[n + 4] = pos[j3 + 1];
            lp[n + 5] = pos[j3 + 2];
            const alpha = 1 - Math.sqrt(d2) / CONNECT_DIST;
            lc[n] = ACCENT.r * alpha;
            lc[n + 1] = ACCENT.g * alpha;
            lc[n + 2] = ACCENT.b * alpha;
            lc[n + 3] = ACCENT.r * alpha;
            lc[n + 4] = ACCENT.g * alpha;
            lc[n + 5] = ACCENT.b * alpha;
            lineCount++;
          }
        }
      }
      for (let i = lineCount * 6; i < MAX_LINES * 6; i++) {
        lp[i] = 0;
        lc[i] = 0;
      }
      linesGeo.attributes.position.needsUpdate = true;
      linesGeo.attributes.color.needsUpdate = true;
      linesGeo.setDrawRange(0, lineCount * 2);

      camTarget.x += (mouse.x * 1.2 - camTarget.x) * 0.02;
      camTarget.y += (-mouse.y * 0.8 - camTarget.y) * 0.02;
      camera.position.x = camTarget.x;
      camera.position.y = camTarget.y;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    },
    dispose() {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onMove);
      pointsGeo.dispose();
      linesGeo.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    },
  };
}

function createToggle(onSwitch) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "bg-toggle";
  btn.setAttribute("aria-live", "polite");
  document.body.appendChild(btn);

  const updateLabel = (mode) => {
    btn.dataset.mode = mode;
    btn.textContent = mode === "aurora" ? "배경: 오로라" : "배경: 별빛";
    btn.setAttribute(
      "aria-label",
      mode === "aurora" ? "배경을 별빛 파티클로 전환" : "배경을 오로라 셰이더로 전환"
    );
  };

  btn.addEventListener("click", () => {
    const next = btn.dataset.mode === "aurora" ? "stars" : "aurora";
    onSwitch(next);
    updateLabel(next);
  });

  return { updateLabel };
}

function init() {
  const mount = document.getElementById("star-canvas");
  if (!mount) return;

  let mode = loadMode();
  let active = null;
  let frameId = 0;
  let running = true;
  const clock = new THREE.Clock();

  const switchMode = (next) => {
    mode = next;
    saveMode(next);
    setBodyMode(mode);
    active?.dispose();
    active = mode === "aurora" ? createAurora(mount) : createStars(mount);
  };

  const toggle = createToggle(switchMode);
  switchMode(mode);
  toggle.updateLabel(mode);

  const animate = () => {
    if (!running) return;
    frameId = requestAnimationFrame(animate);
    active?.tick(clock.getElapsedTime());
  };

  const onResize = () => active?.resize();
  const onVisibility = () => {
    running = !document.hidden;
    if (running) animate();
  };

  window.addEventListener("resize", onResize);
  document.addEventListener("visibilitychange", onVisibility);
  animate();

  return () => {
    running = false;
    cancelAnimationFrame(frameId);
    window.removeEventListener("resize", onResize);
    document.removeEventListener("visibilitychange", onVisibility);
    active?.dispose();
    document.querySelector(".bg-toggle")?.remove();
  };
}

function initBrandBubble() {
  document.querySelectorAll("a.brand:not([data-bubble])").forEach((el) => {
    applyBubbleText(el, el.textContent.trim(), "#ffd84d", { size: "brand" });
    el.setAttribute("data-bubble", "1");
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    init();
    initBrandBubble();
  });
} else {
  init();
  initBrandBubble();
}