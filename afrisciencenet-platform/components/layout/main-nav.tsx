import { auth, signOut } from '@/lib/auth/auth';

const links = [
  { label: 'Home', href: '/' },
  { label: 'Find Equipment', href: '/equipment' },
  { label: 'Find Experts', href: '/researchers' },
  { label: 'Funding', href: '/funding' },
  { label: 'Collaborations', href: '/collaborations' },
  { label: 'Institutions', href: '/institutions' },
  { label: 'Projects', href: '/projects' },
  { label: 'Datasets', href: '/datasets' },
  { label: 'Map', href: '/map' }
];

const dashboardByRole: Record<string, string> = {
  RESEARCHER: '/dashboard/researcher',
  INSTITUTION_ADMIN: '/dashboard/institution-admin',
  COUNTRY_COORDINATOR: '/dashboard/country-coordinator',
  SUPER_ADMIN: '/dashboard/super-admin'
};

export async function MainNav() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <a href="/" className="font-semibold text-navy">AfriScienceNet</a>
        <nav className="hidden gap-4 md:flex">
          {links.map((item) => <a key={item.label} href={item.href} className="text-sm font-medium text-slate-700 hover:text-navy">{item.label}</a>)}
        </nav>
        <div className="flex items-center gap-2">
          {!session?.user ? (
            <>
              <a href="/login" className="rounded-full border px-3 py-1.5 text-sm">Login</a>
              <a href="/register" className="rounded-full bg-teal px-3 py-1.5 text-sm text-white">Register</a>
            </>
          ) : (
            <>
              <a href={dashboardByRole[session.user.role] ?? '/dashboard/researcher'} className="rounded-full border px-3 py-1.5 text-sm">Dashboard</a>
              {session.user.role !== 'RESEARCHER' ? <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{session.user.role}</span> : null}
              <form
                action={async () => {
                  'use server';
                  await signOut({ redirectTo: '/' });
                }}
              >
                <button className="rounded-full bg-navy px-3 py-1.5 text-sm text-white" type="submit">Sign out</button>
              </form>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
