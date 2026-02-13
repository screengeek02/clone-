import { AccordionFAQ } from '@/components/AccordionFAQ';
import { ClinicianCarousel } from '@/components/ClinicianCarousel';
import { FeatureCard } from '@/components/FeatureCard';
import { PricingSelector } from '@/components/PricingSelector';
import { PrimaryCTA } from '@/components/PrimaryCTA';
import { StatPill } from '@/components/StatPill';
import { TestimonialGrid, VideoCard } from '@/components/TestimonialGrid';
import { TimelineStepper } from '@/components/TimelineStepper';

const faqs = [
  { q: 'Can I use my existing lab?', a: 'We support major national networks with thousands of draw sites.' },
  { q: 'How quickly do results arrive?', a: 'Most panels finalize in about one week, with alerts for outliers.' },
  { q: 'Is this diagnosis?', a: 'No. It is educational wellness guidance that helps inform physician visits.' },
  { q: 'Can I pause membership?', a: 'Yes, billing controls are available in account settings.' },
  { q: 'Does insurance cover this?', a: 'Coverage varies; many members use HSA/FSA funds where eligible.' },
  { q: 'How many markers are included?', a: 'Over 100 biomarkers each year across core health systems.' }
];

export default function HomePage() {
  return (
    <div className="space-y-12">
      <section className="grid items-center gap-8 md:grid-cols-2">
        <div>
          <h1 className="text-4xl font-bold md:text-6xl">Unlock your health intelligence</h1>
          <p className="mt-4 text-lg text-muted">100+ biomarkers yearly to catch risk early and build a personalized plan.</p>
          <ul className="mt-4 space-y-2 text-muted"><li>• Clinician-reviewed results</li><li>• Practical weekly actions</li><li>• Trend tracking over time</li></ul>
          <p className="mt-3 text-sm text-cyan-300">Fast results · Convenient labs nationwide</p>
          <div className="mt-5 flex gap-3"><PrimaryCTA href="/gift">Join Membership</PrimaryCTA><PrimaryCTA href="/what-we-test" secondary>See what we test</PrimaryCTA></div>
        </div>
        <div className="panel rounded-3xl bg-glow p-8">
          <div className="h-72 rounded-2xl border border-[var(--border)] bg-gradient-to-br from-blue-500/20 to-cyan-300/10 p-4">
            <p className="text-sm text-muted">Animated device mock placeholder</p>
          </div>
        </div>
      </section>

      <section className="flex flex-wrap gap-3">{['No wait times', 'Results in ~1 week', 'Thousands of locations'].map((s) => <StatPill key={s} label={s} />)}</section>

      <section>
        <h2 className="text-3xl font-semibold">It starts with comprehensive testing</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">{['Heart', 'Metabolic', 'Hormones', 'Inflammation', 'Nutrients', 'Liver'].map((c) => <FeatureCard key={c} title={c} body={`Targeted markers and longitudinal trend views for ${c.toLowerCase()} health.`} />)}</div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <FeatureCard title="38%" body="Members reporting improved energy after 90 days." />
        <FeatureCard title="31%" body="Observed reduction in flagged high-risk markers." />
        <FeatureCard title="4.8/5" body="Average member satisfaction in quarterly surveys." />
        <p className="text-xs text-muted md:col-span-3">Outcomes are illustrative placeholders and not guaranteed medical results.</p>
      </section>

      <TimelineStepper items={[{ day: 'Today', title: 'Join and complete your intake' }, { day: 'Day 5', title: 'Visit a nearby lab for your panel' }, { day: 'Day 10', title: 'Review insights and activate plan' }]} />

      <section>
        <h2 className="text-3xl font-semibold">What you get</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">{['Annual roadmap', 'Lab logistics', 'Risk flags', 'Coach messaging', 'Goal tracking', 'Progress snapshots'].map((i) => <FeatureCard key={i} title={i} body="Designed to keep your plan practical and measurable." />)}</div>
      </section>

      <ClinicianCarousel />
      <PricingSelector />
      <section><h2 className="text-3xl font-semibold">Real member reviews</h2><p className="text-muted">4.8 average from 2,100+ submitted experiences.</p><div className="mt-4 grid gap-4 md:grid-cols-2"><TestimonialGrid /><VideoCard /></div></section>
      <section><h2 className="text-3xl font-semibold">Popular questions</h2><div className="mt-4"><AccordionFAQ items={faqs} /></div><PrimaryCTA href="/faqs" secondary>View all FAQs</PrimaryCTA></section>
      <section className="panel rounded-3xl p-8 text-center"><h2 className="text-3xl font-semibold">Start your next year of better health decisions</h2><p className="mt-2 text-muted">Data-driven prevention, designed around your schedule.</p><div className="mt-4"><PrimaryCTA href="/gift">Join Membership</PrimaryCTA></div></section>
    </div>
  );
}
