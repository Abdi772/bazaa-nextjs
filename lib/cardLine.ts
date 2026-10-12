export function cardLine(
  brand?: string | null,
  model?: string | null,
  title?: string | null,
) {
  const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '');
  const t = norm(title ?? '');

  return [brand, model]
    .filter((p): p is string => !!p)
    .filter((p) => !t.includes(norm(p)))
    .join(' • ');
}
