import { useRef } from 'react';
import type { MouseEvent, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  /** 悬停时上浮 4px */
  lift?: boolean;
  /** 卡片内跟随光标的径向聚光 */
  spotlight?: boolean;
  /** 入场动画延迟(秒),用于错落出现 */
  delay?: number;
}

export default function GlassCard({
  children,
  className = '',
  lift = true,
  spotlight = true,
  delay = 0,
}: GlassCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    if (!spotlight || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    ref.current.style.setProperty('--spot-x', `${event.clientX - rect.left}px`);
    ref.current.style.setProperty('--spot-y', `${event.clientY - rect.top}px`);
  };

  return (
    /* 外层:入场 reveal(独立的 transition,避免 delay 影响 hover) */
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
    >
      {/* 内层:玻璃样式 + hover 上浮 */}
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        whileHover={lift ? { y: -4 } : undefined}
        transition={{ type: 'spring', stiffness: 320, damping: 24 }}
        className={[
          'group relative overflow-hidden rounded-2xl border border-slate-900/10',
          'bg-white/60 backdrop-blur-xl',
          'shadow-[0_8px_32px_0_rgba(15,23,42,0.10)]',
          'transition-colors duration-300 hover:border-indigo-500/50',
          className,
        ].join(' ')}
      >
        {/* 顶部高光线 */}
        <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent" />

        {/* 光标聚光 */}
        {spotlight && (
          <div
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{
              background:
                'radial-gradient(240px circle at var(--spot-x, 50%) var(--spot-y, 50%), rgba(99,102,241,0.15), transparent 70%)',
            }}
          />
        )}

        <div className="relative">{children}</div>
      </motion.div>
    </motion.div>
  );
}
