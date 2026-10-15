 // Spec table rows (label + value) shown in the description.
// Each subcategory below gets its own starter rows when the seller picks it.
// To add the table to another subcategory, add a line to SPEC_PRESETS.

export type SpecRow = { label: string; value: string };

const rows = (...labels: string[]): SpecRow[] =>
  labels.map((label) => ({ label, value: '' }));

export const SPEC_PRESETS: Record<string, SpecRow[]> = {
  Phones: rows('Storage', 'RAM', 'Battery health', 'Color'),
  Tablets: rows('Storage', 'RAM', 'SIM or Wi-Fi only', 'Color'),
  Computers: rows('Processor', 'RAM', 'Storage', 'Screen size', 'Battery health'),
  Monitors: rows('Screen size', 'Resolution', 'Refresh rate'),
  Cameras: rows(
    'Camera type',
    'Megapixels',
    'Shutter count',
    'Lens or kit included',
    'Battery and charger included',
    'Memory card included',
  ),
  TV: rows('TV type (LED, QLED, OLED)', 'Resolution (HD, Full HD, 4K)', 'Smart TV', 'Remote and stand included'),
  Gaming: rows('Storage', 'Controllers included', 'Games included'),
  'Photo & Video': rows('Compatible with (mount or brand)', 'Power or size', 'What is in the box'),
  'Solar & Power': rows('Power (W or kVA)', 'Voltage', 'Capacity (Ah or kWh)', 'Warranty'),
};

export const SPEC_SUBCATEGORIES = Object.keys(SPEC_PRESETS);

// Kept so older imports still work.
export const DEFAULT_PHONE_SPECS: SpecRow[] = SPEC_PRESETS.Phones;

export function defaultSpecsFor(subcategory: string): SpecRow[] {
  return (SPEC_PRESETS[subcategory] ?? []).map((r) => ({ ...r }));
}

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
