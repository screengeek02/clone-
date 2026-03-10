import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

export default async function EquipmentDetailPage({ params }: { params: { slug: string } }) {
  const equipment = await prisma.equipment.findUnique({ where: { slug: params.slug }, include: { institution: true, country: true, bookings: true } });
  if (!equipment) return notFound();

  return (
    <main className="mx-auto grid max-w-7xl gap-6 px-4 py-8 md:grid-cols-3">
      <section className="md:col-span-2 card p-6"><h1 className="text-3xl font-semibold text-navy">{equipment.title}</h1><p className="mt-2">{equipment.description}</p><p className="mt-3 text-sm">{equipment.manufacturer} {equipment.model} • {equipment.institution.name}</p></section>
      <aside className="card p-6"><h2 className="font-semibold text-navy">Booking & Access</h2><p className="mt-2 text-sm">Availability: {equipment.availabilityStatus}</p><a href="/dashboard/researcher" className="mt-4 inline-block rounded-full bg-teal px-4 py-2 text-white">Request Access</a></aside>
    </main>
  );
}
