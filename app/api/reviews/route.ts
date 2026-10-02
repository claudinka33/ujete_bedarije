import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { createPublicReview, type PublicReviewInput } from '@/lib/queries';
import { sql } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Simple rate-limiting: cap how many reviews one IP can post in 10 minutes. */
async function checkRateLimit(ip: string): Promise<{ ok: boolean; reason?: string }> {
  try {
    const rows = await sql`
      SELECT COUNT(*)::int AS c
      FROM reviews
      WHERE submission_source = 'public'
        AND created_at > NOW() - INTERVAL '10 minutes'
    ` as Array<{ c: number }>;
    if ((rows[0]?.c ?? 0) >= 20) {
      return { ok: false, reason: 'Preveč oddanih mnenj v kratkem času. Poskusite kasneje.' };
    }
  } catch {
    // Non-fatal — if the rate check fails, don't block submission
  }
  return { ok: true };
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || '';
    let body: PublicReviewInput;
    if (contentType.includes('application/json')) {
      body = await request.json();
    } else {
      const text = await request.text();
      body = JSON.parse(text);
    }

    // Validation
    if (!body.reviewer_name || body.reviewer_name.trim().length < 2) {
      return NextResponse.json({ error: 'Ime je obvezno' }, { status: 400 });
    }
    if (body.reviewer_name.trim().length > 60) {
      return NextResponse.json({ error: 'Ime je predolgo (max 60 znakov)' }, { status: 400 });
    }
    if (!body.event_type || body.event_type.trim().length < 2) {
      return NextResponse.json({ error: 'Tip dogodka je obvezen' }, { status: 400 });
    }
    if (!body.location || body.location.trim().length < 2) {
      return NextResponse.json({ error: 'Kraj je obvezen' }, { status: 400 });
    }
    if (!body.text || body.text.trim().length < 10) {
      return NextResponse.json({ error: 'Komentar mora imeti vsaj 10 znakov' }, { status: 400 });
    }
    if (body.text.trim().length > 1000) {
      return NextResponse.json({ error: 'Komentar je predolg (max 1000 znakov)' }, { status: 400 });
    }
    const rating = Number(body.rating);
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Ocena mora biti med 1 in 5' }, { status: 400 });
    }
    if (body.reviewer_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.reviewer_email)) {
      return NextResponse.json({ error: 'Neveljaven email naslov' }, { status: 400 });
    }

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
    const rate = await checkRateLimit(ip);
    if (!rate.ok) {
      return NextResponse.json({ error: rate.reason }, { status: 429 });
    }

    const review = await createPublicReview({
      reviewer_name: body.reviewer_name,
      reviewer_email: body.reviewer_email,
      event_type: body.event_type,
      location: body.location,
      rating,
      text: body.text,
    });

    revalidatePath('/admin/mnenja', 'page');
    revalidatePath('/admin', 'page');

    return NextResponse.json(
      {
        ok: true,
        id: review.id,
        message:
          'Hvala za vaše mnenje! Po pregledu ga bomo objavili na spletni strani.',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[public-review] Error:', error);
    return NextResponse.json(
      { error: 'Napaka pri pošiljanju. Prosimo, poskusite znova.' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
