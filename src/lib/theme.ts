'use client';

import { useState, useEffect, useCallback } from 'react';

export type Theme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'lodgehere_theme';
export const THEME_CHANGE_EVENT = 'lodgehere-theme-change';

let memoryTheme: Theme | null = null;

export function getClientTheme(): Theme {
  if (typeof document === 'undefined') return 'light';

  try {
    if (typeof localStorage !== 'undefined' && typeof localStorage.getItem === 'function') {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (stored === 'dark' || stored === 'light') {
        return stored as Theme;
      }
    }
  } catch {
    // Ignore storage errors
  }

  if (memoryTheme) {
    return memoryTheme;
  }

  // Check document cookie
  try {
    if (document.cookie) {
      const match = document.cookie.match(/theme=(dark|light)/);
      if (match) return match[1] as Theme;
    }
  } catch {
    // Ignore
  }

  // Check system preference fallback
  if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }

  return 'light';
}

export function setClientTheme(theme: Theme): void {
  if (typeof document === 'undefined') return;

  memoryTheme = theme;

  try {
    if (typeof localStorage !== 'undefined' && typeof localStorage.setItem === 'function') {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    }
    document.cookie = `theme=${theme}; path=/; max-age=31536000; SameSite=Lax`;
  } catch {
    // Ignore storage errors
  }

  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }

  try {
    if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
      window.dispatchEvent(new CustomEvent(THEME_CHANGE_EVENT, { detail: { theme } }));
    }
  } catch {
    // Ignore
  }
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const initial = getClientTheme();
    setThemeState(initial);

    // Apply on DOM
    if (initial === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    const handleThemeChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ theme: Theme }>;
      if (customEvent.detail?.theme) {
        setThemeState(customEvent.detail.theme);
      } else {
        setThemeState(getClientTheme());
      }
    };

    window.addEventListener(THEME_CHANGE_EVENT, handleThemeChange);
    window.addEventListener('storage', handleThemeChange);

    return () => {
      window.removeEventListener(THEME_CHANGE_EVENT, handleThemeChange);
      window.removeEventListener('storage', handleThemeChange);
    };
  }, []);

  const toggleTheme = useCallback(() => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setThemeState(nextTheme);
    setClientTheme(nextTheme);
  }, [theme]);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    setClientTheme(newTheme);
  }, []);

  return {
    theme,
    toggleTheme,
    setTheme,
    isDark: theme === 'dark',
    mounted,
  };
}
