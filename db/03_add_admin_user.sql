-- =============================================================
-- Migracija: dodaj ujete.bedarije@gmail.com kot glavnega admin-a
-- =============================================================
-- Zaženi enkrat v Neon SQL Editor.

INSERT INTO users (email, name, role, active)
VALUES ('ujete.bedarije@gmail.com', 'Ujete Bedarije', 'admin', true)
ON CONFLICT (email) DO UPDATE
SET role = 'admin', name = EXCLUDED.name, active = true;

-- Preveri
SELECT id, email, name, role, active FROM users ORDER BY id;
