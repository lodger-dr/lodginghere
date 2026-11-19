import type { MetadataRoute } from 'next';
import { getAppBaseUrl } from '@/lib/utils';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getAppBaseUrl();

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/explore',
          '/universities',
          '/how-it-works',
          '/lodges',
          '/lodges/*',
          '/terms',
          '/privacy',
          '/cookies',
          '/licenses',
          '/report',
          '/data-deletion',
        ],
        disallow: [
          '/api/*',
          '/auth/*',
          '/student/*',
          '/landlord/*',
          '/admin/*',
          '/login',
          '/register',
          '/onboarding',
          '/reset-password',
        ],
      },
      {
        // Explicitly allow AI and LLM search agents for high-visibility AEO indexing
        userAgent: [
          'Googlebot',
          'Bingbot',
          'Applebot',
          'GPTBot',
          'ClaudeBot',
          'PerplexityBot',
          'CCBot',
          'cohere-ai',
        ],
        allow: [
          '/',
          '/explore',
          '/universities',
          '/how-it-works',
          '/lodges',
          '/lodges/*',
          '/terms',
          '/privacy',
          '/cookies',
          '/licenses',
          '/data-deletion',
        ],
        disallow: [
          '/api/*',
          '/auth/*',
          '/student/*',
          '/landlord/*',
          '/admin/*',
          '/login',
          '/register',
          '/onboarding',
          '/reset-password',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
