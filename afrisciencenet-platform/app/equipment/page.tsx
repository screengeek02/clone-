import { prisma } from '@/lib/db/prisma';
import { EquipmentCard } from '@/components/cards/equipment-card';

export default async function EquipmentListPage() {
  const equipment = await prisma.equipment.findMany({ where: { approvalStatus: 'APPROVED' }, include: { institution: true }, orderBy: { createdAt: 'desc' } });
  return <main className="mx-auto max-w-7xl px-4 py-8"><h1 className="text-3xl font-semibold text-navy">Equipment Registry</h1><div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{equipment.map((item) => <EquipmentCard key={item.id} equipment={item} />)}</div></main>;
}
