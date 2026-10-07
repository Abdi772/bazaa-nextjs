  export type CategoryConfig = {
  icon: string;
  /** Brand names for each subcategory. Empty array means brand/model is not required. */
  subcategories: Record<string, string[]>;
};

/**
 * Bazaa marketplace taxonomy.
 *
 * Design rule:
 * - Popular model-heavy categories have curated brand lists.
 * - Model data is maintained separately in MODEL_DATABASE.
 * - Sellers can always enter a model manually when it is not listed.
 * - For categories where a model is not useful, the brand/model fields can remain optional.
 */
export const CATEGORY_CONFIG: Record<string, CategoryConfig> = {
  Electronics: {
    icon: '📱',
    subcategories: {
      Phones: ['Apple','Samsung','Tecno','Infinix','Xiaomi','Redmi','Huawei','Oppo','Vivo','OnePlus','Honor','Google','Nokia','Realme','Itel','Motorola','ZTE','Other'],
      Tablets: ['Samsung','Apple','Lenovo','Huawei','Xiaomi','Honor','Amazon','Microsoft','Tecno','OnePlus','Oppo','Realme','TCL','Asus','Google','Nokia','Motorola','itel','Acer','ZTE','Other'],
      Laptops: ['Apple','HP','Dell','Lenovo','Asus','Acer','MSI','Microsoft','Samsung','Huawei','Other'],
      'Desktop Computers': ['Apple','HP','Dell','Lenovo','Asus','Acer','MSI','Custom PC','Other'],
      Monitors: ['Samsung','LG','Dell','HP','AOC','BenQ','Asus','Acer','ViewSonic','Other'],
      TVs: ['Samsung','LG','Hisense','TCL','Sony','Skyworth','Toshiba','Xiaomi','Panasonic','Philips','Other'],
      Cameras: ['Canon','Sony','Nikon','Fujifilm','Panasonic','Olympus','GoPro','DJI','Leica','Pentax','Kodak','Other'],
      'Camera Lenses': ['Canon','Sony','Nikon','Sigma','Tamron','Fujifilm','Panasonic','Tokina','Other'],
      'Headphones & Earbuds': ['Apple','Samsung','JBL','Sony','Anker Soundcore','Bose','Beats','Huawei','Xiaomi','Other'],
      Speakers: ['JBL','Sony','Samsung','LG','Bose','Marshall','Anker Soundcore','Harman Kardon','Other'],
      'Smart Watches': ['Apple','Samsung','Huawei','Xiaomi','Amazfit','Garmin','Honor','Redmi','Other'],
      'Gaming Consoles': ['Sony PlayStation','Microsoft Xbox','Nintendo','Steam Deck','Other'],
      Projectors: ['Epson','BenQ','Sony','LG','Xiaomi','ViewSonic','Wanbo','Other'],
      'Printers & Scanners': ['HP','Canon','Epson','Brother','Xerox','Ricoh','Other'],
      'Computer Accessories': [],
      'Phone Accessories': [],
      'Chargers & Cables': [],
      'Power Banks': ['Anker','Xiaomi','Baseus','Romoss','Oraimo','Other'],
      'Routers & Networking': ['TP-Link','Huawei','ZTE','D-Link','Tenda','MikroTik','Ubiquiti','Other'],
      'Storage Devices': ['Samsung','SanDisk','Kingston','Western Digital','Seagate','Crucial','Lexar','Other'],
      Drones: ['DJI','Autel','Syma','Holy Stone','Other'],
      'Security & CCTV': ['Hikvision','Dahua','TP-Link','Ezviz','Xiaomi','Hiksemi','Other'],
      'TV & Media Accessories': [],
      'Audio & Microphones': ['JBL','Sony','Bose','Shure','Rode','Sennheiser','Audio-Technica','Other'],
      'Electronic Components': [],
      'Other Electronics': [],
    },
  },

  Vehicles: {
    icon: '🚗',
    subcategories: {
      Cars: ['Toyota','Hyundai','Suzuki','BYD','Nissan','Honda','Kia','Mitsubishi','Volkswagen','Mercedes-Benz','BMW','Lexus','Ford','Chevrolet','Mazda','Subaru','Audi','Land Rover','Jeep','Peugeot','Renault','Chery','Changan','Geely','Jetour','GAC','Great Wall','Haval','Isuzu','MG','Volvo','Tesla','Other'],
      SUVs: ['Toyota','Hyundai','Suzuki','BYD','Nissan','Honda','Kia','Mitsubishi','Lexus','Land Rover','Jeep','Ford','Mazda','Subaru','Chery','Changan','Geely','Jetour','GAC','Haval','Other'],
      'Pickup Trucks': ['Toyota','Ford','Isuzu','Nissan','Mitsubishi','Great Wall','Foton','JAC','Mahindra','Other'],
      'Vans & Minivans': ['Toyota','Hyundai','Nissan','Kia','Mercedes-Benz','Volkswagen','Other'],
      Minibuses: ['Toyota','Hyundai','Isuzu','Foton','King Long','Other'],
      Buses: ['Isuzu','Higer','Yutong','Mercedes-Benz','Hyundai','King Long','Other'],
      Trucks: ['Isuzu','Hino','Mitsubishi Fuso','Volvo','Scania','Mercedes-Benz','Sinotruk HOWO','FAW','Shacman','Other'],
      Trailers: ['Schmitz Cargobull','Krone','Kögel','Other'],
      Motorcycles: ['Bajaj','TVS','Honda','Yamaha','Suzuki','Hero','KTM','Kawasaki','BMW','Lifan','Other'],
      Scooters: ['Honda','Yamaha','Suzuki','TVS','Piaggio','Other'],
      'Three-Wheelers': ['Bajaj','TVS','Piaggio','Other'],
      Bicycles: ['Giant','Trek','Scott','Cannondale','Specialized','Other'],
      'Electric Vehicles': ['BYD','Tesla','Nissan','Hyundai','Kia','Other'],
      Tractors: ['Massey Ferguson','John Deere','New Holland','Kubota','Mahindra','Sonalika','Other'],
      'Heavy Equipment': ['Caterpillar','Komatsu','JCB','Volvo','Hitachi','Hyundai','XCMG','Sany','Other'],
      'Vehicle Parts': [],
      'Tires & Wheels': ['Michelin','Bridgestone','Goodyear','Continental','Pirelli','Yokohama','Other'],
      'Car Accessories': [],
      'Other Vehicles': [],
    },
  },

  'Home & Living': {
    icon: '🏠',
    subcategories: {
      Furniture: [], Sofas: [], Beds: [], Mattresses: [], 'Tables & Chairs': [], Wardrobes: [], Cabinets: [], Shelves: [], 'TV Stands': [],
      Refrigerators: ['Samsung','LG','Hisense','Haier','Midea','Whirlpool','Beko','Other'],
      Freezers: ['Samsung','LG','Hisense','Haier','Midea','Whirlpool','Other'],
      'Washing Machines': ['Samsung','LG','Hisense','Haier','Midea','Whirlpool','Beko','Other'],
      'Air Conditioners': ['Samsung','LG','Midea','Hisense','Gree','Daikin','Carrier','Other'],
      'Kitchen Appliances': ['Samsung','LG','Midea','Philips','Kenwood','Moulinex','Black+Decker','Other'],
      Microwaves: ['Samsung','LG','Hisense','Midea','Panasonic','Other'],
      Ovens: ['Samsung','LG','Beko','Midea','Ariston','Other'],
      'Electric Stoves': ['Samsung','LG','Midea','Beko','Other'],
      'Gas Stoves': ['Midea','Beko','Ariston','Other'],
      'Small Appliances': [],
      Lighting: [], Curtains: [], Carpets: [], 'Home Decor': [], 'Bathroom Items': [], 'Storage & Organization': [],
      'Garden Equipment': [], 'Cleaning Equipment': [], 'Other Home & Living': [],
    },
  },

  Fashion: {
    icon: '👗',
    subcategories: {
      "Men's Clothing": [], "Women's Clothing": [], "Kids' Clothing": [], Shoes: [], Sneakers: [], Sandals: [], Boots: [],
      'Traditional Clothing': [], Sportswear: [], Bags: [], Backpacks: [], Wallets: [], Jewelry: [], Watches: ['Apple','Samsung','Casio','Seiko','Citizen','Fossil','Tissot','Rolex','Other'],
      'Fashion Accessories': [], 'Other Fashion': [],
    },
  },

  'Beauty & Personal Care': {
    icon: '💄',
    subcategories: { Skincare: [], Makeup: [], Perfumes: [], 'Hair Care': [], 'Hair Dryers': [], 'Hair Clippers': [], 'Hair Straighteners': [], 'Electric Shavers': [], 'Oral Care': [], 'Beauty Equipment': [], 'Other Beauty': [] },
  },

  'Baby & Kids': {
    icon: '🍼',
    subcategories: { 'Baby Clothing': [], 'Baby Shoes': [], Strollers: [], 'Car Seats': [], Cribs: [], 'Baby Furniture': [], 'Feeding Items': [], Toys: [], 'Educational Toys': [], 'Kids Bicycles': [], 'School Bags': [], 'Other Baby & Kids': [] },
  },

  'Tools & Machinery': {
    icon: '🔧',
    subcategories: {
      'Power Tools': ['Bosch','Makita','DeWalt','Milwaukee','Stanley','Total','Ingco','Black+Decker','Other'],
      'Hand Tools': ['Stanley','Total','Ingco','Bosch','Makita','Other'],
      'Welding Equipment': ['Lincoln Electric','Miller','ESAB','Ingco','Total','Other'],
      Generators: ['Honda','Yamaha','Firman','Perkins','Cummins','Caterpillar','Other'],
      Compressors: ['Atlas Copco','Ingersoll Rand','Kaeser','Other'],
      Pumps: ['Grundfos','Pedrollo','Kärcher','Other'],
      'Workshop Equipment': [], 'Industrial Machinery': [], 'Other Tools & Machinery': [],
    },
  },

  Agriculture: {
    icon: '🌾',
    subcategories: {
      'Farm Machinery': [], Tractors: ['Massey Ferguson','John Deere','New Holland','Kubota','Mahindra','Sonalika','Other'],
      Plows: [], Cultivators: [], Seeders: [], Harvesters: [], Threshers: [], Sprayers: [],
      'Irrigation Equipment': [], 'Water Pumps': [], 'Poultry Equipment': [], 'Livestock Equipment': [], 'Animal Feed': [], Seeds: [], Fertilizers: [], 'Farm Tools': [], 'Other Agriculture': [],
    },
  },

  'Construction & Building': {
    icon: '🏗️',
    subcategories: {
      'Building Materials': [], Cement: [], Steel: [], 'Wood & Timber': [], Bricks: [], Blocks: [], Sand: [], Gravel: [], Tiles: [], Paint: [], Roofing: [],
      Plumbing: [], 'Electrical Materials': [], 'Doors & Windows': [], 'Construction Tools': [], 'Construction Machinery': ['Caterpillar','Komatsu','JCB','Volvo','Hitachi','Hyundai','XCMG','Sany','Other'], 'Other Construction': [],
    },
  },

  'Office & Business': {
    icon: '💼',
    subcategories: { 'Office Furniture': [], 'Office Computers': ['Apple','HP','Dell','Lenovo','Other'], Printers: ['HP','Canon','Epson','Brother','Xerox','Ricoh','Other'], Scanners: ['HP','Canon','Epson','Brother','Other'], Photocopiers: ['Canon','Ricoh','Xerox','Konica Minolta','Kyocera','Other'], Projectors: ['Epson','BenQ','Sony','LG','Other'], 'POS Machines': [], 'Cash Registers': [], Safes: [], Shredders: [], Stationery: [], 'Commercial Equipment': [], 'Other Office & Business': [] },
  },

  'Sports & Fitness': {
    icon: '⚽',
    subcategories: { 'Gym Equipment': [], Treadmills: ['NordicTrack','ProForm','Technogym','Other'], 'Exercise Bikes': [], Dumbbells: [], 'Weight Sets': [], Football: [], Basketball: [], Volleyball: [], Tennis: [], Cycling: [], Camping: [], 'Outdoor Equipment': [], Sportswear: [], 'Other Sports & Fitness': [] },
  },

  'Books & Education': {
    icon: '📚',
    subcategories: { Textbooks: [], 'University Books': [], 'Medical Books': [], 'School Books': [], 'Children Books': [], 'Reference Books': [], 'Religious Books': [], Stationery: [], 'Educational Equipment': [], 'Musical Instruments': [], 'Other Books & Education': [] },
  },

  'Gaming & Entertainment': {
    icon: '🎮',
    subcategories: { 'PlayStation': ['Sony'], Xbox: ['Microsoft'], Nintendo: ['Nintendo'], 'Gaming PCs': ['Apple','HP','Dell','Lenovo','Asus','Acer','MSI','Other'], 'Gaming Laptops': ['Asus','Lenovo','Acer','MSI','HP','Dell','Other'], 'Gaming Monitors': ['Samsung','LG','AOC','BenQ','Asus','Other'], 'Gaming Chairs': [], Controllers: [], 'Gaming Headsets': [], 'Video Games': [], 'VR Headsets': ['Meta','Sony','HTC','Pico','Other'], 'Musical Instruments': [], Other: [] },
  },

  Property: {
    icon: '🏡',
    subcategories: { 'Houses for Sale': [], 'Houses for Rent': [], 'Apartments for Sale': [], 'Apartments for Rent': [], 'Rooms for Rent': [], Villas: [], Condominiums: [], Shops: [], Offices: [], Warehouses: [], Hotels: [], Restaurants: [], 'Commercial Buildings': [], 'Residential Land': [], 'Agricultural Land': [], 'Commercial Land': [], 'Industrial Land': [], Farms: [], 'Other Property': [] },
  },

  'Jobs & Services': {
    icon: '💼',
    subcategories: { Jobs: [], 'Full-Time Jobs': [], 'Part-Time Jobs': [], Freelance: [], Internship: [], Construction: [], Electrical: [], Plumbing: [], 'Car Repair': [], 'Phone Repair': [], 'Computer Repair': [], Cleaning: [], Transportation: [], Delivery: [], Photography: [], 'Graphic Design': [], 'Web Development': [], Tutoring: [], Translation: [], 'Other Services': [] },
  },

  'Animals & Pets': {
    icon: '🐄',
    subcategories: { Cattle: [], Sheep: [], Goats: [], Horses: [], Camels: [], Chickens: [], Birds: [], Dogs: [], Cats: [], Fish: [], 'Other Pets': [], 'Animal Equipment': [], 'Animal Feed': [] },
  },

  'Food & Groceries': {
    icon: '🛒',
    subcategories: { Grains: [], Fruits: [], Vegetables: [], Meat: [], Dairy: [], Eggs: [], Coffee: [], Spices: [], 'Cooking Oil': [], 'Packaged Food': [], Drinks: [], Snacks: [], 'Other Food': [] },
  },

  'Travel & Luggage': {
    icon: '🧳',
    subcategories: { Suitcases: [], 'Travel Bags': [], Backpacks: [], 'Travel Accessories': [], Tents: [], 'Sleeping Bags': [], 'Camping Equipment': [], Other: [] },
  },

  'Hobbies & Collectibles': {
    icon: '🎨',
    subcategories: { Collectibles: [], Antiques: [], Art: [], 'Musical Instruments': [], Crafts: [], Coins: [], Stamps: [], Toys: [], Photography: [], Other: [] },
  },

  Other: {
    icon: '📦',
    subcategories: { 'Other Products': [] },
  },
};

