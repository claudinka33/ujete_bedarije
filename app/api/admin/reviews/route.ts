import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { createReview, type ReviewInput } from '@/lib/queries';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }
  try {
    const body = (await request.json()) as ReviewInput;
    const review = await createReview(body);
    return NextResponse.json({ ok: true, review }, { status: 201 });
  } catch (error) {
    console.error('POST review error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
