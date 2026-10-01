 'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CATEGORY_CONFIG } from '@/lib/categories';
import { getBrandLogo } from '@/lib/brandLogos';

function buildUrl(category?: string, subcategory?: string, brand?: string) {
  const params = new URLSearchParams();
  if (category) params.set('category', category);
  if (subcategory) params.set('subcategory', subcategory);
  if (brand) params.set('brand', brand);
  const qs = params.toString();
  return qs ? `/?${qs}` : '/';
}

export default function CategorySidebar({
  currentCategory,
  currentSubcategory,
  currentBrand,
}: {
  currentCategory: string;
  currentSubcategory: string;
  currentBrand: string;
}) {
  const [openCategory, setOpenCategory] = useState<string | null>(currentCategory || null);
  const [openSubcategory, setOpenSubcategory] = useState<string | null>(currentSubcategory || null);

  // Keeps the sidebar in sync after a Link navigation changes the URL.
  // Without this, tapping "Electronics" navigates to that category's
  // listings, but the subcategory list underneath it stays closed because
  // this component doesn't remount on the new page — only its props change.
  useEffect(() => {
    if (currentCategory) setOpenCategory(currentCategory);
  }, [currentCategory]);

  useEffect(() => {
    if (currentSubcategory) setOpenSubcategory(currentSubcategory);
  }, [currentSubcategory]);

  return (
    <nav className="w-full md:w-48 shrink-0 bg-white md:bg-transparent border md:border-0 border-line rounded-lg p-3 md:p-0 mb-6 md:mb-0">
      <div className="hidden md:block text-xs font-bold uppercase tracking-wide text-muted mb-2">
        Categories
      </div>
      <div className="flex flex-col gap-0.5">
        <Link
          href="/"
          className={`px-3 py-2 rounded text-sm flex items-center gap-2 ${
            !currentCategory ? 'bg-ink text-paper font-semibold' : 'hover:bg-amber/10'
          }`}
        >
          🗂️ All categories
        </Link>

        {Object.entries(CATEGORY_CONFIG).map(([catName, config]) => {
          const subNames = Object.keys(config.subcategories);
          const hasSubs = subNames.length > 0;
          const isCatOpen = openCategory === catName;
          const isCatActive = currentCategory === catName;

          return (
            <div key={catName}>
              <div
                className={`px-3 py-2 rounded text-sm flex items-center justify-between cursor-pointer ${
                  isCatActive && !currentSubcategory ? 'bg-ink text-paper font-semibold' : 'hover:bg-amber/10'
                }`}
                onClick={() => {
                  if (hasSubs) setOpenCategory(isCatOpen ? null : catName);
                }}
              >
                <Link
                  href={buildUrl(catName)}
                  className="flex items-center gap-2 flex-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span>{config.icon}</span>
                  <span>{catName}</span>
                </Link>
                {hasSubs && <span className={`text-xs transition-transform ${isCatOpen ? 'rotate-90' : ''}`}>▶</span>}
              </div>

              {hasSubs && isCatOpen && (
                <div className="pl-4 flex flex-col gap-0.5">
                  {subNames.map((subName) => {
                    const brands = config.subcategories[subName];
                    const hasBrands = brands.length > 0;
                    const isSubOpen = openSubcategory === subName;
                    const isSubActive = currentCategory === catName && currentSubcategory === subName;

                    return (
                      <div key={subName}>
                        <div
                          className={`px-2.5 py-1.5 rounded text-xs flex items-center justify-between cursor-pointer ${
                            isSubActive && !currentBrand ? 'bg-amber text-ink font-semibold' : 'text-muted hover:bg-amber/10 hover:text-ink'
                          }`}
                          onClick={() => {
                            if (hasBrands) setOpenSubcategory(isSubOpen ? null : subName);
                          }}
                        >
                          <Link
                            href={buildUrl(catName, subName)}
                            className="flex-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {subName}
                          </Link>
                          {hasBrands && <span className={`text-xs transition-transform ${isSubOpen ? 'rotate-90' : ''}`}>▶</span>}
                        </div>

                        {hasBrands && isSubOpen && (
                          <div className="pl-3 flex flex-col gap-0.5">
                            {brands.map((brand) => {
                              const isBrandActive =
                                currentCategory === catName && currentSubcategory === subName && currentBrand === brand;
                              const logo = getBrandLogo(brand);
                              return (
                                <Link
                                  key={brand}
                                  href={buildUrl(catName, subName, brand)}
                                  className={`px-2 py-1 rounded text-xs flex items-center gap-1.5 ${
                                    isBrandActive ? 'bg-amber text-ink font-semibold' : 'text-muted hover:bg-amber/10 hover:text-ink'
                                  }`}
                                >
                                  {logo ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={logo} alt="" className="w-4 h-4 object-contain rounded-sm" />
                                  ) : null}
                                  <span>{brand}</span>
                                </Link>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
                            }
