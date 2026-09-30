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
