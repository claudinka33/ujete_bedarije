-- =============================================================
-- New 4th email template: "Received" — fired to the customer
-- immediately when they submit the reservation form, so they
-- know we got it and know what to expect next.
-- =============================================================

INSERT INTO settings (key, value) VALUES
  ('mail_received_subject', 'Prejeli smo vaše povpraševanje ✓ · {{datum}}'),
  ('mail_received_body',
   E'Pozdravljeni {{ime}},\nhvala za vaše povpraševanje za photo booth. Spodaj je povzetek podatkov, ki ste jih poslali.'),
  ('mail_received_whatsnext',
   E'V 24 urah vam bomo poslali potrditev ali predlog alternativnega termina.\nRezervacija NI dokončna, dokler ne prejmete potrditvenega maila.\nZa vprašanja smo na voljo na {{email_kontakt}} ali 030 654 002.'),
  ('mail_received_closing', E'Hvala za zaupanje!\nEkipa Ujete Bedarije')
ON CONFLICT (key) DO NOTHING;