export const ETHIOPIA_REGIONS = [
  'Addis Ababa',
  'Oromia',
  'Amhara',
  'Tigray',
  'Somali',
  'Afar',
  'Sidama',
  'South Ethiopia',
  'South West Ethiopia',
  'Central Ethiopia',
  'Benishangul-Gumuz',
  'Gambela',
  'Harari',
  'Dire Dawa',
];

export const CONDITIONS = [
  'New',
  'Used - Like New',
  'Used - Good',
  'Used - Fair',
];

// ---------- Brands shown under "Other" ----------
// When the buyer/seller taps "Other", show this list.

export const OTHER_BRANDS: Record<string, string[]> = {
  Phones: [
    'Itel',
    'Nokia',
    'Vivo',
    'Honor',
    'Realme',
    'OnePlus',
    'Google',
    'Motorola',
    'Sony',
    'ZTE',
    'Nothing',
    'Poco',
    'Asus',
    'Lenovo',
    'TCL',
    'Other',
  ],
  Tablets: [
    'Tecno',
    'OnePlus',
    'Oppo',
    'Realme',
    'TCL',
    'Asus',
    'Google',
    'Nokia',
    'Motorola',
    'itel',
    'Acer',
    'Alcatel',
    'ZTE',
    'Vivo',
    'Cidea',
    'Other',
  ],
  TV: [
    'Vizio',
    'Westinghouse',
    'Supersonic',
    'Tornado',
    'Vtex',
    'Weyon',
    'Wyinix',
    'Westpool',
    'Vivibright',
    'UKA',
    'TSTV',
    'Tiger',
    'THTF',
    'Televes',
    'Strong',
    'StarTimes',
    'SPJ',
    'SPAK',
    'Sonix',
    'Solstar',
    'Zum',
    'ZEG',
    'Yayi',
    'XGA',
    'Other',
  ],
  Cameras: [
    'Lumix',
    'Pentax',
    'Leica',
    'Kodak',
    'Polaroid',
    'Konica Minolta',
    'Yashica',
    'Hasselblad',
    'Sigma',
    'Yongnuo',
    'Vivitar',
    'JVC',
    'Sanyo',
    'Hitachi',
    'Garmin',
    'Epson',
    'Autel',
    'Syma',
    'Upair',
    'Red5',
    'Sandisk',
    'Xiaomi',
    'Samsung',
    'Other',
  ],
};

