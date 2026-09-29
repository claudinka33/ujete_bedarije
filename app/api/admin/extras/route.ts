import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { createExtra, type ExtraInput } from '@/lib/queries';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }
  try {
    const body = (await request.json()) as ExtraInput;
    const extra = await createExtra(body);
    return NextResponse.json({ ok: true, extra }, { status: 201 });
  } catch (error) {
    console.error('POST extra error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
