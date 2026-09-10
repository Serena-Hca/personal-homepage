import { motion } from 'framer-motion';

interface SectionHeaderProps {
  index: string;
  zh: string;
  title: string;
  subtitle?: string;
}

export default function SectionHeader({ index, zh, title, subtitle }: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
      className="mb-10"
    >
      <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-indigo-600">
        <span className="text-slate-400">{index}</span>
        <span className="h-px w-8 bg-gradient-to-r from-indigo-500/60 to-transparent" />
        {zh}
      </p>
      <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-600">{subtitle}</p>
      )}
    </motion.div>
  );
}
