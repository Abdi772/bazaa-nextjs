// Spec table rows (label + value) shown in the description.
// To add the table to another sub-category, add its name to SPEC_SUBCATEGORIES.

export type SpecRow = { label: string; value: string };

export const SPEC_SUBCATEGORIES = ['Phones'];

export const DEFAULT_PHONE_SPECS: SpecRow[] = [
  { label: 'Storage', value: '' },
  { label: 'RAM', value: '' },
  { label: 'Battery health', value: '' },
  { label: 'Color', value: '' },
];

export function hasSpecs(subcategory: string): boolean {
  return SPEC_SUBCATEGORIES.includes(subcategory);
}

// Removes empty rows. Returns null when nothing is left.
export function cleanSpecs(rows: SpecRow[]): SpecRow[] | null {
  const out = rows
    .map((r) => ({ label: r.label.trim(), value: r.value.trim() }))
    .filter((r) => r.label && r.value);
  return out.length > 0 ? out : null;
}
