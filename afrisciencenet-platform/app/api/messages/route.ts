import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { prisma } from '@/lib/db/prisma';

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const payload = await request.json();
  const { threadId, recipientId, subject, body } = payload as { threadId?: string; recipientId?: string; subject?: string; body: string };

  let finalThreadId = threadId;
  if (!finalThreadId) {
    const created = await prisma.messageThread.create({ data: { subject: subject ?? 'New Conversation', participants: { create: [{ userId: session.user.id }, { userId: recipientId! }] } } });
    finalThreadId = created.id;
  }

  const message = await prisma.message.create({ data: { threadId: finalThreadId, senderId: session.user.id, body } });
  return NextResponse.json(message, { status: 201 });
}
