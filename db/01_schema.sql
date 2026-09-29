-- =============================================================
-- UJETE BEDARIJE — DB SCHEMA
-- Postgres (Neon)
-- Vse tabele, ki jih potrebujemo za javno stran + CMS + rezervacije + galerija
-- =============================================================

-- Extension za UUID (če bo kdaj treba)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================
-- UPORABNIKI (Claudia, Anita, Stane)
-- =============================================================
CREATE TABLE IF NOT EXISTS users (
  id                    SERIAL PRIMARY KEY,
  email                 TEXT UNIQUE NOT NULL,
  name                  TEXT NOT NULL,
  role                  TEXT NOT NULL DEFAULT 'staff',        -- 'admin' | 'staff'
  google_id             TEXT UNIQUE,                          -- Google account ID
  google_refresh_token  TEXT,                                 -- za Calendar API
  google_access_token   TEXT,
  google_token_expiry   TIMESTAMPTZ,
  active                BOOLEAN NOT NULL DEFAULT true,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_login_at         TIMESTAMPTZ
);

-- =============================================================
-- PAKETI (BASIC, PARTY, VIP)
-- =============================================================
CREATE TABLE IF NOT EXISTS packages (
  id              SERIAL PRIMARY KEY,
  slug            TEXT UNIQUE NOT NULL,                       -- 'basic' | 'party' | 'vip'
  name            TEXT NOT NULL,                              -- 'BASIC', 'PARTY', 'VIP'
  duration_hours  INTEGER NOT NULL,                           -- 1, 2, 3 (za Calendar dogodek)
  duration_label  TEXT NOT NULL,                              -- '1 ura fotografiranja'
  price           INTEGER NOT NULL,                           -- v EUR (190, 280, 350)
  old_price       INTEGER,                                    -- prečrtana cena (210, 320, 410) | NULL
  sale_badge      TEXT,                                       -- 'Akcija −10%' | NULL
  price_note      TEXT,                                       -- 'akcijska cena' | NULL
  featured        BOOLEAN NOT NULL DEFAULT false,             -- PARTY = true (dark card)
  ribbon          TEXT,                                       -- 'Priporočamo' | NULL
  features        JSONB NOT NULL DEFAULT '[]'::jsonb,         -- array of {text: 'Do 70 tiskanih fotografij'}
  sort_order      INTEGER NOT NULL DEFAULT 0,
  published       BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================
-- EXTRAS / Dodatne možnosti
-- =============================================================
CREATE TABLE IF NOT EXISTS extras (
  id              SERIAL PRIMARY KEY,
  slug            TEXT UNIQUE NOT NULL,
  name            TEXT NOT NULL,
  price           INTEGER NOT NULL,
  sort_order      INTEGER NOT NULL DEFAULT 0,
  published       BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================
-- REZERVACIJE
-- =============================================================
CREATE TABLE IF NOT EXISTS reservations (
  id                          SERIAL PRIMARY KEY,
  -- Stranka
  customer_name               TEXT NOT NULL,
  customer_phone              TEXT NOT NULL,
  customer_email              TEXT NOT NULL,
  -- Dogodek
  event_date                  DATE NOT NULL,
  event_time                  TIME NOT NULL,
  event_location              TEXT NOT NULL,
  event_type                  TEXT NOT NULL,                  -- Poroka, Rojstni dan, Firmni, Valeta, Obletnica, ...
  event_purpose               TEXT,                           -- opcijsko: 'namen' — za koga (30. rojstni dan, 50-letnica, ...)
  -- Paket
  package_id                  INTEGER REFERENCES packages(id) ON DELETE SET NULL,
  package_name_snapshot       TEXT NOT NULL,                  -- 'PARTY' — snapshot ob rezervaciji
  package_price_snapshot      INTEGER,                        -- cena ob rezervaciji
  extras_snapshot             JSONB NOT NULL DEFAULT '[]'::jsonb, -- [{name, price}]
  -- Custom
  frame_text                  TEXT,                           -- napis na okvirju
  logo_url                    TEXT,                           -- URL uploadanega logotipa stranke
  notes                       TEXT,                           -- opombe stranke
  -- Status
  status                      TEXT NOT NULL DEFAULT 'pending', -- pending | confirmed | rejected | completed | cancelled
  internal_notes              TEXT,                           -- interne opombe (samo za Anito/Staneta)
  rejection_reason            TEXT,                           -- razlog zavrnitve
  handled_by_user_id          INTEGER REFERENCES users(id) ON DELETE SET NULL,
  handled_at                  TIMESTAMPTZ,
  -- Google Calendar
  google_event_ids            JSONB NOT NULL DEFAULT '{}'::jsonb, -- { "anita@...": "eventId1", "stane@...": "eventId2" }
  -- Timestamps
  created_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reservations_status ON reservations(status);
CREATE INDEX IF NOT EXISTS idx_reservations_event_date ON reservations(event_date);
CREATE INDEX IF NOT EXISTS idx_reservations_created_at ON reservations(created_at DESC);

-- =============================================================
-- GALERIJE / Projekti (poroka, rojstni dan, ...)
-- =============================================================
CREATE TABLE IF NOT EXISTS galleries (
  id              SERIAL PRIMARY KEY,
  slug            TEXT UNIQUE NOT NULL,
  title           TEXT NOT NULL,                              -- 'Poroka Nina & Matej'
  event_type      TEXT,                                       -- Poroka, Rojstni dan, ...
  event_date      DATE,
  description     TEXT,
  cover_photo_url TEXT,                                       -- URL prve slike (Vercel Blob)
  published       BOOLEAN NOT NULL DEFAULT false,             -- draft dokler ni "objavljeno"
  sort_order      INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by_user_id INTEGER REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_galleries_published ON galleries(published);

-- =============================================================
-- GALERIJA SLIKE (max 10 per gallery — enforced v aplikaciji)
-- =============================================================
CREATE TABLE IF NOT EXISTS gallery_photos (
  id              SERIAL PRIMARY KEY,
  gallery_id      INTEGER NOT NULL REFERENCES galleries(id) ON DELETE CASCADE,
  photo_url       TEXT NOT NULL,                              -- Vercel Blob URL
  blob_pathname   TEXT,                                       -- za brisanje z Vercel Blob
  alt_text        TEXT,
  width           INTEGER,
  height          INTEGER,
  sort_order      INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_gallery_photos_gallery ON gallery_photos(gallery_id, sort_order);

-- =============================================================
-- KONTAKTI (CRM light — vsi ki so kdaj poslali povpraševanje)
-- =============================================================
CREATE TABLE IF NOT EXISTS contacts (
  id                  SERIAL PRIMARY KEY,
  email               TEXT UNIQUE NOT NULL,
  name                TEXT NOT NULL,
  phone               TEXT,
  tags                JSONB NOT NULL DEFAULT '[]'::jsonb,     -- ['Poroka 2027', 'Firmni klienti']
  notes               TEXT,
  reservation_count   INTEGER NOT NULL DEFAULT 0,
  first_seen_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_activity_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================
-- MNENJA STRANK / Reviews (Štajerska, Dolenjska, Koroška, Prekmurje)
-- =============================================================
CREATE TABLE IF NOT EXISTS reviews (
  id                  SERIAL PRIMARY KEY,
  reviewer_name       TEXT NOT NULL,                          -- 'Nina B.'
  reviewer_initial    TEXT,                                   -- 'N' (za avatar)
  avatar_variant      INTEGER NOT NULL DEFAULT 1,             -- 1-5 (color)
  event_type          TEXT NOT NULL,                          -- Poroka, Rojstni dan, ...
  location            TEXT NOT NULL,                          -- Maribor, Ptuj, ...
  region              TEXT,                                   -- Štajerska, Dolenjska, Koroška, Prekmurje
  rating              INTEGER NOT NULL DEFAULT 5,             -- 1-5
  text                TEXT NOT NULL,
  published           BOOLEAN NOT NULL DEFAULT true,
  sort_order          INTEGER NOT NULL DEFAULT 0,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================
-- FAQ
-- =============================================================
CREATE TABLE IF NOT EXISTS faq_items (
  id              SERIAL PRIMARY KEY,
  question        TEXT NOT NULL,
  answer          TEXT NOT NULL,
  sort_order      INTEGER NOT NULL DEFAULT 0,
  published       BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================
-- NASTAVITVE (key-value store za spletno stran)
-- Primeri: hero_title, hero_subtitle, phone, email, address,
--          bonus_banner, working_hours, ...
-- =============================================================
CREATE TABLE IF NOT EXISTS settings (
  key             TEXT PRIMARY KEY,
  value           TEXT,                                       -- za enostavne strings
  value_json      JSONB,                                      -- za kompleksnejše (npr. delovni čas)
  description     TEXT,                                       -- opomba za CMS ('Telefonska številka')
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================
-- AUDIT LOG (kdo je kaj naredil — samo pomembne akcije)
-- =============================================================
CREATE TABLE IF NOT EXISTS audit_log (
  id              SERIAL PRIMARY KEY,
  user_id         INTEGER REFERENCES users(id) ON DELETE SET NULL,
  action          TEXT NOT NULL,                              -- 'reservation.confirmed', 'package.updated', ...
  entity_type     TEXT,                                       -- 'reservation', 'package', 'gallery'
  entity_id       INTEGER,
  details         JSONB,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_log_created ON audit_log(created_at DESC);

-- =============================================================
-- Trigger za auto-update `updated_at` polj
-- =============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS trg_packages_updated ON packages;
CREATE TRIGGER trg_packages_updated
  BEFORE UPDATE ON packages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_reservations_updated ON reservations;
CREATE TRIGGER trg_reservations_updated
  BEFORE UPDATE ON reservations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_galleries_updated ON galleries;
CREATE TRIGGER trg_galleries_updated
  BEFORE UPDATE ON galleries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_settings_updated ON settings;
CREATE TRIGGER trg_settings_updated
  BEFORE UPDATE ON settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
