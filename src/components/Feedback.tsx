import { useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Loader2, Send } from 'lucide-react';
import GlassCard from './GlassCard';
import SectionHeader from './SectionHeader';
import { profile } from '../data';

/**
 * 留言板:访客反馈直接发送到 profile.email 邮箱
 * 通过 FormSubmit 静态表单服务(无需后端):
 * - 首次有人提交后,FormSubmit 会给邮箱发一封激活邮件,点一下链接即永久生效
 */

const ENDPOINT = `https://formsubmit.co/ajax/${profile.email}`;
const MAX_LENGTH = 500;

type Status = 'idle' | 'sending' | 'sent' | 'error';

const inputCls =
  'w-full rounded-xl border border-slate-900/10 bg-white/60 px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition-all duration-300 focus:border-indigo-500/60 focus:bg-white/80 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.12)]';

export default function Feedback() {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const timer = useRef<number | undefined>(undefined);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!message.trim() || status === 'sending') return;
    setStatus('sending');
    try {
      const response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: name.trim() || '匿名访客',
          contact: contact.trim() || '未留联系方式',
          message: message.trim(),
          _subject: `【主页留言】${name.trim() || '匿名访客'}`,
          _template: 'table',
          _honey: '',
        }),
      });
      const data = await response.json();
      if (!response.ok || (data.success !== true && data.success !== 'true')) {
        throw new Error('submit failed');
      }
      setStatus('sent');
      setName('');
      setContact('');
      setMessage('');
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setStatus('idle'), 8000);
    } catch {
      setStatus('error');
    }
  };

  return (
    <section id="feedback" className="mt-28 scroll-mt-24">
      <SectionHeader
        index="04"
        zh="留言板"
        title="给我留言"
        subtitle="对主页有什么建议、想交流什么话题,写在这里 —— 提交后会直接发到我的邮箱。"
      />

      <GlassCard className="p-5 sm:p-8" delay={0.1}>
        <AnimatePresence mode="wait">
          {status === 'sent' ? (
            <motion.div
              key="sent"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="flex flex-col items-center gap-3 py-10 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.05 }}
              >
                <CheckCircle2 className="h-12 w-12 text-emerald-500" />
              </motion.div>
              <p className="font-display text-lg font-semibold text-slate-900">已收到你的留言!</p>
              <p className="text-sm text-slate-600">感谢你的反馈,我会尽快查看并回复。</p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-xs font-medium text-slate-600">
                    称呼(选填)
                  </span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="怎么称呼你?"
                    className={inputCls}
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-medium text-slate-600">
                    联系方式(选填)
                  </span>
                  <input
                    type="text"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="邮箱 / 微信 / QQ,方便我回复"
                    className={inputCls}
                  />
                </label>
              </div>

              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-slate-600">留言内容</span>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value.slice(0, MAX_LENGTH))}
                  rows={4}
                  required
                  placeholder="写下你想说的话…"
                  className={`${inputCls} resize-none`}
                />
                <span className="mt-1 block text-right font-mono text-[10px] text-slate-400">
                  {message.length} / {MAX_LENGTH}
                </span>
              </label>

              {status === 'error' && (
                <p className="rounded-xl border border-rose-300/40 bg-rose-500/10 px-4 py-2.5 text-xs text-rose-600">
                  发送失败,请稍后再试 —— 也可以直接发邮件给我:{profile.email}
                </p>
              )}

              <button
                type="submit"
                disabled={status === 'sending'}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-5 py-3 text-sm font-medium text-white shadow-[0_4px_20px_rgba(99,102,241,0.35)] transition-all duration-300 hover:shadow-[0_6px_28px_rgba(139,92,246,0.45)] hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === 'sending' ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    发送中…
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    发送留言
                  </>
                )}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </GlassCard>
    </section>
  );
}
