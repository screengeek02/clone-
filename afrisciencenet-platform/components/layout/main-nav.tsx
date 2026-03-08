const links = ['Home', 'Find Equipment', 'Find Experts', 'Funding', 'Collaborations', 'Institutions', 'Map', 'Dashboard'];

export function MainNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <a href="/" className="font-semibold text-navy">AfriScienceNet</a>
        <nav className="hidden gap-4 md:flex">
          {links.map((item) => <a key={item} href={item === 'Home' ? '/' : `/${item.toLowerCase().replace(/ /g, '-')}`} className="text-sm font-medium text-slate-700 hover:text-navy">{item}</a>)}
        </nav>
        <div className="flex gap-2">
          <a href="/login" className="rounded-full border px-3 py-1.5 text-sm">Login</a>
          <a href="/register" className="rounded-full bg-teal px-3 py-1.5 text-sm text-white">Register</a>
        </div>
      </div>
    </header>
  );
}
