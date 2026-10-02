import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { addHeroMedia, countHeroMedia } from '@/lib/queries';

export const runtime = 'nodejs';

const MAX_ITEMS = 5;
const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // 10 MB
const MAX_VIDEO_BYTES = 25 * 1024 * 1024; // 25 MB
const ALLOWED_IMAGE = new Set(['image/jpeg', 'image/png', 'image/webp']);
const ALLOWED_VIDEO = new Set(['video/mp4', 'video/webm', 'video/quicktime']);

function invalidatePaths() {
  revalidatePath('/', 'page');
  revalidatePath('/admin/hero-media', 'page');
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: 'Vercel Blob ni nastavljen. V Vercelu dodaj Blob store.' },
      { status: 503 }
    );
  }

  const existing = await countHeroMedia();
  if (existing >= MAX_ITEMS) {
    return NextResponse.json(
      { error: `Največ ${MAX_ITEMS} medijev v hero sekciji. Odstrani enega preden dodaš novega.` },
      { status: 400 }
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: 'Napačna oblika zahteve' }, { status: 400 });
  }

  const file = formData.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Ni izbrane datoteke' }, { status: 400 });
  }

  const isImage = ALLOWED_IMAGE.has(file.type);
  const isVideo = ALLOWED_VIDEO.has(file.type);
  if (!isImage && !isVideo) {
    return NextResponse.json(
      { error: 'Nepodprt format. Dovoljeni: JPG, PNG, WebP (slike) ali MP4, WebM, MOV (videji).' },
      { status: 400 }
    );
  }

  const maxBytes = isImage ? MAX_IMAGE_BYTES : MAX_VIDEO_BYTES;
  if (file.size > maxBytes) {
    const mb = Math.round(maxBytes / 1024 / 1024);
    return NextResponse.json(
      { error: `Datoteka je prevelika. Max ${mb} MB za ta format.` },
      { status: 400 }
    );
  }

  const ext = (file.name.split('.').pop() || (isImage ? 'jpg' : 'mp4')).toLowerCase();
  const pathname = `hero/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  try {
    const { put } = await import('@vercel/blob');
    const blob = await put(pathname, file, {
      access: 'public',
      contentType: file.type,
    });

    const item = await addHeroMedia({
      media_type: isImage ? 'image' : 'video',
      media_url: blob.url,
      blob_pathname: blob.pathname,
      caption: (formData.get('caption') as string | null)?.trim() || null,
    });

    invalidatePaths();
    return NextResponse.json({ ok: true, item }, { status: 201 });
  } catch (err) {
    console.error('[hero-media] Upload failed:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Napaka pri nalaganju' },
      { status: 500 }
    );
  }
}
