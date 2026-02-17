import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUserFromRequest } from '@/lib/auth';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const user = await getCurrentUserFromRequest(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const booking = await prisma.booking.findUnique({ where: { id: params.id } });
  if (!booking) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  if (![booking.providerId, booking.customerId].includes(user.id) && user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { status, date } = await request.json();
  const updated = await prisma.booking.update({
    where: { id: params.id },
    data: {
      status,
      ...(date ? { date: new Date(date) } : {})
    }
  });

  return NextResponse.json(updated);
}
