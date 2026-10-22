'use client';

import { useState } from 'react';
import Image, { type ImageProps } from 'next/image';

// Hosts that next.config.js allows Vercel to resize.
const OPTIMIZED_HOSTS = (() => {
  const hosts = ['okxmpkrokqihhfdwtnmx.supabase.co'];
  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      hosts.push(new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname);
    }
  } catch {
    // ignore a badly formatted env value
  }
  return hosts;
})();

function canOptimize(src: ImageProps['src']): boolean {
  if (typeof src !== 'string') return true;
  if (src.startsWith('/')) return true;
  try {
    const u = new URL(src);
    return (
      u.protocol === 'https:' &&
      OPTIMIZED_HOSTS.includes(u.hostname) &&
      u.pathname.startsWith('/storage/v1/object/public/')
    );
  } catch {
    return false;
  }
}

// Drop-in replacement for next/image for listing photos.
// - Supabase photos are resized and compressed by Vercel.
// - Any other URL (older listings) is shown as-is, so it never breaks.
// - If a resized photo fails to load, it retries with the original file.
export default function ListingImage({
  unoptimized,
  onError,
  ...props
}: ImageProps) {
  const [failedSrc, setFailedSrc] = useState<ImageProps['src'] | null>(null);
  const optimizable = canOptimize(props.src);

  return (
    <Image
      {...props}
      unoptimized={
        unoptimized || !optimizable || failedSrc === props.src
      }
      onError={(e) => {
        if (optimizable && failedSrc !== props.src) {
          setFailedSrc(props.src);
        }
        onError?.(e);
      }}
    />
  );
}
