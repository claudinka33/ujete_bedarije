import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { createGallery, type GalleryInput } from '@/lib/queries';

export const runtime = 'nodejs';

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/š/g, 's').replace(/č/g, 'c').replace(/ć/g, 'c')
    .replace(/ž/g, 'z').replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'galerija';
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const body = (await request.json()) as Partial<GalleryInput>;
    if (!body.title || !body.title.trim()) {
      return NextResponse.json({ error: 'Naslov je obvezen' }, { status: 400 });
    }
    const input: GalleryInput = {
      slug: body.slug?.trim() || `${slugify(body.title)}-${Date.now().toString(36)}`,
      title: body.title.trim(),
      event_type: body.event_type || null,
      event_date: body.event_date || null,
      description: body.description || null,
      cover_photo_url: body.cover_photo_url || null,
      published: body.published ?? false,
      sort_order: body.sort_order ?? 0,
    };
    const gallery = await createGallery(input);
    revalidatePath('/', 'page');
    revalidatePath('/admin/galerija', 'page');
    return NextResponse.json({ ok: true, gallery }, { status: 201 });
  } catch (error) {
    console.error('POST gallery error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
