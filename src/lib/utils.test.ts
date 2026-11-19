import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { cn, formatNaira, formatDate, getAppBaseUrl } from './utils';

describe('Utility Functions', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('cn (Tailwind class merger)', () => {
    it('should merge class names properly', () => {
      expect(cn('px-2', 'py-1')).toBe('px-2 py-1');
    });

    it('should resolve Tailwind class conflicts with later wins', () => {
      expect(cn('bg-red-500', 'bg-blue-500')).toBe('bg-blue-500');
    });

    it('should ignore falsey values', () => {
      expect(cn('px-2', false && 'py-1', undefined, null, 'text-sm')).toBe('px-2 text-sm');
    });
  });

  describe('formatNaira', () => {
    it('should format amounts with Nigerian currency symbol or NGN', () => {
      const formatted = formatNaira(350000);
      expect(formatted).toMatch(/(₦|NGN)\s?350,000/);
    });

    it('should format zero correctly', () => {
      const formatted = formatNaira(0);
      expect(formatted).toMatch(/(₦|NGN)\s?0/);
    });
  });

  describe('formatDate', () => {
    it('should return N/A for null or undefined dates', () => {
      expect(formatDate(null)).toBe('N/A');
      expect(formatDate(undefined)).toBe('N/A');
      expect(formatDate('')).toBe('N/A');
    });

    it('should format valid ISO date strings', () => {
      const formatted = formatDate('2026-11-14T10:00:00Z');
      expect(formatted).toContain('2026');
    });
  });

  describe('getAppBaseUrl', () => {
    it('should prioritize NEXT_PUBLIC_APP_URL and strip trailing slash', () => {
      process.env.NEXT_PUBLIC_APP_URL = 'https://custom-domain.com/';
      expect(getAppBaseUrl()).toBe('https://custom-domain.com');
    });

    it('should fallback to VERCEL_PROJECT_PRODUCTION_URL', () => {
      delete process.env.NEXT_PUBLIC_APP_URL;
      process.env.VERCEL_PROJECT_PRODUCTION_URL = 'lodgehere-prod.vercel.app';
      expect(getAppBaseUrl()).toBe('https://lodgehere-prod.vercel.app');
    });

    it('should fallback to VERCEL_URL', () => {
      delete process.env.NEXT_PUBLIC_APP_URL;
      delete process.env.VERCEL_PROJECT_PRODUCTION_URL;
      process.env.VERCEL_URL = 'lodgehere-preview.vercel.app';
      expect(getAppBaseUrl()).toBe('https://lodgehere-preview.vercel.app');
    });

    it('should default to production domain when no env is set', () => {
      delete process.env.NEXT_PUBLIC_APP_URL;
      delete process.env.VERCEL_PROJECT_PRODUCTION_URL;
      delete process.env.VERCEL_URL;
      expect(getAppBaseUrl()).toBe('https://lodginghere.vercel.app');
    });
  });
});
