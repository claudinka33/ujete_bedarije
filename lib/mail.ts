import type { Reservation } from './queries';
import { sql } from './db';

/**
 * Email helpers. All functions are no-ops (just log) when
 * RESEND_API_KEY is missing, so the app keeps working during the
 * phase when Resend hasn't been set up yet.
 */

const FROM = process.env.MAIL_FROM || 'Ujete Bedarije <rezervacije@ujetebedarije.si>';
const REPLY_TO = process.env.MAIL_REPLY_TO || 'ujete.bedarije@gmail.com';
const STAFF_NOTIFY = (process.env.STAFF_NOTIFY_EMAILS ||
  'szekar14@gmail.com,stanislavzekar@gmail.com')
  .split(',').map((e) => e.trim()).filter(Boolean);

// -------------------------------------------------------------------
// TEMPLATE SETTINGS — editable by staff via /admin/mail
// -------------------------------------------------------------------

/** Keys of mail-template settings rows the admin can edit. */
export const MAIL_TEMPLATE_KEYS = [
  'mail_received_subject',
  'mail_received_body',
  'mail_received_whatsnext',
  'mail_received_closing',
  'mail_new_reservation_subject',
  'mail_new_reservation_body',
  'mail_approved_subject',
  'mail_approved_body',
  'mail_approved_whatsnext',
  'mail_approved_closing',
  'mail_rejected_subject',
  'mail_rejected_body',
  'mail_rejected_closing',
] as const;
export type MailTemplateKey = (typeof MAIL_TEMPLATE_KEYS)[number];

/** Hard-coded fallbacks, used when settings table has no value for a key. */
const DEFAULTS: Record<MailTemplateKey, string> = {
  mail_received_subject: 'Prejeli smo vaše povpraševanje ✓ · {{datum}}',
  mail_received_body:
    'Pozdravljeni {{ime}},\nhvala za vaše povpraševanje za photo booth. Spodaj je povzetek podatkov, ki ste jih poslali.',
  mail_received_whatsnext:
    'V 24 urah vam bomo poslali potrditev ali predlog alternativnega termina.\n' +
    'Rezervacija NI dokončna, dokler ne prejmete potrditvenega maila.\n' +
    'Za vprašanja smo na voljo na {{email_kontakt}} ali 030 654 002.',
  mail_received_closing: 'Hvala za zaupanje!\nEkipa Ujete Bedarije',

  mail_new_reservation_subject: 'Nova rezervacija: {{polno_ime}} · {{datum}}',
  mail_new_reservation_body:
    'Stranka je oddala rezervacijo preko spletne strani. Pregled podatkov spodaj — v CMS lahko potrdite ali zavrnete.',
  mail_approved_subject: 'Vaša rezervacija je potrjena ✓ · {{datum}}',
  mail_approved_body:
    'Pozdravljeni {{ime}},\nz veseljem potrjujemo vašo rezervacijo photo booth-a. Veselimo se dogodka!',
  mail_approved_whatsnext:
    'Dan pred dogodkom vas pokličemo za potrditev časa in natančnega naslova.\n' +
    'Prihod je brezplačen znotraj Slovenije.\n' +
    'Če želite kaj spremeniti, nam pišite na {{email_kontakt}}.',
  mail_approved_closing: 'Hvala za zaupanje!\nEkipa Ujete Bedarije',
  mail_rejected_subject: 'Rezervacija ni mogoča · {{datum}}',
  mail_rejected_body:
    'Pozdravljeni {{ime}},\nhvala za vaše zanimanje. Za {{datum}} žal nismo prosti.',
  mail_rejected_closing:
    'Če želite preveriti kakšen drug termin, nam pišite ali pokličite — z veseljem najdemo rešitev.\n\nEkipa Ujete Bedarije',
};

export async function getMailTemplates(): Promise<Record<MailTemplateKey, string>> {
  try {
    const rows = (await sql`
      SELECT key, value FROM settings WHERE key = ANY(${MAIL_TEMPLATE_KEYS as unknown as string[]})
    `) as Array<{ key: string; value: string }>;
    const result = { ...DEFAULTS };
    for (const r of rows) {
      if ((MAIL_TEMPLATE_KEYS as readonly string[]).includes(r.key) && r.value) {
        result[r.key as MailTemplateKey] = r.value;
      }
    }
    return result;
  } catch (err) {
    console.error('[mail] getMailTemplates failed, using defaults:', err);
    return { ...DEFAULTS };
  }
}

/** Replace {{variable}} placeholders in a template string. */
function substitute(template: string, vars: Record<string, string>): string {
  return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, name) => {
    return vars[name] !== undefined ? vars[name] : `{{${name}}}`;
  });
}

