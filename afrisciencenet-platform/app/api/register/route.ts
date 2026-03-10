import { prisma } from '@/lib/prisma';
import { UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  confirmPassword: z.string().min(8),
  institution: z.string().optional(),
  country: z.string().optional(),
  discipline: z.string().optional()
}).refine((v) => v.password === v.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
});

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: parsed.error.flatten() }, { status: 400 });
  }

  const { name, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ ok: false, error: 'Email already in use' }, { status: 409 });
  }

  const [country, discipline] = await Promise.all([
    prisma.country.findFirst({ where: parsed.data.country ? { name: parsed.data.country } : undefined }),
    prisma.discipline.findFirst({ where: parsed.data.discipline ? { name: parsed.data.discipline } : undefined })
  ]);

  const fallbackCountry = country ?? await prisma.country.findFirst();
  const fallbackDiscipline = discipline ?? await prisma.discipline.findFirst();

  if (!fallbackCountry || !fallbackDiscipline) {
    return NextResponse.json({ ok: false, error: 'Country and discipline seed data are required' }, { status: 500 });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      name,
      passwordHash,
      role: UserRole.RESEARCHER,
      isApproved: true
    }
  });

  const baseSlug = slugify(name);
  const existingSlug = await prisma.researcherProfile.findFirst({ where: { slug: baseSlug } });
  const slug = existingSlug ? `${baseSlug}-${user.id.slice(-6)}` : baseSlug;

  await prisma.researcherProfile.create({
    data: {
      userId: user.id,
      fullName: name,
      slug,
      countryId: fallbackCountry.id,
      disciplineId: fallbackDiscipline.id,
      institutionId: null,
      createdByUserId: user.id
    }
  });

  return NextResponse.json({ ok: true });
}
