import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * 3D 神经元网络背景(浅色主题适配)
 * - 稀疏的细胞体簇 + 细突触连线 + 向外延伸的轴突,形态更像真实神经元
 * - 3D simplex 噪声驱动缓慢漂移(CPU 计算,以便动态重建突触连线)
 * - 点击任意处触发「神经冲动」;鼠标轻微视差;尊重 reduced-motion
 */

/* ---------- Ashima 3D simplex noise(JS 移植) ---------- */
const grad3 = [
  [1, 1, 0], [-1, 1, 0], [1, -1, 0], [-1, -1, 0],
  [1, 0, 1], [-1, 0, 1], [1, 0, -1], [-1, 0, -1],
  [0, 1, 1], [0, -1, 1], [0, 1, -1], [0, -1, -1],
];
const PERM_SEED = [
  151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69,
  142, 8, 99, 37, 240, 21, 10, 23, 190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219,
  203, 117, 35, 11, 32, 57, 177, 33, 88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175,
  74, 165, 71, 134, 139, 48, 27, 166, 77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230,
  220, 105, 92, 41, 55, 46, 245, 40, 244, 102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73, 209, 76,
  132, 187, 208, 89, 18, 169, 200, 196, 135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173,
  186, 3, 64, 52, 217, 226, 250, 124, 123, 5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206,
  59, 227, 47, 16, 58, 17, 182, 189, 28, 42, 223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163,
  70, 221, 153, 101, 155, 167, 43, 172, 9, 129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232,
  178, 185, 112, 104, 218, 246, 97, 228, 251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241,
  81, 51, 145, 235, 249, 14, 239, 107, 49, 192, 214, 31, 181, 199, 106, 157, 184, 84, 204, 176,
  115, 121, 50, 45, 127, 4, 150, 254, 138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128,
  195, 78, 66, 215, 61, 156, 180,
];
const perm = new Uint8Array(512);
const permMod12 = new Uint8Array(512);
for (let i = 0; i < 512; i++) {
  perm[i] = PERM_SEED[i & 255];
  permMod12[i] = perm[i] % 12;
}

function snoise3(xin: number, yin: number, zin: number): number {
  const F3 = 1 / 3;
  const G3 = 1 / 6;
  const s = (xin + yin + zin) * F3;
  const i = Math.floor(xin + s);
  const j = Math.floor(yin + s);
  const k = Math.floor(zin + s);
  const t = (i + j + k) * G3;
  const x0 = xin - (i - t);
  const y0 = yin - (j - t);
  const z0 = zin - (k - t);
  let i1: number, j1: number, k1: number, i2: number, j2: number, k2: number;
  if (x0 >= y0) {
    if (y0 >= z0) { i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 1; k2 = 0; }
    else if (x0 >= z0) { i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 0; k2 = 1; }
    else { i1 = 0; j1 = 0; k1 = 1; i2 = 1; j2 = 0; k2 = 1; }
  } else {
    if (y0 < z0) { i1 = 0; j1 = 0; k1 = 1; i2 = 0; j2 = 1; k2 = 1; }
    else if (x0 < z0) { i1 = 0; j1 = 1; k1 = 0; i2 = 0; j2 = 1; k2 = 1; }
    else { i1 = 0; j1 = 1; k1 = 0; i2 = 1; j2 = 1; k2 = 0; }
  }
  const x1 = x0 - i1 + G3;
  const y1 = y0 - j1 + G3;
  const z1 = z0 - k1 + G3;
  const x2 = x0 - i2 + 2 * G3;
  const y2 = y0 - j2 + 2 * G3;
  const z2 = z0 - k2 + 2 * G3;
  const x3 = x0 - 1 + 3 * G3;
  const y3 = y0 - 1 + 3 * G3;
  const z3 = z0 - 1 + 3 * G3;
  const ii = i & 255;
  const jj = j & 255;
  const kk = k & 255;
  const gi0 = permMod12[ii + perm[jj + perm[kk]]];
  const gi1 = permMod12[ii + i1 + perm[jj + j1 + perm[kk + k1]]];
  const gi2 = permMod12[ii + i2 + perm[jj + j2 + perm[kk + k2]]];
  const gi3 = permMod12[ii + 1 + perm[jj + 1 + perm[kk + 1]]];
  let n0 = 0, n1 = 0, n2 = 0, n3 = 0;
  let t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0;
  if (t0 > 0) {
    t0 *= t0;
    n0 = t0 * t0 * (grad3[gi0][0] * x0 + grad3[gi0][1] * y0 + grad3[gi0][2] * z0);
  }
  let t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1;
  if (t1 > 0) {
    t1 *= t1;
    n1 = t1 * t1 * (grad3[gi1][0] * x1 + grad3[gi1][1] * y1 + grad3[gi1][2] * z1);
  }
  let t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2;
  if (t2 > 0) {
    t2 *= t2;
    n2 = t2 * t2 * (grad3[gi2][0] * x2 + grad3[gi2][1] * y2 + grad3[gi2][2] * z2);
  }
  let t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3;
  if (t3 > 0) {
    t3 *= t3;
    n3 = t3 * t3 * (grad3[gi3][0] * x3 + grad3[gi3][1] * y3 + grad3[gi3][2] * z3);
  }
  return 32.0 * (n0 + n1 + n2 + n3);
}