/** Convert plain-text (with \n line-breaks) to safe HTML with <br> tags. */
function textToHtml(text: string): string {
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  return escaped.replace(/\n/g, '<br>');
}

/** Build the variable map from a reservation. */
function reservationVars(r: Reservation): Record<string, string> {
  return {
    ime: r.customer_name.split(' ')[0] || r.customer_name,
    polno_ime: r.customer_name,
    datum: fmtDate(r.event_date),
    ura: r.event_time ? r.event_time.slice(0, 5) : '',
    lokacija: r.event_location || '',
    tip_dogodka: r.event_type || '',
    paket: r.package_name_snapshot || '',
    razlog: r.rejection_reason || '',
    email_kontakt: REPLY_TO,
  };
}

interface SendArgs {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}

async function send(args: SendArgs): Promise<{ ok: boolean; error?: string }> {
  if (!process.env.RESEND_API_KEY) {
    console.log('[mail] RESEND_API_KEY not set — skipping send:', args.subject, '→', args.to);
    return { ok: false, error: 'RESEND_API_KEY not configured' };
  }
  try {
    const { Resend } = await import('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { data, error } = await resend.emails.send({
      from: FROM,
      to: args.to,
      subject: args.subject,
      html: args.html,
      replyTo: args.replyTo || REPLY_TO,
    });
    if (error) {
      console.error('[mail] Resend error:', error);
      return { ok: false, error: error.message };
    }
    console.log('[mail] Sent:', args.subject, '→', args.to, 'id:', data?.id);
    return { ok: true };
  } catch (err) {
    console.error('[mail] Exception:', err);
    return { ok: false, error: err instanceof Error ? err.message : 'send failed' };
  }
}

// -------------------------------------------------------------------
// SHARED PIECES
// -------------------------------------------------------------------

function fmtDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('sl-SI', {
      day: 'numeric', month: 'long', year: 'numeric',
    });
  } catch { return iso; }
}

function fmtPrice(n: number | null | undefined): string {
  if (n === null || n === undefined) return '—';
  return `${Number(n).toFixed(0)} €`;
}

function wrap(bodyHtml: string, title: string): string {
  return `<!doctype html>
<html lang="sl">
<head>
<meta charset="utf-8">
<title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#f5efe8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;color:#1c1a17;line-height:1.5;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.06);">
        <tr><td style="padding:28px 32px 0 32px;">
          <div style="font-size:14px;color:#8a7f70;letter-spacing:.08em;text-transform:uppercase;font-weight:600;">Ujete Bedarije</div>
          <div style="font-size:12px;color:#a3998b;">Photo Booth Slovenija</div>
        </td></tr>
        <tr><td style="padding:16px 32px 32px 32px;">
          ${bodyHtml}
        </td></tr>
        <tr><td style="padding:20px 32px;background:#faf6f1;border-top:1px solid #ece6dc;font-size:12px;color:#8a7f70;text-align:center;">
          <a href="https://www.ujetebedarije.si" style="color:#8a7f70;text-decoration:none;">ujetebedarije.si</a>
          &nbsp;·&nbsp;
          <a href="mailto:ujete.bedarije@gmail.com" style="color:#8a7f70;text-decoration:none;">ujete.bedarije@gmail.com</a>
          &nbsp;·&nbsp;
          <a href="tel:+38630654002" style="color:#8a7f70;text-decoration:none;">030 654 002</a>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function detailsBlock(r: Partial<Reservation>): string {
  const extras = Array.isArray(r.extras_snapshot) ? r.extras_snapshot : [];
  const extrasRows = extras.length
    ? extras.map((e) => `<tr><td style="padding:4px 0;color:#5a5248;">• ${e.name}</td><td style="padding:4px 0;text-align:right;">${fmtPrice(e.price)}</td></tr>`).join('')
    : '';

  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:16px;border-collapse:collapse;">
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #ece6dc;color:#8a7f70;font-size:13px;">Stranka</td>
        <td style="padding:10px 0;border-bottom:1px solid #ece6dc;text-align:right;font-weight:600;">${r.customer_name || ''}</td>
      </tr>
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #ece6dc;color:#8a7f70;font-size:13px;">Email</td>
        <td style="padding:10px 0;border-bottom:1px solid #ece6dc;text-align:right;"><a href="mailto:${r.customer_email}" style="color:#1c1a17;">${r.customer_email || ''}</a></td>
      </tr>
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #ece6dc;color:#8a7f70;font-size:13px;">Telefon</td>
        <td style="padding:10px 0;border-bottom:1px solid #ece6dc;text-align:right;"><a href="tel:${r.customer_phone}" style="color:#1c1a17;">${r.customer_phone || ''}</a></td>
      </tr>
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #ece6dc;color:#8a7f70;font-size:13px;">Datum &amp; ura</td>
        <td style="padding:10px 0;border-bottom:1px solid #ece6dc;text-align:right;font-weight:600;">${r.event_date ? fmtDate(r.event_date) : ''}${r.event_time ? ` · ${r.event_time}` : ''}</td>
      </tr>
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #ece6dc;color:#8a7f70;font-size:13px;">Lokacija</td>
        <td style="padding:10px 0;border-bottom:1px solid #ece6dc;text-align:right;">${r.event_location || ''}</td>
      </tr>
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #ece6dc;color:#8a7f70;font-size:13px;">Tip dogodka</td>
        <td style="padding:10px 0;border-bottom:1px solid #ece6dc;text-align:right;">${r.event_type || ''}</td>
      </tr>
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #ece6dc;color:#8a7f70;font-size:13px;">Paket</td>
        <td style="padding:10px 0;border-bottom:1px solid #ece6dc;text-align:right;font-weight:600;">${r.package_name_snapshot || ''} ${r.package_price_snapshot ? `(${fmtPrice(r.package_price_snapshot)})` : ''}</td>
      </tr>
      ${extrasRows ? `<tr><td colspan="2" style="padding:10px 0 4px 0;color:#8a7f70;font-size:13px;">Dodatki</td></tr>${extrasRows}` : ''}
      ${r.frame_text ? `<tr><td style="padding:10px 0;border-top:1px solid #ece6dc;color:#8a7f70;font-size:13px;">Napis na okvirju</td><td style="padding:10px 0;border-top:1px solid #ece6dc;text-align:right;">${r.frame_text}</td></tr>` : ''}
      ${r.notes ? `<tr><td colspan="2" style="padding:10px 0;border-top:1px solid #ece6dc;color:#8a7f70;font-size:13px;">Opombe stranke:<br><span style="color:#1c1a17;">${r.notes}</span></td></tr>` : ''}
    </table>
  `;
}

