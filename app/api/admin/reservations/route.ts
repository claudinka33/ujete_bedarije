import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import {
  createReservation,
  updateReservationStatus,
  upsertContact,
  type ReservationInput,
} from '@/lib/queries';
import { mailApprovedToCustomer } from '@/lib/mail';
import { createEventForAllStaff } from '@/lib/google-calendar';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Admin-created reservation. Anita/Stane use this when a customer calls or
 * writes instead of filling the public form. Unlike the public endpoint:
 *   - requires auth
 *   - lets admin set initial status (default: 'confirmed', since they just
 *     talked to the customer on the phone)
 *   - send_email flag controls whether the customer gets the approved mail
 *   - add_to_calendar flag controls Google Calendar sync
 *   - NO "received" mail is sent — this isn't a form submission; the staff
 *     is entering it after a phone call. Only the approved mail is relevant.
 */

interface RequestBody {
  // customer
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  // event
  event_date: string;    // YYYY-MM-DD
  event_time: string;    // HH:MM or HH:MM:SS
  event_location: string;
  event_type: string;
  event_purpose?: string;
  // package / extras
  package_id?: number;
  package_name_snapshot: string;
  package_price_snapshot?: number;
  extras_snapshot?: Array<{ name: string; price: number }>;
  // extras
  frame_text?: string;
  notes?: string;
  internal_notes?: string;
  // admin controls
  initial_status: 'pending' | 'confirmed' | 'completed';
  send_email: boolean;
  add_to_calendar: boolean;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidDate(dateStr: string): boolean {
  const d = new Date(dateStr);
  return !isNaN(d.getTime());
}

function isValidTime(timeStr: string): boolean {
  return /^\d{2}:\d{2}(:\d{2})?$/.test(timeStr);
}

export async function POST(request: NextRequest) {
  // Auth
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }
  const userId = (session.user as { id?: number }).id;
  if (!userId) {
    return NextResponse.json({ error: 'User ID missing from session' }, { status: 401 });
  }

  try {
    const body = (await request.json()) as RequestBody;

    // Validation (same shape as public endpoint, but date can be in the past
    // in case staff is backfilling)
    if (!body.customer_name || body.customer_name.trim().length < 2) {
      return NextResponse.json({ error: 'Ime je obvezno' }, { status: 400 });
    }
    if (!body.customer_phone || body.customer_phone.trim().length < 5) {
      return NextResponse.json({ error: 'Telefon je obvezen' }, { status: 400 });
    }
    if (!body.customer_email || !isValidEmail(body.customer_email)) {
      return NextResponse.json({ error: 'Neveljaven email' }, { status: 400 });
    }
    if (!body.event_date || !isValidDate(body.event_date)) {
      return NextResponse.json({ error: 'Neveljaven datum' }, { status: 400 });
    }
    if (!body.event_time || !isValidTime(body.event_time)) {
      return NextResponse.json({ error: 'Neveljavna ura' }, { status: 400 });
    }
    if (!body.event_location || body.event_location.trim().length < 2) {
      return NextResponse.json({ error: 'Lokacija je obvezna' }, { status: 400 });
    }

    const input: ReservationInput = {
      customer_name: body.customer_name.trim(),
      customer_phone: body.customer_phone.trim(),
      customer_email: body.customer_email.trim().toLowerCase(),
      event_date: body.event_date,
      event_time: body.event_time.length === 5 ? body.event_time + ':00' : body.event_time,
      event_location: body.event_location.trim(),
      event_type: body.event_type || 'Ostalo',
      event_purpose: body.event_purpose,
      package_id: body.package_id,
      package_name_snapshot: body.package_name_snapshot || 'Ni izbrano',
      package_price_snapshot: body.package_price_snapshot,
      extras_snapshot: body.extras_snapshot || [],
      frame_text: body.frame_text,
      notes: body.notes,
    };

    // 1. Create row (always starts as 'pending' per createReservation())
    let reservation = await createReservation(input);

    // 2. Upsert contact
    await upsertContact(input.customer_email, input.customer_name, input.customer_phone);

    // 3. If admin asked for a non-pending status, bump it immediately.
    // internal_notes are saved as part of the status update. For status=pending
    // the admin can edit internal_notes on the detail page after creation.
    const targetStatus = body.initial_status || 'confirmed';
    if (targetStatus !== 'pending') {
      reservation = await updateReservationStatus(
        reservation.id,
        targetStatus,
        userId,
        undefined,
        body.internal_notes
      );
    }

    // 4. Side-effects — only if confirmed AND admin opted in
    if (targetStatus === 'confirmed') {
      // Mail
      if (body.send_email) {
        try {
          await mailApprovedToCustomer(reservation);
        } catch (mailErr) {
          console.error('[admin reservation] Mail send failed:', mailErr);
        }
      }
      // Calendar
      if (body.add_to_calendar) {
        try {
          const results = await createEventForAllStaff(reservation);
          console.log('[admin reservation] gcal results:', reservation.id, results);
        } catch (gcalErr) {
          console.error('[admin reservation] Calendar sync failed:', gcalErr);
        }
      }
    }

    revalidatePath('/admin/rezervacije', 'page');
    revalidatePath('/admin', 'page');

    return NextResponse.json(
      { ok: true, id: reservation.id, reservation },
      { status: 201 }
    );
  } catch (error) {
    console.error('[admin reservation] Create error:', error);
    return NextResponse.json(
      { error: 'Napaka pri shranjevanju rezervacije.' },
      { status: 500 }
    );
  }
}
