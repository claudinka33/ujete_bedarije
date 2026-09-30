import { auth } from '@/auth';
import { NextResponse } from 'next/server';

/**
 * Middleware — samo za auth zaščito CMS ruta.
 *
 * Matcher IZKLJUČUJE /admin/login (login page je javna).
 * Vse ostale /admin/* rute zahtevajo prijavo.
 *
 * Layout v app/admin/(cms)/layout.tsx dela dodatno zaščito na server-side.
 */
export default auth((req) => {
  const isLoggedIn = !!req.auth;

  if (!isLoggedIn) {
    const loginUrl = new URL('/admin/login', req.nextUrl);
    loginUrl.searchParams.set('callbackUrl', req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * Match vse /admin/* rute RAZEN:
     * - /admin/login (login page)
     * - /admin/api/auth/* (NextAuth API endpoints)
     */
    '/admin/((?!login|api/auth).*)',
    '/admin',
  ],
};
