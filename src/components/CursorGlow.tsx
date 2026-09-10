import { useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CursorGlow() {
  const x = useMotionValue(-500);
  const y = useMotionValue(-500);
  const springX = useSpring(x, { stiffness: 120, damping: 25, mass: 0.5 });
  const springY = useSpring(y, { stiffness: 120, damping: 25, mass: 0.5 });

  useEffect(() => {
    // 触屏设备不启用
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const handleMove = (event: PointerEvent) => {
      x.set(event.clientX - 250);
      y.set(event.clientY - 250);
    };
    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
  }, [x, y]);

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-0 h-[500px] w-[500px] rounded-full [background:radial-gradient(circle,rgba(99,102,241,0.14),transparent_65%)]"
      style={{ x: springX, y: springY }}
    />
  );
}
