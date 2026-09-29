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

export type SettingsMap = Record<string, string>;

// =============================================================
// QUERIES
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

export async function getExtras(): Promise<Extra[]> {
  const rows = await sql`
    SELECT id, slug, name, price, sort_order, published
    FROM extras
    WHERE published = true
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
  const rows = await sql`
    SELECT key, value FROM settings
  ` as Array<{ key: string; value: string | null }>;

  const map: SettingsMap = {};
  for (const row of rows) {
    if (row.value !== null) {
      map[row.key] = row.value;
    }
  }
  return map;
}
