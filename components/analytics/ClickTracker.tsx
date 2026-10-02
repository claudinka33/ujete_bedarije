'use client';

import { useEffect } from 'react';
import {
  trackPhoneClick,
  trackEmailClick,
} from '@/lib/analytics';

/**
 * Delegated click listener for homepage anchors. Any element rendered
 * with a `data-track-event="<name>"` attribute will fire the matching
 * analytics event when clicked. This lets the server-rendered homepage
 * stay a Server Component.
 */
export default function ClickTracker() {
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const el = target?.closest<HTMLElement>('[data-track-event]');
      if (!el) return;
      const name = el.getAttribute('data-track-event');
      switch (name) {
        case 'contact_phone':
          trackPhoneClick();
          break;
        case 'contact_email':
          trackEmailClick();
          break;
        // Add more cases here as new data-track-event names appear
      }
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);
  return null;
}
