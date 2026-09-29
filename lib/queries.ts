import { sql } from './db';

// =============================================================
// TYPES
// =============================================================
export interface Package {
  id: number;
  slug: string;
  name: string;
  duration_hours: number;
  duration_label: string;
  price: number;
  old_price: number | null;
  sale_badge: string | null;
  price_note: string | null;
  featured: boolean;
  ribbon: string | null;
  features: Array<{ text: string }>;
  sort_order: number;
  published: boolean;
}

export interface Extra {
  id: number;
  slug: string;
  name: string;
  price: number;
  sort_order: number;
  published: boolean;
}

export interface Review {
  id: number;
  reviewer_name: string;
  reviewer_initial: string | null;
  avatar_variant: number;
  event_type: string;
  location: string;
  region: string | null;
  rating: number;
  text: string;
  sort_order: number;
}

export interface FaqItem {
  id: number;
  question: string;
  answer: string;
  sort_order: number;
}

export interface Reservation {
  id: number;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  event_date: string;
  event_time: string;
  event_location: string;
  event_type: string;
  event_purpose: string | null;
  package_id: number | null;
  package_name_snapshot: string;
  package_price_snapshot: number | null;
  extras_snapshot: Array<{ name: string; price: number }>;
  frame_text: string | null;
  logo_url: string | null;
  notes: string | null;
  status: 'pending' | 'confirmed' | 'rejected' | 'completed' | 'cancelled';
  internal_notes: string | null;
  rejection_reason: string | null;
  handled_by_user_id: number | null;
  handled_at: string | null;
  google_event_ids: Record<string, string>;
  created_at: string;
  updated_at: string;
}

export interface ReservationInput {
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  event_date: string;
  event_time: string;
  event_location: string;
  event_type: string;
  event_purpose?: string;
  package_id?: number;
  package_name_snapshot: string;
  package_price_snapshot?: number;
  extras_snapshot?: Array<{ name: string; price: number }>;
  frame_text?: string;
  notes?: string;
}

export type SettingsMap = Record<string, string>;

// =============================================================
// PUBLIC READ QUERIES
// =============================================================

export async function getPackages(): Promise<Package[]> {
  const rows = await sql`
    SELECT id, slug, name, duration_hours, duration_label,
           price, old_price, sale_badge, price_note,
           featured, ribbon, features, sort_order, published
    FROM packages
    WHERE published = true
    ORDER BY sort_order ASC
  `;
  return rows as Package[];
}

export async function getAllPackages(): Promise<Package[]> {
  const rows = await sql`
    SELECT id, slug, name, duration_hours, duration_label,
           price, old_price, sale_badge, price_note,
           featured, ribbon, features, sort_order, published
    FROM packages
    ORDER BY sort_order ASC
  `;
  return rows as Package[];
}

export async function getExtras(): Promise<Extra[]> {
  const rows = await sql`
    SELECT id, slug, name, price, sort_order, published
    FROM extras
    WHERE published = true
    ORDER BY sort_order ASC
  `;
  return rows as Extra[];
}

export async function getAllExtras(): Promise<Extra[]> {
  const rows = await sql`
    SELECT id, slug, name, price, sort_order, published
    FROM extras
    ORDER BY sort_order ASC
  `;
  return rows as Extra[];
}

export async function getReviews(): Promise<Review[]> {
  const rows = await sql`
    SELECT id, reviewer_name, reviewer_initial, avatar_variant,
           event_type, location, region, rating, text, sort_order
    FROM reviews
    WHERE published = true
    ORDER BY sort_order ASC
  `;
  return rows as Review[];
}

export async function getFaqItems(): Promise<FaqItem[]> {
  const rows = await sql`
    SELECT id, question, answer, sort_order
    FROM faq_items
    WHERE published = true
    ORDER BY sort_order ASC
  `;
  return rows as FaqItem[];
}

export async function getSettings(): Promise<SettingsMap> {
  const rows = (await sql`
    SELECT key, value FROM settings
  `) as Array<{ key: string; value: string | null }>;

  const map: SettingsMap = {};
  for (const row of rows) {
    if (row.value !== null) {
      map[row.key] = row.value;
    }
  }
  return map;
}

// =============================================================
// RESERVATION QUERIES
// =============================================================

export async function createReservation(input: ReservationInput): Promise<Reservation> {
  const rows = await sql`
    INSERT INTO reservations (
      customer_name, customer_phone, customer_email,
      event_date, event_time, event_location, event_type, event_purpose,
      package_id, package_name_snapshot, package_price_snapshot,
      extras_snapshot, frame_text, notes, status
    ) VALUES (
      ${input.customer_name}, ${input.customer_phone}, ${input.customer_email},
      ${input.event_date}, ${input.event_time}, ${input.event_location},
      ${input.event_type}, ${input.event_purpose || null},
      ${input.package_id || null}, ${input.package_name_snapshot},
      ${input.package_price_snapshot || null},
      ${JSON.stringify(input.extras_snapshot || [])}::jsonb,
      ${input.frame_text || null}, ${input.notes || null}, 'pending'
    )
    RETURNING *
  `;
  return rows[0] as Reservation;
}

export async function upsertContact(email: string, name: string, phone: string): Promise<void> {
  await sql`
    INSERT INTO contacts (email, name, phone, reservation_count)
    VALUES (${email}, ${name}, ${phone}, 1)
    ON CONFLICT (email) DO UPDATE
    SET reservation_count = contacts.reservation_count + 1,
        last_activity_at = NOW(),
        name = EXCLUDED.name,
        phone = EXCLUDED.phone
  `;
}

export async function getReservations(status?: string): Promise<Reservation[]> {
  if (status) {
    const rows = await sql`
      SELECT * FROM reservations
      WHERE status = ${status}
      ORDER BY created_at DESC
    `;
    return rows as Reservation[];
  }
  const rows = await sql`
    SELECT * FROM reservations
    ORDER BY created_at DESC
  `;
  return rows as Reservation[];
}

export async function getReservation(id: number): Promise<Reservation | null> {
  const rows = await sql`
    SELECT * FROM reservations WHERE id = ${id}
  `;
  return (rows[0] as Reservation) || null;
}

export async function updateReservationStatus(
  id: number,
  status: 'confirmed' | 'rejected' | 'completed' | 'cancelled',
  userId: number,
  rejectionReason?: string,
  internalNotes?: string
): Promise<Reservation> {
  const rows = await sql`
    UPDATE reservations
    SET status = ${status},
        handled_by_user_id = ${userId},
        handled_at = NOW(),
        rejection_reason = ${rejectionReason || null},
        internal_notes = COALESCE(${internalNotes || null}, internal_notes)
    WHERE id = ${id}
    RETURNING *
  `;
  return rows[0] as Reservation;
}
