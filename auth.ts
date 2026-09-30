import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import { isAdminEmail } from '@/lib/whitelist';
import { sql } from '@/lib/db';

/**
 * NextAuth v5 config.
 *
 * Zahteva env variables:
 *   AUTH_SECRET           — random string (naredi z: openssl rand -base64 32)
 *   AUTH_GOOGLE_ID        — Google OAuth Client ID
 *   AUTH_GOOGLE_SECRET    — Google OAuth Client Secret
 *
 * Google OAuth scopes za Calendar API bomo dodali kasneje —
 * za zdaj samo profile + email za identifikacijo.
 */
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      authorization: {
        params: {
          // Za zdaj samo osnovni scope. Ko dodamo Calendar sync:
          //   scope: 'openid email profile https://www.googleapis.com/auth/calendar.events',
          //   access_type: 'offline',   // za refresh_token
          //   prompt: 'consent',        // vedno vprašaj za dovoljenje (dobimo refresh_token)
          scope: 'openid email profile',
        },
      },
    }),
  ],
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  callbacks: {
    /**
     * Nadzor dostopa — kliče se pri vsakem requestu na zaščiten route.
     * Prepreči redirect loop tako, da izrecno dovoli /admin/login,
     * NextAuth pa samodejno redirect-a na signIn page pri drugih /admin/* rutah.
     */
    authorized({ auth: session, request: { nextUrl } }) {
      const path = nextUrl.pathname;
      const isLoggedIn = !!session;

      // Login page je vedno dostopna
      if (path === '/admin/login') {
        // Če je uporabnik že prijavljen, ga preusmeri na dashboard
        if (isLoggedIn) {
          return Response.redirect(new URL('/admin', nextUrl));
        }
        return true;
      }

      // Ostale /admin/* poti zahtevajo prijavo
      if (path.startsWith('/admin')) {
        return isLoggedIn; // NextAuth avtomatsko preusmeri na signIn (=/admin/login)
      }

      // Vse ostalo je dostopno vsem
      return true;
    },
    /**
     * Preverimo email whitelist — samo Claudia, Anita, Stane lahko notri.
     */
    async signIn({ user }) {
      if (!isAdminEmail(user.email)) {
        console.warn(`[auth] Zavrnjen email: ${user.email}`);
        return false;
      }
      return true;
    },
    /**
     * Ob prijavi shrani user info v JWT session.
     */
    async jwt({ token, user, account }) {
      if (account && user) {
        // Prva prijava — shrani email + poišči user_id iz baze
        token.email = user.email;
        try {
          const rows = (await sql`
            SELECT id, role FROM users WHERE email = ${user.email!} LIMIT 1
          `) as Array<{ id: number; role: string }>;
          if (rows[0]) {
            token.userId = rows[0].id;
            token.role = rows[0].role;
            // Update last_login_at
            await sql`
              UPDATE users SET last_login_at = NOW() WHERE id = ${rows[0].id}
            `;
          }
        } catch (err) {
          console.error('[auth] DB lookup failed:', err);
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.email = token.email as string;
        (session.user as { id?: number }).id = token.userId as number;
        (session.user as { role?: string }).role = token.role as string;
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 dni
  },
});
