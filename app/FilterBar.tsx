 'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ETHIOPIA_REGIONS, CONDITIONS } from '@/lib/categories';

const BUDGET_RANGES = [
  { label: 'Under 10K', min: '', max: '10000' },
  { label: '10K - 25K', min: '10000', max: '25000' },
  { label: '25K - 50K', min: '25000', max: '50000' },
  { label: '50K - 100K', min: '50000', max: '100000' },
  { label: '100K - 250K', min: '100000', max: '250000' },
  { label: '250K+', min: '250000', max: '' },
];

const SORT_OPTIONS = [
  { value: '', label: 'Sort: Newest' },
  { value: 'price_asc', label: 'Price: low to high' },
  { value: 'price_desc', label: 'Price: high to low' },
];

export default function FilterBar({
  region,
  minPrice,
  maxPrice,
  brand,
  condition,
  sort,
  availableBrands,
}: {
  region: string;
  minPrice: string;
  maxPrice: string;
  brand: string;
  condition: string;
  sort: string;
  availableBrands: string[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function go(params: URLSearchParams) {
    const qs = params.toString();
    router.push(qs ? `/?${qs}` : '/');
  }

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    go(params);
  }

  function setBudget(min: string, max: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (min) params.set('minPrice', min); else params.delete('minPrice');
    if (max) params.set('maxPrice', max); else params.delete('maxPrice');
    go(params);
  }

  function clearFilters() {
    const params = new URLSearchParams(searchParams.toString());
    ['region', 'minPrice', 'maxPrice', 'condition', 'sort'].forEach((k) => params.delete(k));
    go(params);
  }

  const activeBudget = BUDGET_RANGES.find((r) => r.min === minPrice && r.max === maxPrice);
  const anyActive = !!(region || minPrice || maxPrice || condition || sort);

  const pill = (active: boolean) =>
    `shrink-0 rounded-full border px-4 py-2 text-sm font-semibold ${
      active ? 'border-amber bg-amber/10 text-amberDeep' : 'border-line bg-white text-ink'
    }`;

  return (
    <div className="mb-4">
      {/* Quick budget chips */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-1 -mx-1 px-1">
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

      {/* One scrolling row of filters, like Jiji */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
        <select
          value={region}
          onChange={(e) => updateParam('region', e.target.value)}
          className={pill(!!region)}
        >
          <option value="">Region</option>
          {ETHIOPIA_REGIONS.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>

        {availableBrands.length > 0 && (
          <select
            value={brand}
            onChange={(e) => updateParam('brand', e.target.value)}
            className={pill(!!brand)}
          >
            <option value="">Brand</option>
            {availableBrands.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        )}

        <select
          value={condition}
          onChange={(e) => updateParam('condition', e.target.value)}
          className={pill(!!condition)}
        >
          <option value="">Condition</option>
          {CONDITIONS.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) => updateParam('sort', e.target.value)}
          className={pill(!!sort)}
        >
          {SORT_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>

        {anyActive && (
          <button
            onClick={clearFilters}
            className="shrink-0 rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-amberDeep underline"
          >
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
            }