// -------------------------------------------------------------------
// 0) RECEIVED → CUSTOMER (fired immediately on form submission)
// -------------------------------------------------------------------
export async function buildReceivedCustomerEmail(
  reservation: Reservation,
  overrides?: Partial<Record<MailTemplateKey, string>>
): Promise<{ subject: string; html: string }> {
  const t = await getMailTemplates();
  const merged = { ...t, ...(overrides || {}) };
  const vars = reservationVars(reservation);
  const subject = substitute(merged.mail_received_subject, vars);
  const bodyText = substitute(merged.mail_received_body, vars);
  const whatsnextText = substitute(merged.mail_received_whatsnext, vars);
  const closingText = substitute(merged.mail_received_closing, vars);

  const whatsnextItems = whatsnextText.split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => `• ${textToHtml(l)}`)
    .join('<br>');

  const html = wrap(`
    <div style="display:inline-block;padding:6px 14px;background:#e8f0f7;color:#1f4e7a;border-radius:999px;font-size:12px;font-weight:600;letter-spacing:.04em;text-transform:uppercase;">Prejeto</div>
    <h1 style="margin:12px 0 8px 0;font-size:22px;font-weight:700;">Prejeli smo vaše povpraševanje</h1>
    <p style="margin:0;color:#5a5248;">${textToHtml(bodyText)}</p>
    ${detailsBlock(reservation)}
    <div style="margin-top:24px;padding:16px;background:#faf6f1;border-radius:8px;font-size:14px;color:#5a5248;">
      <strong>Kaj sledi?</strong><br>
      ${whatsnextItems}
    </div>
    <p style="margin:24px 0 0 0;color:#5a5248;">${textToHtml(closingText)}</p>
  `, subject);
  return { subject, html };
}

export async function mailReceivedToCustomer(reservation: Reservation) {
  const { subject, html } = await buildReceivedCustomerEmail(reservation);
  return send({
    to: reservation.customer_email,
    subject,
    html,
  });
}

// -------------------------------------------------------------------
// 1) NEW RESERVATION → STAFF
// -------------------------------------------------------------------
export async function buildNewReservationStaffEmail(
  reservation: Reservation,
  overrides?: Partial<Record<MailTemplateKey, string>>
): Promise<{ subject: string; html: string }> {
  const t = await getMailTemplates();
  const merged = { ...t, ...(overrides || {}) };
  const vars = reservationVars(reservation);
  const subject = substitute(merged.mail_new_reservation_subject, vars);
  const bodyText = substitute(merged.mail_new_reservation_body, vars);
  const html = wrap(`
    <h1 style="margin:0 0 8px 0;font-size:22px;font-weight:700;">Nova rezervacija</h1>
    <p style="margin:0;color:#5a5248;">${textToHtml(bodyText)}</p>
    ${detailsBlock(reservation)}
    <div style="margin-top:24px;text-align:center;">
      <a href="https://www.ujetebedarije.si/admin/rezervacije/${reservation.id}"
         style="display:inline-block;padding:12px 24px;background:#1c1a17;color:#fdfaf4;text-decoration:none;border-radius:999px;font-weight:600;font-size:14px;">
         Odpri v CMS →
      </a>
    </div>
  `, subject);
  return { subject, html };
}

