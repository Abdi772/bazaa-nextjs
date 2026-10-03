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

type Sheet =
  | null
  | 'type'
  | 'brand'
  | 'model'
  | 'condition'
  | 'budget'
  | 'more';

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

const CONDITIONS = [
  'New',
  'Like New',
  'Used',
  'Refurbished',
];

const BUDGETS = [
  'Under ETB 10,000',
  'ETB 10,000 – 25,000',
  'ETB 25,000 – 50,000',
  'ETB 50,000 – 100,000',
  'Over ETB 100,000',
];

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

  const [priceOpen, setPriceOpen] =
    useState(false);

  const [min, setMin] =
    useState(minPrice);

  const [max, setMax] =
    useState(maxPrice);

  const [sheet, setSheet] =
    useState<Sheet>(null);

  const [search, setSearch] =
    useState('');

  const [modelBrand, setModelBrand] =
    useState(brand);

  function getParam(name: string) {
    if (typeof window === 'undefined') {
      return '';
    }

    return (
      new URLSearchParams(
        window.location.search,
      ).get(name) || ''
    );
  }

  const currentModel =
    getParam('model');

  const currentCondition =
    getParam('condition');

  const currentBudget =
    getParam('budget');

  function update(
    changes: Record<string, string>,
  ) {
    const params =
      new URLSearchParams(
        window.location.search,
      );

    Object.entries(changes).forEach(
      ([key, value]) => {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      },
    );

    const query = params.toString();

    router.push(
      query ? `/?${query}` : '/',
    );
  }

  const priceActive = Boolean(
    minPrice || maxPrice,
  );

  const anyActive = Boolean(
    region ||
      minPrice ||
      maxPrice ||
      subcategory ||
      brand ||
      currentModel ||
      currentCondition ||
      currentBudget,
  );

  const pill =
    'shrink-0 min-h-[44px] rounded-full border-[1.5px] bg-white px-4 py-2 text-sm font-semibold leading-5 transition-colors active:scale-[0.98]';

  const activePill =
    'border-amber bg-amberSoft text-amberDeep';

  const inactivePill =
    'border-line text-ink hover:border-amber hover:bg-amberSoft';

  const row =
    'flex min-h-[56px] w-full items-center justify-between border-b-[1.5px] border-line px-4 py-4 text-left transition-colors active:bg-amberSoft hover:bg-amberSoft';

  const query =
    search.trim().toLowerCase();

  const filteredBrands =
    brandOptions.filter((option) =>
      option.name
        .toLowerCase()
        .includes(query),
    );

  const popularBrands = query
    ? []
    : filteredBrands
        .filter(
          (option) =>
            option.name !== 'Other',
        )
        .slice(0, 8);

  const otherBrands =
    filteredBrands
      .filter(
        (option) =>
          !popularBrands.includes(
            option,
          ),
      )
      .sort((a, b) => {
        if (a.name === 'Other') return 1;
        if (b.name === 'Other') return -1;

        return a.name.localeCompare(
          b.name,
        );
      });

  /*
   * Some data may call Apple "iPhone".
   * Convert it to the internal Apple model list.
   */
  const normalizedModelBrand =
    modelBrand === 'iPhone'
      ? 'Apple'
      : modelBrand;

  const models =
    PHONE_MODELS[
      normalizedModelBrand
    ] || ['Other model'];

  const filteredModels =
    models.filter((model) =>
      model
        .toLowerCase()
        .includes(query),
    );

  function openBrandSheet() {
    setSearch('');
    setSheet('brand');
  }

  function chooseBrand(name: string) {
    update({
      brand: name,
      model: '',
    });

    setModelBrand(name);
    setSearch('');
    setSheet(null);
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
        onClick={() =>
          chooseBrand(option.name)
        }
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

        {option.name === brand ? (
          <span className="font-bold text-amberDeep">
            ✓
          </span>
        ) : (
          <span className="text-lg text-muted">
            ›
          </span>
        )}
      </button>
    );
  }

  return (
    <div className="mb-5 min-w-0">
      <div className="-mx-1 overflow-hidden">
        <div className="flex gap-2 overflow-x-auto px-1 pb-2 pt-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <select
            value={region}
            onChange={(event) =>
              update({
                region:
                  event.target.value,
              })
            }
            className={`${pill} ${
              region
                ? activePill
                : inactivePill
            }`}
          >
            <option value="">
              Region
            </option>

            {REGIONS.map((item) => (
              <option
                key={item}
                value={item}
              >
                {item}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() =>
              setPriceOpen(
                (open) => !open,
              )
            }
            className={`${pill} ${
              priceActive
                ? activePill
                : inactivePill
            }`}
          >
            Price, ETB

            <span className="ml-1 text-xs">
              {priceOpen ? '▲' : '▼'}
            </span>
          </button>

          {!subcategory &&
            typeOptions.length > 0 && (
              <button
                type="button"
                onClick={() =>
                  setSheet('type')
                }
                className={`${pill} ${inactivePill}`}
              >
                Type

                <span className="ml-1 text-xs">
                  ▼
                </span>
              </button>
            )}

          {subcategory && (
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setSheet(
                  'condition',
                );
              }}
              className={`${pill} ${
                currentCondition
                  ? activePill
                  : inactivePill
              }`}
            >
              {currentCondition ||
                'Condition'}

              <span className="ml-1 text-xs">
                ▼
              </span>
            </button>
          )}

          {subcategory && (
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setSheet('budget');
              }}
              className={`${pill} ${
                currentBudget
                  ? activePill
                  : inactivePill
              }`}
            >
              {currentBudget ||
                'Budget'}

              <span className="ml-1 text-xs">
                ▼
              </span>
            </button>
          )}

          {subcategory &&
            brandOptions.length > 0 && (
              <button
                type="button"
                onClick={
                  openBrandSheet
                }
                className={`${pill} ${
                  brand
                    ? activePill
                    : inactivePill
                }`}
              >
                {brand || 'Brand'}

                <span className="ml-1 text-xs">
                  ▼
                </span>
              </button>
            )}

          {subcategory &&
            brand && (
              <button
                type="button"
                onClick={() => {
                  setModelBrand(brand);
                  setSearch('');
                  setSheet('model');
                }}
                className={`${pill} ${
                  currentModel
                    ? activePill
                    : inactivePill
                }`}
              >
                {currentModel ||
                  'Model'}

                <span className="ml-1 text-xs">
                  ▼
                </span>
              </button>
            )}

          {subcategory && (
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setSheet('more');
              }}
              className={`${pill} ${inactivePill}`}
            >
              More

              <span className="ml-1 text-xs">
                ▼
              </span>
            </button>
          )}

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
                  condition: '',
                  budget: '',
                });
              }}
              className={`${pill} border-line bg-paper text-muted hover:border-danger hover:bg-dangerSoft hover:text-danger`}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {priceOpen && (
        <div className="mt-3 rounded-card border-[1.5px] border-line bg-white p-4 shadow-card">
          <div className="mb-3 text-sm font-semibold text-ink">
            Price range
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <input
                type="number"
                inputMode="numeric"
                placeholder="Min"
                value={min}
                onChange={(event) =>
                  setMin(
                    event.target.value,
                  )
                }
                className="bazaa-input min-w-0"
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
                  setMax(
                    event.target.value,
                  )
                }
                className="bazaa-input min-w-0"
              />
            </div>

            <button
              type="button"
              onClick={() => {
                update({
                  minPrice: min,
                  maxPrice: max,
                });

                setPriceOpen(false);
              }}
              className="bazaa-primary min-h-[46px] w-full shrink-0 sm:w-auto"
            >
              Apply
            </button>
          </div>
        </div>
      )}
           {sheet && (
        <div
          className="fixed inset-0 z-[100] flex items-end bg-ink/40 backdrop-blur-[2px]"
          onClick={() => {
            setSheet(null);
            setSearch('');
          }}
        >
          <div
            className="max-h-[88vh] w-full overflow-hidden rounded-t-[22px] bg-white shadow-soft"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="mx-auto w-full max-w-2xl">
              <div className="flex items-center justify-between border-b-[1.5px] border-line px-4 py-4">
                <div>
                  <h3 className="text-base font-bold text-ink">
                    {sheet === 'type' &&
                      'Choose type'}

                    {sheet === 'brand' &&
                      'Choose brand'}

                    {sheet === 'model' &&
                      'Choose model'}

                    {sheet ===
                      'condition' &&
                      'Condition'}

                    {sheet === 'budget' &&
                      'Budget'}

                    {sheet === 'more' &&
                      'More filters'}
                  </h3>

                  <p className="mt-0.5 text-xs text-muted">
                    Tap an option to apply it
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSheet(null);
                    setSearch('');
                  }}
                  aria-label="Close filter"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-paper text-xl text-ink transition-colors hover:bg-amberSoft"
                >
                  ×
                </button>
              </div>

              {(
                sheet === 'brand' ||
                sheet === 'model'
              ) && (
                <div className="border-b-[1.5px] border-line bg-paper px-4 py-3">
                  <input
                    type="search"
                    value={search}
                    onChange={(event) =>
                      setSearch(
                        event.target.value,
                      )
                    }
                    placeholder={
                      sheet === 'brand'
                        ? 'Search brands...'
                        : 'Search models...'
                    }
                    autoFocus
                    className="bazaa-input min-h-[46px]"
                  />
                </div>
              )}

              <div className="max-h-[65vh] overflow-y-auto overscroll-contain">
                {sheet === 'type' && (
                  <div>
                    {typeOptions.map(
                      (option) => (
                        <button
                          key={
                            option.name
                          }
                          type="button"
                          onClick={() => {
                            update({
                              subcategory:
                                option.name,
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
                              option.name ===
                              subcategory
                                ? 'font-bold text-amberDeep'
                                : 'text-ink'
                            }
                          >
                            {
                              option.name
                            }{' '}
                            <span className="text-sm font-normal text-muted">
                              •{' '}
                              {adsLabel(
                                option.count,
                              )}
                            </span>
                          </span>

                          {option.name ===
                            subcategory && (
                            <span className="font-bold text-amberDeep">
                              ✓
                            </span>
                          )}
                        </button>
                      ),
                    )}
                  </div>
                )}

                {sheet === 'brand' && (
                  <div>
                    {popularBrands.length >
                      0 && (
                      <>
                        <div className="bg-paper px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-muted">
                          Popular
                        </div>

                        {popularBrands.map(
                          brandRow,
                        )}
                      </>
                    )}

                    {otherBrands.length >
                      0 && (
                      <>
                        <div className="bg-paper px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-muted">
                          All brands
                        </div>

                        {otherBrands.map(
                          brandRow,
                        )}
                      </>
                    )}

                    {filteredBrands.length ===
                      0 && (
                      <div className="px-5 py-12 text-center">
                        <div className="mb-2 text-2xl">
                          ⌕
                        </div>

                        <p className="text-sm font-semibold text-ink">
                          No brands found
                        </p>

                        <p className="mt-1 text-xs text-muted">
                          Try a different
                          search.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {sheet === 'model' && (
                  <div>
                    {filteredModels.length >
                      0 ? (
                      filteredModels.map(
                        (model) => (
                          <button
                            key={model}
                            type="button"
                            onClick={() =>
                              chooseModel(
                                model,
                              )
                            }
                            className={row}
                          >
                            <span
                              className={
                                model ===
                                currentModel
                                  ? 'font-bold text-amberDeep'
                                  : 'text-ink'
                              }
                            >
                              {model}
                            </span>

                            {model ===
                              currentModel && (
                              <span className="font-bold text-amberDeep">
                                ✓
                              </span>
                            )}
                          </button>
                        ),
                      )
                    ) : (
                      <div className="px-5 py-12 text-center">
                        <div className="mb-2 text-2xl">
                          ⌕
                        </div>

                        <p className="text-sm font-semibold text-ink">
                          No models found
                        </p>

                        <p className="mt-1 text-xs text-muted">
                          Try a different
                          search.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {sheet ===
                  'condition' && (
                  <div>
                    {CONDITIONS.map(
                      (item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => {
                            update({
                              condition:
                                item,
                            });

                            setSheet(null);
                          }}
                          className={row}
                        >
                          <span
                            className={
                              item ===
                              currentCondition
                                ? 'font-bold text-amberDeep'
                                : 'text-ink'
                            }
                          >
                            {item}
                          </span>

                          {item ===
                            currentCondition && (
                            <span className="font-bold text-amberDeep">
                              ✓
                            </span>
                          )}
                        </button>
                      ),
                    )}

                    {currentCondition && (
                      <button
                        type="button"
                        onClick={() => {
                          update({
                            condition: '',
                          });

                          setSheet(null);
                        }}
                        className="flex min-h-[56px] w-full items-center justify-center border-t-[1.5px] border-line px-4 py-4 text-sm font-semibold text-danger"
                      >
                        Clear condition
                      </button>
                    )}
                  </div>
                )}

                {sheet === 'budget' && (
                  <div>
                    {BUDGETS.map(
                      (item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => {
                            update({
                              budget: item,
                            });

                            setSheet(null);
                          }}
                          className={row}
                        >
                          <span
                            className={
                              item ===
                              currentBudget
                                ? 'font-bold text-amberDeep'
                                : 'text-ink'
                            }
                          >
                            {item}
                          </span>

                          {item ===
                            currentBudget && (
                            <span className="font-bold text-amberDeep">
                              ✓
                            </span>
                          )}
                        </button>
                      ),
                    )}

                    {currentBudget && (
                      <button
                        type="button"
                        onClick={() => {
                          update({
                            budget: '',
                          });

                          setSheet(null);
                        }}
                        className="flex min-h-[56px] w-full items-center justify-center border-t-[1.5px] border-line px-4 py-4 text-sm font-semibold text-danger"
                      >
                        Clear budget
                      </button>
                    )}
                  </div>
                )}

                {sheet === 'more' && (
                  <div>
                    <div className="px-4 py-4">
                      <div className="mb-3 text-sm font-semibold text-ink">
                        Additional filters
                      </div>

                      <div className="rounded-bazaa bg-paper p-4 text-sm leading-6 text-muted">
                        Use the filters above
                        for region, price,
                        condition, budget,
                        brand, and model.
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setSheet(null);
                        setSearch('');
                      }}
                      className="flex min-h-[52px] w-full items-center justify-center border-t-[1.5px] border-line px-4 py-4 text-sm font-semibold text-amberDeep"
                    >
                      Done
                    </button>
                  </div>
                )}
              </div>

              <div className="h-[max(16px,env(safe-area-inset-bottom))]" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
                    }