// ---------- Tablets: brands and models ----------
// Models are listed once; Wi-Fi/5G, RAM and storage are variants (separate fields).

export const TABLET_BRANDS = [
  'Samsung',
  'Apple',
  'Lenovo',
  'Huawei',
  'Xiaomi',
  'Honor',
  'Amazon',
  'Microsoft',
  'Other',
];

export const TABLET_OTHER_BRANDS = [
  'Tecno',
  'OnePlus',
  'Oppo',
  'Realme',
  'TCL',
  'Asus',
  'Google',
  'Nokia',
  'Motorola',
  'itel',
  'Acer',
  'Alcatel',
  'ZTE',
  'Vivo',
  'Cidea',
  'Other',
];

export const TABLET_MODELS: Record<string, string[]> = {
  Samsung: [
    'Galaxy Tab S12 Ultra',
    'Galaxy Tab S12+',
    'Galaxy Tab S11 Ultra',
    'Galaxy Tab S11',
    'Galaxy Tab S10 Ultra',
    'Galaxy Tab S10+',
    'Galaxy Tab S10 FE+',
    'Galaxy Tab S10 FE',
    'Galaxy Tab S9 Ultra',
    'Galaxy Tab S9+',
    'Galaxy Tab S9',
    'Galaxy Tab S9 FE+',
    'Galaxy Tab S9 FE',
    'Galaxy Tab S8 Ultra',
    'Galaxy Tab S8+',
    'Galaxy Tab S8',
    'Galaxy Tab S7+',
    'Galaxy Tab S7',
    'Galaxy Tab S7 FE',
    'Galaxy Tab S6',
    'Galaxy Tab S6 Lite',
    'Galaxy Tab S5e',
    'Galaxy Tab S4',
    'Galaxy Tab S3',
    'Galaxy Tab S2',
    'Galaxy Tab A11+',
    'Galaxy Tab A11',
    'Galaxy Tab A9+',
    'Galaxy Tab A9',
    'Galaxy Tab A8',
    'Galaxy Tab A7',
    'Galaxy Tab A7 Lite',
    'Galaxy Tab A 10.1',
    'Galaxy Tab A 8.0',
    'Galaxy Tab A 8.4',
    'Galaxy Tab A 10.5',
    'Galaxy Tab A 7.0',
    'Galaxy Tab Active5',
    'Galaxy Tab Active4 Pro',
    'Galaxy Tab Active3',
    'Galaxy Tab Active2',
    'Galaxy View',
    'Galaxy View2',
    'Other',
  ],
  Apple: [
    'iPad (A16)',
    'iPad 10th generation',
    'iPad 9th generation',
    'iPad 8th generation',
    'iPad 7th generation',
    'iPad 6th generation',
    'iPad 5th generation',
    'iPad 4th generation',
    'iPad 3rd generation',
    'iPad 2',
    'iPad',
    'iPad Air 13-inch (M4)',
    'iPad Air 11-inch (M4)',
    'iPad Air 13-inch (M3)',
    'iPad Air 11-inch (M3)',
    'iPad Air 13-inch (M2)',
    'iPad Air 11-inch (M2)',
    'iPad Air 5',
    'iPad Air 4',
    'iPad Air 3',
    'iPad Air 2',
    'iPad Air',
    'iPad Pro 13-inch (M5)',
    'iPad Pro 11-inch (M5)',
    'iPad Pro 13-inch (M4)',
    'iPad Pro 11-inch (M4)',
    'iPad Pro 12.9-inch (6th generation)',
    'iPad Pro 11-inch (4th generation)',
    'iPad Pro 12.9-inch (5th generation)',
    'iPad Pro 11-inch (3rd generation)',
    'iPad Pro 12.9-inch (4th generation)',
    'iPad Pro 11-inch (2nd generation)',
    'iPad Pro 12.9-inch (3rd generation)',
    'iPad Pro 11-inch',
    'iPad Pro 12.9-inch',
    'iPad Pro 10.5-inch',
    'iPad Pro 9.7-inch',
    'iPad mini (A17 Pro)',
    'iPad mini 6',
    'iPad mini 5',
    'iPad mini 4',
    'iPad mini 3',
    'iPad mini 2',
    'iPad mini',
    'Other',
  ],
  Lenovo: [
    'Lenovo Idea Tab',
    'Lenovo Idea Tab Pro',
    'Lenovo Idea Tab Plus',
    'Lenovo Tab',
    'Lenovo Tab One',
    'Lenovo Tab K9',
    'Lenovo Tab K11',
    'Lenovo Tab K11 Gen 2',
    'Lenovo Tab M8',
    'Lenovo Tab M9',
    'Lenovo Tab M10',
    'Lenovo Tab M10 Plus',
    'Lenovo Tab M11',
    'Lenovo Tab P11',
    'Lenovo Tab P11 Plus',
    'Lenovo Tab P11 Pro',
    'Lenovo Tab P12',
    'Lenovo Tab P12 Pro',
    'Lenovo Tab Extreme',
    'Lenovo Yoga Tab 11',
    'Lenovo Yoga Tab 13',
    'Lenovo Yoga Tab Plus',
    'Lenovo Yoga Smart Tab',
    'Lenovo Legion Tab',
    'Lenovo Legion Y700',
    'Lenovo Legion Y700 2023',
    'Lenovo Legion Y700 2025',
    'Lenovo Legion Y700 Gen 4',
    'Lenovo Legion Y700 Gen 5',
    'Other',
  ],
  Huawei: [
    'MatePad',
    'MatePad SE',
    'MatePad SE 10.4',
    'MatePad SE 11',
    'MatePad 10.4',
    'MatePad 11',
    'MatePad 11.5',
    'MatePad 11.5 2025',
    'MatePad 11.5 S',
    'MatePad 11.5 S 2025',
    'MatePad 12 X',
    'MatePad 12 X 2025',
    'MatePad Air',
    'MatePad Air 2025',
    'MatePad Pro 10.8',
    'MatePad Pro 11',
    'MatePad Pro 12.2',
    'MatePad Pro 13.2',
    'MatePad Pro 13.2 2024',
    'MatePad Edge',
    'Other',
  ],
  Xiaomi: [
    'Xiaomi Pad 7',
    'Xiaomi Pad 7 Pro',
    'Xiaomi Pad 7S Pro',
    'Xiaomi Pad 7 Ultra',
    'Xiaomi Pad 6',
    'Xiaomi Pad 6 Pro',
    'Xiaomi Pad 6S Pro',
    'Xiaomi Pad 5',
    'Xiaomi Pad 5 Pro',
    'Xiaomi Pad 5 Pro 12.4',
    'Xiaomi Pad 4',
    'Xiaomi Pad 4 Plus',
    'Xiaomi Pad 3',
    'Xiaomi Pad 2',
    'Xiaomi Pad 1',
    'Redmi Pad',
    'Redmi Pad SE',
    'Redmi Pad SE 8.7',
    'Redmi Pad 2',
    'Redmi Pad 2 SE',
    'Redmi Pad 2 Pro',
    'Redmi Pad Pro',
    'Redmi K Pad',
    'Black Shark Pad',
    'Black Shark Pad 2',
    'Black Shark Pad 5',
    'Black Shark Pad 6',
    'Black Shark Pad 7',
    'Black Shark Pad 7 Pro',
    'Other',
  ],
  Honor: [
    'Honor Pad',
    'Honor Pad X8',
    'Honor Pad X8a',
    'Honor Pad X8b',
    'Honor Pad X9',
    'Honor Pad X9a',
    'Honor Pad X9 Pro',
    'Honor Pad 9',
    'Honor Pad 9 Pro',
    'Honor Pad V7',
    'Honor Pad V8',
    'Honor Pad V9',
    'Honor Pad GT',
    'Honor Pad GT Pro',
    'Honor MagicPad 2',
    'Honor MagicPad 3',
    'Honor MagicPad 3 Pro',
    'Honor MagicPad 4',
    'Other',
  ],
  Amazon: [
    'Fire 7',
    'Fire HD 8',
    'Fire HD 8 Plus',
    'Fire HD 10',
    'Fire HD 10 Plus',
    'Fire Max 11',
    'Fire HD 10 Kids',
    'Fire HD 10 Kids Pro',
    'Fire HD 8 Kids',
    'Fire HD 8 Kids Pro',
    'Other',
  ],
  Microsoft: [
    'Surface Go',
    'Surface Go 2',
    'Surface Go 3',
    'Surface Go 4',
    'Surface Pro',
    'Surface Pro 3',
    'Surface Pro 4',
    'Surface Pro 5',
    'Surface Pro 6',
    'Surface Pro 7',
    'Surface Pro 7+',
    'Surface Pro 8',
    'Surface Pro 9',
    'Surface Pro 10',
    'Surface Pro 11',
    'Surface Pro X',
    'Surface Book',
    'Surface Book 2',
    'Surface Book 3',
    'Other',
  ],
  Tecno: [
    'Tecno MegaPad 10',
    'Tecno MegaPad 11',
    'Tecno MegaPad 12',
    'Tecno MegaPad SE',
    'Tecno MegaPad Pro',
    'Tecno MegaPad 2',
    'Other',
    ],
  OnePlus: [
    'OnePlus Pad',
    'OnePlus Pad Go',
    'OnePlus Pad Go 2',
    'OnePlus Pad 2',
    'OnePlus Pad 3',
    'Other',
  ],
  Oppo: [
    'Oppo Pad',
    'Oppo Pad Air',
    'Oppo Pad 2',
    'Oppo Pad 3',
    'Oppo Pad 3 Pro',
    'Oppo Pad Neo',
    'Oppo Pad SE',
    'Other',
  ],
  Realme: [
    'Realme Pad',
    'Realme Pad Mini',
    'Realme Pad 2',
    'Realme Pad 2 Lite',
    'Realme Pad X',
    'Realme Pad 2 5G',
    'Other',
  ],
  TCL: [
    'TCL Tab 8',
    'TCL Tab 8 LE',
    'TCL Tab 10',
    'TCL Tab 10L',
    'TCL Tab 10s',
    'TCL Tab 10 Gen 2',
    'TCL Tab 11',
    'TCL Tab 11 FE',
    'TCL Tab 12',
    'TCL NXTPAPER 10s',
    'TCL NXTPAPER 11',
    'TCL NXTPAPER 11 Plus',
    'Other',
  ],
  Asus: [
    'ASUS ROG Flow Z13',
    'ASUS ROG Flow Z13 2025',
    'ASUS ROG Tablet',
    'ASUS ZenPad 3S 10',
    'ASUS ZenPad 10',
    'ASUS ZenPad 8',
    'ASUS ZenPad 7',
    'ASUS Transformer Pad',
    'Other',
  ],
  Google: [
    'Google Pixel Tablet',
    'Google Pixel Tablet 2',
    'Other',
  ],
  Nokia: [
    'Nokia T20',
    'Nokia T21',
    'Nokia T10',
    'Nokia T10 LTE',
    'Other',
  ],
  Motorola: [
    'Moto Tab G20',
    'Moto Tab G20 LTE',
    'Moto Tab G62',
    'Moto Tab G70',
    'Moto Tab G70 LTE',
    'Moto Tab G84',
    'Moto Tab 2024',
    'Moto Pad 60',
    'Moto Pad 60 Pro',
    'Moto Pad 70',
    'Moto Pad 2026',
    'Other',
  ],
  itel: [
    'itel Pad 1',
    'itel Pad 2',
    'itel VistaTab 10',
    'itel VistaTab 10 Mini',
    'itel VistaTab 30',
    'itel VistaTab 30 Pro',
    'Other',
  ],
  Acer: [
    'Acer Iconia Tab',
    'Acer Iconia One',
    'Acer Iconia A1',
    'Acer Iconia B1',
    'Acer Iconia W3',
    'Acer Iconia W4',
    'Acer Iconia Tab 10',
    'Acer Iconia Tab 8',
    'Acer Iconia Duo',
    'Other',
  ],
  Alcatel: [
    'Alcatel 1T',
    'Alcatel 1T 7',
    'Alcatel 1T 10',
    'Alcatel 3T 8',
    'Alcatel 3T 10',
    'Alcatel 3T 10 4G',
    'Alcatel Joy Tab',
    'Alcatel Joy Tab 2',
    'Other',
  ],
  ZTE: [
    'ZTE AxonPad',
    'ZTE AxonPad 5G',
    'ZTE nubia Pad 3D',
    'ZTE nubia Pad 3D II',
    'ZTE Red Magic Gaming Tablet',
    'ZTE Blade Tab',
    'ZTE Grand Memo Pad',
    'Other',
  ],
  Vivo: [
    'Vivo Pad',
    'Vivo Pad Air',
    'Vivo Pad2',
    'Vivo Pad3',
    'Vivo Pad3 Pro',
    'Vivo Pad5',
    'Vivo Pad5 Pro',
    'Other',
  ],
  Cidea: ['Other'],
  Other: ['Other'],
};

