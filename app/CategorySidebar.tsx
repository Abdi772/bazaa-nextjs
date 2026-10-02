 'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CATEGORY_CONFIG } from '@/lib/categories';
import { getBrandLogo } from '@/lib/brandLogos';

function buildUrl(
  category?: string,
  subcategory?: string,
  brand?: string
) {
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
  const [openCategory, setOpenCategory] =
    useState<string | null>(
      currentCategory || null
    );

  const [openSubcategory, setOpenSubcategory] =
    useState<string | null>(
      currentSubcategory || null
    );

  // Keep sidebar synchronized with navigation.
  useEffect(() => {
    if (currentCategory) {
      setOpenCategory(currentCategory);
    }
  }, [currentCategory]);

  useEffect(() => {
    if (currentSubcategory) {
      setOpenSubcategory(currentSubcategory);
    }
  }, [currentSubcategory]);

  return (
    <nav className="w-full shrink-0 md:w-52">

      {/* Sidebar card */}
      <div className="rounded-card border border-line bg-white p-3 shadow-card">

        {/* Heading */}
        <div className="mb-2 px-3 py-2">
          <div className="text-xs font-bold uppercase tracking-[0.16em] text-muted">
            Categories
          </div>
        </div>

        <div className="flex flex-col gap-1">

          {/* All categories */}
          <Link
            href="/"
            className={`flex items-center gap-2 rounded-bazaa px-3 py-2.5 text-sm transition-colors ${
              !currentCategory
                ? 'bg-ink font-semibold text-paper'
                : 'text-ink hover:bg-amberSoft'
            }`}
          >
            <span className="text-base">
              🗂️
            </span>

            <span>
              All categories
            </span>
          </Link>

          {/* Categories */}
          {Object.entries(CATEGORY_CONFIG).map(
            ([catName, config]) => {
              const subNames = Object.keys(
                config.subcategories
              );

              const hasSubs =
                subNames.length > 0;

              const isCatOpen =
                openCategory === catName;

              const isCatActive =
                currentCategory === catName;

              return (
                <div key={catName}>

                  {/* Category */}
                  <div
                    className={`flex cursor-pointer items-center justify-between rounded-bazaa px-3 py-2.5 text-sm transition-colors ${
                      isCatActive &&
                      !currentSubcategory
                        ? 'bg-ink font-semibold text-paper'
                        : 'text-ink hover:bg-amberSoft'
                    }`}
                    onClick={() => {
                      if (hasSubs) {
                        setOpenCategory(
                          isCatOpen
                            ? null
                            : catName
                        );
                      }
                    }}
                  >
                    <Link
                      href={buildUrl(catName)}
                      className="flex min-w-0 flex-1 items-center gap-2"
                      onClick={(e) =>
                        e.stopPropagation()
                      }
                    >
                      <span className="shrink-0">
                        {config.icon}
                      </span>

                      <span className="truncate">
                        {catName}
                      </span>
                    </Link>

                    {hasSubs && (
                      <span
                        className={`ml-2 text-[10px] text-muted transition-transform duration-200 ${
                          isCatOpen
                            ? 'rotate-90'
                            : ''
                        }`}
                      >
                        ▶
                      </span>
                    )}
                  </div>

                  {/* Subcategories */}
                  {hasSubs && isCatOpen && (
                    <div className="ml-2 mt-1 border-l border-line pl-2">
                      <div className="flex flex-col gap-0.5">
                        {subNames.map(
                          (subName) => {
                            const brands =
                              config.subcategories[
                                subName
                              ];

                            const hasBrands =
                              brands.length > 0;

                            const isSubOpen =
                              openSubcategory ===
                              subName;

                            const isSubActive =
                              currentCategory ===
                                catName &&
                              currentSubcategory ===
                                subName;

                            return (
                              <div
                                key={subName}
                              >

                                {/* Subcategory */}
                                <div
                                  className={`flex cursor-pointer items-center justify-between rounded-lg px-2.5 py-2 text-xs transition-colors ${
                                    isSubActive &&
                                    !currentBrand
                                      ? 'bg-amber font-semibold text-ink'
                                      : 'text-muted hover:bg-amberSoft hover:text-ink'
                                  }`}
                                  onClick={() => {
                                    if (hasBrands) {
                                      setOpenSubcategory(
                                        isSubOpen
                                          ? null
                                          : subName
                                      );
                                    }
                                  }}
                                >
                                  <Link
                                    href={buildUrl(
                                      catName,
                                      subName
                                    )}
                                    className="min-w-0 flex-1 truncate"
                                    onClick={(e) =>
                                      e.stopPropagation()
                                    }
                                  >
                                    {subName}
                                  </Link>

                                  {hasBrands && (
                                    <span
                                      className={`ml-2 text-[9px] text-muted transition-transform duration-200 ${
                                        isSubOpen
                                          ? 'rotate-90'
                                          : ''
                                      }`}
                                    >
                                      ▶
                                    </span>
                                  )}
                                </div>

                                {/* Brands */}
                                {hasBrands &&
                                  isSubOpen && (
                                    <div className="ml-2 mt-0.5 border-l border-line pl-2">
                                      <div className="flex flex-col gap-0.5">
                                        {brands.map(
                                          (brand) => {
                                            const isBrandActive =
                                              currentCategory ===
                                                catName &&
                                              currentSubcategory ===
                                                subName &&
                                              currentBrand ===
                                                brand;

                                            const logo =
                                              getBrandLogo(
                                                brand
                                              );

                                            return (
                                              <Link
                                                key={
                                                  brand
                                                }
                                                href={buildUrl(
                                                  catName,
                                                  subName,
                                                  brand
                                                )}
                                                className={`flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[11px] transition-colors ${
                                                  isBrandActive
                                                    ? 'bg-amberSoft font-semibold text-amberDeep'
                                                    : 'text-muted hover:bg-paper hover:text-ink'
                                                }`}
                                              >
                                                {logo ? (
                                                  // eslint-disable-next-line @next/next/no-img-element
                                                  <img
                                                    src={
                                                      logo
                                                    }
                                                    alt=""
                                                    className="h-4 w-4 shrink-0 rounded-sm object-contain"
                                                  />
                                                ) : null}

                                                <span className="truncate">
                                                  {brand}
                                                </span>
                                              </Link>
                                            );
                                          }
                                        )}
                                      </div>
                                    </div>
                                  )}
                              </div>
                            );
                          }
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            }
          )}
        </div>
      </div>
    </nav>
  );
}
