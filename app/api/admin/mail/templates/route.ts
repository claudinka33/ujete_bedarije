import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { sql } from '@/lib/db';
import { getMailTemplates, MAIL_TEMPLATE_KEYS, type MailTemplateKey } from '@/lib/mail';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** GET — return all current template values (settings merged with defaults). */
export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }
  const templates = await getMailTemplates();
  return NextResponse.json({ ok: true, templates });
}

/** POST — upsert one or more templates into the settings table.
 * Body: { templates: { key: value, ... } }
 */
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }
  try {
    const body = (await request.json()) as {
      templates: Partial<Record<MailTemplateKey, string>>;
    };
    const payload = body.templates || {};

    // Only accept keys from our known list
    const validKeys = Object.keys(payload).filter(
      (k): k is MailTemplateKey => (MAIL_TEMPLATE_KEYS as readonly string[]).includes(k)
    );

    if (validKeys.length === 0) {
      return NextResponse.json({ error: 'No valid template keys in payload' }, { status: 400 });
    }

    // Upsert each one. Minimum validation: non-null string.
    for (const key of validKeys) {
      const value = String(payload[key] ?? '').trim();
      if (!value) {
        return NextResponse.json({ error: `Prazno polje: ${key}` }, { status: 400 });
      }
      await sql`
        INSERT INTO settings (key, value) VALUES (${key}, ${value})
        ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value
      `;
    }

    revalidatePath('/admin/mail', 'page');
    return NextResponse.json({ ok: true, saved: validKeys });
  } catch (err) {
    console.error('[mail-templates] Save failed:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Server error' },
      { status: 500 }
    );
  }
}
