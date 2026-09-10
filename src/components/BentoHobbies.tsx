import type { LucideIcon } from 'lucide-react';
import {
  Bike,
  BookOpen,
  Camera,
  Dumbbell,
  FileText,
  Gamepad2,
  Globe,
  Headphones,
  Keyboard,
  Music2,
  Server,
} from 'lucide-react';
import GlassCard from './GlassCard';
import SectionHeader from './SectionHeader';

/** 均衡器柱子高度 */
const EQ_BARS = [0.9, 0.55, 1, 0.65, 0.8, 0.45, 0.7];

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
        {/* 🎮 Gaming & Tech */}
        <GlassCard className="md:col-span-3" delay={0}>
          <div className="p-6">
            <div className="flex items-start justify-between">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-900/10 bg-gradient-to-br from-indigo-500/25 to-violet-500/5">
                <Gamepad2 className="h-5 w-5 text-indigo-600" />
              </span>
              <span className="font-mono text-[10px] tracking-[0.25em] text-slate-400">
                游戏 · 折腾 · 创造
              </span>
            </div>
            <h3 className="mt-4 font-display text-lg font-semibold text-slate-900">
              游戏与科技
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
              像素风独立游戏、7×24 小时运行的家庭服务器,以及对机械键盘日益增长的痴迷。
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Chip icon={Gamepad2} label="独立游戏" />
              <Chip icon={Server} label="家庭服务器" />
              <Chip icon={Keyboard} label="机械键盘" />
            </div>
          </div>
        </GlassCard>

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

            {/* 迷你"正在播放" + 均衡器动画 */}
            <div className="mt-4 flex items-center gap-3 rounded-xl border border-slate-900/5 bg-slate-900/5 p-3">
              <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-cyan-400 shadow-[0_0_18px_rgba(139,92,246,0.45)]">
                <Music2 className="h-4.5 w-4.5 text-white" />
                <span className="absolute -right-0.5 -top-0.5 h-2 w-2 animate-pulse rounded-full border-2 border-white bg-emerald-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-slate-800">
                  合成器浪潮 & Lo-fi 节拍
                </p>
                <p className="truncate font-mono text-[10px] text-slate-500">
                  官方指定「写代码时听」歌单
                </p>
              </div>
              <div className="flex h-6 items-end gap-[3px]" aria-hidden="true">
                {EQ_BARS.map((height, i) => (
                  <span
                    key={i}
                    className="w-[3px] origin-bottom animate-eq rounded-full bg-gradient-to-t from-indigo-500 to-cyan-400"
                    style={{ height: `${height * 100}%`, animationDelay: `${i * 0.13}s` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </GlassCard>

        {/* 📚 Reading & Sci-Fi */}
        <GlassCard className="md:col-span-2" delay={0.16}>
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

        {/* 🏃 Life & Sports */}
        <GlassCard className="md:col-span-4" delay={0.24}>
          <div className="p-6">
            <div className="flex items-start justify-between">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-900/10 bg-gradient-to-br from-emerald-500/25 to-cyan-500/5">
                <Dumbbell className="h-5 w-5 text-emerald-600" />
              </span>
              <span className="font-mono text-[10px] tracking-[0.25em] text-slate-400">
                线下 · 生活
              </span>
            </div>
            <h3 className="mt-4 font-display text-lg font-semibold text-slate-900">
              生活与运动
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
              离开键盘:骑上单车探索城市、用相机追逐好光线,以及(基本)不缺席的健身打卡。
            </p>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {[
                { icon: Bike, label: '城市骑行', sub: '周末路线' },
                { icon: Camera, label: '摄影', sub: '黄金时刻' },
                { icon: Dumbbell, label: '健身', sub: '每周三次' },
              ].map(({ icon: Icon, label, sub }) => (
                <div
                  key={label}
                  className="rounded-xl border border-slate-900/5 bg-white/60 p-3 text-center transition-colors duration-300 hover:border-cyan-500/50"
                >
                  <Icon className="mx-auto h-4 w-4 text-cyan-600" />
                  <p className="mt-1.5 text-xs font-medium text-slate-800">{label}</p>
                  <p className="font-mono text-[10px] text-slate-500">{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      </div>
    </section>
  );
}
