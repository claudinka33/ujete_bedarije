-- =============================================================
-- UJETE BEDARIJE — SEED DATA
-- Osnovni podatki iz obstoječe HTML strani, prenešeni v bazo
-- =============================================================

-- =============================================================
-- UPORABNIKI CMS
-- =============================================================
INSERT INTO users (email, name, role, active) VALUES
  ('claudinka33@gmail.com',     'Claudia Seidl', 'admin', true),
  ('szekar14@gmail.com',        'Anita Seidl',   'staff', true),
  ('stanislavzekar@gmail.com',  'Stanislav Žekar','staff', true)
ON CONFLICT (email) DO NOTHING;

-- =============================================================
-- PAKETI
-- =============================================================
INSERT INTO packages (slug, name, duration_hours, duration_label, price, old_price, sale_badge, price_note, featured, ribbon, features, sort_order, published) VALUES
(
  'basic', 'BASIC', 1, '1 ura fotografiranja',
  190, 210, 'Akcija −10%', 'akcijska cena', false, NULL,
  '[
    {"text": "Do 70 tiskanih fotografij"},
    {"text": "Digitalni album na email"},
    {"text": "Fizični album s pisali in nalepkami"},
    {"text": "Rekviziti za fotografiranje"},
    {"text": "Izbira različnih ozadij"},
    {"text": "Prilagojen okvir z napisom"}
  ]'::jsonb,
  1, true
),
(
  'party', 'PARTY', 2, '2 uri fotografiranja',
  280, 320, 'Akcija −13% do 30.9.2026', 'akcijska cena', true, 'Priporočamo',
  '[
    {"text": "Do 150 tiskanih fotografij"},
    {"text": "Digitalni album na email"},
    {"text": "Fizični album s pisali in nalepkami"},
    {"text": "Rekviziti za fotografiranje"},
    {"text": "Izbira različnih ozadij"},
    {"text": "Prilagojen okvir z napisom"},
    {"text": "QR prenos fotografij na telefon"},
    {"text": "Glasbena popestritev s harmoniko 30-45 min"}
  ]'::jsonb,
  2, true
),
(
  'vip', 'VIP', 3, '3 ure fotografiranja',
  350, 410, 'Akcija −15%', 'akcijska cena', false, NULL,
  '[
    {"text": "Neomejeno tiskanje fotografij"},
    {"text": "Digitalni album + fizični album"},
    {"text": "QR prenos fotografij na telefon"},
    {"text": "Audio Guestbook Experience"},
    {"text": "Glasbena popestritev s harmoniko (po dogovoru)"},
    {"text": "Nagrade za najboljšo fotografijo večera"},
    {"text": "Presenečenje za slavljenca"}
  ]'::jsonb,
  3, true
)
ON CONFLICT (slug) DO NOTHING;

-- =============================================================
-- EXTRAS / Dodatne možnosti
-- =============================================================
INSERT INTO extras (slug, name, price, sort_order, published) VALUES
  ('dodatna-ura',     'Dodatna ura fotografiranja', 70,  1, true),
  ('audio-guestbook', 'Audio Guestbook',            90,  2, true),
  ('neomejen-tisk',   'Neomejen tisk fotografij',   80,  3, true)
ON CONFLICT (slug) DO NOTHING;

-- =============================================================
-- MNENJA STRANK (samo Štajerska, Dolenjska, Koroška, Prekmurje)
-- =============================================================
INSERT INTO reviews (reviewer_name, reviewer_initial, avatar_variant, event_type, location, region, rating, text, sort_order, published) VALUES
  ('Nina B.',    'N', 1, 'Poroka',        'Maribor',        'Štajerska', 5,
   'Najela sem jih za poroko in to je bil definitivno hit večera. Babice in dedki so se fotkali kot mladi, fotografije pa še vedno krožijo po družinskih klepetih. Hvala!',
   1, true),
  ('Tjaša M.',   'T', 2, 'Poroka',        'Ptuj',           'Štajerska', 5,
   'Naša poročna fotokabina! Audio Guestbook je dal čisto novo dimenzijo — voščila gostov si poslušava še zdaj. Profesionalna ekipa, vse je bilo perfektno organizirano.',
   2, true),
  ('Mojca K.',   'M', 3, 'Rojstni dan',   'Celje',          'Štajerska', 5,
   'Za 40. rojstni dan sem si privoščila in nisem obžalovala. Rekvizitov je bilo za vse okuse, vsi gostje so se zabavali. Album s posnetki je perfekten spomin.',
   3, true),
  ('Sara J.',    'S', 4, 'Valeta',        'Novo mesto',     'Dolenjska', 5,
   'Valeta je bila nepozabna! Otroci so se fotkali nonstop, učitelji prav tako. Postavitev je bila hitra in profesionalna, foto so čudovite kvalitete.',
   4, true),
  ('Lara Š.',    'L', 5, '18. rojstni dan','Velenje',       'Koroška',   5,
   '18. rojstni dan sem zaupala njima in nisem se zmotila! Atmosfera je bila top, fotki so neverjetni. Vsi prijatelji še zdaj govorijo o tem.',
   5, true),
  ('Eva P.',     'E', 2, 'Poroka',        'Murska Sobota',  'Prekmurje', 5,
   'Najboljša odločitev za poroko, takoj za izbrano lokacijo. Vsi gostje so dobili spomin domov, midva pa imava album, ki ga bova prebirala še 50 let.',
   6, true),
  ('Boštjan H.', 'B', 3, 'Rojstni dan',   'Brežice',        'Dolenjska', 5,
   'Za 50. rojstni dan moje mame — bila je presrečna! Fotke vsi gostje še danes objavljajo. Cena res odgovarja kvaliteti, priporočam vsem.',
   7, true),
  ('Damjan R.',  'D', 4, 'Poroka',        'Maribor',        'Štajerska', 5,
   'Profesionalno od začetka do konca. Postavili so se hitro, brez kakršnegakoli kompliciranja. Album s sporočili gostov pa zdaj stoji na vidnem mestu doma.',
   8, true)
