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

// =============================================================
// ADMIN: PACKAGES CRUD
// =============================================================

export interface PackageInput {
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

export async function getPackage(id: number): Promise<Package | null> {
  const rows = await sql`SELECT * FROM packages WHERE id = ${id}`;
  return (rows[0] as Package) || null;
}

export async function createPackage(input: PackageInput): Promise<Package> {
  const rows = await sql`
    INSERT INTO packages (
      slug, name, duration_hours, duration_label,
      price, old_price, sale_badge, price_note,
      featured, ribbon, features, sort_order, published
    ) VALUES (
      ${input.slug}, ${input.name}, ${input.duration_hours}, ${input.duration_label},
      ${input.price}, ${input.old_price}, ${input.sale_badge}, ${input.price_note},
      ${input.featured}, ${input.ribbon},
      ${JSON.stringify(input.features)}::jsonb,
      ${input.sort_order}, ${input.published}
    )
    RETURNING *
  `;
  return rows[0] as Package;
}

export async function updatePackage(id: number, input: PackageInput): Promise<Package> {
  const rows = await sql`
    UPDATE packages SET
      slug = ${input.slug},
      name = ${input.name},
      duration_hours = ${input.duration_hours},
      duration_label = ${input.duration_label},
      price = ${input.price},
      old_price = ${input.old_price},
      sale_badge = ${input.sale_badge},
      price_note = ${input.price_note},
      featured = ${input.featured},
      ribbon = ${input.ribbon},
      features = ${JSON.stringify(input.features)}::jsonb,
      sort_order = ${input.sort_order},
      published = ${input.published}
    WHERE id = ${id}
    RETURNING *
  `;
  return rows[0] as Package;
}

export async function deletePackage(id: number): Promise<void> {
  await sql`DELETE FROM packages WHERE id = ${id}`;
}

// =============================================================
// ADMIN: EXTRAS CRUD
// =============================================================

export interface ExtraInput {
  slug: string;
  name: string;
  price: number;
  sort_order: number;
  published: boolean;
}

export async function createExtra(input: ExtraInput): Promise<Extra> {
  const rows = await sql`
    INSERT INTO extras (slug, name, price, sort_order, published)
    VALUES (${input.slug}, ${input.name}, ${input.price}, ${input.sort_order}, ${input.published})
    RETURNING *
  `;
  return rows[0] as Extra;
}

export async function updateExtra(id: number, input: ExtraInput): Promise<Extra> {
  const rows = await sql`
    UPDATE extras SET
      slug = ${input.slug},
      name = ${input.name},
      price = ${input.price},
      sort_order = ${input.sort_order},
      published = ${input.published}
    WHERE id = ${id}
    RETURNING *
  `;
  return rows[0] as Extra;
}

export async function deleteExtra(id: number): Promise<void> {
  await sql`DELETE FROM extras WHERE id = ${id}`;
}

// =============================================================
// ADMIN: SETTINGS CRUD
// =============================================================

export async function getAllSettings(): Promise<Array<{ key: string; value: string | null; description: string | null }>> {
  const rows = await sql`
    SELECT key, value, description FROM settings ORDER BY key ASC
  `;
  return rows as Array<{ key: string; value: string | null; description: string | null }>;
}

export async function upsertSetting(key: string, value: string): Promise<void> {
  await sql`
    INSERT INTO settings (key, value)
    VALUES (${key}, ${value})
    ON CONFLICT (key) DO UPDATE SET value = ${value}, updated_at = NOW()
  `;
}

// =============================================================
// ADMIN: REVIEWS CRUD
// =============================================================

export interface ReviewInput {
  reviewer_name: string;
  reviewer_initial: string | null;
  avatar_variant: number;
  event_type: string;
  location: string;
  region: string | null;
  rating: number;
  text: string;
  sort_order: number;
  published: boolean;
}

export async function getAllReviews(): Promise<Review[]> {
  const rows = await sql`
    SELECT id, reviewer_name, reviewer_initial, avatar_variant,
           event_type, location, region, rating, text, sort_order, published
    FROM reviews
    ORDER BY sort_order ASC
  ` as (Review & { published: boolean })[];
  return rows;
}

export async function createReview(input: ReviewInput): Promise<Review> {
  const rows = await sql`
    INSERT INTO reviews (
      reviewer_name, reviewer_initial, avatar_variant,
      event_type, location, region, rating, text, sort_order, published
    ) VALUES (
      ${input.reviewer_name}, ${input.reviewer_initial}, ${input.avatar_variant},
      ${input.event_type}, ${input.location}, ${input.region},
      ${input.rating}, ${input.text}, ${input.sort_order}, ${input.published}
    )
    RETURNING *
  `;
  return rows[0] as Review;
}

export async function updateReview(id: number, input: ReviewInput): Promise<Review> {
  const rows = await sql`
    UPDATE reviews SET
      reviewer_name = ${input.reviewer_name},
      reviewer_initial = ${input.reviewer_initial},
      avatar_variant = ${input.avatar_variant},
      event_type = ${input.event_type},
      location = ${input.location},
      region = ${input.region},
      rating = ${input.rating},
      text = ${input.text},
      sort_order = ${input.sort_order},
      published = ${input.published}
    WHERE id = ${id}
    RETURNING *
  `;
  return rows[0] as Review;
}

export async function deleteReview(id: number): Promise<void> {
  await sql`DELETE FROM reviews WHERE id = ${id}`;
}

// =============================================================
// ADMIN: FAQ CRUD
// =============================================================

export interface FaqInput {
  question: string;
  answer: string;
  sort_order: number;
  published: boolean;
}

export async function getAllFaqItems(): Promise<FaqItem[]> {
  const rows = await sql`
    SELECT id, question, answer, sort_order, published
    FROM faq_items
    ORDER BY sort_order ASC
  `;
  return rows as FaqItem[];
}

export async function createFaqItem(input: FaqInput): Promise<FaqItem> {
  const rows = await sql`
    INSERT INTO faq_items (question, answer, sort_order, published)
    VALUES (${input.question}, ${input.answer}, ${input.sort_order}, ${input.published})
    RETURNING *
  `;
  return rows[0] as FaqItem;
}

export async function updateFaqItem(id: number, input: FaqInput): Promise<FaqItem> {
  const rows = await sql`
    UPDATE faq_items SET
      question = ${input.question},
      answer = ${input.answer},
      sort_order = ${input.sort_order},
      published = ${input.published}
    WHERE id = ${id}
    RETURNING *
  `;
  return rows[0] as FaqItem;
}

export async function deleteFaqItem(id: number): Promise<void> {
  await sql`DELETE FROM faq_items WHERE id = ${id}`;
}

// =============================================================
// GALLERIES
// =============================================================
export interface GalleryPhoto {
  id: number;
  gallery_id: number;
  photo_url: string;
  blob_pathname: string | null;
  alt_text: string | null;
  width: number | null;
  height: number | null;
  sort_order: number;
}

export interface Gallery {
  id: number;
  slug: string;
  title: string;
  event_type: string | null;
  event_date: string | null;
  description: string | null;
  cover_photo_url: string | null;
  published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface GalleryWithPhotos extends Gallery {
  photos: GalleryPhoto[];
}

export interface GalleryInput {
  slug: string;
  title: string;
  event_type?: string | null;
  event_date?: string | null;
  description?: string | null;
  cover_photo_url?: string | null;
  published: boolean;
  sort_order: number;
}

/** Public: only published + at least one photo */
export async function getPublicGalleries(): Promise<Gallery[]> {
  const rows = await sql`
    SELECT g.id, g.slug, g.title, g.event_type,
           TO_CHAR(g.event_date, 'YYYY-MM-DD') AS event_date,
           g.description,
           g.cover_photo_url, g.published, g.sort_order, g.created_at, g.updated_at
    FROM galleries g
    WHERE g.published = true
      AND EXISTS (SELECT 1 FROM gallery_photos p WHERE p.gallery_id = g.id)
    ORDER BY g.sort_order ASC, g.event_date DESC NULLS LAST, g.id DESC
  `;
  return rows as Gallery[];
}

export async function getPublicGalleryBySlug(slug: string): Promise<GalleryWithPhotos | null> {
  const rows = await sql`
    SELECT id, slug, title, event_type,
           TO_CHAR(event_date, 'YYYY-MM-DD') AS event_date,
           description,
           cover_photo_url, published, sort_order, created_at, updated_at
    FROM galleries
    WHERE slug = ${slug} AND published = true
    LIMIT 1
  `;
  if (rows.length === 0) return null;
  const gallery = rows[0] as Gallery;
  const photos = await sql`
    SELECT id, gallery_id, photo_url, blob_pathname, alt_text, width, height, sort_order
    FROM gallery_photos
    WHERE gallery_id = ${gallery.id}
    ORDER BY sort_order ASC, id ASC
  `;
  return { ...gallery, photos: photos as GalleryPhoto[] };
}

/** Admin: all galleries */
export async function getAllGalleries(): Promise<Gallery[]> {
  const rows = await sql`
    SELECT id, slug, title, event_type,
           TO_CHAR(event_date, 'YYYY-MM-DD') AS event_date,
           description,
           cover_photo_url, published, sort_order, created_at, updated_at
    FROM galleries
    ORDER BY sort_order ASC, event_date DESC NULLS LAST, id DESC
  `;
  return rows as Gallery[];
}

export async function getGalleryById(id: number): Promise<GalleryWithPhotos | null> {
  const rows = await sql`
    SELECT id, slug, title, event_type,
           TO_CHAR(event_date, 'YYYY-MM-DD') AS event_date,
           description,
           cover_photo_url, published, sort_order, created_at, updated_at
    FROM galleries WHERE id = ${id} LIMIT 1
  `;
  if (rows.length === 0) return null;
  const gallery = rows[0] as Gallery;
  const photos = await sql`
    SELECT id, gallery_id, photo_url, blob_pathname, alt_text, width, height, sort_order
    FROM gallery_photos
    WHERE gallery_id = ${gallery.id}
    ORDER BY sort_order ASC, id ASC
  `;
  return { ...gallery, photos: photos as GalleryPhoto[] };
}

export async function createGallery(input: GalleryInput): Promise<Gallery> {
  await sql`
    INSERT INTO galleries
      (slug, title, event_type, event_date, description, cover_photo_url, published, sort_order)
    VALUES
      (${input.slug}, ${input.title}, ${input.event_type ?? null},
       ${input.event_date ?? null}, ${input.description ?? null},
       ${input.cover_photo_url ?? null}, ${input.published}, ${input.sort_order})
  `;
  const rows = await sql`
    SELECT id, slug, title, event_type,
           TO_CHAR(event_date, 'YYYY-MM-DD') AS event_date,
           description, cover_photo_url, published, sort_order, created_at, updated_at
    FROM galleries WHERE slug = ${input.slug} LIMIT 1
  `;
  return rows[0] as Gallery;
}

export async function updateGallery(id: number, input: GalleryInput): Promise<Gallery> {
  await sql`
    UPDATE galleries SET
      slug = ${input.slug},
      title = ${input.title},
      event_type = ${input.event_type ?? null},
      event_date = ${input.event_date ?? null},
      description = ${input.description ?? null},
      cover_photo_url = ${input.cover_photo_url ?? null},
      published = ${input.published},
      sort_order = ${input.sort_order}
    WHERE id = ${id}
  `;
  const rows = await sql`
    SELECT id, slug, title, event_type,
           TO_CHAR(event_date, 'YYYY-MM-DD') AS event_date,
           description, cover_photo_url, published, sort_order, created_at, updated_at
    FROM galleries WHERE id = ${id} LIMIT 1
  `;
  return rows[0] as Gallery;
}

export async function deleteGallery(id: number): Promise<GalleryPhoto[]> {
  // Return photos so caller can also delete blobs
  const photos = await sql`
    SELECT id, gallery_id, photo_url, blob_pathname, alt_text, width, height, sort_order
    FROM gallery_photos WHERE gallery_id = ${id}
  `;
  await sql`DELETE FROM galleries WHERE id = ${id}`;
  return photos as GalleryPhoto[];
}

export async function countGalleryPhotos(galleryId: number): Promise<number> {
  const rows = await sql`SELECT COUNT(*)::int AS c FROM gallery_photos WHERE gallery_id = ${galleryId}`;
  return (rows[0] as { c: number }).c;
}

export async function addGalleryPhoto(input: {
  gallery_id: number;
  photo_url: string;
  blob_pathname?: string | null;
  alt_text?: string | null;
  width?: number | null;
  height?: number | null;
}): Promise<GalleryPhoto> {
  // sort_order = current max + 1
  const maxRow = await sql`
    SELECT COALESCE(MAX(sort_order), 0) AS m FROM gallery_photos WHERE gallery_id = ${input.gallery_id}
  `;
  const nextOrder = ((maxRow[0] as { m: number }).m ?? 0) + 1;

  const rows = await sql`
    INSERT INTO gallery_photos
      (gallery_id, photo_url, blob_pathname, alt_text, width, height, sort_order)
    VALUES
      (${input.gallery_id}, ${input.photo_url}, ${input.blob_pathname ?? null},
       ${input.alt_text ?? null}, ${input.width ?? null}, ${input.height ?? null},
       ${nextOrder})
    RETURNING *
  `;
  const photo = rows[0] as GalleryPhoto;

  // If gallery has no cover yet, use this photo as cover
  await sql`
    UPDATE galleries
    SET cover_photo_url = ${photo.photo_url}
    WHERE id = ${input.gallery_id} AND (cover_photo_url IS NULL OR cover_photo_url = '')
  `;

  return photo;
}

export async function getGalleryPhotoById(id: number): Promise<GalleryPhoto | null> {
  const rows = await sql`
    SELECT id, gallery_id, photo_url, blob_pathname, alt_text, width, height, sort_order
    FROM gallery_photos WHERE id = ${id} LIMIT 1
  `;
  return (rows[0] as GalleryPhoto) ?? null;
}

export async function deleteGalleryPhoto(id: number): Promise<GalleryPhoto | null> {
  const photo = await getGalleryPhotoById(id);
  if (!photo) return null;
  await sql`DELETE FROM gallery_photos WHERE id = ${id}`;
  // If this photo was the cover, replace with first remaining
  await sql`
    UPDATE galleries
    SET cover_photo_url = (
      SELECT photo_url FROM gallery_photos
      WHERE gallery_id = ${photo.gallery_id}
      ORDER BY sort_order ASC, id ASC LIMIT 1
    )
    WHERE id = ${photo.gallery_id} AND cover_photo_url = ${photo.photo_url}
  `;
  return photo;
}

export async function setGalleryCover(galleryId: number, photoUrl: string): Promise<void> {
  await sql`UPDATE galleries SET cover_photo_url = ${photoUrl} WHERE id = ${galleryId}`;
}

export async function reorderGalleryPhotos(orderedIds: number[]): Promise<void> {
  for (let i = 0; i < orderedIds.length; i++) {
    await sql`UPDATE gallery_photos SET sort_order = ${i + 1} WHERE id = ${orderedIds[i]}`;
  }
}
