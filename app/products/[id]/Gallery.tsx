 'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function Gallery({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState(0);

  return (
    <div className="mt-3 mb-3">
      <div className="aspect-[4/3] relative rounded-lg overflow-hidden bg-[#EDE7D9]">
        <Image src={images[active]} alt={title} fill sizes="600px" className="object-cover" priority />
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 mt-2 overflow-x-auto">
          {images.map((url, i) => (
            <button
              key={url}
              type="button"
              onClick={() => setActive(i)}
              className={`relative w-16 h-16 shrink-0 rounded overflow-hidden border-2 ${
                i === active ? 'border-ink' : 'border-transparent'
              }`}
              aria-label={`Show photo ${i + 1}`}
            >
              <Image src={url} alt="" fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
