# DB migracije za Ujete Bedarije

## Kaj je tu

- `01_schema.sql` — vse tabele, indeksi, triggerji
- `02_seed.sql` — začetni podatki (3 paketi, 3 extras, 8 mnenj, FAQ, nastavitve, uporabniki)

## Kako zagnati

### Prvič (nova baza)

1. Pojdi na **[console.neon.tech](https://console.neon.tech)** → projekt `ujete-bedarije-db`
2. Levo v meniju: **SQL Editor**
3. Kopiraj vsebino `01_schema.sql` → prilepi → **Run**
4. Kopiraj vsebino `02_seed.sql` → prilepi → **Run**
5. Preveri z: `SELECT COUNT(*) FROM packages;` — mora vrniti 3

### Kasnejše migracije

Vsaka nova migracija naj bo nov fajl z incrementiranim številom (`03_add_...`, `04_...`).
Uporabi `CREATE TABLE IF NOT EXISTS`, `ALTER TABLE ... ADD COLUMN IF NOT EXISTS`, ipd.,
da so idempotentne (lahko se poženejo večkrat brez napake).

## Tabele — pregled

| Tabela | Namen |
|--------|-------|
| `users` | CMS uporabniki (Anita, Stane, Claudia) + Google OAuth tokens |
| `packages` | Paketi BASIC/PARTY/VIP + features + cene |
| `extras` | Dodatne možnosti (Dodatna ura, Audio Guestbook, Neomejen tisk) |
| `reservations` | Rezervacije s statusom pending/confirmed/rejected |
| `galleries` | Galerije dogodkov (poroka X, rojstni dan Y) |
| `gallery_photos` | Slike znotraj galerije (max 10 per gallery) |
| `contacts` | CRM light — vsi ki so kdaj poslali povpraševanje |
| `reviews` | Mnenja strank (Štajerska, Dolenjska, Koroška, Prekmurje) |
| `faq_items` | FAQ vprašanja + odgovori |
| `settings` | Key-value store za vse tekste na strani (hero, kontakt, ...) |
| `audit_log` | Kdo je kaj naredil (za forenziko) |
