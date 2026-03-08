import { Equipment } from '@prisma/client';

export function EquipmentCard({ equipment }: { equipment: Equipment }) {
  return (
    <article className="card p-5 transition hover:-translate-y-1">
      <p className="text-xs uppercase tracking-wide text-slate-500">{equipment.category}</p>
      <h3 className="mt-1 text-lg font-semibold text-navy"><a href={`/equipment/${equipment.slug}`}>{equipment.title}</a></h3>
      <p className="mt-1 text-sm">{equipment.manufacturer} {equipment.model}</p>
      <span className="mt-3 inline-block rounded-full bg-teal/10 px-3 py-1 text-xs font-semibold text-teal">{equipment.availabilityStatus}</span>
    </article>
  );
}
