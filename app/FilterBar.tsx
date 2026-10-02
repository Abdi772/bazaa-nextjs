'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ETHIOPIA_REGIONS } from '@/lib/categories';

const BUDGET_RANGES = [
  { label: 'Under 10K', min: '', max: '10000' },
  { label: '10K - 25K', min: '10000', max: '25000' },
  { label: '25K - 50K', min: '25000', max: '50000' },
  { label: '50K - 100K', min: '50000', max: '100000' },
  { label: '100K - 250K', min: '100000', max: '250000' },
  { label: '250K+', min: '250000', max: '' },
];

export default function FilterBar({
  region,
  minPrice,
  maxPrice,
  brand,
  availableBrands,
}: {
  region: string;
  minPrice: string;
  maxPrice: string;
  brand: string;
  availableBrands: string[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`/?${params.toString()}`);
  }

  function setBudget(min: string, max: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (min) params.set('minPrice', min); else params.delete('minPrice');
    if (max) params.set('maxPrice', max); else params.delete('maxPrice');
    router.push(`/?${params.toString()}`);
  }

  const activeBudget = BUDGET_RANGES.find((r) => r.min === minPrice && r.max === maxPrice);

  return (
    <div className="mb-4">
      {/* Quick budget chips */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-2 -mx-1 px-1">
        <button
          onClick={() => setBudget('', '')}
          className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold border ${
            !minPrice && !maxPrice ? 'bg-ink text-paper border-ink' : 'bg-white text-ink border-line'
          }`}
        >
          Any budget
        </button>
        {BUDGET_RANGES.map((r) => (
          <button
            key={r.label}
            onClick={() => setBudget(r.min, r.max)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold border ${
              activeBudget?.label === r.label ? 'bg-amber text-ink border-amber' : 'bg-white text-ink border-line'
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      {/* Dropdown filters */}
      <div className="flex gap-2 flex-wrap">
        <select
          value={region}
          onChange={(e) => updateParam('region', e.target.value)}
          className="border border-line rounded px-3 py-2 text-sm bg-white"
        >
          <option value="">All regions</option>
          {ETHIOPIA_REGIONS.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>

        {availableBrands.length > 0 && (
          <select
            value={brand}
            onChange={(e) => updateParam('brand', e.target.value)}
            className="border border-line rounded px-3 py-2 text-sm bg-white"
          >
            <option value="">All brands</option>
            {availableBrands.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
            }
