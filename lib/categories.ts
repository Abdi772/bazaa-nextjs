 export type CategoryConfig = {
  icon: string;
  subcategories: Record<string, string[]>;
};

export const CATEGORY_CONFIG: Record<string, CategoryConfig> = {
  Electronics: {
    icon: '📱',
    subcategories: {
      Phones: ['iPhone', 'Samsung', 'Xiaomi', 'Redmi', 'Tecno', 'Infinix', 'Huawei', 'Oppo', 'Other'],
      'Computers & Tablets': ['Apple', 'HP', 'Dell', 'Lenovo', 'Samsung', 'Asus', 'Other'],
      'TV & Audio': [],
      Cameras: [],
      Gaming: ['PlayStation', 'Xbox', 'Nintendo', 'Other'],
      'Other Electronics': [],
    },
  },
  Vehicles: {
    icon: '🚗',
    subcategories: {
      Cars: ['Toyota', 'Hyundai', 'Suzuki', 'Nissan', 'Volkswagen', 'Other'],
      Motorcycles: ['Bajaj', 'TVS', 'Other'],
      'Trucks & Vans': [],
      'Parts & Accessories': [],
      'Other Vehicles': [],
    },
  },
  Furniture: {
    icon: '🛋️',
    subcategories: {
      Sofas: [],
      Beds: [],
      'Tables & Chairs': [],
      Storage: [],
      'Other Furniture': [],
    },
  },
  Fashion: {
    icon: '👗',
    subcategories: {
      "Men's Clothing": [],
      "Women's Clothing": [],
      Shoes: [],
      'Bags & Accessories': [],
      'Other Fashion': [],
    },
  },
  Property: {
    icon: '🏠',
    subcategories: {
      'For Rent': [],
      'For Sale': [],
      Land: [],
      'Other Property': [],
    },
  },
  Other: { icon: '📦', subcategories: {} },
};

export const ETHIOPIA_REGIONS = [
  'Addis Ababa', 'Oromia', 'Amhara', 'Tigray', 'Somali', 'Afar', 'Sidama',
  'South Ethiopia', 'South West Ethiopia', 'Central Ethiopia',
  'Benishangul-Gumuz', 'Gambela', 'Harari', 'Dire Dawa',
];

export const CONDITIONS = ['New', 'Used - Like New', 'Used - Good', 'Used - Fair'];

// ---------- Subcategory pictures ----------
// Pictures live in public/categories/sub/<slug>.jpg (top level of the repo).
// When you add a new picture, add its slug to this list.
const SUB_IMAGES = new Set([
  'phones', 'computers-tablets', 'tv-audio', 'cameras', 'gaming',
  'cars', 'motorcycles', 'trucks-vans', 'parts-accessories',
  'sofas', 'beds', 'tables-chairs', 'storage', 'other-furniture',
  'men-s-clothing', 'women-s-clothing', 'shoes',
  'bags-accessories', 'other-fashion',
  'for-rent', 'land', 'other-property',
]);

// "Men's Clothing" -> "men-s-clothing"
export function subcategorySlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

// Returns the picture path, or null if that subcategory has no picture yet
export function subcategoryImage(name: string): string | null {
  const slug = subcategorySlug(name);
  return SUB_IMAGES.has(slug) ? `/categories/sub/${slug}.jpg` : null;
}
