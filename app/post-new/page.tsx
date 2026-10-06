 "use client";
import { useState } from "react";

// TEMP options from the planning PDF. Later we swap these for lib/categories.ts.
const itemCategories = ["Electronics", "Vehicles", "Furniture", "Fashion", "Property", "Other"];

const itemSubs: Record<string, string[]> = {
  Electronics: ["Phones", "Computers & Tablets", "TV & Audio", "Cameras", "Gaming", "Other Electronics"],
  Vehicles: ["Cars", "Motorcycles", "Trucks", "Other Vehicles"],
  Furniture: ["Sofas", "Beds", "Tables", "Other Furniture"],
  Fashion: ["Clothing", "Shoes", "Bags", "Other Fashion"],
  Property: ["Houses", "Apartments", "Land", "Other Property"],
  Other: [],
};

const brandsBySub: Record<string, string[]> = {
  Phones: ["Apple", "Samsung", "Xiaomi", "Redmi", "Tecno", "Infinix", "Huawei", "Oppo", "Other"],
};

const serviceCategories = [
  "Automotive", "Home & Repair", "Cleaning", "Education", "Technology",
  "Photography & Media", "Beauty & Personal Care", "Transport & Moving",
  "Professional Services", "Other Services",
];

const serviceSubs: Record<string, string[]> = {
  Technology: ["Phone Repair", "Computer Repair", "Software / IT", "Web Development", "Graphic Design", "Other"],
};

type Answers = { type?: string; category?: string; subcategory?: string; brand?: string };

// Every answer controls the next screen
function stepsFor(a: Answers): string[] {
  const steps = ["type"];
  if (!a.type) return steps;
  steps.push("category");
  if (!a.category) return steps;
  const subs = a.type === "Item" ? itemSubs[a.category] : serviceSubs[a.category];
  if (subs && subs.length) steps.push("subcategory");
  if (a.type === "Item" && a.subcategory && brandsBySub[a.subcategory]) steps.push("brand");
  return steps;
}

export default function PostNew() {
  const [answers, setAnswers] = useState<Answers>({});
  const [index, setIndex] = useState(0);

  const steps = stepsFor(answers);
  const current = steps[index];

  function choose(key: keyof Answers, value: string) {
    // changing an answer clears the answers after it
    const next: Answers = { ...answers, [key]: value };
    if (key === "type") { delete next.category; delete next.subcategory; delete next.brand; }
    if (key === "category") { delete next.subcategory; delete next.brand; }
    if (key === "subcategory") { delete next.brand; }
    setAnswers(next);
    setIndex(index + 1);
  }

  const isItem = answers.type === "Item";

  const options: string[] =
    current === "type" ? ["Item", "Service"]
    : current === "category" ? (isItem ? itemCategories : serviceCategories)
    : current === "subcategory" ? (isItem ? itemSubs[answers.category!] : serviceSubs[answers.category!]) || []
    : current === "brand" ? brandsBySub[answers.subcategory!] || []
    : [];

  const titles: Record<string, string> = {
    type: "What are you offering?",
    category: isItem ? "What type of item is it?" : "What kind of service do you provide?",
    subcategory: isItem ? `What kind of ${answers.category?.toLowerCase()}?` : "What kind of service?",
    brand: "Which brand?",
  };

  const btn = {
    display: "block", width: "100%", padding: "14px", marginBottom: 10,
    borderRadius: 10, border: "1px solid #ccc", background: "#fff",
    fontSize: 16, textAlign: "left" as const, cursor: "pointer",
  };

  return (
    <main style={{ maxWidth: 480, margin: "0 auto", padding: 20 }}>
      {index > 0 && (
        <button onClick={() => setIndex(index - 1)} style={{ marginBottom: 12, background: "none", border: "none", fontSize: 16, cursor: "pointer" }}>
          ← Back
        </button>
      )}

      {current ? (
        <>
          <h1 style={{ fontSize: 22, marginBottom: 16 }}>{titles[current]}</h1>
          {options.map((o) => (
            <button key={o} style={btn} onClick={() => choose(current as keyof Answers, o)}>
              {o}
            </button>
          ))}
        </>
      ) : (
        <>
          <h1 style={{ fontSize: 22, marginBottom: 16 }}>
            {isItem ? "Photos screen comes next" : "Service Details screen comes next"}
          </h1>
          <pre style={{ background: "#f4f4f4", padding: 12, borderRadius: 8 }}>
            {JSON.stringify(answers, null, 2)}
          </pre>
        </>
      )}
    </main>
  );
}
