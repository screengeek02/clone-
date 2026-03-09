export const dynamic = "force-dynamic";
import { prisma } from '@/lib/prisma';

export default async function MapPage() {
  const institutions = await prisma.institution.findMany({ where: { approvalStatus: 'APPROVED' }, select: { id: true, name: true, city: true, region: true } });
  return <main className="mx-auto max-w-7xl px-4 py-8"><h1 className="text-3xl font-semibold text-navy">Research Infrastructure Map</h1><article className="card mt-6 p-6"><p className="text-sm">Leaflet map container (cluster + filters by country/region/type).</p><div className="mt-3 h-80 rounded-xl border border-dashed border-slate-300 bg-slate-100 p-4">Map data points loaded: {institutions.length}</div></article></main>;
}