export async function mailNewReservationToStaff(reservation: Reservation) {
  const { subject, html } = await buildNewReservationStaffEmail(reservation);
  return send({
    to: STAFF_NOTIFY,
    subject,
    html,
    replyTo: reservation.customer_email,
  });
}

// -------------------------------------------------------------------
// 2) APPROVED → CUSTOMER
// -------------------------------------------------------------------
export async function buildApprovedCustomerEmail(
  reservation: Reservation,
  overrides?: Partial<Record<MailTemplateKey, string>>
): Promise<{ subject: string; html: string }> {
  const t = await getMailTemplates();
  const merged = { ...t, ...(overrides || {}) };
  const vars = reservationVars(reservation);
  const subject = substitute(merged.mail_approved_subject, vars);
  const bodyText = substitute(merged.mail_approved_body, vars);
  const whatsnextText = substitute(merged.mail_approved_whatsnext, vars);
  const closingText = substitute(merged.mail_approved_closing, vars);

  // Convert "whatsnext" lines into bulleted list
  const whatsnextItems = whatsnextText.split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => `• ${textToHtml(l)}`)
    .join('<br>');

  const html = wrap(`
    <div style="display:inline-block;padding:6px 14px;background:#e9f5ec;color:#1b5a2a;border-radius:999px;font-size:12px;font-weight:600;letter-spacing:.04em;text-transform:uppercase;">Potrjeno</div>
    <h1 style="margin:12px 0 8px 0;font-size:22px;font-weight:700;">Vaša rezervacija je potrjena!</h1>
    <p style="margin:0;color:#5a5248;">${textToHtml(bodyText)}</p>
    ${detailsBlock(reservation)}
    <div style="margin-top:24px;padding:16px;background:#faf6f1;border-radius:8px;font-size:14px;color:#5a5248;">
      <strong>Kaj zdaj?</strong><br>
      ${whatsnextItems}
    </div>
    <p style="margin:24px 0 0 0;color:#5a5248;">${textToHtml(closingText)}</p>
  `, subject);
  return { subject, html };
}

export async function mailApprovedToCustomer(reservation: Reservation) {
  const { subject, html } = await buildApprovedCustomerEmail(reservation);
  return send({
    to: reservation.customer_email,
    subject,
    html,
  });
}

// -------------------------------------------------------------------
// 3) REJECTED → CUSTOMER
// -------------------------------------------------------------------
export async function buildRejectedCustomerEmail(
  reservation: Reservation,
  overrides?: Partial<Record<MailTemplateKey, string>>
): Promise<{ subject: string; html: string }> {
  const t = await getMailTemplates();
  const merged = { ...t, ...(overrides || {}) };
  const vars = reservationVars(reservation);
  const subject = substitute(merged.mail_rejected_subject, vars);
  const bodyText = substitute(merged.mail_rejected_body, vars);
  const closingText = substitute(merged.mail_rejected_closing, vars);

  const reasonBlock = reservation.rejection_reason
    ? `<div style="margin:16px 0;padding:14px;background:#faf6f1;border-left:3px solid #d4a5a5;border-radius:4px;color:#5a5248;font-style:italic;">${textToHtml(reservation.rejection_reason)}</div>`
    : '';

  const html = wrap(`
    <h1 style="margin:0 0 8px 0;font-size:22px;font-weight:700;">Žal rezervacija ni mogoča</h1>
    <p style="margin:0;color:#5a5248;">${textToHtml(bodyText)}</p>
    ${reasonBlock}
    <p style="margin:16px 0;color:#5a5248;">${textToHtml(closingText)}</p>
    <div style="margin-top:24px;text-align:center;">
      <a href="https://www.ujetebedarije.si"
         style="display:inline-block;padding:12px 24px;background:#1c1a17;color:#fdfaf4;text-decoration:none;border-radius:999px;font-weight:600;font-size:14px;">
         Nova rezervacija →
      </a>
    </div>
  `, subject);
  return { subject, html };
}

export async function mailRejectedToCustomer(reservation: Reservation) {
  const { subject, html } = await buildRejectedCustomerEmail(reservation);
  return send({
    to: reservation.customer_email,
    subject,
    html,
  });
}
