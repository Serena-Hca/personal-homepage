import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bot, X } from 'lucide-react';
import TwinChat from './TwinChat';

/**
 * 数字分身「小何」:右下角悬浮圆钮 + 悬浮聊天窗
 * 聊天界面本体在 TwinChat.tsx(主页「数字分身」板块也复用同一个组件)
 */

export default function DigitalTwin() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* 悬浮按钮 */}
      <motion.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2, type: 'spring', stiffness: 260, damping: 20 }}
        aria-label={open ? '关闭数字分身' : '打开数字分身'}
        className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-[0_8px_28px_rgba(99,102,241,0.45)] transition-shadow duration-300 hover:shadow-[0_10px_36px_rgba(139,92,246,0.55)]"
      >
        {open ? <X className="h-6 w-6" /> : <Bot className="h-6 w-6" />}
      </motion.button>

      {/* 悬浮聊天窗 */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed bottom-24 right-4 z-40 h-[min(480px,72vh)] w-[calc(100vw-2rem)] max-w-sm overflow-hidden rounded-2xl border border-slate-900/10 bg-white/85 shadow-[0_16px_48px_rgba(15,23,42,0.18)] backdrop-blur-2xl"
          >
            <TwinChat showHeader onClose={() => setOpen(false)} className="h-full" />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
