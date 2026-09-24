import { useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { createClient } from '@supabase/supabase-js';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Loader2, Send } from 'lucide-react';
import GlassCard from './GlassCard';
import SectionHeader from './SectionHeader';

const MAX_LENGTH = 2000;
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const supabase =
  supabaseUrl && supabasePublishableKey
    ? createClient(supabaseUrl, supabasePublishableKey)
    : null;

type Status = 'idle' | 'sending' | 'sent' | 'error';

const inputCls =
  'w-full rounded-xl border border-slate-900/10 bg-white/60 px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition-all duration-300 focus:border-indigo-500/60 focus:bg-white/80 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.12)]';

export default function Feedback() {
  const [name, setName] = useState('');
  const [relation, setRelation] = useState('');
  const [device, setDevice] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const timer = useRef<number | undefined>(undefined);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!message.trim() || !device || status === 'sending') return;

    setStatus('sending');

    try {
      if (!supabase) throw new Error('Supabase configuration is missing');

      const { error } = await supabase.from('feedback').insert({
        name: name.trim() || null,
        relation: relation || null,
        device,
        message: message.trim(),
        version: 'v3',
      });

      if (error) throw error;

      setStatus('sent');
      setName('');
      setRelation('');
      setDevice('');
      setMessage('');
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setStatus('idle'), 8000);
    } catch (error) {
      console.error('反馈提交失败：', error);
      setStatus('error');
    }
  };

  return (
    <section id="feedback" className="mt-28 scroll-mt-24">
      <SectionHeader
        index="04"
        zh="反馈"
        title="给我反馈"
        subtitle="如果你发现看不懂、不好找或不方便使用的地方，欢迎告诉我。反馈不会公开，只有我能看到。"
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
              <p className="font-display text-lg font-semibold text-slate-900">已收到你的反馈！</p>
              <p className="text-sm text-slate-600">感谢你的建议，我会认真查看。</p>
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
              <div className="grid gap-4 sm:grid-cols-3">
                <label className="block">
                  <span className="mb-1.5 block text-xs font-medium text-slate-600">称呼（选填）</span>
                  <input
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="怎么称呼你？"
                    className={inputCls}
                  />
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-xs font-medium text-slate-600">与我的关系（选填）</span>
                  <select
                    value={relation}
                    onChange={(event) => setRelation(event.target.value)}
                    className={inputCls}
                  >
                    <option value="">请选择</option>
                    <option value="同学">同学</option>
                    <option value="老师">老师</option>
                    <option value="家人">家人</option>
                    <option value="朋友">朋友</option>
                    <option value="同事">同事</option>
                    <option value="其他">其他</option>
                    <option value="不便透露">不便透露</option>
                  </select>
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-xs font-medium text-slate-600">使用设备</span>
                  <select
                    value={device}
                    onChange={(event) => setDevice(event.target.value)}
                    required
                    className={inputCls}
                  >
                    <option value="">请选择</option>
                    <option value="电脑">电脑</option>
                    <option value="手机">手机</option>
                    <option value="平板">平板</option>
                    <option value="其他">其他</option>
                  </select>
                </label>
              </div>

              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-slate-600">反馈内容</span>
                <textarea
                  value={message}
                  onChange={(event) => {
                    setMessage(event.target.value.slice(0, MAX_LENGTH));
                    if (status === 'error') setStatus('idle');
                  }}
                  rows={5}
                  required
                  placeholder="请描述具体位置、体验或遇到的问题…"
                  className={`${inputCls} resize-none`}
                />
                <span className="mt-1 block text-right font-mono text-[10px] text-slate-400">
                  {message.length} / {MAX_LENGTH}
                </span>
              </label>

              {status === 'error' && (
                <p className="rounded-xl border border-rose-300/40 bg-rose-500/10 px-4 py-2.5 text-xs text-rose-600">
                  提交失败，已保留填写内容，请稍后重试。
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
                    提交中…
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    提交反馈
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
