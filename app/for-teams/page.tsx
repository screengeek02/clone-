export default function ForTeamsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold">For teams</h1>
      <p className="text-muted">Build healthier organizations with proactive biomarker programs.</p>
      <div className="grid gap-4 md:grid-cols-3">
        {['Retention lift', 'Proactive care', 'Actionable reporting'].map((b) => <div key={b} className="panel rounded-xl p-4">{b}</div>)}
      </div>
      <section className="panel rounded-xl p-5"><h2 className="text-xl font-semibold">Security & Privacy</h2><p className="text-muted">Data controls, permissioning, and compliance-oriented workflows.</p></section>
      <section className="panel rounded-xl p-5"><h2 className="text-xl font-semibold">Pricing tiers</h2><table className="mt-3 w-full text-sm"><tbody><tr><td>Starter</td><td>25–100 members</td></tr><tr><td>Growth</td><td>101–500 members</td></tr><tr><td>Enterprise</td><td>500+ members</td></tr></tbody></table></section>
      <form className="panel max-w-xl rounded-xl p-5"><h2 className="text-xl font-semibold">Contact sales</h2><input className="focus-ring mt-3 w-full rounded border border-[var(--border)] bg-white/5 p-2" placeholder="Work email" /><textarea className="focus-ring mt-3 w-full rounded border border-[var(--border)] bg-white/5 p-2" placeholder="Tell us about your team" /><button className="focus-ring mt-3 rounded bg-cyan-300 px-4 py-2 text-slate-900">Submit</button></form>
    </div>
  );
}
