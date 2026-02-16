import Link from 'next/link';

export function Footer() {
  return (
    <footer className="mt-20 border-t border-zinc-800 bg-black/70">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-3">
        <div>
          <p className="font-display text-lg uppercase tracking-wider">Da Basement Apparel</p>
          <p className="mt-2 text-sm text-zinc-400">Curated streetwear for nights that run long.</p>
        </div>
        <div>
          <p className="mb-2 text-sm uppercase tracking-widest text-zinc-500">Social</p>
          <ul className="space-y-1 text-sm text-zinc-300">
            <li>
              <a href="https://instagram.com" className="hover:text-white">
                Instagram
              </a>
            </li>
            <li>
              <a href="https://pinterest.com" className="hover:text-white">
                Pinterest
              </a>
            </li>
          </ul>
        </div>
        <div>
          <p className="mb-2 text-sm uppercase tracking-widest text-zinc-500">Legal</p>
          <ul className="space-y-1 text-sm text-zinc-300">
            <li><Link href="/disclosure">Affiliate Disclosure</Link></li>
            <li><Link href="/privacy">Privacy Policy</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
