import type { ComponentType } from 'react';
import { Braces, Cpu, Sparkles, SquareTerminal, Terminal } from 'lucide-react';
import { WechatIcon } from './components/icons';

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
    id: 'wechat',
    label: '微信',
    handle: '悬停显示微信号',
    icon: WechatIcon,
    reveal: '微信号: 13953830088',
    hoverGlow: 'hover:border-emerald-400/50 hover:shadow-[0_0_28px_rgba(52,211,153,0.25)]',
    iconWrap: 'from-emerald-500/25 to-emerald-500/5 text-emerald-600',
  },
];
