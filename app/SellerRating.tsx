 'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { adjustedRating, MIN_REVIEWS } from '../lib/rating';

export default function SellerRating({ sellerId }: { sellerId: string }) {
  const [stats, setStats] = useState<{ sum: number; count: number } | null>(null);

  useEffect(() => {
    supabase
      .from('reviews')
      .select('rating')
      .eq('seller_id', sellerId)
      .then(({ data }) => {
        const rows = (data as { rating: number }[]) || [];
        setStats({
          count: rows.length,
          sum: rows.reduce((s, r) => s + r.rating, 0),
        });
      });
  }, [sellerId]);

  if (!stats) return <div className="mt-1 h-4" />;

  if (stats.count >= MIN_REVIEWS) {
    return (
      <div className="mt-1 text-xs font-semibold text-fg">
        <span className="text-amberText">★</span>{' '}
        {adjustedRating(stats.sum, stats.count).toFixed(1)}{' '}
        <span className="font-normal text-muted">({stats.count} reviews)</span>
      </div>
    );
  }

  return (
    <div className="mt-1 text-xs text-muted">
      New seller
      {stats.count > 0
        ? ` · ${stats.count} ${stats.count === 1 ? 'review' : 'reviews'}`
        : ''}
    </div>
  );
}
