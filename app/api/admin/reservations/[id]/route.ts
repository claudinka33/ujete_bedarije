import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { updateReservationStatus } from '@/lib/queries';
import { mailApprovedToCustomer, mailRejectedToCustomer } from '@/lib/mail';
import { createEventForAllStaff, deleteEventsForReservation } from '@/lib/google-calendar';

export const runtime = 'nodejs';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Auth check
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }
  const userId = (session.user as { id?: number }).id;
  if (!userId) {
    return NextResponse.json({ error: 'User ID missing from session' }, { status: 401 });
  }

  const id = parseInt(params.id, 10);
  if (isNaN(id)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { action, rejection_reason, internal_notes } = body;

    let status: 'confirmed' | 'rejected' | 'completed' | 'cancelled';
    switch (action) {
      case 'confirm':
        status = 'confirmed';
        break;
      case 'reject':
        status = 'rejected';
        break;
      case 'complete':
        status = 'completed';
        break;
      case 'cancel':
        status = 'cancelled';
        break;
      default:
        return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
    }

    const updated = await updateReservationStatus(
      id,
      status,
      userId,
      rejection_reason,
      internal_notes
    );

    // Fire-and-forget notifications. Never fail the API if mail is down —
    // the status change has already been committed to the DB above.
    try {
      if (status === 'confirmed') {
        await mailApprovedToCustomer(updated);
      } else if (status === 'rejected') {
        await mailRejectedToCustomer(updated);
      }
    } catch (mailErr) {
      console.error('Mail send failed (status change):', mailErr);
    }

    // Google Calendar sync. Same contract: never fail the API if calendar
    // writes fail — the status change is already persisted.
    try {
      if (status === 'confirmed') {
        const results = await createEventForAllStaff(updated);
        console.log('[gcal] Event creation results for reservation', id, results);
      } else if (status === 'cancelled' || status === 'rejected') {
        await deleteEventsForReservation(updated);
      }
    } catch (gcalErr) {
      console.error('Calendar sync failed:', gcalErr);
    }

    return NextResponse.json({ ok: true, reservation: updated });
  } catch (error) {
    console.error('PATCH reservation error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
