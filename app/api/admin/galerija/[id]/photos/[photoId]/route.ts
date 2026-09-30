import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { deleteGalleryPhoto, setGalleryCover, getGalleryPhotoById } from '@/lib/queries';

export const runtime = 'nodejs';

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string; photoId: string } }
) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const photoId = parseInt(params.photoId, 10);
  if (isNaN(photoId)) {
    return NextResponse.json({ error: 'Invalid photo ID' }, { status: 400 });
  }

  try {
    const deleted = await deleteGalleryPhoto(photoId);
    if (!deleted) {
      return NextResponse.json({ error: 'Fotografija ni najdena' }, { status: 404 });
    }

    // Best-effort: also delete blob
    if (process.env.BLOB_READ_WRITE_TOKEN && deleted.photo_url) {
      try {
        const { del } = await import('@vercel/blob');
        await del(deleted.photo_url);
      } catch (blobErr) {
        console.error('Blob delete failed:', blobErr);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('DELETE photo error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

/** PATCH: set as cover photo */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string; photoId: string } }
) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const galleryId = parseInt(params.id, 10);
  const photoId = parseInt(params.photoId, 10);
  if (isNaN(galleryId) || isNaN(photoId)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  try {
    const body = (await request.json().catch(() => ({}))) as { action?: string };
    if (body.action !== 'set_cover') {
      return NextResponse.json({ error: 'Unsupported action' }, { status: 400 });
    }
    const photo = await getGalleryPhotoById(photoId);
    if (!photo || photo.gallery_id !== galleryId) {
      return NextResponse.json({ error: 'Fotografija ni najdena' }, { status: 404 });
    }
    await setGalleryCover(galleryId, photo.photo_url);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('PATCH photo error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
