import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { updatePackage, deletePackage, type PackageInput } from '@/lib/queries';

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
    const body = (await request.json()) as PackageInput;
    const pkg = await updatePackage(id, body);
    return NextResponse.json({ ok: true, package: pkg });
  } catch (error) {
    console.error('PATCH package error:', error);
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
    await deletePackage(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('DELETE package error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
