import Link from 'next/link';

export function Footer() {
  return (
    <footer className="mt-20 border-t border-[var(--border)] py-10">
      <div className="container-xl grid gap-8 md:grid-cols-4">
        <div>
          <p className="font-semibold">VitalSpring</p>
          <p className="mt-2 text-sm text-muted">Proactive testing and personalized care plans.</p>
        </div>
        <div>
          <p className="font-medium">Product</p>
          <div className="mt-2 space-y-2 text-sm text-muted"><Link href="/how-it-works">How it works</Link><br/><Link href="/what-we-test">What we test</Link></div>
        </div>
        <div>
          <p className="font-medium">Company</p>
          <div className="mt-2 space-y-2 text-sm text-muted"><Link href="/our-why">Our why</Link><br/><Link href="/for-teams">For teams</Link></div>
        </div>
        <div>
          <p className="font-medium">Legal</p>
          <div className="mt-2 space-y-2 text-sm text-muted"><Link href="/legal/privacy">Privacy</Link><br/><Link href="/legal/terms">Terms</Link><br/><Link href="/legal/consent">Consent</Link></div>
        </div>
      </div>
    </footer>
  );
}
