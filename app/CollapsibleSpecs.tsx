'use client';

import { useState } from 'react';

type Row = { label: string; value: string };

// Shows the first few specs, with "Show more / Hide" for the rest.
export default function CollapsibleSpecs({
  rows,
  limit = 6,
}: {
  rows: Row[];
  limit?: number;
}) {
  const [open, setOpen] = useState(false);

  const canCollapse = rows.length > limit;
  const shown = open || !canCollapse ? rows : rows.slice(0, limit);

  return (
    <section className="mb-4 rounded-card border border-line bg-surface p-5 shadow-card sm:p-6">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amberSoft text-lg">
          📋
        </div>

        <h2 className="font-serif text-xl font-bold text-fg">
          Specifications
        </h2>
      </div>

      <dl className="grid grid-cols-2 gap-x-4 gap-y-4">
        {shown.map((row, i) => (
          <div key={`${row.label}-${i}`} className="min-w-0">
            <dd className="break-words text-sm font-bold text-fg sm:text-base">
              {row.value}
            </dd>

            <dt className="mt-0.5 text-xs font-semibold uppercase tracking-wide text-muted">
              {row.label}
            </dt>
          </div>
        ))}
      </dl>

      {canCollapse && (
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className="inline-flex min-h-[40px] items-center gap-1 text-sm font-bold text-amberText hover:underline"
          >
            {open ? 'Show less ⌃' : `Show more (${rows.length - limit}) ⌄`}
          </button>
        </div>
      )}
    </section>
  );
}
