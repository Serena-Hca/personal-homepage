import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bot, Send, X } from 'lucide-react';
import { profile, socials } from '../data';

/**
 * 数字分身「小何」:右下角悬浮聊天窗口
 * - 基于关键词规则的问答,信息全部来自 data.ts,无需后端
 * - 想改答案:直接编辑下方 answer() 函数
 */

interface Message {
  id: number;
  role: 'user' | 'bot';
  text: string;
}

const QUICK_QUESTIONS = ['你学什么专业?', '怎么加你微信?', '你喜欢什么?', '你的邮箱是?'];

function answer(input: string): string {
  const q = input.toLowerCase();
  const has = (...words: string[]) => words.some((w) => q.includes(w));
  const wechatId = socials.find((s) => s.id === 'wechat')?.reveal?.replace('微信号: ', '') ?? '';

  if (has('你好', 'hello', 'hi', '在吗', '嗨')) {
    return `你好呀!我是${profile.name}的数字分身 ⚡ 学校、专业、联系方式、爱好,都可以问我。`;
  }
  if (has('学校', '大学', '学院', '哪里', '在哪')) {
    return `我在${profile.university}就读,位于${profile.location}。`;
  }
  if (has('专业', '学什么', '医学')) {
    return `我的专业是${profile.major},对脑机接口这类方向很感兴趣 —— 主页背景的神经元动画就是我的小心思 🧠`;
  }
  if (has('微信', '联系', '联系方式', '加我', '加你')) {
    return `可以加我微信:${wechatId},备注一下来意哦。`;
  }
  if (has('邮箱', '邮件', 'email', 'mail')) {
    return `我的邮箱是 ${profile.email},也可以在主页「联系我」里一键复制。`;
  }
  if (has('摄影', '拍照', '照片', '相机')) {
    return `摄影是我的一大爱好 📷 主页「生活与爱好」里有我的作品,点击还能看大图。`;
  }
  if (has('爱好', '喜欢', '兴趣', '平时')) {
    return `平时喜欢摄影、听歌(最近在听《雪人》驼儿)、看硬核科幻,也爱折腾代码。`;
  }
  if (has('留言', '反馈', '建议', '意见')) {
    return `太好了!主页底部有「给我反馈」板块,写下来我会收到;或者直接发邮件 ${profile.email}。`;
  }
  if (has('名字', '叫什么', '你是谁')) {
    return `我是${profile.name}的数字分身,${profile.major}专业大一新生。有问题尽管问我!`;
  }
  if (has('网易云', '音乐', '听歌', '歌')) {
    return `主页「音乐与音频」卡片里嵌了网易云播放器,现在放的是《雪人》驼儿 🎵`;
  }
  if (has('谢谢', '感谢', '3q', 'thx')) {
    return `不客气!还有问题随时问我 😄`;
  }
  return `这个问题把我问住了 😅 你可以去主页底部的「给我反馈」留言,${profile.name}本人看到后会回复你。`;
}

export default function DigitalTwin() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      role: 'bot',
      text: `你好,我是${profile.name}的数字分身 ⚡ 想了解学校、专业、联系方式还是爱好?直接问我,或者点下面的快捷问题。`,
    },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const idRef = useRef(1);
  const timerRef = useRef<number | undefined>(undefined);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, typing, open]);

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || typing) return;
    setMessages((prev) => [...prev, { id: idRef.current++, role: 'user', text: trimmed }]);
    setInput('');
    setTyping(true);
    timerRef.current = window.setTimeout(() => {
      setMessages((prev) => [...prev, { id: idRef.current++, role: 'bot', text: answer(trimmed) }]);
      setTyping(false);
    }, 700 + Math.random() * 500);
  };

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

      {/* 聊天面板 */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed bottom-24 right-4 z-40 flex h-[min(480px,72vh)] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-slate-900/10 bg-white/85 shadow-[0_16px_48px_rgba(15,23,42,0.18)] backdrop-blur-2xl"
          >
            {/* 头部 */}
            <div className="flex items-center gap-3 border-b border-slate-900/10 bg-gradient-to-r from-indigo-500/10 to-violet-500/10 px-4 py-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 font-display text-sm font-bold text-white">
                {profile.initials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-900">小何 · 数字分身</p>
                <p className="flex items-center gap-1.5 font-mono text-[10px] text-slate-500">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  在线 · 秒回
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="收起"
                className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-white/60 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* 消息区 */}
            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <p
                    className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                      m.role === 'user'
                        ? 'bg-gradient-to-r from-indigo-500 to-violet-500 text-white'
                        : 'border border-slate-900/10 bg-white/80 text-slate-800'
                    }`}
                  >
                    {m.text}
                  </p>
                </motion.div>
              ))}
              {typing && (
                <div className="flex justify-start">
                  <span className="flex items-center gap-1 rounded-2xl border border-slate-900/10 bg-white/80 px-4 py-3">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:0ms]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:150ms]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:300ms]" />
                  </span>
                </div>
              )}
            </div>

            {/* 快捷问题 */}
            <div className="scrollbar-none flex gap-2 overflow-x-auto border-t border-slate-900/5 px-3 pb-1 pt-2.5">
              {QUICK_QUESTIONS.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => send(q)}
                  className="shrink-0 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs text-indigo-600 transition-colors duration-200 hover:bg-indigo-500/20"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* 输入区 */}
            <form
              onSubmit={(event) => {
                event.preventDefault();
                send(input);
              }}
              className="flex items-center gap-2 px-3 pb-3 pt-2"
            >
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="问问小何…"
                className="min-w-0 flex-1 rounded-xl border border-slate-900/10 bg-white/70 px-3.5 py-2 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition-all duration-300 focus:border-indigo-500/60 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.12)]"
              />
              <button
                type="submit"
                disabled={!input.trim() || typing}
                aria-label="发送"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
