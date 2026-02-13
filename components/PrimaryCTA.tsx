import Link from 'next/link';

type Props = { href: string; children: React.ReactNode; secondary?: boolean };

export function PrimaryCTA({ href, children, secondary }: Props) {
  const style = secondary
    ? 'border border-[var(--border)] bg-white/5 hover:bg-white/10'
    : 'bg-gradient-to-r from-blue-500 to-cyan-400 text-slate-950 hover:opacity-90';
  return (
    <Link href={href} className={`focus-ring inline-flex rounded-xl px-5 py-3 font-semibold transition ${style}`}>
      {children}
    </Link>
  );
}
