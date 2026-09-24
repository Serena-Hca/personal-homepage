import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Check, Copy, Mail } from 'lucide-react';
import { profile, socials } from '../data';
import type { Social } from '../data';
import GlassCard from './GlassCard';
import SectionHeader from './SectionHeader';

/** 单个社交按钮:有 url 渲染为链接;微信/Discord 为 hover 显示 ID */
function SocialButton({ social }: { social: Social }) {
  const Icon = social.icon;

  const inner = (
    <>
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-900/10 bg-gradient-to-br ${social.iconWrap}`}
      >
        <Icon className="h-5 w-5" />
      </span>
      <span className="min-w-0 flex-1 text-left">
        <span className="block text-sm font-medium text-slate-800">{social.label}</span>
        <span className="relative block h-4 font-mono text-xs text-slate-500">
          <span className="absolute inset-0 truncate transition-all duration-300 group-hover:-translate-y-1 group-hover:opacity-0">
            {social.handle}
          </span>
          {social.reveal && (
            <span className="absolute inset-0 translate-y-1 truncate text-indigo-600 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              {social.reveal}
            </span>
          )}
        </span>
      </span>
      <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-400 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-indigo-500" />
    </>
  );

  const base = `group flex w-full items-center gap-3 rounded-xl border border-slate-900/10 bg-white/60 p-3.5 transition-all duration-300 ${social.hoverGlow}`;

  if (social.url) {
    return (
      <motion.a
        href={social.url}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ y: -2 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className={base}
      >
        {inner}
      </motion.a>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={base}
      role="button"
      tabIndex={0}
      aria-label={`${social.label}: ${social.reveal ?? social.handle}`}
    >
      {inner}
    </motion.div>
  );
}

/** 复制邮箱(带剪贴板降级方案) */
function EmailCopy() {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
    } catch {
      // 非 https 环境的降级方案
      const textarea = document.createElement('textarea');
      textarea.value = profile.email;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      textarea.remove();
    }
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-3 flex items-center gap-3 rounded-xl border border-slate-900/10 bg-white/60 p-3.5">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-900/10 bg-gradient-to-br from-cyan-500/25 to-indigo-500/5">
        <Mail className="h-5 w-5 text-cyan-600" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-slate-800">邮箱</p>
        <p className="truncate font-mono text-xs text-slate-500">{profile.email}</p>
      </div>
      <button
        type="button"
        onClick={copy}
        className="inline-flex min-w-[128px] items-center justify-center gap-1.5 rounded-lg border border-indigo-500/40 bg-indigo-500/10 px-3.5 py-2 font-mono text-xs text-indigo-700 transition-all duration-300 hover:border-indigo-500/60 hover:bg-indigo-500/15 hover:shadow-[0_0_20px_rgba(99,102,241,0.25)]"
      >
        <AnimatePresence mode="wait" initial={false}>
          {copied ? (
            <motion.span
              key="copied"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.15 }}
              className="inline-flex items-center gap-1.5 text-emerald-600"
            >
              <Check className="h-3.5 w-3.5" /> 已复制!
            </motion.span>
          ) : (
            <motion.span
              key="copy"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.15 }}
              className="inline-flex items-center gap-1.5"
            >
              <Copy className="h-3.5 w-3.5" /> 复制邮箱
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    </div>
  );
}

export default function SocialLinks() {
  return (
    <section id="contact" className="mt-28 scroll-mt-24">
      <SectionHeader
        index="04"
        zh="社交连接"
        title="联系我"
        subtitle="全网都能找到我 —— 或者直接发邮件。欢迎约黑客松、学习小组和开源合作。"
      />

      <GlassCard className="p-5 sm:p-8" delay={0.1}>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-display text-lg font-semibold text-slate-900">
              一起搞点事情吧。
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              通常一天内回复 —— 如果聊机械键盘或宇宙,回得更快。
            </p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 font-mono text-[11px] text-emerald-600">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            {profile.status}
          </span>
        </div>

        <div className="grid gap-3">
          {socials.map((social) => (
            <SocialButton key={social.id} social={social} />
          ))}
        </div>

        <EmailCopy />
      </GlassCard>
    </section>
  );
}
