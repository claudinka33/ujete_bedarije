# Ujete Bedarije — Roadmap za CMS migracijo

## Stack
- Next.js 14 App Router + TypeScript
- Tailwind CSS + Lucide ikone
- Neon PostgreSQL (Frankfurt)
- NextAuth v5 z Google Provider
- Vercel Blob (slike)
- Google Calendar API (OAuth)

## Uporabniki CMS
- Claudia (admin)
- Anita — szekar14@gmail.com
- Stane — stanislavzekar@gmail.com

## Moduli (vrstni red gradnje)
1. Baza + shema (packages, extras, reservations, users, galleries, gallery_photos, settings, contacts)
2. Javna stran (migracija HTML → Next.js komponente)
3. Rezervacijski API (POST /api/reservations → status "pending")
4. Admin login (Google OAuth + email whitelist)
5. Admin: Rezervacije (list, filtri, potrdi/zavrni flow)
6. Google Calendar sync (dogodek v OBA koledarja pri potrditvi)
7. Admin: Paketi (edit cene, features, badge, active toggle)
8. Admin: Extras (dodatne možnosti)
9. Admin: Galerija (upload do 10 slik na projekt, Vercel Blob)
10. Admin: Besedila (hero, FAQ, bonus banner, kontakt)
11. Admin: Nastavitve (telefon, email, delovni čas)
12. iCal feed backup
13. Mobilna optimizacija
14. Backup rutina (mesečni Neon export)

## Deploy strategija
- `main` = coming soon (produkcija)
- `nextjs-migration` = razvoj (Vercel preview URL)
- Ko je vse testirano → merge v main = zamenjava
