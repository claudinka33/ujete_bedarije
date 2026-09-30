import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { sql } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Diagnostics: raw dump of galleries + gallery_photos so we can see what's actually in DB. */
export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    // Check that both tables exist
    const tables = await sql`
      SELECT table_name FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_name IN ('galleries', 'gallery_photos')
      ORDER BY table_name
    `;
    const tableNames = (tables as Array<{ table_name: string }>).map((t) => t.table_name);
    if (!tableNames.includes('gallery_photos') || !tableNames.includes('galleries')) {
      return NextResponse.json({
        error: 'Manjkajoča tabela',
        tables_found: tableNames,
        needed: ['galleries', 'gallery_photos'],
      }, { status: 500 });
    }

    const galleries = await sql`
      SELECT id, slug, title, event_type, event_date, cover_photo_url, published,
             sort_order, created_at, updated_at
      FROM galleries ORDER BY id ASC
    `;
    const photos = await sql`
      SELECT id, gallery_id, photo_url, blob_pathname, alt_text, sort_order, created_at
      FROM gallery_photos ORDER BY gallery_id ASC, id ASC
    `;

    // Group photos per gallery
    const byGallery: Record<number, unknown[]> = {};
    for (const p of photos as Array<{ gallery_id: number }>) {
      byGallery[p.gallery_id] = byGallery[p.gallery_id] || [];
      byGallery[p.gallery_id].push(p);
    }

    const report = (galleries as Array<{ id: number }>).map((g) => ({
      ...g,
      photo_count: (byGallery[g.id] || []).length,
      photos: byGallery[g.id] || [],
    }));

    return NextResponse.json({
      env: {
        BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN ? 'SET' : 'MISSING',
        BLOB_STORE_ID: process.env.BLOB_STORE_ID || 'MISSING',
        DATABASE_URL: process.env.DATABASE_URL ? 'SET' : 'MISSING',
      },
      galleries: report,
      total_photos: photos.length,
    }, { status: 200 });
  } catch (error) {
    console.error('Debug error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Server error' },
      { status: 500 }
    );
  }
}
