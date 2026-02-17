import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUserFromRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const user = await getCurrentUserFromRequest(request);
  if (!user || user.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const listings = await prisma.serviceListing.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(listings);
}
