import { NextRequest, NextResponse } from 'next/server';
import { createReservation, upsertContact, type ReservationInput } from '@/lib/queries';
import { mailNewReservationToStaff, mailReceivedToCustomer } from '@/lib/mail';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface RequestBody {
  ime: string;
  telefon: string;
  email: string;
  datum: string;
  ura: string;
  lokacija: string;
  tipDogodka: string;
  namen?: string;
  paket: string; // 'BASIC (190€ · 1h)' — format from form
  paketId?: number;
  paketCena?: number;
  extras?: string[]; // array of extra names
  extrasFull?: Array<{ name: string; price: number }>;
  okvirNapis?: string;
  opombe?: string;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidDate(dateStr: string): boolean {
  const d = new Date(dateStr);
  return !isNaN(d.getTime()) && d > new Date();
}

function isValidTime(timeStr: string): boolean {
  return /^\d{2}:\d{2}(:\d{2})?$/.test(timeStr);
}

export async function POST(request: NextRequest) {
  try {
    // Parse body — accept both JSON and text/plain (for no-cors fetch)
    const contentType = request.headers.get('content-type') || '';
    let body: RequestBody;

    if (contentType.includes('application/json')) {
      body = await request.json();
    } else {
      const text = await request.text();
      body = JSON.parse(text);
    }

    // Validation
    if (!body.ime || body.ime.trim().length < 2) {
      return NextResponse.json({ error: 'Ime je obvezno' }, { status: 400 });
    }
    if (!body.telefon || body.telefon.trim().length < 5) {
      return NextResponse.json({ error: 'Telefon je obvezen' }, { status: 400 });
    }
    if (!body.email || !isValidEmail(body.email)) {
      return NextResponse.json({ error: 'Neveljaven email' }, { status: 400 });
    }
    if (!body.datum || !isValidDate(body.datum)) {
      return NextResponse.json({ error: 'Neveljaven ali pretekel datum' }, { status: 400 });
    }
    if (!body.ura || !isValidTime(body.ura)) {
      return NextResponse.json({ error: 'Neveljavna ura' }, { status: 400 });
    }
    if (!body.lokacija || body.lokacija.trim().length < 2) {
      return NextResponse.json({ error: 'Lokacija je obvezna' }, { status: 400 });
    }

    const input: ReservationInput = {
      customer_name: body.ime.trim(),
      customer_phone: body.telefon.trim(),
      customer_email: body.email.trim().toLowerCase(),
      event_date: body.datum,
      event_time: body.ura.length === 5 ? body.ura + ':00' : body.ura,
      event_location: body.lokacija.trim(),
      event_type: body.tipDogodka || 'Ostalo',
      event_purpose: body.namen,
      package_id: body.paketId,
      package_name_snapshot: body.paket || 'Ni izbrano',
      package_price_snapshot: body.paketCena,
      extras_snapshot: body.extrasFull || [],
      frame_text: body.okvirNapis,
      notes: body.opombe,
    };

    // Create reservation
    const reservation = await createReservation(input);

    // Upsert contact (CRM light)
    await upsertContact(input.customer_email, input.customer_name, input.customer_phone);

    // Fire-and-forget mails. Never fail the user's reservation if mail is
    // down — the row is already in the DB and visible in CMS.
    // Both staff notification and customer "received" confirmation go out
    // right now, independently of each other.
    try {
      await Promise.allSettled([
        mailNewReservationToStaff(reservation),
        mailReceivedToCustomer(reservation),
      ]);
    } catch (mailErr) {
      console.error('Mail send failed (new reservation):', mailErr);
    }

    return NextResponse.json(
      {
        ok: true,
        id: reservation.id,
        message: 'Vaše povpraševanje je bilo poslano. Stane se vam oglasi v 24 urah.',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Reservation error:', error);
    return NextResponse.json(
      { error: 'Napaka pri pošiljanju. Prosimo, poskusite znova ali nas pokličite.' },
      { status: 500 }
    );
  }
}

// CORS preflight — dovoli POST z brskalnika
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
