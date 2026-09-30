import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import {
  updateGallery,
  deleteGallery,
  type GalleryInput,
} from '@/lib/queries';

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
    const body = (await request.json()) as GalleryInput;
    const gallery = await updateGallery(id, body);
    return NextResponse.json({ ok: true, gallery });
  } catch (error) {
    console.error('PATCH gallery error:', error);
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
    const photos = await deleteGallery(id);

    // Best-effort: also delete blobs, if Blob is configured. Never fail the API on this.
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        const { del } = await import('@vercel/blob');
        const urls = photos
          .map((p) => p.photo_url)
          .filter((u): u is string => Boolean(u));
        if (urls.length > 0) {
          await del(urls);
        }
      } catch (blobErr) {
        console.error('Blob cleanup failed for gallery', id, blobErr);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('DELETE gallery error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
