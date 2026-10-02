-- =============================================================
-- Email template settings — osebje lahko ureja predloge v CMS.
-- Vsak template ima dva dela: subject + body (text, podpira {{variables}}).
--
-- Variables, ki se zamenjajo pri pošiljanju:
--   {{ime}}           — kratko ime stranke
--   {{polno_ime}}     — polno ime stranke
--   {{datum}}         — "20. december 2026"
--   {{ura}}           — "18:00"
--   {{lokacija}}      — kraj dogodka
--   {{tip_dogodka}}   — Poroka / Rojstni dan / ...
--   {{paket}}         — ime paketa z ceno
--   {{razlog}}        — razlog zavrnitve (samo za rejected)
--   {{email_kontakt}} — reply-to kontaktni email
--
-- Line-breaks (\n) se spremenijo v <br> pri renderanju.
-- =============================================================

INSERT INTO settings (key, value) VALUES
  ('mail_new_reservation_subject', 'Nova rezervacija: {{polno_ime}} · {{datum}}')
  ON CONFLICT (key) DO NOTHING;

INSERT INTO settings (key, value) VALUES
  ('mail_new_reservation_body',
   'Stranka je oddala rezervacijo preko spletne strani. Pregled podatkov spodaj — v CMS lahko potrdiš ali zavrneš.')
  ON CONFLICT (key) DO NOTHING;

INSERT INTO settings (key, value) VALUES
  ('mail_approved_subject', 'Vaša rezervacija je potrjena ✓ · {{datum}}')
  ON CONFLICT (key) DO NOTHING;

INSERT INTO settings (key, value) VALUES
  ('mail_approved_body',
   'Pozdravljeni {{ime}},' || E'\n' ||
   'z veseljem potrjujemo vašo rezervacijo photo booth-a. Veselimo se dogodka!')
  ON CONFLICT (key) DO NOTHING;

INSERT INTO settings (key, value) VALUES
  ('mail_approved_whatsnext',
   'Dan pred dogodkom vas pokličemo za potrditev časa in natančnega naslova.' || E'\n' ||
   'Prihod je brezplačen znotraj Slovenije.' || E'\n' ||
   'Če želite kaj spremeniti, nam pišite na {{email_kontakt}}.')
  ON CONFLICT (key) DO NOTHING;

INSERT INTO settings (key, value) VALUES
  ('mail_approved_closing',
   'Hvala za zaupanje!' || E'\n' ||
   'Ekipa Ujete Bedarije')
  ON CONFLICT (key) DO NOTHING;

INSERT INTO settings (key, value) VALUES
  ('mail_rejected_subject', 'Rezervacija ni mogoča · {{datum}}')
  ON CONFLICT (key) DO NOTHING;

INSERT INTO settings (key, value) VALUES
  ('mail_rejected_body',
   'Pozdravljeni {{ime}},' || E'\n' ||
   'hvala za vaše zanimanje. Za {{datum}} žal nismo prosti.')
  ON CONFLICT (key) DO NOTHING;

INSERT INTO settings (key, value) VALUES
  ('mail_rejected_closing',
   'Če želite preveriti kakšen drug termin, nam pišite ali pokličite — z veseljem najdemo rešitev.' || E'\n' || E'\n' ||
   'Ekipa Ujete Bedarije')
  ON CONFLICT (key) DO NOTHING;
