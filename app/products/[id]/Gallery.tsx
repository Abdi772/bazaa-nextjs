 'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function Gallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const [active, setActive] = useState(0);

  return (
    <div className="mb-4">

      {/* Main image */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-card border border-line bg-paper shadow-card">
        <Image
          src={images[active]}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 600px"
          className="object-cover"
          priority
        />

        {/* Photo counter */}
        {images.length > 1 && (
          <div className="absolute bottom-3 right-3 rounded-full bg-ink/80 px-2.5 py-1 text-xs font-medium text-paper backdrop-blur-sm">
            {active + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {images.map((url, i) => (
            <button
              key={url}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show photo ${i + 1}`}
              aria-current={i === active ? 'true' : undefined}
              className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-bazaa border-2 bg-paper transition-all ${
                i === active
                  ? 'border-amber shadow-card'
                  : 'border-line opacity-70 hover:border-amber/60 hover:opacity-100'
              }`}
            >
              <Image
                src={url}
                alt=""
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

    </div>
  );
}
