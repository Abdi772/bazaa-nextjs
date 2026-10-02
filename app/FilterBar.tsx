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

type Sheet = null | 'brand' | 'type' | 'model';

const PHONE_MODELS: Record<string, string[]> = {
  Apple: [
    'iPhone 8',
    'iPhone 8 Plus',
    'iPhone X',
    'iPhone XR',
    'iPhone XS',
    'iPhone XS Max',
    'iPhone 11',
    'iPhone 11 Pro',
    'iPhone 11 Pro Max',
    'iPhone 12',
    'iPhone 12 mini',
    'iPhone 12 Pro',
    'iPhone 12 Pro Max',
    'iPhone 13',
    'iPhone 13 mini',
    'iPhone 13 Pro',
    'iPhone 13 Pro Max',
    'iPhone 14',
    'iPhone 14 Plus',
    'iPhone 14 Pro',
    'iPhone 14 Pro Max',
    'iPhone 15',
    'iPhone 15 Plus',
    'iPhone 15 Pro',
    'iPhone 15 Pro Max',
    'iPhone 16',
    'iPhone 16 Plus',
    'iPhone 16 Pro',
    'iPhone 16 Pro Max',
    'iPhone 17',
    'iPhone 17 Pro',
    'iPhone 17 Pro Max',
  ],

  Samsung: [
    'Galaxy A05',
    'Galaxy A05s',
    'Galaxy A06',
    'Galaxy A14',
    'Galaxy A15',
    'Galaxy A16',
    'Galaxy A24',
    'Galaxy A25',
    'Galaxy A34',
    'Galaxy A35',
    'Galaxy A54',
    'Galaxy A55',
    'Galaxy S20',
    'Galaxy S20+',
    'Galaxy S20 Ultra',
    'Galaxy S21',
    'Galaxy S21+',
    'Galaxy S21 Ultra',
    'Galaxy S22',
    'Galaxy S22+',
    'Galaxy S22 Ultra',
    'Galaxy S23',
    'Galaxy S23+',
    'Galaxy S23 Ultra',
    'Galaxy S24',
    'Galaxy S24+',
    'Galaxy S24 Ultra',
    'Galaxy S25',
    'Galaxy S25+',
    'Galaxy S25 Ultra',
    'Galaxy Note 20',
    'Galaxy Note 20 Ultra',
    'Galaxy Z Flip',
    'Galaxy Z Flip 3',
    'Galaxy Z Flip 4',
    'Galaxy Z Flip 5',
    'Galaxy Z Flip 6',
    'Galaxy Z Fold 2',
    'Galaxy Z Fold 3',
    'Galaxy Z Fold 4',
    'Galaxy Z Fold 5',
    'Galaxy Z Fold 6',
  ],

  Xiaomi: [
    'Xiaomi 12',
    'Xiaomi 12 Pro',
    'Xiaomi 13',
    'Xiaomi 13 Pro',
    'Xiaomi 13T',
    'Xiaomi 13T Pro',
    'Xiaomi 14',
    'Xiaomi 14 Pro',
    'Xiaomi 14T',
    'Xiaomi 14T Pro',
    'Xiaomi 15',
    'Xiaomi 15 Pro',
    'Xiaomi 15 Ultra',
    'Xiaomi Mi 10',
    'Xiaomi Mi 11',
    'Xiaomi Mi 11 Ultra',
  ],

  Redmi: [
    'Redmi 9',
    'Redmi 10',
    'Redmi 12',
    'Redmi 13',
    'Redmi 14C',
    'Redmi Note 10',
    'Redmi Note 10 Pro',
    'Redmi Note 11',
    'Redmi Note 11 Pro',
    'Redmi Note 12',
    'Redmi Note 12 Pro',
    'Redmi Note 13',
    'Redmi Note 13 Pro',
    'Redmi Note 14',
    'Redmi Note 14 Pro',
  ],

  Tecno: [
    'Spark 8',
    'Spark 9',
    'Spark 10',
    'Spark 20',
    'Spark 20 Pro',
    'Spark 30',
    'Spark 30 Pro',
    'Camon 18',
    'Camon 19',
    'Camon 20',
    'Camon 20 Pro',
    'Camon 30',
    'Camon 30 Pro',
    'Phantom X',
    'Phantom X2',
    'Phantom V Fold',
    'Phantom V Flip',
  ],

  Infinix: [
    'Hot 10',
    'Hot 11',
    'Hot 12',
    'Hot 20',
    'Hot 30',
    'Hot 40',
    'Hot 50',
    'Note 10',
    'Note 11',
    'Note 12',
    'Note 30',
    'Note 40',
    'Zero 20',
    'Zero 30',
    'Zero 40',
  ],

  Huawei: [
    'P30',
    'P30 Pro',
    'P40',
    'P40 Pro',
    'P50',
    'P50 Pro',
    'P60',
    'P60 Pro',
    'Mate 20',
    'Mate 20 Pro',
    'Mate 30',
    'Mate 30 Pro',
    'Mate 40',
    'Mate 40 Pro',
    'Mate 50',
    'Mate 50 Pro',
    'Mate 60',
    'Mate 60 Pro',
    'Nova 8',
    'Nova 9',
    'Nova 10',
    'Nova 11',
    'Nova 12',
  ],

  Oppo: [
    'A15',
    'A16',
    'A17',
    'A18',
    'A38',
    'A58',
    'A78',
    'A98',
    'Reno 5',
    'Reno 6',
    'Reno 7',
    'Reno 8',
    'Reno 10',
    'Reno 11',
    'Reno 12',
    'Find X3',
    'Find X3 Pro',
    'Find X5',
    'Find X5 Pro',
    'Find X6',
    'Find X7',
  ],

  Other: [
    'Other model',
  ],
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

  const [sheet, setSheet] = useState<Sheet>(null);

  const [search, setSearch] = useState('');

  /*
   * The currently selected brand while the user is
   * browsing models inside the Brand sheet.
   */
  const [modelBrand, setModelBrand] = useState(brand);

  /*
   * Selected model.
   *
   * This is intentionally kept in the URL so that
   * the next step can connect it to the database.
   */
  const currentModel =
    typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search).get('model') || ''
      : '';

  // Keep every other setting in the address
  // and change only the requested filter.
  function update(changes: Record<string, string>) {
    const params = new URLSearchParams(window.location.search);

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
    subcategory ||
    brand ||
    currentModel
  );

  const priceActive = !!(minPrice || maxPrice);

  /*
   * Filter pill design.
   */
  const pill =
    'shrink-0 rounded-full border-[1.5px] bg-white px-4 py-2 text-sm font-semibold transition-colors';

  const on =
    'border-amber bg-amberSoft text-amberDeep';

  const off =
    'border-line text-ink hover:border-amber hover:bg-amberSoft';

  /*
   * Stronger separator rows.
   */
  const row =
    'flex w-full items-center justify-between border-b-[1.5px] border-line px-4 py-4 text-left transition-colors hover:bg-amberSoft';

  /*
   * Brand search.
   */
  const q = search.trim().toLowerCase();

  const filteredBrands = brandOptions.filter((o) =>
    o.name.toLowerCase().includes(q)
  );

  const popularBrands = q
    ? []
    : filteredBrands
        .filter((o) => o.name !== 'Other')
        .slice(0, 8);

  const remainingBrands = filteredBrands
    .filter((o) => !popularBrands.includes(o))
    .sort((a, b) =>
      a.name === 'Other'
        ? 1
        : b.name === 'Other'
          ? -1
          : a.name.localeCompare(b.name)
    );

  /*
   * Models for the selected brand.
   *
   * If we do not yet have a predefined model list,
   * we still show a safe "Other model" option.
   */
  const modelNames = PHONE_MODELS[modelBrand] || ['Other model'];

  const filteredModels = modelNames.filter((model) =>
    model.toLowerCase().includes(q)
  );

  function openBrandSheet() {
    setSearch('');
    setModelBrand(brand);
    setSheet('brand');
  }

  function pickBrand(name: string) {
    /*
     * Selecting a brand resets the old model.
     */
    update({
      brand: name,
      model: '',
    });

    /*
     * Keep the user inside the hierarchy.
     * They selected Apple/Samsung/etc., so now show
     * that brand's models.
     */
    setModelBrand(name);
    setSearch('');
    setSheet('model');
  }

  function pickModel(name: string) {
    update({
      model: name,
    });

    setSearch('');
    setSheet(null);
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

        <span className="text-muted">
          ›
        </span>
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

        {/*
         * TYPE / PHONES
         *
         * Once a subcategory is selected, we hide this
         * button because the user already selected Phones.
         *
         * This removes the duplicate "Phones" filter
         * shown in your screenshot.
         */}
        {!subcategory && typeOptions.length > 0 && (
          <button
            type="button"
            onClick={() => setSheet('type')}
            className={`${pill} ${
              subcategory ? on : off
            }`}
          >
            Type
            <span className="ml-1 text-xs">
              ▼
            </span>
          </button>
        )}

        {/* Brand */}
        {brandOptions.length > 0 && subcategory && (
          <button
            type="button"
            onClick={openBrandSheet}
            className={`${pill} ${
              brand ? on : off
            }`}
          >
            {brand || 'Brand'}
            <span className="ml-1 text-xs">
              ▼
            </span>
          </button>
        )}

        {/* Model */}
        {brand && subcategory && (
          <button
            type="button"
            onClick={() => {
              setModelBrand(brand);
              setSearch('');
              setSheet('model');
            }}
            className={`${pill} ${
              currentModel ? on : off
            }`}
          >
            {currentModel || 'Model'}
            <span className="ml-1 text-xs">
              ▼
            </span>
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
              setSearch('');
              setModelBrand('');

              update({
                region: '',
                minPrice: '',
                maxPrice: '',
                subcategory: '',
                brand: '',
                model: '',
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
        <div className="mt-3 rounded-card border-[1.5px] border-line bg-white p-4 shadow-card">
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
            className="max-h-[70vh] w-full overflow-y-auto rounded-t-[20px] border-t-[1.5px] border-line bg-white shadow-soft"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* Sheet header */}
            <div className="sticky top-0 border-b-[1.5px] border-line bg-white px-4 py-4">
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
                    model: '',
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
          BRAND SHEET
      ========================= */}
      {sheet === 'brand' && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-paper">

          {/* Header */}
          <div className="flex items-center gap-3 border-b-[1.5px] border-white/20 bg-ink p-3 text-paper">

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
                className="w-full rounded-bazaa border-[1.5px] border-white/20 bg-white px-4 py-2.5 text-sm text-ink outline-none placeholder:text-mutedLight focus:border-amber focus:ring-2 focus:ring-amber/20"
              />
            </div>
          </div>


          {/* Brand list */}
          <div className="flex-1 overflow-y-auto">

            {/* All brands */}
            {brand && !q && (
              <button
                type="button"
                onClick={() => {
                  update({
                    brand: '',
                    model: '',
                  });

                  setModelBrand('');
                  setSearch('');
                }}
                className={row}
              >
                <span className="font-semibold text-amberDeep">
                  All brands
                </span>
              </button>
            )}

            {/* Popular */}
            {popularBrands.length > 0 && (
              <>
                <div className="border-b-[1.5px] border-line bg-amberSoft px-4 py-2 text-xs font-bold uppercase tracking-wider text-amberDeep">
                  Brands
                </div>

                {popularBrands.map(brandRow)}
              </>
            )}

            {/* Other / search results */}
            {remainingBrands.length > 0 && (
              <>
                <div className="border-b-[1.5px] border-line bg-paper px-4 py-2 text-xs font-bold uppercase tracking-wider text-muted">
                  {q ? 'Results' : 'Other'}
                </div>

                {remainingBrands.map(brandRow)}
              </>
            )}

            {/* No results */}
            {filteredBrands.length === 0 && (
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


      {/* =========================
          MODEL SHEET
      ========================= */}
      {sheet === 'model' && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-paper">

          {/* Header */}
          <div className="flex items-center gap-3 border-b-[1.5px] border-white/20 bg-ink p-3 text-paper">

            <button
              type="button"
              onClick={() => {
                setSheet('brand');
                setSearch('');
              }}
              className="flex h-10 w-10 items-center justify-center rounded-full text-2xl transition-colors hover:bg-white/10"
              aria-label="Back to brands"
            >
              ‹
            </button>

            <div className="min-w-0 flex-1">
              <div className="text-xs uppercase tracking-wider text-paper/60">
                {subcategory || 'Product'}
              </div>

              <div className="truncate font-serif text-lg font-bold">
                {modelBrand || 'Model'}
              </div>
            </div>

            <div className="w-[40%]">
              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Find model"
                className="w-full rounded-bazaa border-[1.5px] border-white/20 bg-white px-3 py-2 text-sm text-ink outline-none placeholder:text-mutedLight focus:border-amber focus:ring-2 focus:ring-amber/20"
              />
            </div>
          </div>


          {/* Model list */}
          <div className="flex-1 overflow-y-auto">

            {currentModel && (
              <button
                type="button"
                onClick={() => {
                  update({
                    model: '',
                  });

                  setSearch('');
                }}
                className={row}
              >
                <span className="font-semibold text-amberDeep">
                  All {modelBrand} models
                <
