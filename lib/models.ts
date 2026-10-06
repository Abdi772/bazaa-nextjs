 // Phone models (keys are brand names; 'iPhone' maps to 'Apple').

export const PHONE_MODELS: Record<string, string[]> = {
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


// ---------- Cars ----------
const CAR_MODELS: Record<string, string[]> = {
  Toyota: [
    'Corolla', 'Yaris', 'Vitz', 'Camry', 'Avalon', 'Aqua', 'Premio', 'Allion', 'Axio', 'Fielder',
    'RAV4', 'Rush', 'Fortuner', 'Hilux', 'Land Cruiser', 'Land Cruiser Prado', 'V8', 'Hiace',
    'Corolla Cross', 'C-HR', 'Probox', 'Succeed', 'Starlet', 'Auris', 'Other Toyota',
  ],
  Hyundai: [
    'i10', 'i20', 'i30', 'Accent', 'Elantra', 'Sonata', 'Tucson', 'Santa Fe', 'Creta', 'Venue',
    'Atos', 'Getz', 'H1', 'County', 'Other Hyundai',
  ],
  Suzuki: [
    'Alto', 'Swift', 'Dzire', 'Celerio', 'Baleno', 'Vitara', 'Grand Vitara', 'Jimny', 'Ertiga',
    'S-Presso', 'Ciaz', 'APV', 'Other Suzuki',
  ],
  Nissan: [
    'Sunny', 'Tiida', 'Note', 'Micra', 'Almera', 'Altima', 'Qashqai', 'X-Trail', 'Juke', 'Patrol',
    'Navara', 'Hardbody', 'Urvan', 'Other Nissan',
  ],
  Volkswagen: [
    'Polo', 'Golf', 'Jetta', 'Passat', 'Tiguan', 'Touareg', 'Beetle', 'Santana', 'Caddy',
    'Transporter', 'Other Volkswagen',
  ],
  Other: ['Other model'],
};

// ---------- Motorcycles ----------
const MOTORCYCLE_MODELS: Record<string, string[]> = {
  Bajaj: [
    'Boxer 100', 'Boxer 150', 'Pulsar 125', 'Pulsar 150', 'Pulsar 180', 'Pulsar 200 NS', 'Pulsar 220',
    'Discover', 'Platina', 'CT100', 'Dominar 400', 'Avenger', 'Qute', 'Tuk-tuk (RE)', 'Other Bajaj',
  ],
  TVS: [
    'Apache RTR 160', 'Apache RTR 180', 'Apache RTR 200', 'HLX 125', 'HLX 150', 'Star City',
    'Sport', 'Jupiter', 'Ntorq', 'King (Tuk-tuk)', 'Other TVS',
  ],
  Other: ['Other model'],
};

// ---------- Laptops & Tablets ----------
const COMPUTER_MODELS: Record<string, string[]> = {
  Apple: [
    'MacBook Air M1', 'MacBook Air M2', 'MacBook Air M3', 'MacBook Pro 13"', 'MacBook Pro 14"',
    'MacBook Pro 16"', 'iMac', 'Mac mini', 'iPad', 'iPad Air', 'iPad Pro', 'iPad mini', 'Other Apple',
  ],
  HP: [
    'EliteBook', 'ProBook', 'Pavilion', 'Envy', 'Spectre', 'Omen', 'Victus', 'ZBook',
    'HP 250', 'HP 255', 'Stream', 'Other HP',
  ],
  Dell: [
    'Latitude', 'Inspiron', 'XPS', 'Vostro', 'Precision', 'Alienware', 'G15', 'Other Dell',
  ],
  Lenovo: [
    'ThinkPad T-Series', 'ThinkPad X-Series', 'ThinkPad E-Series', 'IdeaPad 1', 'IdeaPad 3', 'IdeaPad 5',
    'Legion 5', 'Legion 7', 'Yoga', 'ThinkBook', 'Other Lenovo',
  ],
  Samsung: [
    'Galaxy Book', 'Galaxy Tab S9', 'Galaxy Tab S8', 'Galaxy Tab A9', 'Galaxy Tab A8', 'Chromebook', 'Other Samsung',
  ],
  Asus: [
    'VivoBook', 'ZenBook', 'ROG Strix', 'ROG Zephyrus', 'TUF Gaming', 'ExpertBook', 'Chromebook', 'Other Asus',
  ],
  Other: ['Other model'],
};

// ---------- Gaming ----------
const GAMING_MODELS: Record<string, string[]> = {
  PlayStation: ['PS5 Disc', 'PS5 Digital', 'PS5 Slim', 'PS5 Pro', 'PS4 Pro', 'PS4 Slim', 'PS4', 'PS3', 'Other PlayStation'],
  Xbox: ['Xbox Series X', 'Xbox Series S', 'Xbox One X', 'Xbox One S', 'Xbox One', 'Xbox 360', 'Other Xbox'],
  Nintendo: ['Switch OLED', 'Switch', 'Switch Lite', 'Wii', '3DS', 'Other Nintendo'],
  Other: ['Other model'],
};

// Which list belongs to which sub-category
const MODELS_BY_SUBCATEGORY: Record<string, Record<string, string[]>> = {
  Phones: PHONE_MODELS,
  Cars: CAR_MODELS,
  Motorcycles: MOTORCYCLE_MODELS,
  'Computers & Tablets': COMPUTER_MODELS,
  Gaming: GAMING_MODELS,
};

// The one function the filter and the Post/Edit forms use.
// modelsFor('Cars', 'Toyota')  ->  ['Corolla', 'Yaris', ...]
// Returns [] when there is no list (then the form shows a text box).
export function modelsFor(subcategory: string, brand: string): string[] {
  const key = subcategory === 'Phones' && brand === 'iPhone' ? 'Apple' : brand;
  return MODELS_BY_SUBCATEGORY[subcategory]?.[key] ?? [];
}

// "Other ..." choices let the seller type a model that is not in our list.
export const OTHER_MODEL = 'Other model';

export function isOtherModel(model: string): boolean {
  return model.startsWith('Other');
}

// The list shown on the Model screen: always ends with an "Other" choice.
export function modelOptionsFor(subcategory: string, brand: string): string[] {
  const list = modelsFor(subcategory, brand);
  if (list.length === 0) return list;
  return list.some(isOtherModel) ? list : [...list, OTHER_MODEL];
    }
