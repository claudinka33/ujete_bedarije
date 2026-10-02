import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { deleteHeroMedia } from '@/lib/queries';

export const runtime = 'nodejs';

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }
  const id = parseInt(params.id, 10);
  if (isNaN(id)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  try {
    const deleted = await deleteHeroMedia(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Ni najdeno' }, { status: 404 });
    }

    // Best-effort blob cleanup
    if (process.env.BLOB_READ_WRITE_TOKEN && deleted.media_url) {
      try {
        const { del } = await import('@vercel/blob');
        await del(deleted.media_url);
      } catch (blobErr) {
        console.error('[hero-media] Blob delete failed:', blobErr);
      }
    }

    revalidatePath('/', 'page');
    revalidatePath('/admin/hero-media', 'page');
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('DELETE hero-media error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