ON CONFLICT DO NOTHING;

-- =============================================================
-- FAQ
-- =============================================================
INSERT INTO faq_items (question, answer, sort_order, published) VALUES
  ('Koliko prostora potrebujete na lokaciji?',
   'Za postavitev potrebujemo približno 2×3 m prostora za ozadje. Postavimo se lahko v dvorani, šotoru ali na prostem v primeru jasnega vremena.',
   1, true),
  ('Ali pridete tudi izven Ljubljane?',
   'Pokrivamo celotno Slovenijo. Prihod je za vse rezervacije do 31. 12. 2026 popolnoma brezplačen, ne glede na oddaljenost lokacije.',
   2, true),
  ('Kako dolgo traja postavitev?',
   'Postavitev običajno traja 45 do 90 minut. Pridemo dovolj zgodaj, da je vse pripravljeno pred prihodom prvih gostov. Postavitev in pospravljanje nista del plačanega časa.',
   3, true),
  ('Ali lahko izberemo lasten dizajn okvirja?',
   'Seveda! Vsak paket vključuje prilagojen okvir z napisom po vaši želji — imena, datum, slogan. Če želite, lahko dodate tudi lasten logotip.',
   4, true),
  ('Kdaj bomo prejeli digitalne fotografije?',
   'Digitalni album vam pošljemo v roku 24 ur po dogodku na e-pošto. Fotografije lahko potem svobodno delite z gosti in na družbenih omrežjih.',
   5, true),
  ('Kako opravimo rezervacijo?',
   'Preprosto izpolnite obrazec na naši spletni strani ali nas pokličite. Rezervacija je potrjena po plačilu 30 % predplačila. Preostanek plačate po dogodku.',
   6, true)
ON CONFLICT DO NOTHING;

-- =============================================================
-- NASTAVITVE spletne strani
-- =============================================================
INSERT INTO settings (key, value, description) VALUES
  -- Kontakti
  ('company_name',        'Ujete Bedarije',                          'Ime podjetja'),
  ('phone',               '030 654 002',                             'Telefonska številka'),
  ('phone_international', '+38630654002',                            'Telefon za tel: in wa.me links'),
  ('email',               'ujete.bedarije@gmail.com',                'Kontaktni email'),
  ('whatsapp_message',    'Pozdravljeni, zanima me photo booth za dogodek.', 'Pripravljeno WhatsApp sporočilo'),

  -- Hero sekcija
  ('hero_title',          'Ujemite trenutke na svoj način',          'Glavni naslov na strani (hero)'),
  ('hero_subtitle',       'Photo booth za poroke, zabave in firmne dogodke po Sloveniji. Neomejen tisk, rekviziti in prilagojen okvir.', 'Podnaslov hero'),
  ('hero_cta_primary',    'Rezervacija termina',                     'Glavni CTA gumb'),
  ('hero_cta_secondary',  'Poglej pakete',                           'Sekundarni CTA gumb'),

  -- Bonus banner
  ('bonus_banner',        'Prihod na lokacijo brezplačen za rezervacije do 31. 12. 2026', 'Bonus banner nad paketi'),

  -- Cene
  ('vat_note',            'Vse navedene cene so brez DDV.',          'Opomba pod cenami'),

  -- SEO
  ('seo_title',           'Photo Booth Slovenija | Ujete Bedarije — najem fotokabine za poroke in zabave', 'HTML <title>'),
  ('seo_description',     'Najem photo booth fotokabine za poroke, rojstne dneve in firmne dogodke po vsej Sloveniji. Neomejen tisk, rekviziti, album in prihod brezplačen. Paketi od 190 €.', 'Meta description'),

  -- Poslovni podatki
  ('service_area',        'Slovenija',                               'Območje delovanja'),
  ('setup_time_min',      '45',                                      'Min čas postavitve (minut)'),
  ('setup_time_max',      '90',                                      'Max čas postavitve (minut)'),
  ('required_space',      '2×3 m',                                   'Potreben prostor za postavitev'),

  -- Rezervacije
  ('reservation_response_hours', '24',                               'Odzivni čas na povpraševanje (ure)'),
  ('reservation_deposit_percent', '30',                              'Predplačilo v %')
ON CONFLICT (key) DO NOTHING;

-- =============================================================
-- Verify seed
-- =============================================================
DO $$
DECLARE
  pkg_count INTEGER;
  ext_count INTEGER;
  rev_count INTEGER;
  faq_count INTEGER;
  usr_count INTEGER;
  set_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO pkg_count FROM packages;
  SELECT COUNT(*) INTO ext_count FROM extras;
  SELECT COUNT(*) INTO rev_count FROM reviews;
  SELECT COUNT(*) INTO faq_count FROM faq_items;
  SELECT COUNT(*) INTO usr_count FROM users;
  SELECT COUNT(*) INTO set_count FROM settings;

  RAISE NOTICE '=== SEED COMPLETED ===';
  RAISE NOTICE 'Packages: %', pkg_count;
  RAISE NOTICE 'Extras: %', ext_count;
  RAISE NOTICE 'Reviews: %', rev_count;
  RAISE NOTICE 'FAQ items: %', faq_count;
  RAISE NOTICE 'Users: %', usr_count;
  RAISE NOTICE 'Settings: %', set_count;
END $$;
