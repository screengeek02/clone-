export const dynamic = "force-dynamic";
import { prisma } from '@/lib/prisma';
import { HomeHero } from '@/components/sections/home-hero';
import { FeatureCard } from '@/components/cards/feature-card';
import { EquipmentCard } from '@/components/cards/equipment-card';
import { ResearcherCard } from '@/components/cards/researcher-card';
import { SiteFooter } from '@/components/layout/site-footer';

export default async function HomePage() {
  const [featuredEquipment, featuredResearchers, featuredFunding, institutions] = await Promise.all([
    prisma.equipment.findMany({ where: { featured: true, approvalStatus: 'APPROVED' }, take: 6, orderBy: { createdAt: 'desc' } }),
    prisma.researcherProfile.findMany({ where: { featured: true, approvalStatus: 'APPROVED' }, take: 6, orderBy: { createdAt: 'desc' } }),
    prisma.fundingOpportunity.findMany({ where: { featured: true, approvalStatus: 'APPROVED' }, take: 6, orderBy: { deadline: 'asc' } }),
    prisma.institution.findMany({ where: { approvalStatus: 'APPROVED' }, take: 6 })
  ]);

  return (
    <main className="mx-auto max-w-7xl space-y-8 px-4 py-8">
      <HomeHero />
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {[
          ['Find Equipment', 'Discover instrumentation and availability by institution.'],
          ['Find Expert', 'Search verified researchers by discipline and expertise.'],
          ['Find Scholarship', 'Track grants, fellowships, and lab funding.'],
          ['Post Collaboration', 'Build partnerships and consortium opportunities.'],
          ['Submit Lab Equipment', 'Add institutional infrastructure to the registry.']
        ].map(([title, description]) => <FeatureCard key={title} title={title} description={description} />)}
      </section>

      <section><h2 className="mb-3 text-2xl font-semibold text-navy">Featured Equipment</h2><div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{featuredEquipment.map((e) => <EquipmentCard key={e.id} equipment={e} />)}</div></section>
      <section><h2 className="mb-3 text-2xl font-semibold text-navy">Featured Researchers</h2><div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{featuredResearchers.map((r) => <ResearcherCard key={r.id} researcher={r} />)}</div></section>
      <section><h2 className="mb-3 text-2xl font-semibold text-navy">Funding Highlights</h2><div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{featuredFunding.map((f) => <article key={f.id} className="card p-5"><h3 className="font-semibold text-navy"><a href={`/funding/${f.slug}`}>{f.title}</a></h3><p className="text-sm">{f.provider} • {f.fundingType}</p></article>)}</div></section>
      <section className="grid gap-4 md:grid-cols-3">
        <article className="card p-5 md:col-span-2"><h2 className="text-2xl font-semibold text-navy">Research Infrastructure Map Preview</h2><p className="mt-2 text-sm">Explore centres of excellence, institutions, and equipment clusters.</p><a className="mt-4 inline-block rounded-full bg-navy px-4 py-2 text-white" href="/map">Open Interactive Map</a></article>
        <article className="card p-5"><h3 className="font-semibold text-navy">Platform Stats</h3><ul className="mt-3 space-y-2 text-sm"><li>{featuredEquipment.length}+ featured equipment</li><li>{featuredResearchers.length}+ featured researchers</li><li>{institutions.length}+ active institutions</li></ul></article>
      </section>
      <SiteFooter />
    </main>
  );
}
