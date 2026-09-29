import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { updateReservationStatus } from '@/lib/queries';

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

    // TODO: Ko dodamo Google Calendar sync, tukaj:
    //   if (status === 'confirmed') {
    //     await createCalendarEventForAllStaff(updated);
    //   }
    // TODO: Ko dodamo Resend, pošlji email stranki:
    //   if (status === 'confirmed') await sendConfirmationEmail(updated);
    //   if (status === 'rejected') await sendRejectionEmail(updated);

    return NextResponse.json({ ok: true, reservation: updated });
  } catch (error) {
    console.error('PATCH reservation error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
