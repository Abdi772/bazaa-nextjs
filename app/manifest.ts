 import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Jimma — Buy & Sell Marketplace',
    short_name: 'Jimma',
    description: 'Buy and sell anything, right in your area.',
    start_url: '/',
    display: 'standalone',
    background_color: '#F3EFE7',
    theme_color: '#1B1A2E',
    icons: [
      { src: '/categories/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/categories/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
    ],
  };
}
