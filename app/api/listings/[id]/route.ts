import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUserFromRequest } from '@/lib/auth';

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const listing = await prisma.serviceListing.findUnique({ where: { id: params.id } });
  if (!listing) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(listing);
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const user = await getCurrentUserFromRequest(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const existing = await prisma.serviceListing.findUnique({ where: { id: params.id } });
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (user.role !== 'ADMIN' && existing.providerId !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await request.json();
  const updated = await prisma.serviceListing.update({ where: { id: params.id }, data: body });
  return NextResponse.json(updated);
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const user = await getCurrentUserFromRequest(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const existing = await prisma.serviceListing.findUnique({ where: { id: params.id } });
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (user.role !== 'ADMIN' && existing.providerId !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  await prisma.serviceListing.delete({ where: { id: params.id } });
  return NextResponse.json({ message: 'Deleted' });
}
