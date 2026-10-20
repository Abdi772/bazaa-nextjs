'use client';

import { useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

// Anonymous id for this browser tab session (used only to avoid double counting).
function sessionId(): string | null {
  try {
    let sid = sessionStorage.getItem('bazaa-sid');
    if (!sid) {
      sid =
        typeof crypto !== 'undefined' && 'randomUUID' in crypto
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      sessionStorage.setItem('bazaa-sid', sid);
    }
    return sid;
  } catch {
    return null;
  }
}

// Counts a view for "Trending". Renders nothing.
// - Only counts after 3 seconds on the page (quick bounces do not count).
// - Once per listing per browser session; the database also ignores repeats
//   within 30 minutes and the seller's own views.
export default function ViewTracker({ listingId }: { listingId: number }) {
  useEffect(() => {
    const key = `bazaa-viewed-${listingId}`;

    try {
      if (sessionStorage.getItem(key)) return;
    } catch {
      // storage blocked: continue, the database de-duplicates anyway
    }

    const timer = window.setTimeout(() => {
      try {
        sessionStorage.setItem(key, '1');
      } catch {
        // ignore
      }

      supabase
        .rpc('track_listing_view', {
          p_listing_id: listingId,
          p_session: sessionId(),
        })
        .then(({ error }) => {
          if (error) console.error('track_listing_view:', error.message);
        });
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [listingId]);

  return null;
}
