import type { MetadataRoute } from 'next';
import { getLodges } from '@/lib/data/lodges-data';

// Fallback curated showcase slugs that are permanently supported for SEO ranking
const CURATED_SLUGS = [
  'emerald-haven-self-con-akoka',
  'oakwood-executive-studio-agbowo',
  'silvercrest-private-lodge-mayfair',
  'pinecrest-prime-suites-ekosodin',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://lodginghere.vercel.app';
  const now = new Date();

  // 1. Static Core Public Routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/explore`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/universities`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/how-it-works`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/cookies`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/licenses`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/report`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/data-deletion`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ];

  // 2. Dynamic Lodges Routes (Deduplicated)
  const slugSet = new Set<string>(CURATED_SLUGS);
  try {
    const liveLodges = getLodges();
    for (const lodge of liveLodges) {
      if (lodge?.slug) {
        slugSet.add(lodge.slug);
      }
    }
  } catch {
    // If running in build SSR context where localStorage isn't available, CURATED_SLUGS is used
  }

  const lodgeRoutes: MetadataRoute.Sitemap = Array.from(slugSet).map((slug) => ({
    url: `${baseUrl}/lodges/${slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [...staticRoutes, ...lodgeRoutes];
}
