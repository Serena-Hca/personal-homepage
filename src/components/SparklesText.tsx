import { useId, useMemo } from 'react';
import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

/**
 * 星光文字效果(仿 Magic UI SparklesText)
 * 文字周围随机散布四角星,循环闪烁缩放
 */

interface SparklesTextProps {
  children: ReactNode;
  className?: string;
  /** 星星数量 */
  sparklesCount?: number;
  /** 星星渐变色(随机取两色之一) */
  colors?: { first: string; second: string };
}

const DEFAULT_COLORS = { first: '#8B5CF6', second: '#06B6D4' };

interface SparkleProps {
  size: number;
  left: string;
  top: string;
  delay: number;
  from: string;
  to: string;
}

function Sparkle({ size, left, top, delay, from, to }: SparkleProps) {
  const id = useId();
  return (
    <motion.span
      aria-hidden="true"
      initial={{ opacity: 0, scale: 0, rotate: 0 }}
      animate={{ opacity: [0, 1, 0], scale: [0, 1.2, 0], rotate: [0, 45, 90] }}
      transition={{ duration: 2.4, repeat: Infinity, delay, ease: 'easeInOut' }}
      className="pointer-events-none absolute"
      style={{ left, top, width: size, height: size }}
    >
      <svg viewBox="0 0 24 24" fill={`url(#${id})`} className="h-full w-full">
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
            <stop stopColor={from} />
            <stop offset="1" stopColor={to} />
          </linearGradient>
        </defs>
        <path d="M12 0L12.93 9.07L22 10L12.93 10.93L12 20L11.07 10.93L2 10L11.07 9.07Z" />
      </svg>
    </motion.span>
  );
}

export default function SparklesText({
  children,
  className = '',
  sparklesCount = 16,
  colors = DEFAULT_COLORS,
}: SparklesTextProps) {
  const sparkles = useMemo(
    () =>
      Array.from({ length: sparklesCount }, () => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        size: 10 + Math.random() * 16,
        delay: Math.random() * 2.4,
        from: Math.random() > 0.5 ? colors.first : colors.second,
        to: Math.random() > 0.5 ? colors.first : colors.second,
      })),
    [sparklesCount, colors.first, colors.second],
  );

  return (
    <span className={`relative inline-block ${className}`}>
      {/* 星星层 */}
      <span className="pointer-events-none absolute inset-0" aria-hidden="true">
        {sparkles.map((sparkle, i) => (
          <Sparkle key={i} {...sparkle} />
        ))}
      </span>
      {/* 文字层 */}
      <span className="relative">{children}</span>
    </span>
  );
}
