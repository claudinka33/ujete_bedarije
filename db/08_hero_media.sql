-- =============================================================
-- Hero media: optional Instagram Reel (or image URL) that shows
-- in the hero section next to the headline.
-- =============================================================

INSERT INTO settings (key, value, description) VALUES
  ('hero_instagram_url', '', 'Instagram Reel URL (npr. https://www.instagram.com/reel/XXXXX/) — pokaže se desno v hero sekciji. Pusti prazno za centrirani stari layout.'),
  ('hero_image_url', '', 'Alternativa za Reel: URL slike (če je nastavljen in Instagram URL je prazen). Pusti prazno če želiš samo tekst.')
ON CONFLICT (key) DO NOTHING;