// ---------- TV & Audio types ----------

export const TV_AUDIO_TYPES = [
  'TVs',
  'Projectors',
  'TV Receivers',
  'Media Players',
  'Decoders',
  'Digital Signage',
  'DVD Players',
  'Speakers',
  'Microphones',
  'Home Theater Systems',
  'Sound Systems',
  'Soundcards',
  'Amplifiers',
  'Music Mixers',
  'Radios',
  'Turntables',
  'Karaoke',
  'Other',
];

// ---------- Cameras: types and models ----------

export const CAMERA_TYPES = [
  'Digital Cameras',
  'DSLR Cameras',
  'Video Cameras',
  'Action Cameras',
  'Film Cameras',
  'Camera Lenses',
  'Drones',
  'Accessories',
];

export const CAMERA_MODELS: Record<string, string[]> = {
  Canon: [
    'EOS 1500D',
    'EOS 2000D',
    'EOS 4000D',
    'EOS 80D',
    'EOS 90D',
    'EOS 5D Mark IV',
    'EOS R',
    'EOS R6',
    'EOS M50',
    'Other',
  ],
  Sony: [
    'Alpha a6000',
    'Alpha a6400',
    'Alpha a7 III',
    'Alpha a7 IV',
    'ZV-E10',
    'ZV-1',
    'Handycam',
    'Other',
  ],
  Nikon: [
    'D3500',
    'D5600',
    'D7500',
    'D850',
    'Z50',
    'Z6 II',
    'Z fc',
    'Other',
  ],
  GoPro: [
    'Hero 9',
    'Hero 10',
    'Hero 11',
    'Hero 12',
    'Other',
  ],
  DJI: [
    'Osmo Action 3',
    'Osmo Pocket 2',
    'Mini 3',
    'Mavic 3',
    'Other',
  ],
  Fujifilm: [
    'X-T30',
    'X-S10',
    'Instax Mini',
    'Other',
  ],
  Panasonic: ['Lumix G7', 'Lumix GH5', 'Lumix S5', 'Other'],
  Lumix: ['G7', 'GH5', 'S5', 'FZ300', 'Other'],
  Olympus: ['OM-D E-M10', 'OM-D E-M5', 'PEN E-PL9', 'Other'],
  Pentax: ['K-70', 'K-3 III', 'KF', 'Other'],
  Leica: ['Q2', 'M10', 'D-Lux 7', 'Other'],
  Kodak: ['PixPro AZ401', 'Ektar H35', 'Other'],
  Polaroid: ['Now', 'OneStep', 'Other'],
  Sigma: ['18-35mm f/1.8', '50mm f/1.4', '24-70mm f/2.8', 'Other'],
  Yongnuo: ['YN50mm f/1.8', 'YN560 Flash', 'Other'],
  Vivitar: ['Other'],
  JVC: ['Other'],
  Xiaomi: ['Mi Action Camera 4K', 'Other'],
  Samsung: ['Other'],
  Other: ['Other'],
};

