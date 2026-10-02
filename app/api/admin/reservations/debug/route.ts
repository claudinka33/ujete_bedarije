import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { sql } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Diagnostic: raw dump of reservations table so we can confirm what's actually there. */
export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const total = await sql`SELECT COUNT(*)::int AS c FROM reservations`;
    const rows = await sql`
      SELECT id, customer_name, customer_email, event_date, event_type,
             status, google_event_ids, created_at
      FROM reservations
      ORDER BY id ASC
    `;
    return NextResponse.json({
      total: (total[0] as { c: number }).c,
      reservations: rows,
    });
  } catch (error) {
    console.error('Reservations debug error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Server error' },
      { status: 500 }
    );
  }
}
