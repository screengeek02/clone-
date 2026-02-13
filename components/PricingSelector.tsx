'use client';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { PrimaryCTA } from './PrimaryCTA';

const plans = [
  { key: '1x', label: '1x / year', price: 299, savings: 'Starter' },
  { key: '2x', label: '2x / year', price: 549, savings: 'Save 8%' },
  { key: '4x', label: '4x / year', price: 999, savings: 'Save 16%' }
];

export function PricingSelector() {
  const [selected, setSelected] = useState(plans[1]);
  return (
    <section className="panel rounded-3xl p-6">
      <h3 className="text-2xl font-semibold">Membership pricing</h3>
      <div className="mt-5 grid gap-3 md:grid-cols-3" role="tablist" aria-label="Plan frequency">
        {plans.map((plan) => (
          <button
            key={plan.key}
            role="tab"
            aria-selected={selected.key === plan.key}
            onClick={() => setSelected(plan)}
            className="focus-ring relative rounded-xl border border-[var(--border)] p-3 text-left"
          >
            {selected.key === plan.key && (
              <motion.div layoutId="activePlan" className="absolute inset-0 rounded-xl bg-cyan-300/15" />
            )}
            <div className="relative">
              <p className="font-medium">{plan.label}</p>
              <p className="text-sm text-muted">{plan.savings}</p>
            </div>
          </button>
        ))}
      </div>
      <p className="mt-4 text-3xl font-bold">${selected.price}<span className="text-base text-muted"> / year</span></p>
      <div className="mt-4 flex flex-wrap gap-3">
        <PrimaryCTA href="/gift">Start</PrimaryCTA>
        <span className="text-sm text-muted">HSA/FSA eligible · Cancel anytime</span>
      </div>
    </section>
  );
}
