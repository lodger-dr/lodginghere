import { describe, it, expect } from 'vitest';
import robots from './robots';
import sitemap from './sitemap';

describe('SEO & Crawling Configuration', () => {
  describe('robots.ts', () => {
    it('should generate valid Robots configuration with allowed and disallowed paths', () => {
      const robotsConfig = robots();

      expect(robotsConfig).toBeDefined();
      expect(robotsConfig.sitemap).toBe('https://lodginghere.vercel.app/sitemap.xml');
      expect(robotsConfig.host).toBe('https://lodginghere.vercel.app');

      const rules = Array.isArray(robotsConfig.rules) ? robotsConfig.rules : [robotsConfig.rules];
      expect(rules.length).toBeGreaterThan(0);

      // Check default crawler rule
      const wildcardRule = rules.find((r) => r.userAgent === '*');
      expect(wildcardRule).toBeDefined();
      expect(wildcardRule?.allow).toContain('/');
      expect(wildcardRule?.allow).toContain('/explore');
      expect(wildcardRule?.allow).toContain('/universities');
      expect(wildcardRule?.allow).toContain('/how-it-works');

      // Check disallow protection for private & auth routes
      expect(wildcardRule?.disallow).toContain('/api/*');
      expect(wildcardRule?.disallow).toContain('/student/*');
      expect(wildcardRule?.disallow).toContain('/landlord/*');
      expect(wildcardRule?.disallow).toContain('/admin/*');
      expect(wildcardRule?.disallow).toContain('/login');
      expect(wildcardRule?.disallow).toContain('/onboarding');
    });

    it('should explicitly support AI crawlers for Answer Engine Optimization (AEO)', () => {
      const robotsConfig = robots();
      const rules = Array.isArray(robotsConfig.rules) ? robotsConfig.rules : [robotsConfig.rules];

      const aiRule = rules.find(
        (r) =>
          Array.isArray(r.userAgent) &&
          (r.userAgent.includes('GPTBot') ||
            r.userAgent.includes('PerplexityBot') ||
            r.userAgent.includes('ClaudeBot'))
      );

      expect(aiRule).toBeDefined();
      expect(aiRule?.allow).toContain('/');
    });
  });

  describe('sitemap.ts', () => {
    it('should generate valid Sitemap containing core public routes', async () => {
      const sitemapEntries = await sitemap();

      expect(Array.isArray(sitemapEntries)).toBe(true);
      expect(sitemapEntries.length).toBeGreaterThanOrEqual(10);

      const urls = sitemapEntries.map((e) => e.url);

      // Core pages
      expect(urls).toContain('https://lodginghere.vercel.app');
      expect(urls).toContain('https://lodginghere.vercel.app/explore');
      expect(urls).toContain('https://lodginghere.vercel.app/universities');
      expect(urls).toContain('https://lodginghere.vercel.app/how-it-works');
      expect(urls).toContain('https://lodginghere.vercel.app/terms');
      expect(urls).toContain('https://lodginghere.vercel.app/privacy');

      // Dynamic showcase lodges
      expect(urls).toContain('https://lodginghere.vercel.app/lodges/emerald-haven-self-con-akoka');
      expect(urls).toContain('https://lodginghere.vercel.app/lodges/oakwood-executive-studio-agbowo');
    });

    it('should assign proper priority and lastModified to all sitemap entries', async () => {
      const sitemapEntries = await sitemap();

      for (const entry of sitemapEntries) {
        expect(entry.url).toMatch(/^https:\/\/lodginghere\.vercel\.app/);
        expect(entry.lastModified).toBeInstanceOf(Date);
        expect(typeof entry.priority).toBe('number');
        expect(entry.priority).toBeGreaterThanOrEqual(0.1);
        expect(entry.priority).toBeLessThanOrEqual(1.0);
      }
    });
  });
});
