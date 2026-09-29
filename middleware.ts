import { auth } from '@/auth';
import { NextResponse } from 'next/server';

/**
 * Middleware — zaščiti vse /admin/* poti (razen /admin/login).
 * Če uporabnik ni prijavljen ali ni na whitelist, preusmeri na login.
 */
export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const path = req.nextUrl.pathname;
  const isLoginPage = path === '/admin/login';
  const isAdminRoute = path.startsWith('/admin');

  if (isAdminRoute && !isLoginPage && !isLoggedIn) {
    const url = req.nextUrl.clone();
    url.pathname = '/admin/login';
    url.searchParams.set('callbackUrl', path);
    return NextResponse.redirect(url);
  }

  if (isLoginPage && isLoggedIn) {
    return NextResponse.redirect(new URL('/admin', req.nextUrl));
  }
});

export const config = {
  matcher: ['/admin/:path*'],
};
