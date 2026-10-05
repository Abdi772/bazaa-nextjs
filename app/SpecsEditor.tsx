'use client';

import type { SpecRow } from '../lib/specs';

const cell =
  'w-full min-h-[44px] rounded-bazaa border-[1.5px] border-line bg-white px-3 py-2 text-base text-ink placeholder:text-mutedLight transition-colors focus:border-amber focus:outline-none focus:ring-2 focus:ring-amber/20';

export default function SpecsEditor({
  rows,
  onChange,
  disabled,
}: {
  rows: SpecRow[];
  onChange: (rows: SpecRow[]) => void;
  disabled?: boolean;
}) {
  function update(i: number, patch: Partial<SpecRow>) {
    onChange(rows.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  }

  function remove(i: number) {
    onChange(rows.filter((_, idx) => idx !== i));
  }

  function add() {
    onChange([...rows, { label: '', value: '' }]);
  }

  return (
    <div className="mt-5">
      <div className="mb-2 text-sm font-bold text-ink">Specifications</div>

      <div className="overflow-hidden rounded-bazaa border-[1.5px] border-line">
        <div className="grid grid-cols-[1fr_1fr_44px] gap-2 bg-surfaceSoft px-2 py-2 text-xs font-bold text-muted">
          <div className="px-1">Name</div>
          <div className="px-1">Details</div>
          <div />
        </div>

        {rows.map((row, i) => (
          <div
            key={i}
            className="grid grid-cols-[1fr_1fr_44px] items-center gap-2 border-t border-line bg-surface px-2 py-2"
          >
            <input
              className={cell}
              value={row.label}
              onChange={(e) => update(i, { label: e.target.value })}
              placeholder="e.g. Storage"
              disabled={disabled}
              aria-label={`Specification name, row ${i + 1}`}
            />
            <input
              className={cell}
              value={row.value}
              onChange={(e) => update(i, { value: e.target.value })}
              placeholder="e.g. 128 GB"
              disabled={disabled}
              aria-label={`Specification details, row ${i + 1}`}
            />
            <button
              type="button"
              onClick={() => remove(i)}
              disabled={disabled}
              className="flex h-11 w-11 items-center justify-center rounded-bazaa text-xl text-muted hover:text-danger"
              aria-label={`Remove row ${i + 1}`}
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={add}
        disabled={disabled}
        className="bazaa-secondary mt-3 min-h-[44px] px-4 text-sm"
      >
        + Add row
      </button>
    </div>
  );
}
