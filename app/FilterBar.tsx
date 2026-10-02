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

type Option = { name: string; count: number };

type Props = {
  region: string;
  minPrice: string;
  maxPrice: string;
  brand: string;
  subcategory: string;
  brandOptions: Option[];
  typeOptions: Option[];
};

function adsLabel(n: number) {
  return `${n} ${n === 1 ? 'ad' : 'ads'}`;
}

export default function FilterBar({
  region,
  minPrice,
  maxPrice,
  brand,
  subcategory,
  brandOptions,
  typeOptions,
}: Props) {
  const router = useRouter();
  const [priceOpen, setPriceOpen] = useState(false);
  const [min, setMin] = useState(minPrice);
  const [max, setMax] = useState(maxPrice);
  const [sheet, setSheet] = useState<null | 'brand' | 'type'>(null);
  const [search, setSearch] = useState('');

  // Keep every other setting in the address and change only these
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

  const pill = 'shrink-0 rounded-full border bg-white px-4 py-2 text-sm font-semibold';
  const on = 'border-amber text-amberDeep';
  const off = 'border-line text-ink';
  const row =
    'flex w-full items-center justify-between border-b border-line px-4 py-4 text-left';

  // Brand list: search, Popular (first 5), Other (A to Z, "Other" last)
  const q = search.trim().toLowerCase();
  const filtered = brandOptions.filter((o) => o.name.toLowerCase().includes(q));
  const popular = q ? [] : brandOptions.filter((o) => o.name !== 'Other').slice(0, 5);
  const rest = filtered
    .filter((o) => !popular.includes(o))
    .sort((a, b) =>
      a.name === 'Other' ? 1 : b.name === 'Other' ? -1 : a.name.localeCompare(b.name)
    );

  function pickBrand(name: string) {
    update({ brand: name });
    setSheet(null);
    setSearch('');
  }

  function brandRow(o: Option) {
    return (
      <button key={o.name} type="button" onClick={() => pickBrand(o.name)} className={row}>
        <span className={o.name === brand ? 'font-bold text-amberDeep' : 'text-ink'}>
          {o.name} <span className="text-sm font-normal text-muted">• {adsLabel(o.count)}</span>
        </span>
        {o.name === brand && <span className="text-amberDeep">✓</span>}
      </button>
    );
  }

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

        {typeOptions.length > 0 && (
          <button
            type="button"
            onClick={() => setSheet('type')}
            className={`${pill} ${subcategory ? on : off}`}
          >
            {subcategory || 'Type'} ▾
          </button>
        )}

        {brandOptions.length > 0 && (
          <button
            type="button"
            onClick={() => setSheet('brand')}
            className={`${pill} ${brand ? on : off}`}
          >
            {brand || 'Brand'} ▾
          </button>
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

      {/* Type: bottom sheet */}
      {sheet === 'type' && (
        <div
          className="fixed inset-0 z-[60] flex items-end bg-black/50"
          onClick={() => setSheet(null)}
        >
          <div
            className="max-h-[70vh] w-full overflow-y-auto rounded-t-2xl bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b border-line px-4 py-4 text-lg font-bold text-amberDeep">
              Type
            </div>
            {typeOptions.map((o) => (
              <button
                key={o.name}
                type="button"
                onClick={() => {
                  update({ subcategory: o.name, brand: '' });
                  setSheet(null);
                }}
                className={row}
              >
                <span className={o.name === subcategory ? 'font-bold text-amberDeep' : 'text-ink'}>
                  {o.name}{' '}
                  <span className="text-sm font-normal text-muted">• {adsLabel(o.count)}</span>
                </span>
                {o.name === subcategory && <span className="text-amberDeep">✓</span>}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Brand: full-screen list with search */}
      {sheet === 'brand' && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-white">
          <div className="flex items-center gap-3 bg-ink p-3">
            <button
              type="button"
              onClick={() => {
                setSheet(null);
                setSearch('');
              }}
              className="px-2 text-2xl text-paper"
              aria-label="Back"
            >
              ‹
            </button>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Find Brand"
              className="w-full rounded px-3 py-2.5 text-sm text-ink"
            />
          </div>
          <div className="flex-1 overflow-y-auto">
            {brand && !q && (
              <button type="button" onClick={() => pickBrand('')} className={row}>
                <span className="font-semibold text-amberDeep">All brands</span>
              </button>
            )}
            {popular.length > 0 && (
              <>
                <div className="bg-[#E8EEF5] px-4 py-1.5 text-xs font-semibold uppercase text-muted">
                  Popular
                </div>
                {popular.map(brandRow)}
              </>
            )}
            {rest.length > 0 && (
              <>
                <div className="bg-[#E8EEF5] px-4 py-1.5 text-xs font-semibold uppercase text-muted">
                  {q ? 'Results' : 'Other'}
                </div>
                {rest.map(brandRow)}
              </>
            )}
            {filtered.length === 0 && (
              <div className="py-10 text-center text-muted">No brand found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
      }
