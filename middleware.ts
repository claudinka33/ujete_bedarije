import { auth } from '@/auth';
import { NextResponse } from 'next/server';

/**
 * Explicitna middleware logika — brez zanašanja na NextAuth default behavior.
 *
 * - /admin/login: dostopen vsem; če je uporabnik že prijavljen → redirect na /admin
 * - /admin/*: zahteva prijavo; neprijavljeni gredo na /admin/login
 * - vsi ostali: dovoli naprej
 */
export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const path = req.nextUrl.pathname;
  const isLoginPage = path === '/admin/login';
  const isAdminRoute = path.startsWith('/admin');

  // Login page: če prijavljen → dashboard, sicer prikazi login
  if (isLoginPage) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL('/admin', req.nextUrl));
    }
    return NextResponse.next();
  }

  // Ostale /admin/* rute: zahtevajo prijavo
  if (isAdminRoute && !isLoggedIn) {
    const loginUrl = new URL('/admin/login', req.nextUrl);
    loginUrl.searchParams.set('callbackUrl', path);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/admin/:path*'],
};
