'use client';

import { useState } from 'react';
import Image from 'next/image';

// Shows the first picture that exists. If none exist, shows `fallback`.
export default function FallbackImage({
  srcs,
  alt,
  sizes,
  className,
  fallback = null,
}: {
  srcs: string[];
  alt: string;
  sizes: string;
  className?: string;
  fallback?: React.ReactNode;
}) {
  const [index, setIndex] = useState(0);

  if (index >= srcs.length) return <>{fallback}</>;

  return (
    <Image
      key={srcs[index]}
      src={srcs[index]}
      alt={alt}
      fill
      sizes={sizes}
      className={className}
      onError={() => setIndex((i) => i + 1)}
    />
  );
}
