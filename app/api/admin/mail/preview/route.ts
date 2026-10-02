import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import type { Reservation } from '@/lib/queries';
import {
  buildNewReservationStaffEmail,
  buildApprovedCustomerEmail,
  buildRejectedCustomerEmail,
} from '@/lib/mail';

export const runtime = 'nodejs';

type TemplateKey = 'new_reservation' | 'approved' | 'rejected';

/** Build a dummy Reservation so templates have something to render. */
function dummyReservation(): Reservation {
  return {
    id: 42,
    customer_name: 'Testna Stranka',
    customer_phone: '031 123 456',
    customer_email: 'testna@email.si',
    event_date: '2026-12-20',
    event_time: '18:00:00',
    event_location: 'Dvorana Grad, Primer ulica 1, 3000 Celje',
    event_type: 'Poroka',
    event_purpose: 'Večerni del poroke',
    package_id: 2,
    package_name_snapshot: 'PARTY (280€ · 3h)',
    package_price_snapshot: 280,
    extras_snapshot: [
      { name: 'Neomejen tisk', price: 80 },
      { name: 'Dodaten album', price: 40 },
    ],
    frame_text: 'Nina & Matej · 20. 12. 2026',
    logo_url: null,
    notes: 'Prihod ob 17:30, da postavimo opremo pred prihodom gostov.',
    status: 'pending',
    internal_notes: null,
    rejection_reason: 'Na ta dan smo že rezervirani za drugo poroko.',
    handled_by_user_id: null,
    handled_at: null,
    google_event_ids: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

function buildTemplate(key: TemplateKey): { subject: string; html: string } {
  const reservation = dummyReservation();
  switch (key) {
    case 'new_reservation':
      return buildNewReservationStaffEmail(reservation);
    case 'approved':
      return buildApprovedCustomerEmail(reservation);
    case 'rejected':
      return buildRejectedCustomerEmail(reservation);
  }
}

/** GET — renders the template HTML in the browser for visual preview. */
export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return new NextResponse('Not authenticated', { status: 401 });
  }

  const url = new URL(request.url);
  const key = url.searchParams.get('template') as TemplateKey | null;
  if (!key || !['new_reservation', 'approved', 'rejected'].includes(key)) {
    return new NextResponse('Invalid template', { status: 400 });
  }

  const { html } = buildTemplate(key);
  return new NextResponse(html, {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}

/** POST — actually sends the template to the specified `to` address. */
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const body = (await request.json()) as { template: TemplateKey; to: string };
    if (!body.template || !body.to) {
      return NextResponse.json({ error: 'Manjka template ali to' }, { status: 400 });
    }

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: 'RESEND_API_KEY ni nastavljen v Vercelu.' },
        { status: 503 }
      );
    }

    const { subject, html } = buildTemplate(body.template);

    const { Resend } = await import('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { data, error } = await resend.emails.send({
      from: process.env.MAIL_FROM || 'Ujete Bedarije <rezervacije@ujetebedarije.si>',
      to: body.to,
      subject: `[TEST] ${subject}`,
      html,
      replyTo: process.env.MAIL_REPLY_TO || 'ujete.bedarije@gmail.com',
    });

    if (error) {
      console.error('[mail-preview] Resend error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, id: data?.id });
  } catch (err) {
    console.error('[mail-preview] Exception:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Server error' },
      { status: 500 }
    );
  }
}
