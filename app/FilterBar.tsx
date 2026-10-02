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

type Option = {
  name: string;
  count: number;
};

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
  const [sheet, setSheet] =
    useState<null | 'brand' | 'type'>(null);
  const [search, setSearch] = useState('');

  // Keep every other setting in the address
  // and change only the requested filter.
  function update(changes: Record<string, string>) {
    const params = new URLSearchParams(
      window.location.search
    );

    for (const [key, value] of Object.entries(changes)) {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    }

    const qs = params.toString();
    router.push(qs ? `/?${qs}` : '/');
  }

  const anyActive = !!(
    region ||
    minPrice ||
    maxPrice ||
    brand
  );

  const priceActive = !!(minPrice || maxPrice);

  const pill =
    'shrink-0 rounded-full border bg-white px-4 py-2 text-sm font-semibold transition-colors';

  const on =
    'border-amber bg-amberSoft text-amberDeep';

  const off =
    'border-line text-ink hover:border-amber hover:bg-amberSoft';

  const row =
    'flex w-full items-center justify-between border-b border-line px-4 py-4 text-left transition-colors hover:bg-amberSoft';

  // Brand search
  const q = search.trim().toLowerCase();

  const filtered = brandOptions.filter((o) =>
    o.name.toLowerCase().includes(q)
  );

  const popular = q
    ? []
    : brandOptions
        .filter((o) => o.name !== 'Other')
        .slice(0, 5);

  const rest = filtered
    .filter((o) => !popular.includes(o))
    .sort((a, b) =>
      a.name === 'Other'
        ? 1
        : b.name === 'Other'
          ? -1
          : a.name.localeCompare(b.name)
    );

  function pickBrand(name: string) {
    update({ brand: name });
    setSheet(null);
    setSearch('');
  }

  function brandRow(o: Option) {
    return (
      <button
        key={o.name}
        type="button"
        onClick={() => pickBrand(o.name)}
        className={row}
      >
        <span
          className={
            o.name === brand
              ? 'font-bold text-amberDeep'
              : 'text-ink'
          }
        >
          {o.name}{' '}
          <span className="text-sm font-normal text-muted">
            • {adsLabel(o.count)}
          </span>
        </span>

        {o.name === brand && (
          <span className="font-bold text-amberDeep">
            ✓
          </span>
        )}
      </button>
    );
  }

  return (
    <div className="mb-5">

      {/* =========================
          FILTER PILLS
      ========================= */}
      <div className="flex gap-2 overflow-x-auto pb-1">

        {/* Region */}
        <select
          value={region}
          onChange={(e) =>
            update({ region: e.target.value })
          }
          className={`${pill} ${
            region ? on : off
          }`}
        >
          <option value="">Region</option>

          {REGIONS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>

        {/* Price */}
        <button
          type="button"
          onClick={() =>
            setPriceOpen((o) => !o)
          }
          className={`${pill} ${
            priceActive ? on : off
          }`}
        >
          Price, ETB
          <span className="ml-1 text-xs">
            {priceOpen ? '▲' : '▼'}
          </span>
        </button>

        {/* Type */}
        {typeOptions.length > 0 && (
          <button
            type="button"
            onClick={() => setSheet('type')}
            className={`${pill} ${
              subcategory ? on : off
            }`}
          >
            {subcategory || 'Type'}
            <span className="ml-1 text-xs">▼</span>
          </button>
        )}

        {/* Brand */}
        {brandOptions.length > 0 && (
          <button
            type="button"
            onClick={() => setSheet('brand')}
            className={`${pill} ${
              brand ? on : off
            }`}
          >
            {brand || 'Brand'}
            <span className="ml-1 text-xs">▼</span>
          </button>
        )}

        {/* Clear */}
        {anyActive && (
          <button
            type="button"
            onClick={() => {
              setMin('');
              setMax('');
              setPriceOpen(false);

              update({
                region: '',
                minPrice: '',
                maxPrice: '',
                brand: '',
              });
            }}
            className={`${pill} border-line bg-paper text-muted hover:border-danger hover:bg-dangerSoft hover:text-danger`}
          >
            Clear
          </button>
        )}
      </div>

      {/* =========================
          PRICE PANEL
      ========================= */}
      {priceOpen && (
        <div className="mt-3 rounded-card border border-line bg-white p-4 shadow-card">
          <div className="mb-3 text-sm font-semibold text-ink">
            Price range
          </div>

          <div className="flex items-center gap-2">
            <input
              type="number"
              inputMode="numeric"
              placeholder="Min"
              value={min}
              onChange={(e) =>
                setMin(e.target.value)
              }
              className="bazaa-input"
            />

            <span className="shrink-0 text-muted">
              –
            </span>

            <input
              type="number"
              inputMode="numeric"
              placeholder="Max"
              value={max}
              onChange={(e) =>
                setMax(e.target.value)
              }
              className="bazaa-input"
            />

            <button
              type="button"
              onClick={() => {
                update({
                  minPrice: min,
                  maxPrice: max,
                });

                setPriceOpen(false);
              }}
              className="bazaa-primary shrink-0"
            >
              Apply
            </button>
          </div>
        </div>
      )}

      {/* =========================
          TYPE BOTTOM SHEET
      ========================= */}
      {sheet === 'type' && (
        <div
          className="fixed inset-0 z-[60] flex items-end bg-ink/50 backdrop-blur-sm"
          onClick={() => setSheet(null)}
        >
          <div
            className="max-h-[70vh] w-full overflow-y-auto rounded-t-[20px] bg-white shadow-soft"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            {/* Sheet header */}
            <div className="sticky top-0 border-b border-line bg-white px-4 py-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted">
                Filter by
              </div>

              <div className="mt-1 font-serif text-xl font-bold text-ink">
                Type
              </div>
            </div>

            {typeOptions.map((o) => (
              <button
                key={o.name}
                type="button"
                onClick={() => {
                  update({
                    subcategory: o.name,
                    brand: '',
                  });

                  setSheet(null);
                }}
                className={row}
              >
                <span
                  className={
                    o.name === subcategory
                      ? 'font-bold text-amberDeep'
                      : 'text-ink'
                  }
                >
                  {o.name}{' '}
                  <span className="text-sm font-normal text-muted">
                    • {adsLabel(o.count)}
                  </span>
                </span>

                {o.name === subcategory && (
                  <span className="font-bold text-amberDeep">
                    ✓
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* =========================
          BRAND FULL-SCREEN SHEET
      ========================= */}
      {sheet === 'brand' && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-paper">

          {/* Header */}
          <div className="flex items-center gap-3 bg-ink p-3 text-paper">
            <button
              type="button"
              onClick={() => {
                setSheet(null);
                setSearch('');
              }}
              className="flex h-10 w-10 items-center justify-center rounded-full text-2xl transition-colors hover:bg-white/10"
              aria-label="Back"
            >
              ‹
            </button>

            <div className="flex-1">
              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Find a brand"
                className="w-full rounded-bazaa border border-white/10 bg-white px-4 py-2.5 text-sm text-ink outline-none placeholder:text-mutedLight focus:border-amber focus:ring-2 focus:ring-amber/20"
              />
            </div>
          </div>

          {/* Brand list */}
          <div className="flex-1 overflow-y-auto">

            {/* All brands */}
            {brand && !q && (
              <button
                type="button"
                onClick={() =>
                  pickBrand('')
                }
                className={row}
              >
                <span className="font-semibold text-amberDeep">
                  All brands
                </span>
              </button>
            )}

            {/* Popular */}
            {popular.length > 0 && (
              <>
                <div className="bg-amberSoft px-4 py-2 text-xs font-bold uppercase tracking-wider text-amberDeep">
                  Popular
                </div>

                {popular.map(brandRow)}
              </>
            )}

            {/* Other / search results */}
            {rest.length > 0 && (
              <>
                <div className="bg-paper px-4 py-2 text-xs font-bold uppercase tracking-wider text-muted">
                  {q ? 'Results' : 'Other'}
                </div>

                {rest.map(brandRow)}
              </>
            )}

            {/* No results */}
            {filtered.length === 0 && (
              <div className="px-6 py-16 text-center">
                <div className="mb-2 text-2xl">
                  ⌕
                </div>

                <div className="font-semibold text-ink">
                  No brand found
                </div>

                <div className="mt-1 text-sm text-muted">
                  Try another brand name.
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
   }
