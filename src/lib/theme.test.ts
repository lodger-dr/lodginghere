import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getClientTheme, setClientTheme, THEME_STORAGE_KEY, THEME_CHANGE_EVENT } from './theme';

describe('Theme Utility', () => {
  let mockStorage: Record<string, string> = {};

  beforeEach(() => {
    mockStorage = {};
    const storageMock = {
      getItem: (key: string) => mockStorage[key] ?? null,
      setItem: (key: string, val: string) => {
        mockStorage[key] = String(val);
      },
      removeItem: (key: string) => {
        delete mockStorage[key];
      },
      clear: () => {
        mockStorage = {};
      },
      length: 0,
      key: () => null,
    };

    Object.defineProperty(window, 'localStorage', {
      value: storageMock,
      writable: true,
      configurable: true,
    });
    Object.defineProperty(globalThis, 'localStorage', {
      value: storageMock,
      writable: true,
      configurable: true,
    });

    document.documentElement.classList.remove('dark');
    document.cookie = 'theme=; path=/; max-age=0';
  });

  it('should set theme to dark and update classList and localStorage', () => {
    setClientTheme('dark');
    expect(getClientTheme()).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(mockStorage[THEME_STORAGE_KEY]).toBe('dark');
  });

  it('should set theme to light and remove classList and update localStorage', () => {
    setClientTheme('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);

    setClientTheme('light');
    expect(getClientTheme()).toBe('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(mockStorage[THEME_STORAGE_KEY]).toBe('light');
  });

  it('should read theme from DOM classList if localStorage is empty', () => {
    mockStorage = {};
    document.documentElement.classList.add('dark');
    expect(getClientTheme()).toBe('dark');
  });

  it('should read theme from cookie if localStorage and classList are empty', () => {
    mockStorage = {};
    document.documentElement.classList.remove('dark');
    document.cookie = 'theme=dark; path=/';
    expect(getClientTheme()).toBe('dark');
  });

  it('should dispatch THEME_CHANGE_EVENT when theme changes', () => {
    const listener = vi.fn();
    window.addEventListener(THEME_CHANGE_EVENT, listener);

    setClientTheme('dark');

    expect(listener).toHaveBeenCalled();
    window.removeEventListener(THEME_CHANGE_EVENT, listener);
  });
});
