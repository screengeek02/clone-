import { NextRequest, NextResponse } from 'next/server';
import { bookingRequestSchema } from '@/lib/validation/schemas';
import { prisma } from '@/lib/db/prisma';
import { auth } from '@/lib/auth/auth';

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const payload = await request.json();
  const parsed = bookingRequestSchema.safeParse(payload);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const booking = await prisma.bookingRequest.create({
    data: {
      ...parsed.data,
      requestedStart: new Date(parsed.data.requestedStart),
      requestedEnd: new Date(parsed.data.requestedEnd),
      userId: session.user.id
    }
  });

  return NextResponse.json(booking, { status: 201 });
}
