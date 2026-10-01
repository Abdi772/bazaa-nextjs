'use client';

import { useState } from 'react';

export default function SubImage({ name }: { name: string }) {
  const [failed, setFailed] = useState(false);
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  if (failed) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/subcategories/${slug}.jpg`}
      alt=""
      className="w-full h-full object-cover"
      onError={() => setFailed(true)}
    />
  );
}
