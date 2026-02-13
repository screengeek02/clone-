export function ComparisonTable() {
  const rows = [
    ['Biomarkers tracked', '100+ per year', 'Basic metabolic panel'],
    ['Action plan', 'Personalized with milestones', 'General recommendations'],
    ['Follow-up cadence', 'Quarterly check-ins', 'Annual or symptom-driven']
  ];
  return (
    <table className="panel w-full rounded-2xl p-3 text-left text-sm">
      <thead>
        <tr className="border-b border-[var(--border)]">
          <th className="p-3">Category</th><th className="p-3">Membership</th><th className="p-3">Typical checkup</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r[0]} className="border-b border-[var(--border)] last:border-none">
            {r.map((c) => <td key={c} className="p-3">{c}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
