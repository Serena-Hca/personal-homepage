export default function Background() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* 淡网格,向顶部淡出 */}
      <div className="absolute inset-0 [background-image:linear-gradient(to_right,rgba(15,23,42,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.05)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_65%_55%_at_50%_0%,#000_55%,transparent_100%)]" />

      {/* 柔光球:violet / indigo / cyan */}
      <div className="absolute -left-32 -top-32 h-[480px] w-[480px] animate-float-slow rounded-full bg-violet-400/40 blur-[140px]" />
      <div className="absolute -right-40 top-1/3 h-[520px] w-[520px] animate-float-slower rounded-full bg-indigo-400/35 blur-[150px]" />
      <div className="absolute -bottom-44 left-1/4 h-[460px] w-[460px] animate-float-slow rounded-full bg-cyan-400/30 blur-[140px]" />

      {/* 顶部渐晕,让 header 区域干净 */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#F5F7FD] to-transparent" />
    </div>
  );
}
