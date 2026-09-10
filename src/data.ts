import type { ComponentType } from 'react';
import { Braces, Cpu, PenLine, Sparkles, SquareTerminal, Terminal } from 'lucide-react';
import {
  BilibiliIcon,
  DiscordIcon,
  GithubIcon,
  WechatIcon,
  ZhihuIcon,
} from './components/icons';

/* ---------- 基本信息 ---------- */
export const profile = {
  name: '何储安',
  initials: 'HE',
  badge: '大一新生',
  university: '天津大学香港理工大学深圳未来技术学院',
  major: '智能医学工程',
  location: '中国天津',
  bio: '大家好，我是何储安，来自天津大学香港理工大学深圳未来技术学院智能医学工程专业的大一新生。我热爱摄影、探索新鲜事物，我希望在大学生活中能够不断充实自己，结交志同道合的朋友，获得一个更加优秀的自己。',
  email: 'heyuyao2018@126.com',
  /** 头像:把图片放到 public/avatar.jpg,然后改成 '/avatar.jpg' */
  avatar: '/avatar.jpg',
  status: '欢迎交流合作',
};

/* ---------- 技能标签 ---------- */
export interface Tag {
  label: string;
  icon: ComponentType<{ className?: string }>;
  /** true 时显示绿色呼吸圆点 */
  live?: boolean;
}

export const tags: Tag[] = [
  { label: 'C++', icon: Terminal },
  { label: 'Python', icon: Braces },
  { label: 'Linux', icon: SquareTerminal },
  { label: '硬件', icon: Cpu },
  { label: '学习探索中', icon: Sparkles, live: true },
];

/* ---------- 社交链接 ---------- */
export interface Social {
  id: string;
  label: string;
  /** 按钮下方的灰色小字 */
  handle: string;
  icon: ComponentType<{ className?: string }>;
  /** 有 url 就渲染为链接;没有则为 hover 显示 ID(微信/Discord) */
  url?: string;
  /** hover 时替换 handle 显示的 ID */
  reveal?: string;
  /** hover 发光颜色(Tailwind 类) */
  hoverGlow: string;
  /** 图标容器渐变色(Tailwind 类) */
  iconWrap: string;
}

export const socials: Social[] = [
  {
    id: 'github',
    label: 'GitHub',
    handle: 'github.com/你的用户名',
    icon: GithubIcon,
    url: 'https://github.com/your-username',
    hoverGlow: 'hover:border-indigo-400/50 hover:shadow-[0_0_28px_rgba(99,102,241,0.25)]',
    iconWrap: 'from-indigo-500/25 to-indigo-500/5 text-indigo-600',
  },
  {
    id: 'bilibili',
    label: '哔哩哔哩',
    handle: 'space.bilibili.com/你的UID',
    icon: BilibiliIcon,
    url: 'https://space.bilibili.com/你的UID',
    hoverGlow: 'hover:border-pink-400/50 hover:shadow-[0_0_28px_rgba(244,114,182,0.25)]',
    iconWrap: 'from-pink-500/25 to-pink-500/5 text-pink-600',
  },
  {
    id: 'zhihu',
    label: '知乎',
    handle: 'zhihu.com/people/你的ID',
    icon: ZhihuIcon,
    url: 'https://www.zhihu.com/people/your-id',
    hoverGlow: 'hover:border-sky-400/50 hover:shadow-[0_0_28px_rgba(56,189,248,0.25)]',
    iconWrap: 'from-sky-500/25 to-sky-500/5 text-sky-600',
  },
  {
    id: 'blog',
    label: '博客',
    handle: '博客地址待填',
    icon: PenLine,
    url: 'https://blog.your-domain.com',
    hoverGlow: 'hover:border-violet-400/50 hover:shadow-[0_0_28px_rgba(139,92,246,0.25)]',
    iconWrap: 'from-violet-500/25 to-violet-500/5 text-violet-600',
  },
  {
    id: 'wechat',
    label: '微信',
    handle: '悬停显示微信号',
    icon: WechatIcon,
    reveal: '微信号: 13953830088',
    hoverGlow: 'hover:border-emerald-400/50 hover:shadow-[0_0_28px_rgba(52,211,153,0.25)]',
    iconWrap: 'from-emerald-500/25 to-emerald-500/5 text-emerald-600',
  },
  {
    id: 'discord',
    label: 'Discord',
    handle: '悬停显示 ID',
    icon: DiscordIcon,
    reveal: '你的用户名#0000',
    hoverGlow: 'hover:border-blue-400/50 hover:shadow-[0_0_28px_rgba(96,165,250,0.25)]',
    iconWrap: 'from-blue-500/25 to-blue-500/5 text-blue-600',
  },
];
