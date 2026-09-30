import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { updateFaqItem, deleteFaqItem, type FaqInput } from '@/lib/queries';

export const runtime = 'nodejs';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }
  const id = parseInt(params.id, 10);
  if (isNaN(id)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

  try {
    const body = (await request.json()) as FaqInput;
    const faq = await updateFaqItem(id, body);
    return NextResponse.json({ ok: true, faq });
  } catch (error) {
    console.error('PATCH faq error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }
  const id = parseInt(params.id, 10);
  if (isNaN(id)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

  try {
    await deleteFaqItem(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('DELETE faq error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
