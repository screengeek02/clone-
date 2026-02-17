import { NextRequest, NextResponse } from 'next/server';
import { AUTH_COOKIE } from '@/lib/auth';
import { verifyEdgeToken } from '@/lib/auth-edge';

const protectedPrefixes = ['/dashboard', '/profile', '/bookings', '/messages'];
const adminPrefix = '/admin';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(AUTH_COOKIE)?.value;

  const needsAuth = protectedPrefixes.some((prefix) => pathname.startsWith(prefix));
  const needsAdmin = pathname.startsWith(adminPrefix);

  if (!needsAuth && !needsAdmin) return NextResponse.next();

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const payload = await verifyEdgeToken(token);
  if (!payload) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (needsAdmin && payload.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*', '/bookings/:path*', '/messages/:path*', '/admin/:path*']
};
