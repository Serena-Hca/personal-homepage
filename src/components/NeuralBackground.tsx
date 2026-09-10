import { useEffect, useRef } from 'react';

/**
 * 神经元网络背景动画(脑机接口风格)
 * - 神经元胞体缓慢漂移,鼠标靠近会轻微推开
 * - 近距离神经元之间绘制突触连线
 * - 信号脉冲沿突触传导(动作电位)
 * 颜色沿用主色调:indigo / violet / cyan
 */

const MAX_DIST = 150; // 突触最大连接距离
const MAX_PULSES = 18; // 同屏最大脉冲数
const PULSE_COLORS = ['#4f46e5', '#7c3aed', '#0891b2']; // indigo-600 / violet-600 / cyan-600

interface Neuron {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  color: string;
}

interface Pulse {
  from: Neuron;
  to: Neuron;
  t: number; // 0 → 1 传导进度
  speed: number;
  color: string;
}

const NEURON_COLORS = ['#6366f1', '#8b5cf6', '#06b6d4'];

export default function NeuralBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(pointer: fine)').matches;

    let width = 0;
    let height = 0;
    let neurons: Neuron[] = [];
    let pulses: Pulse[] = [];
    let raf = 0;
    const pointer = { x: -9999, y: -9999 };

    const spawnNeuron = (): Neuron => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: 2.2 + Math.random() * 3.2,
      color: NEURON_COLORS[Math.floor(Math.random() * NEURON_COLORS.length)],
    });

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.round(Math.min(60, Math.max(22, (width * height) / 40000)));
      neurons = Array.from({ length: count }, () => spawnNeuron());
    };

    const frame = () => {
      ctx.clearRect(0, 0, width, height);

      if (!reduced) {
        // 1. 神经元漂移 + 鼠标轻推 + 边界环绕
        for (const n of neurons) {
          const dx = n.x - pointer.x;
          const dy = n.y - pointer.y;
          const d = Math.hypot(dx, dy);
          if (d < 110 && d > 0.01) {
            const force = ((110 - d) / 110) * 0.06;
            n.vx += (dx / d) * force;
            n.vy += (dy / d) * force;
          }
          const speed = Math.hypot(n.vx, n.vy);
          if (speed > 0.7) {
            n.vx = (n.vx / speed) * 0.7;
            n.vy = (n.vy / speed) * 0.7;
          }
          n.x += n.vx;
          n.y += n.vy;
          if (n.x < -20) n.x = width + 20;
          else if (n.x > width + 20) n.x = -20;
          if (n.y < -20) n.y = height + 20;
          else if (n.y > height + 20) n.y = -20;
        }
      }

      // 2. 突触连线(距离越近越清晰)
      ctx.lineWidth = 1;
      for (let i = 0; i < neurons.length; i++) {
        for (let j = i + 1; j < neurons.length; j++) {
          const a = neurons[i];
          const b = neurons[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 > MAX_DIST * MAX_DIST) continue;
          const d = Math.sqrt(d2);
          ctx.strokeStyle = `rgba(99, 102, 241, ${(1 - d / MAX_DIST) * 0.16})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      // 3. 神经元胞体(光晕 + 内核)
      for (const n of neurons) {
        ctx.fillStyle = n.color;
        ctx.globalAlpha = 0.1;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * 3.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 0.42;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      if (!reduced) {
        // 4. 随机生成信号脉冲
        if (pulses.length < MAX_PULSES && Math.random() < 0.12) {
          const from = neurons[Math.floor(Math.random() * neurons.length)];
          const near = neurons.filter(
            (n) => n !== from && Math.hypot(n.x - from.x, n.y - from.y) < MAX_DIST,
          );
          if (near.length > 0) {
            const to = near[Math.floor(Math.random() * near.length)];
            pulses.push({
              from,
              to,
              t: 0,
              speed: 0.004 + Math.random() * 0.007,
              color: PULSE_COLORS[Math.floor(Math.random() * PULSE_COLORS.length)],
            });
          }
        }

        // 5. 脉冲传导绘制
        pulses = pulses.filter((p) => {
          p.t += p.speed;
          if (p.t >= 1) return false;
          const x = p.from.x + (p.to.x - p.from.x) * p.t;
          const y = p.from.y + (p.to.y - p.from.y) * p.t;
          ctx.fillStyle = p.color;
          ctx.globalAlpha = 0.18;
          ctx.beginPath();
          ctx.arc(x, y, 7, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 0.75;
          ctx.beginPath();
          ctx.arc(x, y, 2.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1;
          return true;
        });
      }

      if (!reduced) raf = requestAnimationFrame(frame);
    };

    const onPointerMove = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
    };

    const onVisibility = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden && !reduced) raf = requestAnimationFrame(frame);
    };

    resize();
    frame(); // 首次绘制;reduced-motion 用户只会看到静态画面
    window.addEventListener('resize', resize);
    if (finePointer && !reduced) window.addEventListener('pointermove', onPointerMove);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('visibilitychange', onVisibility);
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
