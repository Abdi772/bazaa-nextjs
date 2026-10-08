 import { getModels } from './categories';

// Models for a subcategory + brand.
// Everything comes from lib/categories.ts, so there is one place to edit.
// TV (sizes) and Freezer (types) do not depend on the brand.
export function modelsFor(
  subcategory: string,
  brand: string,
): string[] {
  if (!subcategory) return [];

  const independentOfBrand =
    subcategory === 'TV' || subcategory === 'Freezer';

  if (!brand && !independentOfBrand) return [];

  return getModels(subcategory, brand);
}
