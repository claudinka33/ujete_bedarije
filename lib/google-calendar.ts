import { sql } from './db';
import type { Reservation } from './queries';

/**
 * Google Calendar sync.
 *
 * On reservation approval, this creates an event in every staff user's
 * primary calendar (they've granted the Calendar scope at login).
 *
 * Tokens are stored in the users table (04_calendar_tokens.sql). Access
 * tokens are refreshed on demand using the refresh_token. If a user hasn't
 * logged in since Calendar scope was added, their row has no tokens and
 * is simply skipped (logged, not thrown).
 */

const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const CALENDAR_API_BASE = 'https://www.googleapis.com/calendar/v3';

interface StaffCalendarUser {
  id: number;
  email: string;
  google_access_token: string | null;
  google_refresh_token: string | null;
  google_token_expires_at: Date | string | null;
  google_calendar_id: string | null;
}

interface CalendarEventResult {
  userId: number;
  email: string;
  eventId?: string;
  error?: string;
}

async function getStaffForSync(): Promise<StaffCalendarUser[]> {
  const rows = await sql`
    SELECT id, email,
           google_access_token, google_refresh_token,
           google_token_expires_at,
           COALESCE(google_calendar_id, 'primary') AS google_calendar_id
    FROM users
    WHERE calendar_sync_enabled = true
      AND google_refresh_token IS NOT NULL
    ORDER BY id ASC
  `;
  return rows as StaffCalendarUser[];
}

async function refreshAccessToken(user: StaffCalendarUser): Promise<string | null> {
  if (!user.google_refresh_token) return null;

  const clientId = process.env.AUTH_GOOGLE_ID;
  const clientSecret = process.env.AUTH_GOOGLE_SECRET;
  if (!clientId || !clientSecret) {
    console.error('[gcal] Missing AUTH_GOOGLE_ID / AUTH_GOOGLE_SECRET');
    return null;
  }

  try {
    const res = await fetch(GOOGLE_TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: user.google_refresh_token,
        grant_type: 'refresh_token',
      }),
    });
    const data = (await res.json()) as {
      access_token?: string;
      expires_in?: number;
      error?: string;
      error_description?: string;
    };
    if (!res.ok || !data.access_token) {
      console.error('[gcal] Token refresh failed for', user.email, data);
      return null;
    }

    const expiresAt = new Date(Date.now() + (data.expires_in || 3600) * 1000);
    await sql`
      UPDATE users SET
        google_access_token = ${data.access_token},
        google_token_expires_at = ${expiresAt}
      WHERE id = ${user.id}
    `;
    return data.access_token;
  } catch (err) {
    console.error('[gcal] Token refresh exception for', user.email, err);
    return null;
  }
}

async function getValidAccessToken(user: StaffCalendarUser): Promise<string | null> {
  // If current token is good for at least another minute, use it
  if (user.google_access_token && user.google_token_expires_at) {
    const exp = new Date(user.google_token_expires_at).getTime();
    if (exp - Date.now() > 60_000) return user.google_access_token;
  }
  return refreshAccessToken(user);
}

function buildEventPayload(r: Reservation) {
  // Date + time → start Date (local Slovenian time)
  const start = new Date(`${r.event_date}T${r.event_time}`);
  // Default 3h duration if we don't know the package hours
  const durationMinutes = 3 * 60;
  const end = new Date(start.getTime() + durationMinutes * 60 * 1000);

  const extras = Array.isArray(r.extras_snapshot) && r.extras_snapshot.length
    ? '\nDodatki:\n' + r.extras_snapshot.map((e) => `  • ${e.name} (${e.price}€)`).join('\n')
    : '';

  const description = [
    `Stranka: ${r.customer_name}`,
    `Telefon: ${r.customer_phone}`,
    `Email: ${r.customer_email}`,
    '',
    `Paket: ${r.package_name_snapshot}${r.package_price_snapshot ? ` (${r.package_price_snapshot}€)` : ''}`,
    r.event_purpose ? `Namen: ${r.event_purpose}` : '',
    r.frame_text ? `Napis na okvirju: ${r.frame_text}` : '',
    extras.trim(),
    r.notes ? `\nOpombe:\n${r.notes}` : '',
    '',
    `CMS: https://www.ujetebedarije.si/admin/rezervacije/${r.id}`,
  ].filter(Boolean).join('\n');

  return {
    summary: `📸 ${r.customer_name} — ${r.event_type}`,
    description,
    location: r.event_location,
    start: {
      dateTime: start.toISOString(),
      timeZone: 'Europe/Ljubljana',
    },
    end: {
      dateTime: end.toISOString(),
      timeZone: 'Europe/Ljubljana',
    },
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'email', minutes: 24 * 60 },  // 1 day before
        { method: 'popup', minutes: 60 },       // 1 hour before
      ],
    },
    colorId: '7', // Peacock blue — easy to spot in a crowded calendar
  };
}

