import { PropsWithChildren } from 'react';

export function Badge({ children }: PropsWithChildren) {
  return (
    <span className="rounded-full border border-zinc-700 bg-zinc-900/70 px-3 py-1 text-xs uppercase tracking-wide text-zinc-200">
      {children}
    </span>
  );
}
