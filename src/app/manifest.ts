import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'LodgeHere',
    short_name: 'LodgeHere',
    description:
      'Map-based student accommodation discovery across Nigerian university campuses. Verified landlords, transparent pricing, zero agent fees, and direct physical inspections.',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#F8F8F6',
    theme_color: '#F45B2A',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  };
}
