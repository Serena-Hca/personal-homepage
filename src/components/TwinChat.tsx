import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Send, X } from 'lucide-react';
import { profile } from '../data';

/**
 * 数字分身聊天窗口(纯界面,不含定位)
 * - 被两处复用:主页「数字分身」板块(TwinSection)+ 右下角悬浮窗(DigitalTwin)
 * - 期末版:接入真实大模型(智谱 GLM-4-Flash),调用链:本组件 → Supabase Edge Function → 智谱 API
 * - 想改「人设」回答规则,改 supabase/functions/chat/index.ts 里的 SYSTEM_PROMPT
 */

interface Message {
  id: number;
  role: 'user' | 'bot';
  text: string;
}

/** 发给模型的消息格式(OpenAI 兼容) */
interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const QUICK_QUESTIONS = ['你学什么专业?', '怎么加你微信?', '你喜欢什么?', '你的邮箱是?'];

/** 后端聊天接口地址(构建时从 .env.local / CI 注入,不含任何密钥) */
const CHAT_URL = import.meta.env.VITE_TWIN_CHAT_URL as string | undefined;

/** 带给模型的最大历史消息数,与服务端 MAX_HISTORY_MESSAGES 保持一致 */
const MAX_HISTORY = 12;

/** 接口出错时的兜底文案 */
const FALLBACK_TEXT = '分身暂时走神了 😅 稍后再试,或者去主页底部「给我反馈」给何储安留言。';

interface TwinChatProps {
  /** 是否显示顶部头像栏(悬浮窗要,带收起按钮) */
  showHeader?: boolean;
  /** 提供后顶部显示收起按钮 */
  onClose?: () => void;
  /** 高度等外层布局类 */
  className?: string;
}

export default function TwinChat({ showHeader = true, onClose, className = '' }: TwinChatProps) {
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
  /** 只给模型看的对话历史(不含问候语,与界面消息分开维护) */
  const historyRef = useRef<ChatMessage[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, typing]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || typing) return;
    setMessages((prev) => [...prev, { id: idRef.current++, role: 'user', text: trimmed }]);
    setInput('');
    setTyping(true);

    const history = [...historyRef.current, { role: 'user' as const, content: trimmed }].slice(-MAX_HISTORY);

    try {
      if (!CHAT_URL) throw new Error('VITE_TWIN_CHAT_URL 未配置');
      const resp = await fetch(CHAT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      });
      const data = await resp.json();
      if (!resp.ok || typeof data?.content !== 'string') {
        throw new Error(data?.error ?? `HTTP ${resp.status}`);
      }
      historyRef.current = [...history, { role: 'assistant', content: data.content }];
      setMessages((prev) => [...prev, { id: idRef.current++, role: 'bot', text: data.content }]);
    } catch {
      setMessages((prev) => [...prev, { id: idRef.current++, role: 'bot', text: FALLBACK_TEXT }]);
    } finally {
      setTyping(false);
    }
  };

  return (
    <div className={`flex min-h-0 flex-col overflow-hidden ${className}`}>
      {/* 头部 */}
      {showHeader && (
        <div className="flex items-center gap-3 border-b border-slate-900/10 bg-gradient-to-r from-indigo-500/10 to-violet-500/10 px-4 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 font-display text-sm font-bold text-white">
            {profile.initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-slate-900">小何 · 数字分身</p>
            <p className="flex items-center gap-1.5 font-mono text-[10px] text-slate-500">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              在线 · AI 实时回复
            </p>
          </div>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="收起"
              className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-white/60 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      )}

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
    </div>
  );
}
