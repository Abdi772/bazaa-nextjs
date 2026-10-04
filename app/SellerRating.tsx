'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function SellerRating({ sellerId }: { sellerId: string }) {
  const [stats, setStats] = useState<{ avg: number; count: number } | null>(null);

  useEffect(() => {
    supabase
      .from('reviews')
      .select('rating')
      .eq('seller_id', sellerId)
      .then(({ data }) => {
        const rows = (data as { rating: number }[]) || [];
        const count = rows.length;
        setStats({
          count,
          avg: count ? rows.reduce((s, r) => s + r.rating, 0) / count : 0,
        });
      });
  }, [sellerId]);

  if (!stats) return <div className="mt-1 h-4" />;

  return stats.count > 0 ? (
    <div className="mt-1 text-xs font-semibold text-ink">
      <span className="text-amber">★</span> {stats.avg.toFixed(1)}{' '}
      <span className="font-normal text-muted">
        ({stats.count} {stats.count === 1 ? 'review' : 'reviews'})
      </span>
    </div>
  ) : (
    <div className="mt-1 text-xs text-muted">No reviews yet</div>
  );
        }
