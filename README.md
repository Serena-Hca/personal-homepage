# Personal Homepage · 个人主页

玻璃拟态 (Glassmorphism) 风格的 STEM 大一新生个人主页。

## 技术栈

- **React 19 + TypeScript** · **Vite** · **Tailwind CSS v4**
- **framer-motion**(入场 / 悬停动画)· **lucide-react**(图标)
- 品牌图标(GitHub / Bilibili / Zhihu / WeChat / Discord)内联 SVG,路径来自 [simple-icons](https://simpleicons.org)
- 字体通过 `@fontsource` 自托管,不依赖外部 CDN

## 快速开始

```bash
# 需要 Node.js >= 20.19(或 >= 22.12)
node -v

npm install        # 安装依赖
npm run dev        # 开发服务器 → http://localhost:5173
npm run build      # 类型检查 + 生产构建 → dist/
npm run preview    # 本地预览构建产物
```

> 国内网络:若安装缓慢,可先切换镜像
> `npm config set registry https://registry.npmmirror.com`

## 项目结构

```
personal-homepage/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── public/
│   └── favicon.svg
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── index.css            # Tailwind v4 主题、配色、动画 keyframes
    ├── data.ts              # ⚙️ 所有个人信息集中在这里
    └── components/
        ├── Background.tsx   # 环境光球 + 网格
        ├── NeuralBackground.tsx # 神经元/脑机接口背景动画
        ├── CursorGlow.tsx   # 鼠标跟随光晕
        ├── GlassCard.tsx    # 玻璃拟态卡片(核心复用组件)
        ├── SectionHeader.tsx
        ├── Hero.tsx         # 关于我
        ├── BentoHobbies.tsx # 个人爱好 Bento 网格
        ├── SocialLinks.tsx  # 社交连接 + 复制邮箱
        ├── Footer.tsx
        └── icons.tsx        # 品牌图标 SVG
```

## 个性化修改

| 要改什么 | 去哪里改 |
|---|---|
| 姓名、学校、专业、城市、Bio、邮箱 | `src/data.ts` → `profile` |
| 头像 | 图片放到 `public/avatar.jpg`,并把 `profile.avatar` 改为 `'/avatar.jpg'` |
| 技能标签 | `src/data.ts` → `tags` |
| 社交链接 / 微信号 / Discord ID | `src/data.ts` → `socials` |
| 配色(靛蓝 / 紫罗兰 / 青色) | `src/index.css` + `data.ts` 里的 `hoverGlow` / `iconWrap` |
| 爱好卡片内容 | `src/components/BentoHobbies.tsx` |
| 页面标题 | `index.html` 的 `<title>` |

## 部署

- **Vercel**:导入仓库即可,Vite 预设自动识别(构建 `npm run build`,输出 `dist`)
- **Netlify**:Build command `npm run build`,Publish directory `dist`
- **GitHub Pages**:在 `vite.config.ts` 加 `base: '/仓库名/'`,再部署 `dist/`

---

Designed & Built with Claude Code © 2026
