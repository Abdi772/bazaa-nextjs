// Brand logo images, served as normal files from public/brands so the
// browser only downloads the ones it shows and can cache them.
export const BRAND_LOGOS: Record<string, string> = {
  'xiaomi': '/brands/xiaomi.png',
  'tecno': '/brands/tecno.png',
  'oppo': '/brands/oppo.png',
  'infinix': '/brands/infinix.png',
  'huawei': '/brands/huawei.png',
  'redmi': '/brands/redmi.png',
  'samsung': '/brands/samsung.png',
  'asus': '/brands/asus.png',
  'hp': '/brands/hp.png',
  'lenovo': '/brands/lenovo.png',
  'apple': '/brands/apple.png',
  'dell': '/brands/dell.png',
  'toyota': '/brands/toyota.png',
  'nissan': '/brands/nissan.png',
  'hyundai': '/brands/hyundai.png',
  'suzuki': '/brands/suzuki.png',
  'volkswagen': '/brands/volkswagen.png',
  'tvs': '/brands/tvs.png',
  'bajaj': '/brands/bajaj.png',
};

// Some listed brand names differ from the logo file name (e.g. the
// phone brand 'iPhone' uses Apple's logo).
export const BRAND_LOGO_ALIASES: Record<string, string> = {
  iphone: 'apple',
};

export function getBrandLogo(brand: string): string | null {
  const key = BRAND_LOGO_ALIASES[brand.toLowerCase()] || brand.toLowerCase();
  return BRAND_LOGOS[key] || null;
}
