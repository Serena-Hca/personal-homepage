import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * 3D 神经元教堂背景(基于用户提供的 Neural Cathedral demo 改造,适配浅色主题)
 * - 球面点云经 3D simplex 噪声位移,缓慢自转,像一座活的神经结构
 * - 配色:深靛蓝 / 紫罗兰 / 青色(主页主色调)
 * - 点击任意处触发一次「神经冲动」(振幅脉冲 + 旋转加速)
 * - 鼠标轻微视差;尊重 reduced-motion;页面隐藏时暂停
 */

const VERTEX_SHADER = /* glsl */ `
uniform float uTime;
uniform float uAmp;
uniform float uScale;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uColorC;
varying vec3 vColor;

/* --- Ashima 3D simplex noise(与原始 demo 一致)--- */
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}

void main() {
  vec3 p = position;
  float n = snoise(p * 1.6 + uTime * 0.22);
  float n2 = snoise(p * 3.2 - uTime * 0.16) * 0.4;
  vec3 displaced = p * (1.0 + uAmp * (n + n2) * 0.16);
  vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  float size = 0.013 + (n * 0.5 + 0.5) * 0.017;
  gl_PointSize = size * uScale / -mvPosition.z;
  vec3 c1 = mix(uColorA, uColorB, smoothstep(-0.6, 0.6, n));
  vColor = mix(c1, uColorC, smoothstep(0.1, 0.9, n2));
}
`;

const FRAGMENT_SHADER = /* glsl */ `
varying vec3 vColor;
void main() {
  float r = length(gl_PointCoord - vec2(0.5));
  if (r > 0.5) discard;
  float a = smoothstep(0.5, 0.04, r);
  gl_FragColor = vec4(vColor, a * 0.55);
}
`;

/** 适配浅色主题的深色调(比原 demo 的霓虹色收敛) */
const COLORS = {
  indigo: new THREE.Color('#4f46e5'),
  violet: new THREE.Color('#7c3aed'),
  cyan: new THREE.Color('#0891b2'),
};

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
      return; // 不支持 WebGL 时静默降级(原 2D 背景不受影响)
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 9);

    const uniforms = {
      uTime: { value: 0 },
      uAmp: { value: 1.0 },
      uScale: { value: 1000 },
      uColorA: { value: COLORS.indigo },
      uColorB: { value: COLORS.violet },
      uColorC: { value: COLORS.cyan },
    };

    const geometry = new THREE.SphereGeometry(2.4, 96, 96);
    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      transparent: true,
      depthWrite: false,
    });

    const points = new THREE.Points(geometry, material);
    const group = new THREE.Group();
    group.add(points);
    scene.add(group);

    let width = 0;
    let height = 0;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      // 点大小换算系数:像素 = 世界尺寸 × uScale ÷ 距离
      uniforms.uScale.value = (height * renderer.getPixelRatio() / 2) / Math.tan((Math.PI / 180) * 22.5);
      // 宽屏时把结构放到右侧,给中央内容让位;窄屏居中
      group.position.set(width > 900 ? 3.4 : 0, 0.3, 0);
    };

    /* ---- 交互:点击触发神经冲动 / 鼠标视差 ---- */
    let impulseTarget = 1.0;
    let rotationBoost = 0;
    const pointer = { x: 0, y: 0 };

    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0) return;
      impulseTarget = 2.2;
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
    let elapsed = 0;

    const frame = () => {
      const now = performance.now();
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      elapsed += dt;

      // 冲动衰减 + 振幅逼近
      impulseTarget += (1.0 - impulseTarget) * dt * 1.6;
      uniforms.uAmp.value += (impulseTarget - uniforms.uAmp.value) * dt * 6;
      rotationBoost *= Math.pow(0.02, dt);

      uniforms.uTime.value = elapsed;

      // 缓慢自转 + 冲动时加速
      group.rotation.y += dt * (0.16 + rotationBoost * 1.2);
      group.rotation.x = Math.sin(elapsed * 0.08) * 0.12;

      // 鼠标视差
      if (finePointer) {
        camera.position.x += (pointer.x * 0.7 - camera.position.x) * dt * 2.5;
        camera.position.y += (-pointer.y * 0.45 - camera.position.y) * dt * 2.5;
      }
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      raf = requestAnimationFrame(frame);
    };

    resize();
    if (reduced) {
      // 静态渲染一帧
      uniforms.uTime.value = 0.8;
      renderer.render(scene, camera);
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
      geometry.dispose();
      material.dispose();
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
