import { neon } from '@neondatabase/serverless';

/**
 * Neon Postgres serverless client.
 * Uporablja DATABASE_URL iz Vercel env variables (avtomatsko dodane
 * preko Neon Vercel integracije).
 */
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    'DATABASE_URL is not set. Add it to .env.local for dev or check Vercel env vars for production.'
  );
}

export const sql = neon(connectionString);
