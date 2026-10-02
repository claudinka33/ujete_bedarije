import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { addHeroMedia, countHeroMedia } from '@/lib/queries';

export const runtime = 'nodejs';

const MAX_ITEMS = 8;

/**
 * Save a DB row for a blob that was already uploaded directly by the client.
 * Called by HeroMediaManager after upload() from @vercel/blob/client succeeds.
 */
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const body = (await request.json()) as {
      url: string;
      pathname: string;
      contentType: string;
      caption?: string;
    };

    if (!body.url || !body.pathname || !body.contentType) {
      return NextResponse.json({ error: 'Manjkajo polja' }, { status: 400 });
    }

    const existing = await countHeroMedia();
    if (existing >= MAX_ITEMS) {
      return NextResponse.json(
        { error: `Max ${MAX_ITEMS} medijev` },
        { status: 400 }
      );
    }

    const isImage = body.contentType.startsWith('image/');
    const isVideo = body.contentType.startsWith('video/');
    if (!isImage && !isVideo) {
      return NextResponse.json({ error: 'Nepodprt format' }, { status: 400 });
    }

    const item = await addHeroMedia({
      media_type: isImage ? 'image' : 'video',
      media_url: body.url,
      blob_pathname: body.pathname,
      caption: body.caption?.trim() || null,
    });

    revalidatePath('/', 'page');
    revalidatePath('/admin/hero', 'page');

    return NextResponse.json({ ok: true, item }, { status: 201 });
  } catch (err) {
    console.error('[hero-media/save] Error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Server error' },
      { status: 500 }
    );
  }
}
