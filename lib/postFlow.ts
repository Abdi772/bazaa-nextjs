// lib/postFlow.ts
// Config for the posting wizard. Screens read from here.

export type Field = {
  key: string;
  label: string;
  type: "select" | "text" | "number";
  options?: string[];
  placeholder?: string;
};

// Order of screens for the Item path
export const itemSteps = [
  "category",
  "subcategory",
  "brand",
  "photos",
  "model",
  "details",
  "basics", // title, price, description
  "location",
  "preview",
] as const;

export type ItemStep = (typeof itemSteps)[number];

// Model screen: brand -> models. A brand not listed here shows "Other" only.
export const phoneModels: Record<string, string[]> = {
  Samsung: [
    "Galaxy A15", "Galaxy A25", "Galaxy A35", "Galaxy A55",
    "Galaxy S23", "Galaxy S24", "Galaxy S24 Ultra", "Galaxy S25",
  ],
  Apple: [
    "iPhone 11", "iPhone 11 Pro", "iPhone 11 Pro Max",
    "iPhone 12", "iPhone 12 Pro", "iPhone 12 Pro Max",
    "iPhone 13", "iPhone 13 Pro", "iPhone 13 Pro Max",
    "iPhone 14", "iPhone 14 Pro", "iPhone 14 Pro Max",
    "iPhone 15", "iPhone 15 Pro", "iPhone 15 Pro Max",
  ],
};

// Details screen: only these fields appear for phones
export const phoneFields: Field[] = [
  { key: "storage", label: "Storage", type: "select",
    options: ["32GB", "64GB", "128GB", "256GB", "512GB", "1TB"] },
  { key: "ram", label: "RAM", type: "select",
    options: ["2GB", "3GB", "4GB", "6GB", "8GB", "12GB", "16GB"] },
  { key: "condition", label: "Condition", type: "select",
    options: ["New", "Like new", "Used - good", "Used - fair"] },
  { key: "color", label: "Color", type: "text" },
  { key: "battery_health", label: "Battery health (%)", type: "number",
    placeholder: "e.g. 90" },
  { key: "sim_type", label: "SIM type", type: "select",
    options: ["Single SIM", "Dual SIM", "eSIM"] },
  { key: "accessories", label: "Accessories included", type: "text",
    placeholder: "Charger, box, case..." },
];

// Which field set applies to a subcategory
export const detailFieldsBySubcategory: Record<string, Field[]> = {
  Phones: phoneFields,
};
