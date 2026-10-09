'use client';

import { useEffect, useState } from 'react';

type Size = 'small' | 'normal' | 'large' | 'xlarge';

const OPTIONS: { value: Size; label: string; textClass: string }[] = [
  { value: 'small', label: 'Small', textClass: 'text-xs' },
  { value: 'normal', label: 'Normal', textClass: 'text-sm' },
  { value: 'large', label: 'Large', textClass: 'text-base' },
  { value: 'xlarge', label: 'Extra', textClass: 'text-lg' },
];

function applySize(size: Size) {
  if (size === 'normal') {
    delete document.documentElement.dataset.bazaaSize;
    localStorage.removeItem('bazaa-size');
  } else {
    document.documentElement.dataset.bazaaSize = size;
    localStorage.setItem('bazaa-size', size);
  }
}

export default function SizeControl() {
  const [size, setSize] = useState<Size>('normal');

  useEffect(() => {
    const current = document.documentElement.dataset.bazaaSize;
    if (current === 'small' || current === 'large' || current === 'xlarge') {
      setSize(current);
    }
  }, []);

  function choose(next: Size) {
    applySize(next);
    setSize(next);
  }

  return (
    <div
      role="radiogroup"
      aria-label="Display size"
      className="grid grid-cols-4 gap-2"
    >
      {OPTIONS.map((option) => {
        const selected = size === option.value;

        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => choose(option.value)}
            className={`rounded-bazaa border px-2 py-2.5 font-bold transition-colors ${option.textClass} ${
              selected
                ? 'border-amber bg-amberSoft text-amberText'
                : 'border-line bg-panel text-fg hover:bg-amberSoft'
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
