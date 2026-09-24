import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

/**
 * 摄影作品墙:缩略图网格 + 点击大图查看(左右切换 / ESC 关闭)
 * 图片放在 public/photos/,新增照片只需在 PHOTOS 数组加一项
 */

const PHOTOS = [1, 2, 3, 4].map((n) => ({
  src: `${import.meta.env.BASE_URL}photos/photo-${n}.jpg`,
  alt: `摄影作品 ${n}`,
}));

const navBtnCls =
  'flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/15 text-white backdrop-blur-xl transition-colors duration-200 hover:bg-white/30';

export default function PhotoGallery() {
  const [index, setIndex] = useState<number | null>(null);

  const close = () => setIndex(null);
  const prev = () => setIndex((i) => (i === null ? null : (i + PHOTOS.length - 1) % PHOTOS.length));
  const next = () => setIndex((i) => (i === null ? null : (i + 1) % PHOTOS.length));

  useEffect(() => {
    if (index === null) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
      if (event.key === 'ArrowLeft') prev();
      if (event.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  return (
    <>
      {/* 缩略图网格 */}
      <div className="mt-4 grid grid-cols-2 gap-2.5 lg:grid-cols-4">
        {PHOTOS.map((photo, i) => (
          <button
            key={photo.src}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`查看大图:${photo.alt}`}
            className="group relative overflow-hidden rounded-xl border border-slate-900/10 transition-all duration-300 hover:border-cyan-500/50 hover:shadow-[0_8px_24px_rgba(8,145,178,0.18)]"
          >
            <img
              src={photo.src}
              alt={photo.alt}
              loading="lazy"
              className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </button>
        ))}
      </div>

      {/* 大图查看(portal 到 body,避免被卡片 overflow 裁剪) */}
      {createPortal(
        <AnimatePresence>
          {index !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-6 backdrop-blur-sm"
              onClick={close}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={index}
                  src={PHOTOS[index].src}
                  alt={PHOTOS[index].alt}
                  initial={{ scale: 0.92, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="max-h-[80vh] max-w-[88vw] rounded-2xl shadow-[0_24px_80px_rgba(0,0,0,0.5)]"
                  onClick={(event) => event.stopPropagation()}
                />
              </AnimatePresence>

              <button
                type="button"
                aria-label="关闭"
                onClick={close}
                className={`${navBtnCls} absolute right-5 top-5`}
              >
                <X className="h-5 w-5" />
              </button>
              <button
                type="button"
                aria-label="上一张"
                onClick={(event) => {
                  event.stopPropagation();
                  prev();
                }}
                className={`${navBtnCls} absolute left-4`}
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                type="button"
                aria-label="下一张"
                onClick={(event) => {
                  event.stopPropagation();
                  next();
                }}
                className={`${navBtnCls} absolute right-4`}
              >
                <ChevronRight className="h-6 w-6" />
              </button>

              <span className="pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 font-mono text-xs text-white/70">
                {index + 1} / {PHOTOS.length}
              </span>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  );
}
