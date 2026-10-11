'use client';

export default function DescriptionFields({
  values,
  onChange,
  max = 3,
}: {
  values: string[];
  onChange: (next: string[]) => void;
  max?: number;
}) {
  function setAt(i: number, v: string) {
    onChange(values.map((x, idx) => (idx === i ? v : x)));
  }

  function removeAt(i: number) {
    onChange(values.filter((_, idx) => idx !== i));
  }

  return (
    <div>
      {values.map((v, i) => (
        <div key={i} className="mb-3">
          {values.length > 1 && (
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-sm font-bold text-fg">
                Description {i + 1}
              </span>

              {i > 0 && (
                <button
                  type="button"
                  onClick={() => removeAt(i)}
                  className="text-sm font-bold text-red-600"
                >
                  Remove
                </button>
              )}
            </div>
          )}

          <textarea
            id={i === 0 ? 'listing-description' : undefined}
            className="w-full min-h-[140px] resize-y rounded-bazaa border border-line bg-surface px-4 py-3 text-base text-fg placeholder:text-mutedLight transition-colors focus:border-amber focus:outline-none focus:ring-2 focus:ring-amber/20"
            rows={5}
            required={i === 0}
            value={v}
            onChange={(e) => setAt(i, e.target.value)}
            placeholder="Condition, details, why you're selling..."
          />
        </div>
      ))}

      {values.length < max && (
        <button
          type="button"
          onClick={() => onChange([...values, ''])}
          className="mt-1 min-h-[44px] rounded-full border border-line bg-surface px-4 text-sm font-bold text-fg transition-colors hover:bg-amberSoft"
        >
          + Add another description ({values.length}/{max})
        </button>
      )}
    </div>
  );
}
