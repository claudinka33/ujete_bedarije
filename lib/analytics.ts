/**
 * Client-side analytics helpers. Safe to call anywhere — they no-op
 * when the analytics scripts aren't loaded (SSR, blocked by adblock,
 * missing env vars). Both GA4 and Meta Pixel fire for each event.
 */

type GtagFn = (...args: unknown[]) => void;
type FbqFn = (...args: unknown[]) => void;

declare global {
  interface Window {
    gtag?: GtagFn;
    fbq?: FbqFn;
  }
}

function safeGtag(...args: unknown[]) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    try { window.gtag(...args); } catch { /* ignore */ }
  }
}

function safeFbq(...args: unknown[]) {
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    try { window.fbq(...args); } catch { /* ignore */ }
  }
}

/** Page view — Next App Router doesn't auto-track SPA navigations, so call this on route changes if needed. */
export function trackPageView(url: string) {
  safeGtag('event', 'page_view', { page_path: url });
  safeFbq('track', 'PageView');
}

/** User looked at a specific package card (e.g. opened booking from it) */
export function trackViewPackage(pkg: { name: string; price: number }) {
  safeGtag('event', 'view_item', {
    currency: 'EUR',
    value: pkg.price,
    items: [{ item_name: pkg.name, price: pkg.price }],
  });
  safeFbq('track', 'ViewContent', {
    content_name: pkg.name,
    content_category: 'package',
    value: pkg.price,
    currency: 'EUR',
  });
}

/** User opened the booking modal (begin_checkout equivalent) */
export function trackBeginBooking(pkg?: { name: string; price: number }) {
  safeGtag('event', 'begin_checkout', {
    currency: 'EUR',
    value: pkg?.price,
    items: pkg ? [{ item_name: pkg.name, price: pkg.price }] : [],
  });
  safeFbq('track', 'InitiateCheckout', {
    content_name: pkg?.name,
    value: pkg?.price,
    currency: 'EUR',
  });
}

/** User submitted a reservation form — a Lead for the business. */
export function trackReservationSubmit(payload: {
  packageName: string;
  packagePrice: number | null;
  eventType?: string;
}) {
  safeGtag('event', 'generate_lead', {
    currency: 'EUR',
    value: payload.packagePrice ?? 0,
    items: [{ item_name: payload.packageName, price: payload.packagePrice ?? 0 }],
    event_type: payload.eventType,
  });
  safeFbq('track', 'Lead', {
    content_name: payload.packageName,
    value: payload.packagePrice ?? 0,
    currency: 'EUR',
  });
  // Also log a conversion-flavored name for GA4 funnel readability
  safeGtag('event', 'reservation_submitted', {
    package: payload.packageName,
    value: payload.packagePrice ?? 0,
  });
}

/** User clicked "Call" link */
export function trackPhoneClick() {
  safeGtag('event', 'contact_phone');
  safeFbq('track', 'Contact');
}

/** User clicked "Email" link */
export function trackEmailClick() {
  safeGtag('event', 'contact_email');
  safeFbq('track', 'Contact');
}