/* ---------- 场景参数 ---------- */
const POINT_COUNT = 1100;
const CLUSTER_COUNT = 5;
const EDGE_DIST = 0.6; // 突触连接的最大距离
const EDGE_INTERVAL = 10; // 每 10 帧重建一次连线
const MAX_EDGES = 1600;
const COLORS = {
  indigo: new THREE.Color('#4f46e5'),
  violet: new THREE.Color('#7c3aed'),
  cyan: new THREE.Color('#0891b2'),
};

const POINTS_VERTEX = /* glsl */ `
attribute vec3 aColor;
attribute float aSize;
uniform float uScale;
varying vec3 vColor;
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = aSize * uScale / -mv.z;
  vColor = aColor;
}
`;

const POINTS_FRAGMENT = /* glsl */ `
varying vec3 vColor;
void main() {
  float r = length(gl_PointCoord - vec2(0.5));
  if (r > 0.5) discard;
  float a = smoothstep(0.5, 0.04, r);
  gl_FragColor = vec4(vColor, a * 0.5);
}
`;

export default function NeuralCathedral() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(pointer: fine)').matches;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    } catch {
      return; // 不支持 WebGL 时静默降级
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 9);

    /* ---- 生成神经元:细胞体簇 + 轴突延伸 ---- */
    const basePos = new Float32Array(POINT_COUNT * 3);
    const sizes = new Float32Array(POINT_COUNT);
    const colorArr = new Float32Array(POINT_COUNT * 3);

    const clusters: THREE.Vector3[] = [];
    for (let c = 0; c < CLUSTER_COUNT; c++) {
      clusters.push(new THREE.Vector3().randomDirection().multiplyScalar(0.9 + Math.random() * 0.8));
    }

    const pickColor = (): THREE.Color => {
      const r = Math.random();
      if (r < 0.66) return COLORS.indigo;
      if (r < 0.9) return COLORS.violet;
      return COLORS.cyan;
    };
    const randDir = (): THREE.Vector3 => new THREE.Vector3().randomDirection();

    for (let i = 0; i < POINT_COUNT; i++) {
      let p: THREE.Vector3;
      let size: number;
      let color: THREE.Color;
      if (i < 45) {
        // 大细胞体(soma)
        const c = clusters[Math.floor(Math.random() * CLUSTER_COUNT)];
        p = c.clone().multiplyScalar(0.85 + Math.random() * 0.35).add(randDir().multiplyScalar(0.2));
        size = 0.034 + Math.random() * 0.02;
        color = Math.random() < 0.6 ? COLORS.violet : COLORS.cyan;
      } else if (i % 9 === 0) {
        // 轴突末梢(向外延伸)
        p = randDir().multiplyScalar(2.4 + Math.random() * 0.9);
        size = 0.012 + Math.random() * 0.005;
        color = COLORS.cyan;
      } else {
        // 普通神经元
        const c = clusters[Math.floor(Math.random() * CLUSTER_COUNT)];
        p = c.clone().multiplyScalar(0.5 + Math.random() * 0.9).add(randDir().multiplyScalar(0.35 + Math.random() * 0.7));
        size = 0.015 + Math.random() * 0.009;
        color = pickColor();
      }
      basePos[i * 3] = p.x;
      basePos[i * 3 + 1] = p.y;
      basePos[i * 3 + 2] = p.z;
      sizes[i] = size;
      colorArr[i * 3] = color.r;
      colorArr[i * 3 + 1] = color.g;
      colorArr[i * 3 + 2] = color.b;
    }

    /* ---- 点云 ---- */
    const positions = new Float32Array(POINT_COUNT * 3);
    const pointsGeometry = new THREE.BufferGeometry();
    pointsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    pointsGeometry.setAttribute('aColor', new THREE.BufferAttribute(colorArr, 3));
    pointsGeometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    const pointsMaterial = new THREE.ShaderMaterial({
      uniforms: { uScale: { value: 1000 } },
      vertexShader: POINTS_VERTEX,
      fragmentShader: POINTS_FRAGMENT,
      transparent: true,
      depthWrite: false,
    });
    const points = new THREE.Points(pointsGeometry, pointsMaterial);

    /* ---- 突触连线(动态重建) ---- */
    const linePositions = new Float32Array(MAX_EDGES * 6);
    const linesGeometry = new THREE.BufferGeometry();
    linesGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    linesGeometry.setDrawRange(0, 0);
    const linesMaterial = new THREE.LineBasicMaterial({
      color: '#6366f1',
      transparent: true,
      opacity: 0.14,
      depthWrite: false,
    });
    const lines = new THREE.LineSegments(linesGeometry, linesMaterial);

    const group = new THREE.Group();
    group.add(points);
    group.add(lines);
    scene.add(group);

    let width = 0;
    let height = 0;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      pointsMaterial.uniforms.uScale.value =
        (height * renderer.getPixelRatio()) / 2 / Math.tan((Math.PI / 180) * 22.5);
      group.position.set(width > 900 ? 3.2 : 0, 0.25, 0);
      // 手机屏幕窄,整体缩小避免裁切
      group.scale.setScalar(width < 768 ? 0.62 : 1);
    };

    /* ---- 位移计算(CPU)+ 突触重建 ---- */
    let amp = 1.0;
    let impulseTarget = 1.0;
    let rotationBoost = 0;
    let elapsed = 0;
    let frameCount = 0;

    const updatePositions = () => {
      const t = elapsed;
      for (let i = 0; i < POINT_COUNT; i++) {
        const bx = basePos[i * 3];
        const by = basePos[i * 3 + 1];
        const bz = basePos[i * 3 + 2];
        const n1 = snoise3(bx * 1.4 + t * 0.16, by * 1.4 + t * 0.16, bz * 1.4 + t * 0.16);
        const n2 = snoise3(bx * 3.0 - t * 0.12, by * 3.0 - t * 0.12, bz * 3.0 - t * 0.12) * 0.4;
        const s = 1 + amp * (n1 + n2) * 0.22;
        positions[i * 3] = bx * s;
        positions[i * 3 + 1] = by * s;
        positions[i * 3 + 2] = bz * s;
      }
      pointsGeometry.attributes.position.needsUpdate = true;
    };

    const rebuildEdges = () => {
      const d2max = EDGE_DIST * EDGE_DIST;
      let idx = 0;
      outer: for (let i = 0; i < POINT_COUNT; i++) {
        const ix = positions[i * 3];
        const iy = positions[i * 3 + 1];
        const iz = positions[i * 3 + 2];
        for (let j = i + 1; j < POINT_COUNT; j++) {
          const dx = ix - positions[j * 3];
          const dy = iy - positions[j * 3 + 1];
          const dz = iz - positions[j * 3 + 2];
          if (dx * dx + dy * dy + dz * dz > d2max) continue;
          linePositions[idx * 6] = ix;
          linePositions[idx * 6 + 1] = iy;
          linePositions[idx * 6 + 2] = iz;
          linePositions[idx * 6 + 3] = positions[j * 3];
          linePositions[idx * 6 + 4] = positions[j * 3 + 1];
          linePositions[idx * 6 + 5] = positions[j * 3 + 2];
          idx++;
          if (idx >= MAX_EDGES) break outer;
        }
      }
      linesGeometry.attributes.position.needsUpdate = true;
      linesGeometry.setDrawRange(0, idx * 2);
    };

    /* ---- 交互 ---- */
    const pointer = { x: 0, y: 0 };
    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0) return;
      impulseTarget = 2.0;
      rotationBoost = 1;
    };
    const onPointerMove = (event: PointerEvent) => {
      pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (event.clientY / window.innerHeight) * 2 - 1;
    };
    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
      } else if (!reduced) {
        raf = requestAnimationFrame(frame);
      }
    };

    let raf = 0;
    let last = performance.now();

    const frame = () => {
      const now = performance.now();
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      elapsed += dt;
      frameCount++;

      impulseTarget += (1.0 - impulseTarget) * dt * 1.5;
      amp += (impulseTarget - amp) * dt * 5;
      rotationBoost *= Math.pow(0.02, dt);

      updatePositions();
      if (frameCount % EDGE_INTERVAL === 0) rebuildEdges();

      group.rotation.y += dt * (0.07 + rotationBoost * 0.9);
      group.rotation.x = Math.sin(elapsed * 0.06) * 0.1;

      if (finePointer) {
        camera.position.x += (pointer.x * 0.7 - camera.position.x) * dt * 2.5;
        camera.position.y += (-pointer.y * 0.45 - camera.position.y) * dt * 2.5;
      }
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      raf = requestAnimationFrame(frame);
    };

    resize();
    updatePositions();
    rebuildEdges();
    if (reduced) {
      renderer.render(scene, camera); // 静态一帧
    } else {
      raf = requestAnimationFrame(frame);
    }

    window.addEventListener('resize', resize);
    window.addEventListener('pointerdown', onPointerDown);
    if (finePointer && !reduced) window.addEventListener('pointermove', onPointerMove);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('visibilitychange', onVisibility);
      pointsGeometry.dispose();
      pointsMaterial.dispose();
      linesGeometry.dispose();
      linesMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
    />
  );
}
