import { auth } from '@/lib/auth/auth';
import { prisma } from '@/lib/prisma';
import { UserRole } from '@prisma/client';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const bodySchema = z.object({ role: z.nativeEnum(UserRole) });

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user || session.user.role !== UserRole.SUPER_ADMIN) {
    return NextResponse.json({ ok: false, error: 'Forbidden' }, { status: 403 });
  }

  const parsed = bodySchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: parsed.error.flatten() }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: params.id },
    data: { role: parsed.data.role }
  });

  return NextResponse.json({ ok: true });
}
