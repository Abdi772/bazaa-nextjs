'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

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

type Sheet = null | 'type' | 'brand' | 'model';

/*
 * Phone models.
 *
 * This is the first model database.
 * We will expand this later for vehicles and other categories.
 */
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

  Other: ['Other model'],
};

function adsLabel(count: number) {
  return `${count} ${count === 1 ? 'ad' : 'ads'}`;
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
   * The brand currently being viewed in the model screen.
   */
  const [modelBrand, setModelBrand] = useState(brand);

  /*
   * Read the selected model from the URL.
   */
  function getCurrentModel() {
    if (typeof window === 'undefined') {
      return '';
    }

    return (
      new URLSearchParams(window.location.search).get('model') || ''
    );
  }

  const currentModel = getCurrentModel();

  /*
   * Update URL while preserving the other filters.
   */
  function update(changes: Record<string, string>) {
    const params = new URLSearchParams(window.location.search);

    Object.entries(changes).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    const query = params.toString();

    router.push(query ? `/?${query}` : '/');
  }

  const priceActive = Boolean(minPrice || maxPrice);

  const anyActive = Boolean(
    region ||
      minPrice ||
      maxPrice ||
      subcategory ||
      brand ||
      currentModel
  );

  const pill =
    'shrink-0 rounded-full border-[1.5px] bg-white px-4 py-2 text-sm font-semibold transition-colors';

  const activePill =
    'border-amber bg-amberSoft text-amberDeep';

  const inactivePill =
    'border-line text-ink hover:border-amber hover:bg-amberSoft';

  const row =
    'flex w-full items-center justify-between border-b-[1.5px] border-line px-4 py-4 text-left transition-colors hover:bg-amberSoft';

  /*
   * Search brands.
   */
  const query = search.trim().toLowerCase();

  const filteredBrands = brandOptions.filter((option) =>
    option.name.toLowerCase().includes(query)
  );

  const popularBrands = query
    ? []
    : filteredBrands
        .filter((option) => option.name !== 'Other')
        .slice(0, 8);

  const otherBrands = filteredBrands
    .filter((option) => !popularBrands.includes(option))
    .sort((a, b) => {
      if (a.name === 'Other') return 1;
      if (b.name === 'Other') return -1;

      return a.name.localeCompare(b.name);
    });

  /*
   * Models for the selected brand.
   */
  const models = PHONE_MODELS[modelBrand] || ['Other model'];

  const filteredModels = models.filter((model) =>
    model.toLowerCase().includes(query)
  );

  function openBrandSheet() {
    setSearch('');
    setSheet('brand');
  }

  function chooseBrand(name: string) {
    /*
     * Brand selected.
     * Clear any old model.
     */
    update({
      brand: name,
      model: '',
    });

    setModelBrand(name);
    setSearch('');

    /*
     * Immediately continue to that brand's models.
     */
    setSheet('model');
  }

  function chooseModel(name: string) {
    update({
      model: name,
    });

    setSearch('');
    setSheet(null);
  }

  function brandRow(option: Option) {
    return (
      <button
        key={option.name}
        type="button"
        onClick={() => chooseBrand(option.name)}
        className={row}
      >
        <span
          className={
            option.name === brand
              ? 'font-bold text-amberDeep'
              : 'text-ink'
          }
        >
          {option.name}{' '}
          <span className="text-sm font-normal text-muted">
            • {adsLabel(option.count)}
          </span>
        </span>

        <span className="text-lg text-muted">
          ›
        </span>
      </button>
    );
  }

  return (
    <div className="mb-5">
      {/* =====================================================
          FILTER PILLS
      ===================================================== */}

      <div className="flex gap-2 overflow-x-auto pb-1">
        {/* Region */}
        <select
          value={region}
          onChange={(event) =>
            update({
              region: event.target.value,
            })
          }
          className={`${pill} ${
            region ? activePill : inactivePill
          }`}
        >
          <option value="">Region</option>

          {REGIONS.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        {/* Price */}
        <button
          type="button"
          onClick={() =>
            setPriceOpen((open) => !open)
          }
          className={`${pill} ${
            priceActive ? activePill : inactivePill
          }`}
        >
          Price, ETB
          <span className="ml-1 text-xs">
            {priceOpen ? '▲' : '▼'}
          </span>
        </button>

        {/*
         * Type is only shown BEFORE a subcategory has been chosen.
         *
         * Once the user chooses Phones, this button disappears.
         */}
        {!subcategory && typeOptions.length > 0 && (
          <button
            type="button"
            onClick={() => setSheet('type')}
            className={`${pill} ${inactivePill}`}
          >
            Type
            <span className="ml-1 text-xs">
              ▼
            </span>
          </button>
        )}

        {/*
         * Brand appears after the user has selected
         * a subcategory such as Phones.
         */}
        {subcategory && brandOptions.length > 0 && (
          <button
            type="button"
            onClick={openBrandSheet}
            className={`${pill} ${
              brand ? activePill : inactivePill
            }`}
          >
            {brand || 'Brand'}
            <span className="ml-1 text-xs">
              ▼
            </span>
          </button>
        )}

        {/*
         * Model appears after a brand has been selected.
         */}
        {subcategory && brand && (
          <button
            type="button"
            onClick={() => {
              setModelBrand(brand);
              setSearch('');
              setSheet('model');
            }}
            className={`${pill} ${
              currentModel ? activePill : inactivePill
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

      {/* =====================================================
          PRICE PANEL
      ===================================================== */}

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
              onChange={(event) =>
                setMin(event.target.value)
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
              onChange={(event) =>
                setMax(event.target.value)
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

      {/* =====================================================
          TYPE SHEET
      ===================================================== */}

      {sheet === 'type' && (
        <div
          className="fixed inset-0 z-[60] flex items-end bg-ink/50 backdrop-blur-sm"
          onClick={() => setSheet(null)}
        >
          <div
            className="max-h-[70vh] w-full overflow-y-auto rounded-t-[20px] border-t-[1.5px] border-line bg-white shadow-soft"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="sticky top-0 border-b-[1.5px] border-line bg-white px-4 py-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted">
                Filter by
              </div>

              <div className="mt-1 font-serif text-xl font-bold text-ink">
                Type
              </div>
            </div>

            {typeOptions.map((option) => (
              <button
                key={option.name}
                type="button"
                onClick={() => {
                  update({
                    subcategory: option.name,
                    brand: '',
                    model: '',
                  });

                  setModelBrand('');
                  setSheet(null);
                }}
                className={row}
              >
                <span
                  className={
                    option.name === subcategory
                      ? 'font-bold text-amberDeep'
                      : 'text-ink'
                  }
                >
                  {option.name}{' '}
                  <span className="text-sm font-normal text-muted">
                    • {adsLabel(option.count)}
                  </span>
                </span>

                {option.name === subcategory && (
                  <span className="font-bold text-amberDeep">
                    ✓
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* =====================================================
          BRAND SHEET
      ===================================================== */}

      {sheet === 'brand' && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-paper">
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
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Find a brand"
                className="w-full rounded-bazaa border-[1.5px] border-white/20 bg-white px-4 py-2.5 text-sm text-ink outline-none placeholder:text-mutedLight focus:border-amber focus:ring-2 focus:ring-amber/20"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {brand && !query && (
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

            {popularBrands.length > 0 && (
              <>
                <div className="border-b-[1.5px] border-line bg-amberSoft px-4 py-2 text-xs font-bold uppercase tracking-wider text-amberDeep">
                  Brands
                </div>

                {popularBrands.map(brandRow)}
              </>
            )}

            {otherBrands.length > 0 && (
              <>
                <div className="border-b-[1.5px] border-line bg-paper px-4 py-2 text-xs font-bold uppercase tracking-wider text-muted">
                  {query ? 'Results' : 'Other'}
                </div>

                {otherBrands.map(brandRow)}
              </>
            )}

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

      {/* =====================================================
          MODEL SHEET
      ===================================================== */}

      {sheet === 'model' && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-paper">
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
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Find model"
                className="w-full rounded-bazaa border-[1.5px] border-white/20 bg-white px-3 py-2 text-sm text-ink outline-none placeholder:text-mutedLight focus:border-amber focus:ring-2 focus:ring-amber/20"
              />
            </div>
          </div>

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
          
