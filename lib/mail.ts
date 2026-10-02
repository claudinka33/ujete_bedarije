import type { Reservation } from './queries';

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
// 1) NEW RESERVATION → STAFF (Anita + Stane)
// -------------------------------------------------------------------
export function buildNewReservationStaffEmail(reservation: Reservation): {
  subject: string; html: string;
} {
  const subject = `Nova rezervacija: ${reservation.customer_name} · ${fmtDate(reservation.event_date)}`;
  const html = wrap(`
    <h1 style="margin:0 0 8px 0;font-size:22px;font-weight:700;">Nova rezervacija</h1>
    <p style="margin:0;color:#5a5248;">Stranka je oddala rezervacijo preko spletne strani. Pregled podatkov spodaj — v CMS lahko potrdiš ali zavrneš.</p>
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
  const { subject, html } = buildNewReservationStaffEmail(reservation);
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
export function buildApprovedCustomerEmail(reservation: Reservation): {
  subject: string; html: string;
} {
  const subject = `Vaša rezervacija je potrjena ✓ · ${fmtDate(reservation.event_date)}`;
  const html = wrap(`
    <div style="display:inline-block;padding:6px 14px;background:#e9f5ec;color:#1b5a2a;border-radius:999px;font-size:12px;font-weight:600;letter-spacing:.04em;text-transform:uppercase;">Potrjeno</div>
    <h1 style="margin:12px 0 8px 0;font-size:22px;font-weight:700;">Vaša rezervacija je potrjena!</h1>
    <p style="margin:0;color:#5a5248;">
      Pozdravljeni ${reservation.customer_name.split(' ')[0]},<br>
      z veseljem potrjujemo vašo rezervacijo photo booth-a. Veselimo se dogodka!
    </p>
    ${detailsBlock(reservation)}
    <div style="margin-top:24px;padding:16px;background:#faf6f1;border-radius:8px;font-size:14px;color:#5a5248;">
      <strong>Kaj zdaj?</strong><br>
      • Dan pred dogodkom vas pokličemo za potrditev časa in natančnega naslova.<br>
      • Prihod je <strong>brezplačen</strong> znotraj Slovenije.<br>
      • Če želite kaj spremeniti, nam pišite na <a href="mailto:ujete.bedarije@gmail.com" style="color:#1c1a17;">ujete.bedarije@gmail.com</a>.
    </div>
    <p style="margin:24px 0 0 0;color:#5a5248;">
      Hvala za zaupanje!<br>
      <strong>Ekipa Ujete Bedarije</strong>
    </p>
  `, subject);
  return { subject, html };
}

export async function mailApprovedToCustomer(reservation: Reservation) {
  const { subject, html } = buildApprovedCustomerEmail(reservation);
  return send({
    to: reservation.customer_email,
    subject,
    html,
  });
}

// -------------------------------------------------------------------
// 3) REJECTED → CUSTOMER
// -------------------------------------------------------------------
export function buildRejectedCustomerEmail(reservation: Reservation): {
  subject: string; html: string;
} {
  const subject = `Rezervacija ni mogoča · ${fmtDate(reservation.event_date)}`;
  const reasonBlock = reservation.rejection_reason
    ? `<div style="margin:16px 0;padding:14px;background:#faf6f1;border-left:3px solid #d4a5a5;border-radius:4px;color:#5a5248;font-style:italic;">${reservation.rejection_reason}</div>`
    : '';

  const html = wrap(`
    <h1 style="margin:0 0 8px 0;font-size:22px;font-weight:700;">Žal rezervacija ni mogoča</h1>
    <p style="margin:0;color:#5a5248;">
      Pozdravljeni ${reservation.customer_name.split(' ')[0]},<br>
      hvala za vaše zanimanje. Za <strong>${fmtDate(reservation.event_date)}</strong> žal nismo prosti.
    </p>
    ${reasonBlock}
    <p style="margin:16px 0;color:#5a5248;">
      Če želite preveriti kakšen drug termin, nam pišite ali pokličite — z veseljem najdemo rešitev.
    </p>
    <div style="margin-top:24px;text-align:center;">
      <a href="https://www.ujetebedarije.si"
         style="display:inline-block;padding:12px 24px;background:#1c1a17;color:#fdfaf4;text-decoration:none;border-radius:999px;font-weight:600;font-size:14px;">
         Nova rezervacija →
      </a>
    </div>
    <p style="margin:24px 0 0 0;color:#5a5248;">
      <strong>Ekipa Ujete Bedarije</strong>
    </p>
  `, subject);
  return { subject, html };
}

export async function mailRejectedToCustomer(reservation: Reservation) {
  const { subject, html } = buildRejectedCustomerEmail(reservation);
  return send({
    to: reservation.customer_email,
    subject,
    html,
  });
}
