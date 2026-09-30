import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { addGalleryPhoto, countGalleryPhotos, getGalleryById } from '@/lib/queries';

export const runtime = 'nodejs';

// Enforce max photos per gallery (schema comment says 10 — enforced here)
const MAX_PHOTOS_PER_GALLERY = 10;
// Reasonable per-image size cap (10 MB). Vercel Blob supports larger, but keep site fast.
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const galleryId = parseInt(params.id, 10);
  if (isNaN(galleryId)) {
    return NextResponse.json({ error: 'Invalid gallery ID' }, { status: 400 });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      {
        error:
          'Vercel Blob še ni nastavljen. V Vercel dashboard: Storage → Blob → Create store. Token se avtomatsko doda med env vars.',
      },
      { status: 503 }
    );
  }

  const gallery = await getGalleryById(galleryId);
  if (!gallery) {
    return NextResponse.json({ error: 'Galerija ni najdena' }, { status: 404 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: 'Napačna oblika zahteve' }, { status: 400 });
  }

  const files = formData.getAll('file').filter((v): v is File => v instanceof File);
  if (files.length === 0) {
    return NextResponse.json({ error: 'Ni izbrane datoteke' }, { status: 400 });
  }

  const currentCount = await countGalleryPhotos(galleryId);
  if (currentCount + files.length > MAX_PHOTOS_PER_GALLERY) {
    return NextResponse.json(
      {
        error: `Ta galerija lahko ima največ ${MAX_PHOTOS_PER_GALLERY} fotografij (trenutno ${currentCount}, dodajaš ${files.length}).`,
      },
      { status: 400 }
    );
  }

  const { put } = await import('@vercel/blob');
  const uploaded = [];

  for (const file of files) {
    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: `Nepodprt format: ${file.name}. Uporabi JPG, PNG, WebP ali GIF.` },
        { status: 400 }
      );
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { error: `Datoteka ${file.name} je prevelika (max 10 MB).` },
        { status: 400 }
      );
    }

    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const pathname = `galerija/${gallery.slug}/${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}.${ext}`;

    try {
      const blob = await put(pathname, file, {
        access: 'public',
        contentType: file.type,
      });

      const photo = await addGalleryPhoto({
        gallery_id: galleryId,
        photo_url: blob.url,
        blob_pathname: blob.pathname,
        alt_text: gallery.title,
      });

      uploaded.push(photo);
    } catch (err) {
      console.error('Blob upload failed:', err);
      return NextResponse.json(
        { error: `Napaka pri nalaganju ${file.name}` },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ ok: true, photos: uploaded }, { status: 201 });
}
