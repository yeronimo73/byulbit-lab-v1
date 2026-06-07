import * as THREE from 'three';

let starTextureCache = null;

export function getStarTexture() {
  if (starTextureCache) return starTextureCache;

  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const cx = size / 2;
  const cy = size / 2;

  const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, size * 0.5);
  glow.addColorStop(0, 'rgba(255,255,255,1)');
  glow.addColorStop(0.05, 'rgba(255,252,245,1)');
  glow.addColorStop(0.15, 'rgba(255,235,200,0.55)');
  glow.addColorStop(0.35, 'rgba(255,255,255,0.15)');
  glow.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, size, size);

  ctx.globalCompositeOperation = 'lighter';
  ctx.strokeStyle = 'rgba(255,255,255,0.7)';
  ctx.lineWidth = 1.4;
  const ray = size * 0.46;
  ctx.beginPath();
  ctx.moveTo(cx, cy - ray);
  ctx.lineTo(cx, cy + ray);
  ctx.moveTo(cx - ray, cy);
  ctx.lineTo(cx + ray, cy);
  ctx.stroke();

  starTextureCache = new THREE.CanvasTexture(canvas);
  starTextureCache.needsUpdate = true;
  return starTextureCache;
}

/** Per-star twinkle via shader — round sprites, not squares */
export function createTwinkleStarMaterial(baseSize = 20) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uTexture: { value: getStarTexture() },
      uBaseSize: { value: baseSize },
    },
    vertexShader: `
      attribute vec3 color;
      attribute float phase;
      attribute float speed;
      varying vec3 vColor;
      varying float vTwinkle;
      uniform float uTime;
      uniform float uBaseSize;
      void main() {
        vColor = color;
        float wave = sin(uTime * speed + phase);
        vTwinkle = 0.2 + 0.8 * (0.5 + 0.5 * wave);
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = uBaseSize * (0.65 + 0.55 * vTwinkle) * (320.0 / max(-mvPosition.z, 1.0));
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform sampler2D uTexture;
      varying vec3 vColor;
      varying float vTwinkle;
      void main() {
        vec4 tex = texture2D(uTexture, gl_PointCoord);
        if (tex.a < 0.04) discard;
        float a = tex.a * vTwinkle;
        gl_FragColor = vec4(vColor * (0.75 + 0.35 * vTwinkle), a);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
}

export function createStarPointsMaterial(options = {}) {
  return createTwinkleStarMaterial(options.size ? options.size * 180 : 20);
}