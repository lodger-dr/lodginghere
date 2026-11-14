import { describe, it, expect, beforeEach } from 'vitest';
import { getClientTheme, setClientTheme, THEME_STORAGE_KEY } from './theme';

describe('Theme Utility', () => {
  beforeEach(() => {
    try {
      localStorage.clear();
    } catch {}
    document.documentElement.classList.remove('dark');
  });

  it('should set theme to dark and update classList', () => {
    setClientTheme('dark');
    expect(getClientTheme()).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('should set theme to light and remove classList', () => {
    setClientTheme('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);

    setClientTheme('light');
    expect(getClientTheme()).toBe('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });
});
