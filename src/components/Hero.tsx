import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { ChevronDown, GraduationCap, MapPin, Sparkles } from 'lucide-react';
import SparklesText from './SparklesText';
import { profile, tags } from '../data';

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 26 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

export default function Hero() {
  return (
    <section id="about" className="flex flex-col items-center text-center">
      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="flex flex-col items-center"
      >
        {/* 小节眉标 */}
        <motion.p
          variants={item}
          className="font-mono text-[11px] uppercase tracking-[0.3em] text-slate-600"
        >
          01 · 关于我
        </motion.p>

        {/* 极客徽章 */}
        <motion.div
          variants={item}
          className="mt-4 inline-flex items-center gap-2.5 rounded-full border border-slate-900/10 bg-white/60 px-4 py-1.5 shadow-[0_8px_32px_0_rgba(15,23,42,0.08)] backdrop-blur-xl"
        >
          <span className="text-sm leading-none">⚡</span>
          <span className="font-mono text-xs tracking-wide text-slate-600">{profile.badge}</span>
        </motion.div>

        {/* 发光旋转环头像 */}
        <motion.div variants={item} className="relative mt-10 h-32 w-32 md:h-36 md:w-36">
          {/* 外圈光晕 */}
          <div className="absolute -inset-2 animate-rotate-slow rounded-full opacity-60 blur-lg [background:conic-gradient(from_0deg,#6366f1,#8b5cf6,#06b6d4,#6366f1)]" />
          {/* 旋转渐变环 */}
          <div className="absolute inset-0 animate-rotate-slow rounded-full [background:conic-gradient(from_0deg,#6366f1,#8b5cf6,#06b6d4,#6366f1)]" />
          {/* 内芯 */}
          <div className="absolute inset-[3px] flex items-center justify-center overflow-hidden rounded-full bg-white">
            {profile.avatar ? (
              <img src={profile.avatar} alt={profile.name} className="h-full w-full object-cover" />
            ) : (
              <span className="bg-gradient-to-br from-indigo-500 via-violet-500 to-cyan-500 bg-clip-text font-display text-5xl font-bold text-transparent">
                {profile.initials}
              </span>
            )}
          </div>
        </motion.div>

        {/* 姓名 */}
        <motion.h1
          variants={item}
          className="mt-9 font-display text-4xl font-bold tracking-tight text-slate-900 md:text-6xl"
        >
          <SparklesText colors={{ first: '#8B5CF6', second: '#06B6D4' }}>
            {profile.name}
          </SparklesText>
        </motion.h1>
        <motion.div
          variants={item}
          className="mt-5 h-1 w-24 rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-400 shadow-[0_0_16px_rgba(139,92,246,0.5)]"
        />

        {/* 学校 / 专业 / 城市 */}
        <motion.p
          variants={item}
          className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-slate-600"
        >
          <span className="inline-flex items-center gap-1.5">
            <GraduationCap className="h-4 w-4 text-indigo-600" />
            {profile.university}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-violet-600" />
            {profile.major}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-cyan-600" />
            {profile.location}
          </span>
        </motion.p>

        {/* Bio */}
        <motion.p
          variants={item}
          className="mt-6 max-w-2xl text-base leading-relaxed text-slate-600 md:text-lg"
        >
          {profile.bio}
        </motion.p>

        {/* 技能标签 */}
        <motion.div
          variants={item}
          className="mt-9 flex flex-wrap items-center justify-center gap-2.5"
        >
          {tags.map((tag) => (
            <span
              key={tag.label}
              className="group inline-flex cursor-default items-center gap-1.5 rounded-full border border-slate-900/10 bg-white/60 px-3.5 py-1.5 text-sm text-slate-600 backdrop-blur-xl transition-all duration-300 hover:border-indigo-500/50 hover:text-slate-900 hover:shadow-[0_0_20px_rgba(99,102,241,0.20)]"
            >
              {tag.live && <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />}
              <tag.icon className="h-3.5 w-3.5 text-indigo-500 transition-transform duration-300 group-hover:scale-110" />
              {tag.label}
            </span>
          ))}
        </motion.div>

        {/* 滚动提示 */}
        <motion.a
          href="#hobbies"
          variants={item}
          className="mt-14 inline-flex flex-col items-center gap-1.5 text-slate-400 transition-colors hover:text-slate-700"
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.3em]">向下滚动</span>
          <motion.span
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronDown className="h-4 w-4" />
          </motion.span>
        </motion.a>
      </motion.div>
    </section>
  );
}
