'use client';

import { useState } from 'react';
import Link from 'next/link';

type Item = {
  name: string;
  href: string;
  selected: boolean;
};

// Horizontal row of model chips with a small search box.
// The search box only appears when the list is long.
export default function ModelRow({
  items,
}: {
  items: Item[];
}) {
  const [text, setText] = useState('');

  const clean = (v: string) =>
    v.toLowerCase().replace(/[^a-z0-9]+/g, '');

  const q = clean(text);

  const shown = q
    ? items.filter(
        (i) => i.selected || clean(i.name).includes(q),
      )
    : items;

  const matches = q
    ? items.filter((i) => clean(i.name).includes(q))
        .length
    : items.length;

  return (
    <div className="mb-4">
      {items.length > 12 && (
        <input
          type="search"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Search model..."
          className="mb-2 w-full rounded-full border border-line bg-surface px-4 py-2 text-xs text-fg outline-none focus:border-amber"
        />
      )}

      {q && matches === 0 ? (
        <p className="px-1 text-xs text-muted">
          No model found. Clear the search or choose a
          different brand.
        </p>
      ) : (
        <div className="overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex w-max gap-2">
            {shown.map((m) => (
              <Link
                key={m.name}
                href={m.href}
                className={`whitespace-nowrap rounded-full border px-3.5 py-2 text-xs font-semibold transition-colors ${
                  m.selected
                    ? 'border-amber bg-amber text-ink'
                    : 'border-line bg-surface text-fg hover:border-amber'
                }`}
              >
                {m.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
