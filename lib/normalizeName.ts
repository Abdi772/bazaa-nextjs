// Cleans a brand / type name typed by a seller so that
// "canon", "Canon " and "CANON" all become one value: "Canon".
// If the text matches a name already in the list, that exact spelling is used.
export function normalizeName(input: string, known: string[] = []): string {
  const cleaned = input.replace(/\s+/g, ' ').trim();

  if (!cleaned) return '';

  const key = cleaned.toLowerCase();
  const hit = known.find((k) => k.toLowerCase() === key);

  if (hit && !/^other\b/i.test(hit)) return hit;

  return cleaned
    .split(' ')
    .map((word) => {
      // keep short all-capital names such as JBL, MSI, LG, HP
      if (word.length <= 4 && word === word.toUpperCase() && /[A-Z]/.test(word)) {
        return word;
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
}