// ---------- Generic model database ----------
// Curated common models. The UI must always provide manual model entry as a fallback.
export const MODEL_DATABASE: Record<string, Record<string, string[]>> = {
  Phones: {
    Apple: ['iPhone 17 Pro Max','iPhone 17 Pro','iPhone 17','iPhone Air','iPhone 16 Pro Max','iPhone 16 Pro','iPhone 16 Plus','iPhone 16','iPhone 15 Pro Max','iPhone 15 Pro','iPhone 15 Plus','iPhone 15','iPhone 14 Pro Max','iPhone 14 Pro','iPhone 14','iPhone 13','iPhone 12','iPhone 11','Other'],
    Samsung: ['Galaxy S26 Ultra','Galaxy S26+','Galaxy S26','Galaxy S25 Ultra','Galaxy S25+','Galaxy S25','Galaxy S24 Ultra','Galaxy S24+','Galaxy S24','Galaxy S23 Ultra','Galaxy S23','Galaxy A56','Galaxy A36','Galaxy A26','Galaxy A16','Galaxy A15','Galaxy A14','Galaxy A05','Galaxy A05s','Galaxy M55','Galaxy M35','Galaxy M15','Galaxy Z Fold7','Galaxy Z Flip7','Galaxy Z Fold6','Galaxy Z Flip6','Other'],
    Tecno: ['Camon 40','Camon 30','Camon 20','Spark 40','Spark 30','Spark 20','Pova 7','Pova 6','Phantom V Fold','Phantom V Flip','Other'],
    Infinix: ['Note 50','Note 40','Note 30','Hot 60','Hot 50','Hot 40','Smart 10','Smart 9','GT 30 Pro','GT 20 Pro','Other'],
    Xiaomi: ['Xiaomi 15 Ultra','Xiaomi 15','Xiaomi 14','Xiaomi 13','Xiaomi 12','Other'],
    Redmi: ['Redmi Note 14 Pro+','Redmi Note 14 Pro','Redmi Note 14','Redmi Note 13 Pro+','Redmi Note 13 Pro','Redmi Note 13','Redmi 14C','Redmi 13C','Redmi 12','Other'],
    Huawei: ['Pura 80 Pro','Pura 70 Pro','Mate 70 Pro','Mate 60 Pro','Nova 13','Nova 12','Nova 11','Other'],
    Oppo: ['Find X8 Pro','Find X8','Reno 13 Pro','Reno 13','Reno 12','A5 Pro','A3x','Other'],
    Vivo: ['X200 Pro','X200','V50','V40','V30','Y200','Y100','Other'],
    Honor: ['Magic7 Pro','Magic V5','200 Pro','200','X9c','X8c','Other'],
    Google: ['Pixel 10 Pro XL','Pixel 10 Pro','Pixel 10','Pixel 9 Pro XL','Pixel 9 Pro','Pixel 9','Pixel 8 Pro','Pixel 8','Other'],
    Nokia: ['G42','G22','C32','C22','105','Other'],
    Other: ['Other'],
  },
  Laptops: {
    Apple: ['MacBook Air M4','MacBook Air M3','MacBook Air M2','MacBook Pro M4','MacBook Pro M3','MacBook Pro M2','Other'],
    HP: ['EliteBook 840','EliteBook 850','ProBook 450','ProBook 440','Pavilion 15','Pavilion 14','Envy 13','Envy 15','Victus 15','Victus 16','Omen 16','Other'],
    Dell: ['Latitude 5440','Latitude 5430','Latitude 5420','Inspiron 15','Inspiron 14','XPS 13','XPS 15','G15','Other'],
    Lenovo: ['ThinkPad T14','ThinkPad T480','ThinkPad T490','ThinkPad X1 Carbon','IdeaPad 3','IdeaPad 5','Yoga 7','Legion 5','Legion 7','LOQ 15','Other'],
    Asus: ['VivoBook 15','VivoBook 14','ZenBook 14','ROG Zephyrus G14','ROG Strix G16','TUF Gaming A15','Other'],
    Acer: ['Aspire 5','Aspire 3','Swift 3','Swift Go','Nitro 5','Nitro V','Predator Helios','Other'],
    Other: ['Other'],
  },
  TVs: {
    Samsung: ['Crystal UHD','QLED Q60','QLED Q70','QLED Q80','Neo QLED QN90','OLED S90','OLED S95','The Frame','Other'],
    LG: ['UHD AI ThinQ','NanoCell','QNED','OLED C4','OLED C5','OLED G4','Other'],
    Hisense: ['A6 Series','U6 Series','U7 Series','U8 Series','Other'],
    TCL: ['P Series','C Series','QLED C6','QLED C7','Other'],
    Sony: ['BRAVIA 3','BRAVIA 5','BRAVIA 7','BRAVIA 8','BRAVIA 9','Other'],
    Other: ['Other'],
  },
  Refrigerators: {
    Samsung: ['Bespoke','French Door','Side-by-Side','Top Freezer','Other'],
    LG: ['InstaView','French Door','Side-by-Side','Smart Inverter','Other'],
    Hisense: ['French Door','Side-by-Side','Top Mount','Other'],
    Other: ['Other'],
  },
  'Washing Machines': {
    Samsung: ['WW Series','AI EcoBubble','AddWash','Other'],
    LG: ['AI DD','TurboWash','Inverter Direct Drive','Other'],
    Hisense: ['WF Series','Other'],
    Other: ['Other'],
  },
  Cars: {
    Toyota: ['Corolla','Yaris','Vitz','RAV4','Land Cruiser','Land Cruiser Prado','Hilux','Hiace','Camry','Rush','Fortuner','Avensis','Belta','Premio','Allion','Probox','Succeed','Other'],
    Hyundai: ['Tucson','Santa Fe','Elantra','Accent','Sonata','i10','i20','i30','Creta','Kona','Staria','H-1','Other'],
    Suzuki: ['Dzire','Swift','Alto','Celerio','Baleno','Vitara','Ertiga','Jimny','S-Presso','Other'],
    BYD: ['Seal','Atto 3','Dolphin','Qin','Song','Han','Tang','Seagull','Other'],
    Nissan: ['Sunny','X-Trail','Patrol','Navara','Qashqai','Tiida','March','Note','Juke','Other'],
    Honda: ['Civic','Accord','CR-V','Fit','HR-V','Vezel','Other'],
    Kia: ['Sportage','Sorento','Picanto','Rio','Seltos','Carnival','K5','Other'],
    Mitsubishi: ['Lancer','Pajero','Outlander','L200','ASX','Other'],
    Volkswagen: ['Golf','Polo','Passat','Tiguan','Touareg','Transporter','Other'],
    'Mercedes-Benz': ['C-Class','E-Class','S-Class','GLC','GLE','Sprinter','Other'],
    BMW: ['3 Series','5 Series','7 Series','X3','X5','X6','Other'],
    Lexus: ['RX','LX','NX','ES','LS','GX','Other'],
    Ford: ['Ranger','Everest','Explorer','Escape','F-150','Other'],
    Other: ['Other'],
  },
  SUVs: {
    Toyota: ['Land Cruiser','Land Cruiser Prado','RAV4','Fortuner','Rush','Other'],
    Hyundai: ['Tucson','Santa Fe','Creta','Kona','Other'],
    Kia: ['Sportage','Sorento','Seltos','Other'],
    Nissan: ['X-Trail','Patrol','Qashqai','Juke','Other'],
    Other: ['Other'],
  },
  'Pickup Trucks': {
    Toyota: ['Hilux','Tundra','Tacoma','Other'], Ford: ['Ranger','F-150','Maverick','Other'], Isuzu: ['D-Max','Other'], Nissan: ['Navara','Other'], Mitsubishi: ['L200','Other'], Other: ['Other'],
  },
  Motorcycles: {
    Bajaj: ['Pulsar','Boxer','Discover','Platina','CT 100','Other'], TVS: ['Apache','HLX','Radeon','King','Other'], Honda: ['CB Series','CG Series','Africa Twin','Other'], Yamaha: ['FZ','MT-15','R15','XTZ','Other'], Suzuki: ['GSX','Gixxer','V-Strom','Other'], Other: ['Other'],
  },
  'Smart Watches': { Apple: ['Apple Watch Series 11','Apple Watch Series 10','Apple Watch Ultra 2','Apple Watch SE','Other'], Samsung: ['Galaxy Watch8','Galaxy Watch7','Galaxy Watch6','Galaxy Watch5','Other'], Huawei: ['Watch GT 5','Watch GT 4','Watch 4 Pro','Other'], Other: ['Other'] },
  'Gaming Consoles': { 'Sony PlayStation': ['PS5 Pro','PS5 Slim','PS5','PS4 Pro','PS4','Other'], 'Microsoft Xbox': ['Xbox Series X','Xbox Series S','Xbox One X','Xbox One S','Other'], Nintendo: ['Switch 2','Switch OLED','Switch','Switch Lite','Other'], Other: ['Other'] },
  Drones: { DJI: ['Mavic 4 Pro','Mavic 3','Mini 4 Pro','Mini 3 Pro','Air 3','Avata 2','Other'], Autel: ['EVO Lite','EVO II','Other'], Other: ['Other'] },
};

