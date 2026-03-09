import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";

export async function POST(req: Request) {

  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const body = await req.json();

  const booking = await prisma.bookingRequest.create({
    data: {
      userId: session.user.id,
      equipmentId: body.equipmentId,
      institutionId: body.institutionId,
      requestType: body.requestType,
      purpose: body.purpose,
      projectTitle: body.projectTitle ?? null,
      notes: body.notes ?? null,
      requestedStart: new Date(body.requestedStart),
      requestedEnd: new Date(body.requestedEnd)
    }
  });

  return NextResponse.json(booking);
}
