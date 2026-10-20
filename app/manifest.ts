 import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Jimma — Buy & Sell Marketplace',
    short_name: 'Jimma',
    description: 'Buy and sell anything, right in your area.',
    id: '/',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#F7F5F0',
    theme_color: '#19182B',
    icons: [
      { src: '/categories/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/categories/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/categories/icon-maskable-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
      { src: '/categories/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
