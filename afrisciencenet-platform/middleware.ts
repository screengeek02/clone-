import { auth } from '@/lib/auth/auth';
import { UserRole } from '@prisma/client';
import { NextResponse } from 'next/server';

const protectedPrefixes = [
  '/dashboard',
  '/messages',
  '/equipment/submit',
  '/projects/submit',
  '/datasets/submit',
  '/collaborations/create',
  '/researchers/create',
  '/researchers/edit',
  '/api/moderation'
];

const roleRules: Array<{ prefix: string; roles: UserRole[] }> = [
  { prefix: '/dashboard/researcher', roles: [UserRole.RESEARCHER, UserRole.INSTITUTION_ADMIN, UserRole.COUNTRY_COORDINATOR, UserRole.SUPER_ADMIN] },
  { prefix: '/dashboard/institution-admin', roles: [UserRole.INSTITUTION_ADMIN, UserRole.SUPER_ADMIN] },
  { prefix: '/dashboard/country-coordinator', roles: [UserRole.COUNTRY_COORDINATOR, UserRole.SUPER_ADMIN] },
  { prefix: '/dashboard/super-admin', roles: [UserRole.SUPER_ADMIN] },
  { prefix: '/api/admin', roles: [UserRole.SUPER_ADMIN] }
];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isProtected = protectedPrefixes.some((prefix) => pathname.startsWith(prefix));

  if (!isProtected) {
    return NextResponse.next();
  }

  if (!req.auth?.user) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  const rule = roleRules.find((entry) => pathname.startsWith(entry.prefix));
  if (rule && !rule.roles.includes(req.auth.user.role)) {
    return NextResponse.redirect(new URL('/unauthorized', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/dashboard/:path*', '/messages/:path*', '/equipment/submit', '/projects/submit', '/datasets/submit', '/collaborations/create', '/researchers/create', '/researchers/edit/:path*', '/api/moderation/:path*', '/api/admin/:path*']
};