// ---------- Subcategory pictures ----------
// Pictures live in public/categories/sub/<slug>.jpg
// When you add a new picture, add its slug to this list.

const SUB_IMAGES = new Set([
  'phones',
  'computers-tablets',
  'tv-audio',
  'cameras',
  'gaming',

  'cars',
  'motorcycles',
  'trucks-vans',
  'parts-accessories',

  'sofas',
  'beds',
  'tables-chairs',
  'storage',
  'other-furniture',

  'men-s-clothing',
  'women-s-clothing',
  'shoes',
  'bags-accessories',
  'other-fashion',

  'for-rent',
  'land',
  'other-property',
]);

// "Men's Clothing" -> "men-s-clothing"
export function subcategorySlug(
  name: string,
): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Returns the picture path,
// or null if that subcategory has no picture yet
export function subcategoryImage(
  name: string,
): string | null {
  const raw = subcategorySlug(name);

  // Reuse existing pictures after renaming
  const aliases: Record<string, string> = {
    computers: 'computers-tablets',
    tv: 'tv-audio',
  };

  const slug = aliases[raw] ?? raw;

  return SUB_IMAGES.has(slug)
    ? `/categories/sub/${slug}.jpg`
    : null;
}


// ---------- Helpers ----------

// Models for a subcategory + brand (empty list = no models yet)
export function getModels(
  subcategory: string,
  brand: string,
): string[] {
  // Preserve the detailed tablet and camera databases already in this file.
  if (subcategory === 'Tablets') return TABLET_MODELS[brand] ?? ['Other'];
  if (subcategory === 'Cameras') return CAMERA_MODELS[brand] ?? ['Other'];

  // All other model-enabled categories use the shared database.
  return MODEL_DATABASE[subcategory]?.[brand] ?? [];
}

/** True when a subcategory has a curated model list for the selected brand. */
export function hasModels(subcategory: string, brand: string): boolean {
  return getModels(subcategory, brand).length > 0;
}

/**
 * Models are suggestions, not a restriction. The UI should always show
 * an "Enter model manually" option when the seller cannot find a match.
 */
export const MANUAL_MODEL_LABEL = 'Enter model manually';

// Extra brands shown after the buyer/seller taps "Other"
export function getOtherBrands(
  subcategory: string,
): string[] {
  return OTHER_BRANDS[subcategory] ?? [];
                          }
