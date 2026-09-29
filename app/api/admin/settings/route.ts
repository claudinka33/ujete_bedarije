import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { upsertSetting } from '@/lib/queries';

export const runtime = 'nodejs';

export async function PATCH(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const body = (await request.json()) as { settings: Array<{ key: string; value: string }> };
    if (!Array.isArray(body.settings)) {
      return NextResponse.json({ error: 'settings must be array' }, { status: 400 });
    }
    // Batch upsert
    for (const s of body.settings) {
      if (typeof s.key !== 'string' || s.key.length === 0) continue;
      await upsertSetting(s.key, s.value ?? '');
    }
    return NextResponse.json({ ok: true, updated: body.settings.length });
  } catch (error) {
    console.error('PATCH settings error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
