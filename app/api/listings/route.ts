import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUserFromRequest } from '@/lib/auth';

export async function GET() {
  const listings = await prisma.serviceListing.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(listings);
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUserFromRequest(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!['PROVIDER', 'ADMIN'].includes(user.role)) {
    return NextResponse.json({ error: 'Only providers can create listings' }, { status: 403 });
  }

  const { title, description, price, category } = await request.json();
  if (!title || !description || !price || !category) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const listing = await prisma.serviceListing.create({
    data: { title, description, price: Number(price), category, providerId: user.id }
  });

  return NextResponse.json(listing, { status: 201 });
}
