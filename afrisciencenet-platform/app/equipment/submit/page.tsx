import { prisma } from '@/lib/db/prisma';
import { SubmitEquipmentForm } from '@/components/forms/submit-equipment-form';

export default async function SubmitEquipmentPage() {
  const [institutions, countries] = await Promise.all([
    prisma.institution.findMany({ select: { id: true, name: true }, where: { approvalStatus: 'APPROVED' } }),
    prisma.country.findMany({ select: { id: true, name: true } })
  ]);

  return <main className="mx-auto max-w-3xl px-4 py-8"><SubmitEquipmentForm institutions={institutions} countries={countries} /></main>;
}
