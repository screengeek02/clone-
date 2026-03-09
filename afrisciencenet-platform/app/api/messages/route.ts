import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {

  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const body = await req.json();

  const {
    threadId,
    recipientId,
    subject,
    content
  } = body;

  if (!recipientId) {
    return NextResponse.json(
      { error: "Recipient required" },
      { status: 400 }
    );
  }

  let finalThreadId = threadId;

  if (!finalThreadId) {
    const createdThread = await prisma.messageThread.create({
      data: {
        subject: subject ?? "New Conversation",
        participants: {
          create: [
            { userId: session.user.id },
            { userId: recipientId }
          ]
        }
      }
    });

    finalThreadId = createdThread.id;
  }

  const message = await prisma.message.create({
    data: {
      threadId: finalThreadId,
      senderId: session.user.id,
      body: content
    }
  });

  return NextResponse.json(message);
}
