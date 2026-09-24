import { motion } from 'framer-motion';
import SectionHeader from './SectionHeader';
import { moments } from '../data';

/**
 * 日常分享:时间线样式的日常动态
 * 内容集中在 data.ts 的 moments 数组,加一条 = 加一个对象
 */

export default function DailyLife() {
  return (
    <section id="daily" className="mt-28 scroll-mt-24">
      <SectionHeader
        index="03"
        zh="日常分享"
        title="我的日常"
        subtitle="随手记下学习与生活里的碎片,让来访的朋友更了解真实的我。"
      />

      <div className="relative space-y-4 pl-6 md:pl-10">
        {/* 时间线竖线 */}
        <span
          aria-hidden="true"
          className="absolute bottom-1 left-[7px] top-1 w-px bg-gradient-to-b from-indigo-400/50 via-violet-400/40 to-transparent md:left-[23px]"
        />

        {moments.map((moment, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: i * 0.08, ease: 'easeOut' }}
            className="relative"
          >
            {/* 时间线圆点 */}
            <span
              aria-hidden="true"
              className="absolute -left-6 top-6 h-2.5 w-2.5 rounded-full border-2 border-white bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)] md:-left-10"
            />

            <div className="rounded-2xl border border-slate-900/10 bg-white/60 p-5 shadow-[0_8px_32px_0_rgba(15,23,42,0.08)] backdrop-blur-xl transition-colors duration-300 hover:border-indigo-500/40">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <div className="min-w-0 flex-1">
                  <p className="font-mono text-[11px] tracking-[0.2em] text-indigo-500">
                    {moment.date}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{moment.text}</p>
                </div>
                {moment.photo && (
                  <img
                    src={`${import.meta.env.BASE_URL}${moment.photo}`}
                    alt={`${moment.date} 配图`}
                    loading="lazy"
                    className="aspect-[4/3] w-full shrink-0 rounded-xl border border-slate-900/10 object-cover sm:w-44"
                  />
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
