import type { LucideIcon } from 'lucide-react';
import {
  BookOpen,
  Camera,
  FileText,
  Globe,
  Headphones,
} from 'lucide-react';
import { profile } from '../data';
import GlassCard from './GlassCard';
import PhotoGallery from './PhotoGallery';
import SectionHeader from './SectionHeader';

function Chip({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-900/10 bg-white/60 px-3 py-1.5 text-xs text-slate-600 transition-colors duration-300 hover:border-indigo-500/50 hover:text-slate-900">
      <Icon className="h-3.5 w-3.5 text-indigo-500" />
      {label}
    </span>
  );
}

export default function BentoHobbies() {
  return (
    <section id="hobbies" className="mt-28 scroll-mt-24">
      <SectionHeader
        index="02"
        zh="个人爱好"
        title="代码之外的精彩"
        subtitle="合上电脑,好奇心也不会停。"
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-6">
        {/* 🎧 Music / Audio */}
        <GlassCard className="md:col-span-3" delay={0.08}>
          <div className="p-6">
            <div className="flex items-start justify-between">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-900/10 bg-gradient-to-br from-violet-500/25 to-cyan-500/5">
                <Headphones className="h-5 w-5 text-violet-600" />
              </span>
              <span className="font-mono text-[10px] tracking-[0.25em] text-slate-400">
                音乐 · 声波
              </span>
            </div>
            <h3 className="mt-4 font-display text-lg font-semibold text-slate-900">
              音乐与音频
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
              每一次调试与通宵的专属背景音乐。
            </p>

            {/* 网易云音乐外链播放器 */}
            <div className="mt-4 rounded-xl border border-slate-900/5 bg-white/60 p-3">
              <iframe
                title="网易云音乐播放器"
                src={`https://music.163.com/outchain/player?type=2&id=${profile.neteaseSongId}&auto=0&height=66`}
                width="330"
                height="66"
                loading="lazy"
                style={{ border: 0 }}
                className="block w-full max-w-[330px]"
              />
              <p className="mt-1.5 font-mono text-[10px] text-slate-400">
                若无法播放可能是版权限制,可{' '}
                <a
                  href={`https://music.163.com/#/song?id=${profile.neteaseSongId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-500 transition-colors hover:underline"
                >
                  在网易云打开
                </a>
              </p>
            </div>
          </div>
        </GlassCard>

        {/* 📚 Reading & Sci-Fi */}
        <GlassCard className="md:col-span-3" delay={0.16}>
          <div className="flex h-full flex-col p-6">
            <div className="flex items-start justify-between">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-900/10 bg-gradient-to-br from-cyan-500/25 to-indigo-500/5">
                <BookOpen className="h-5 w-5 text-cyan-600" />
              </span>
              <span className="font-mono text-[10px] tracking-[0.25em] text-slate-400">
                阅读
              </span>
            </div>
            <h3 className="mt-4 font-display text-lg font-semibold text-slate-900">
              阅读与科幻
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
              硬核科幻、科技博客与开源文档 —— 未来工程师的书架。
            </p>
            <div className="mt-auto flex flex-wrap gap-2 pt-4">
              <Chip icon={BookOpen} label="硬核科幻" />
              <Chip icon={Globe} label="科技博客" />
              <Chip icon={FileText} label="开源文档" />
            </div>
          </div>
        </GlassCard>

        {/* 📷 生活与爱好 */}
        <GlassCard className="md:col-span-6" delay={0.24}>
          <div className="p-6">
            <div className="flex items-start justify-between">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-900/10 bg-gradient-to-br from-cyan-500/25 to-indigo-500/5">
                <Camera className="h-5 w-5 text-cyan-600" />
              </span>
              <span className="font-mono text-[10px] tracking-[0.25em] text-slate-400">
                线下 · 生活
              </span>
            </div>
            <h3 className="mt-4 font-display text-lg font-semibold text-slate-900">
              生活与爱好
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
              离开键盘,用相机追逐好光线,记录生活里的每一个瞬间。
            </p>
            <PhotoGallery />
          </div>
        </GlassCard>
      </div>
    </section>
  );
}
