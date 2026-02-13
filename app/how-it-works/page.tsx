import { ComparisonTable } from '@/components/ComparisonTable';
import { FeatureCard } from '@/components/FeatureCard';

export default function HowItWorksPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold">How it works</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <FeatureCard title="1. Baseline" body="Complete intake and book labs at a nearby partner location." />
        <FeatureCard title="2. Analysis" body="Our system maps trends and clinician notes by risk priority." />
        <FeatureCard title="3. Action Plan" body="Follow a phased routine with nutrition, movement, and sleep targets." />
      </div>
      <section className="space-y-3"><h2 className="text-2xl font-semibold">After your plan</h2><FeatureCard title="Ongoing guidance" body="Monthly check-ins and re-testing cadence keep improvements on track." /></section>
      <section className="space-y-3"><h2 className="text-2xl font-semibold">Compare action plan vs typical checkup</h2><ComparisonTable /></section>
    </div>
  );
}
