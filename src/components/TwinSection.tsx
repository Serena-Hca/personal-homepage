import GlassCard from './GlassCard';
import SectionHeader from './SectionHeader';
import TwinChat from './TwinChat';

/**
 * 主页「数字分身」板块(期末版新增)
 * 把聊天窗直接嵌在页面里,访客不用点悬浮钮也能和分身对话;
 * 右下角悬浮圆钮保留,两处共用 TwinChat 组件(各自独立的对话)
 */

export default function TwinSection() {
  return (
    <section id="twin" className="mt-28 scroll-mt-24">
      <SectionHeader
        index="04"
        zh="数字分身"
        title="来和小何聊聊"
        subtitle="这不是预设问答——小何背后是接入真实大语言模型的数字分身,关于我的事,尽管问。"
      />

      <GlassCard className="overflow-hidden p-0" delay={0.1}>
        <TwinChat className="h-[420px] md:h-[480px]" />
      </GlassCard>

      <p className="mt-4 text-center font-mono text-[11px] text-slate-400">
        小何也住在右下角 · 随时点那个圆钮召唤他
      </p>
    </section>
  );
}
