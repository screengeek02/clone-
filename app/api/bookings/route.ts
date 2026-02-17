import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUserFromRequest } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const user = await getCurrentUserFromRequest(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { listingId, date } = await request.json();
  const listing = await prisma.serviceListing.findUnique({ where: { id: listingId } });
  if (!listing) return NextResponse.json({ error: 'Listing not found' }, { status: 404 });

  const booking = await prisma.booking.create({
    data: {
      listingId,
      customerId: user.id,
      providerId: listing.providerId,
      date: new Date(date)
    }
  });

  return NextResponse.json(booking, { status: 201 });
}

export async function GET(request: NextRequest) {
  const user = await getCurrentUserFromRequest(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const where = user.role === 'ADMIN'
    ? {}
    : user.role === 'PROVIDER'
      ? { providerId: user.id }
      : { customerId: user.id };

  const bookings = await prisma.booking.findMany({ where, include: { listing: true }, orderBy: { date: 'desc' } });
  return NextResponse.json(bookings);
}
