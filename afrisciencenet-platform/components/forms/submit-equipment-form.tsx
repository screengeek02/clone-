'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { equipmentSubmissionSchema } from '@/lib/validation/schemas';

type FormData = z.infer<typeof equipmentSubmissionSchema>;

export function SubmitEquipmentForm({ institutions, countries }: { institutions: { id: string; name: string }[]; countries: { id: string; name: string }[] }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(equipmentSubmissionSchema) });

  const onSubmit = async (data: FormData) => {
    await fetch('/api/moderation', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...data, entityType: 'equipment' }) });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="card space-y-3 p-5">
      <h2 className="text-xl font-semibold text-navy">Submit Equipment</h2>
      <input className="w-full rounded border p-2" placeholder="Equipment title" {...register('title')} />
      {errors.title && <p className="text-xs text-red-600">{errors.title.message}</p>}
      <input className="w-full rounded border p-2" placeholder="Manufacturer" {...register('manufacturer')} />
      <input className="w-full rounded border p-2" placeholder="Model" {...register('model')} />
      <input className="w-full rounded border p-2" placeholder="Category" {...register('category')} />
      <select className="w-full rounded border p-2" {...register('institutionId')}>{institutions.map((i) => <option key={i.id} value={i.id}>{i.name}</option>)}</select>
      <select className="w-full rounded border p-2" {...register('countryId')}>{countries.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
      <textarea className="w-full rounded border p-2" placeholder="Description" {...register('description')} />
      <input className="w-full rounded border p-2" placeholder="Contact email" {...register('contactPersonEmail')} />
      <button disabled={isSubmitting} className="rounded bg-teal px-4 py-2 text-white">Submit for Moderation</button>
    </form>
  );
}
