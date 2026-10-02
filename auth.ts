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
          // Calendar.events scope so we can create events on the staff
          // member's primary calendar after they log in.
          scope:
            'openid email profile https://www.googleapis.com/auth/calendar.events',
          access_type: 'offline', // we need a refresh_token
          prompt: 'consent',      // force consent screen so Google issues a refresh_token
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

            // Persist Google tokens on login so background jobs (calendar
            // event creation on reservation approval) can act as this user.
            // Only overwrite refresh_token when Google actually returns one;
            // Google only hands it over on the first consent (prompt=consent
            // + access_type=offline mitigate that).
            if (account.provider === 'google') {
              const accessToken = account.access_token ?? null;
              const refreshToken = account.refresh_token ?? null;
              const expiresAt = account.expires_at
                ? new Date(account.expires_at * 1000)
                : null;

              try {
                if (refreshToken) {
                  await sql`
                    UPDATE users SET
                      google_access_token = ${accessToken},
                      google_refresh_token = ${refreshToken},
                      google_token_expires_at = ${expiresAt},
                      last_login_at = NOW()
                    WHERE id = ${rows[0].id}
                  `;
                } else {
                  // Access-only refresh (no refresh token re-issued)
                  await sql`
                    UPDATE users SET
                      google_access_token = ${accessToken},
                      google_token_expires_at = ${expiresAt},
                      last_login_at = NOW()
                    WHERE id = ${rows[0].id}
                  `;
                }
              } catch (tokenErr) {
                console.error('[auth] Failed to persist google tokens:', tokenErr);
                // Fall back to just last_login_at update
                await sql`UPDATE users SET last_login_at = NOW() WHERE id = ${rows[0].id}`;
              }
            } else {
              await sql`UPDATE users SET last_login_at = NOW() WHERE id = ${rows[0].id}`;
            }
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
