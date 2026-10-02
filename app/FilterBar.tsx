 'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Must match the region names used in your Post listing form.
const REGIONS = [
  'Addis Ababa',
  'Oromia',
  'Somali',
  'Amhara',
  'Tigray',
  'Afar',
  'Sidama',
  'South Ethiopia',
  'Dire Dawa',
  'Harari',
];

type Props = {
  region: string;
  minPrice: string;
  maxPrice: string;
  brand: string;
  availableBrands: string[];
};

export default function FilterBar({ region, minPrice, maxPrice, brand, availableBrands }: Props) {
  const router = useRouter();
  const [priceOpen, setPriceOpen] = useState(false);
  const [min, setMin] = useState(minPrice);
  const [max, setMax] = useState(maxPrice);

  // Keep every other setting in the address (category, subcategory, search...) and change only these
  function update(changes: Record<string, string>) {
    const params = new URLSearchParams(window.location.search);
    for (const [key, value] of Object.entries(changes)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    const qs = params.toString();
    router.push(qs ? `/?${qs}` : '/');
  }

  const anyActive = !!(region || minPrice || maxPrice || brand);
  const priceActive = !!(minPrice || maxPrice);

  const pill =
    'shrink-0 rounded-full border bg-white px-4 py-2 text-sm font-semibold';
  const on = 'border-amber text-amberDeep';
  const off = 'border-line text-ink';

  return (
    <div className="mb-4">
      <div className="flex gap-2 overflow-x-auto pb-1">
        <select
          value={region}
          onChange={(e) => update({ region: e.target.value })}
          className={`${pill} ${region ? on : off}`}
        >
          <option value="">Region</option>
          {REGIONS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={() => setPriceOpen((o) => !o)}
          className={`${pill} ${priceActive ? on : off}`}
        >
          Price, ETB ▾
        </button>

        {availableBrands.length > 0 && (
          <select
            value={brand}
            onChange={(e) => update({ brand: e.target.value })}
            className={`${pill} ${brand ? on : off}`}
          >
            <option value="">Brand</option>
            {availableBrands.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        )}

        {anyActive && (
          <button
            type="button"
            onClick={() => {
              setMin('');
              setMax('');
              setPriceOpen(false);
              update({ region: '', minPrice: '', maxPrice: '', brand: '' });
            }}
            className={`${pill} border-line text-muted`}
          >
            Clear
          </button>
        )}
      </div>

      {priceOpen && (
        <div className="mt-2 flex items-center gap-2 rounded-lg border border-line bg-white p-3">
          <input
            type="number"
            inputMode="numeric"
            placeholder="Min"
            value={min}
            onChange={(e) => setMin(e.target.value)}
            className="w-full rounded border border-line px-3 py-2 text-sm"
          />
          <span className="text-muted">–</span>
          <input
            type="number"
            inputMode="numeric"
            placeholder="Max"
            value={max}
            onChange={(e) => setMax(e.target.value)}
            className="w-full rounded border border-line px-3 py-2 text-sm"
          />
          <button
            type="button"
            onClick={() => {
              update({ minPrice: min, maxPrice: max });
              setPriceOpen(false);
            }}
            className="rounded bg-amber px-4 py-2 text-sm font-bold text-ink"
          >
            Apply
          </button>
        </div>
      )}
    </div>
  );
}
