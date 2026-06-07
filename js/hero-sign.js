import * as THREE from 'three';
import { buildConstellationWireframe } from './constellation-wireframes.js';

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function initHeroSign(sign) {
  const mount = document.getElementById('hero-sign-canvas');
  if (!mount || prefersReducedMotion()) return null;

  const size = 220;
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(size, size);
  renderer.setClearColor(0x000000, 0);
  mount.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 50);
  camera.position.z = 3.8;

  const root = buildConstellationWireframe(sign.id, sign.color);
  scene.add(root);

  const clock = new THREE.Clock();
  let running = true;

  const animate = () => {
    if (!running) return;
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();
    root.rotation.y = t * 0.18;
    root.rotation.x = Math.sin(t * 0.12) * 0.12;
    root.position.y = Math.sin(t * 0.3) * 0.04;
    renderer.render(scene, camera);
  };

  const onVisibility = () => {
    running = !document.hidden;
    if (running) animate();
  };
  document.addEventListener('visibilitychange', onVisibility);

  animate();

  return () => {
    running = false;
    document.removeEventListener('visibilitychange', onVisibility);
    root.traverse((obj) => {
      obj.geometry?.dispose();
      obj.material?.dispose();
    });
    renderer.dispose();
    mount.removeChild(renderer.domElement);
  };
}