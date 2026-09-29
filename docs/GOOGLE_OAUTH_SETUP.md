# Google OAuth setup (za CMS prijavo)

Ta dokument je navodila za enkratno konfiguracijo Google OAuth,
da lahko Anita, Stane in Claudia pridejo v CMS.

## 1. Google Cloud Console

1. Pojdi na **[console.cloud.google.com](https://console.cloud.google.com)**
2. Ustvari nov projekt (ali uporabi obstoječega): `ujete-bedarije`
3. **APIs & Services → Credentials**
4. Klikni **+ Create Credentials → OAuth Client ID**
5. Če te vpraša za **OAuth consent screen**, izberi:
   - User Type: **External**
   - App name: `Ujete Bedarije CMS`
   - User support email: `ujete.bedarije@gmail.com`
   - Scope: pusti privzeto (email, profile, openid)
   - Test users: doda Anito, Staneta, Claudijo
   - **Publish app** (pomembno: sicer OAuth deluje samo 7 dni!)
6. Nazaj na **Credentials**, ustvari **OAuth Client ID** tipa **Web application**
7. **Authorized JavaScript origins**:
   ```
   https://www.ujetebedarije.si
   https://ujete-bedarije.vercel.app
   http://localhost:3000
   ```
8. **Authorized redirect URIs**:
   ```
   https://www.ujetebedarije.si/api/auth/callback/google
   https://ujete-bedarije.vercel.app/api/auth/callback/google
   http://localhost:3000/api/auth/callback/google
   ```
9. Klikni **Create** — dobiš:
   - `Client ID`
   - `Client secret`

## 2. Dodaj env vars v Vercel

Vercel dashboard → **ujete-bedarije** → **Settings** → **Environment Variables**:

| Key | Value | Env |
|-----|-------|-----|
| `AUTH_SECRET` | (generiraj: `openssl rand -base64 32`) | Production + Preview |
| `AUTH_GOOGLE_ID` | (Client ID iz koraka 1) | Production + Preview |
| `AUTH_GOOGLE_SECRET` | (Client secret iz koraka 1) | Production + Preview |

Potem **Redeploy** projekt (ali samo počakaj naslednji push).

## 3. Preizkusi

1. Pojdi na `https://tvoja-vercel-preview-url.vercel.app/admin`
2. Preusmeri te na `/admin/login`
3. Klikni **"Prijava z Google"**
4. Izberi svoj Google račun (mora biti na whitelist v `lib/whitelist.ts`)
5. Če uspešno, prideš v `/admin` dashboard

## Whitelist

V `lib/whitelist.ts`:
```ts
export const ADMIN_EMAILS = [
  'claudinka33@gmail.com',
  'szekar14@gmail.com',
  'stanislavzekar@gmail.com',
];
```

Če želiš dodati novega uporabnika: dodaj email v to datoteko + dodaj vrstico v `users` tabelo v Neonu.

## Kasneje: Google Calendar API

Ko bomo dodali sinhronizacijo koledarja:
1. V Google Cloud Console omogoči **Google Calendar API**
2. V `auth.ts` razširi scope:
   ```
   scope: 'openid email profile https://www.googleapis.com/auth/calendar.events'
   access_type: 'offline'
   prompt: 'consent'
   ```
3. Shrani `refresh_token` v `users.google_refresh_token`
4. Ustvari `lib/google-calendar.ts` z API klicem
