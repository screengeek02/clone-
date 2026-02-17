import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';
import { UserRole } from '@prisma/client';

export async function POST(request: Request) {
  try {
    const { email, password, firstName, lastName, role } = await request.json();
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
    }

    const exists = await prisma.user.findUnique({ where: { email: String(email).toLowerCase() } });
    if (exists) return NextResponse.json({ error: 'Email already in use' }, { status: 409 });

    const user = await prisma.user.create({
      data: {
        email: String(email).toLowerCase(),
        password: await hashPassword(password),
        firstName,
        lastName,
        role: role === 'PROVIDER' ? UserRole.PROVIDER : UserRole.USER
      },
      select: { id: true, email: true, role: true }
    });

    return NextResponse.json(user, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
