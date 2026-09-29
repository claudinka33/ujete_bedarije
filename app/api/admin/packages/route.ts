import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { createPackage, type PackageInput } from '@/lib/queries';

export const runtime = 'nodejs';

async function requireAuth() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }
  return null;
}

export async function POST(request: NextRequest) {
  const unauthorized = await requireAuth();
  if (unauthorized) return unauthorized;

  try {
    const body = (await request.json()) as PackageInput;
    const pkg = await createPackage(body);
    return NextResponse.json({ ok: true, package: pkg }, { status: 201 });
  } catch (error) {
    console.error('POST package error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
