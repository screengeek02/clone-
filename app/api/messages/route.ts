import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUserFromRequest } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const user = await getCurrentUserFromRequest(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { content, receiverId } = await request.json();
  if (!content || !receiverId) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

  const message = await prisma.message.create({ data: { content, senderId: user.id, receiverId } });
  return NextResponse.json(message, { status: 201 });
}

export async function GET(request: NextRequest) {
  const user = await getCurrentUserFromRequest(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const messages = await prisma.message.findMany({
    where: { OR: [{ senderId: user.id }, { receiverId: user.id }] },
    orderBy: { sentAt: 'desc' }
  });
  return NextResponse.json(messages);
}
