import { describe, it, expect } from 'vitest';
import { cn, formatNaira, formatDate } from './utils';

describe('Utility Functions', () => {
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
});
