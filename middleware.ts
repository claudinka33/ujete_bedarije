/**
 * Middleware — samo re-eksportira NextAuth-ov auth handler.
 * Vsa logika (kdo lahko dostopa do česa) je v callbacks.authorized() v auth.ts.
 * Ta pristop odpravi risk redirect loop-a.
 */
export { auth as default } from '@/auth';

export const config = {
  matcher: ['/admin/:path*'],
};