async function createEventForUser(
  user: StaffCalendarUser,
  reservation: Reservation
): Promise<CalendarEventResult> {
  const accessToken = await getValidAccessToken(user);
  if (!accessToken) {
    return {
      userId: user.id,
      email: user.email,
      error: 'No valid access token (user needs to log in and re-grant Calendar access)',
    };
  }

  const calendarId = encodeURIComponent(user.google_calendar_id || 'primary');

  try {
    const res = await fetch(`${CALENDAR_API_BASE}/calendars/${calendarId}/events`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(buildEventPayload(reservation)),
    });
    const data = (await res.json()) as { id?: string; error?: { message?: string } };
    if (!res.ok || !data.id) {
      console.error('[gcal] Insert event failed for', user.email, data);
      return {
        userId: user.id,
        email: user.email,
        error: data.error?.message || `HTTP ${res.status}`,
      };
    }
    return { userId: user.id, email: user.email, eventId: data.id };
  } catch (err) {
    console.error('[gcal] Insert event exception for', user.email, err);
    return {
      userId: user.id,
      email: user.email,
      error: err instanceof Error ? err.message : 'network error',
    };
  }
}

/**
 * Create a calendar event in each enabled staff member's calendar for the
 * given reservation. Returns per-user results so the API can log/report.
 * The reservation.google_event_ids column (JSONB) is updated with the
 * email → eventId map so cancellation can later delete them.
 */
export async function createEventForAllStaff(
  reservation: Reservation
): Promise<CalendarEventResult[]> {
  const staff = await getStaffForSync();
  if (staff.length === 0) {
    console.log('[gcal] No staff with calendar sync enabled — skipping');
    return [];
  }

  const results = await Promise.all(
    staff.map((u) => createEventForUser(u, reservation))
  );

  const successMap: Record<string, string> = {};
  for (const r of results) {
    if (r.eventId) successMap[r.email] = r.eventId;
  }

  if (Object.keys(successMap).length > 0) {
    try {
      await sql`
        UPDATE reservations
        SET google_event_ids = ${JSON.stringify(successMap)}::jsonb
        WHERE id = ${reservation.id}
      `;
    } catch (err) {
      console.error('[gcal] Failed to persist google_event_ids:', err);
    }
  }

  return results;
}

/**
 * Delete calendar events previously created for this reservation.
 * Called when a confirmed reservation is cancelled/rejected after approval.
 */
export async function deleteEventsForReservation(
  reservation: Reservation
): Promise<void> {
  const eventMap = reservation.google_event_ids || {};
  if (!eventMap || Object.keys(eventMap).length === 0) return;

  const staff = await getStaffForSync();
  const byEmail = new Map(staff.map((u) => [u.email, u]));

  await Promise.all(
    Object.entries(eventMap).map(async ([email, eventId]) => {
      const user = byEmail.get(email);
      if (!user) return;
      const accessToken = await getValidAccessToken(user);
      if (!accessToken) return;
      const calendarId = encodeURIComponent(user.google_calendar_id || 'primary');
      try {
        await fetch(`${CALENDAR_API_BASE}/calendars/${calendarId}/events/${eventId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${accessToken}` },
        });
      } catch (err) {
        console.error('[gcal] Delete event failed:', err);
      }
    })
  );

  try {
    await sql`
      UPDATE reservations SET google_event_ids = '{}'::jsonb WHERE id = ${reservation.id}
    `;
  } catch { /* ignore */ }
}
