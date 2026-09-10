export default function Footer() {
  return (
    <footer className="mt-24 flex flex-col items-center gap-2 border-t border-slate-900/10 pt-8 text-center">
      <p className="font-mono text-xs text-slate-500">
        由 <span className="text-violet-600">Claude Code</span> 设计与构建 ©{' '}
        {new Date().getFullYear()}
      </p>
      <p className="font-mono text-[11px] text-slate-400">
        React · TypeScript · Tailwind CSS · framer-motion · lucide-react
      </p>
    </footer>
  );
}
