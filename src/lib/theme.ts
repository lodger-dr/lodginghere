'use client';

import { useState, useEffect, useCallback } from 'react';

export type Theme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'lodgehere_theme';
export const THEME_CHANGE_EVENT = 'lodgehere-theme-change';

/**
 * Reads the current client theme from localStorage, DOM classList, cookie, or system preference.
 */
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
    // Ignore storage access errors (e.g. private browsing restrictions or unavailable storage)
  }

  // Check DOM class state (e.g. set by root layout inline script before hydration)
  if (document.documentElement?.classList.contains('dark')) {
    return 'dark';
  }

  // Check cookie (for SSR/middleware compatibility)
  try {
    if (document.cookie) {
      const match = document.cookie.match(/(?:^|;\s*)theme=(dark|light)/);
      if (match) return match[1] as Theme;
    }
  } catch {
    // Ignore cookie read errors
  }

  // Check system preference fallback
  if (
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  ) {
    return 'dark';
  }

  return 'light';
}

/**
 * Persists theme choice to localStorage, cookies, DOM classList, and dispatches a change event.
 */
export function setClientTheme(theme: Theme): void {
  if (typeof document === 'undefined') return;

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

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(THEME_CHANGE_EVENT, { detail: { theme } }));
  }
}

/**
 * React hook to read and toggle the application theme.
 */
export function useTheme() {
  const [theme, setThemeState] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const initial = getClientTheme();
    setThemeState(initial);

    // Ensure DOM class reflects current theme
    if (initial === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // In-window custom event handler
    const handleThemeChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ theme: Theme }>;
      if (customEvent.detail?.theme) {
        setThemeState(customEvent.detail.theme);
      } else {
        setThemeState(getClientTheme());
      }
    };

    // Cross-tab storage change handler
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === THEME_STORAGE_KEY && (e.newValue === 'dark' || e.newValue === 'light')) {
        const newTheme = e.newValue as Theme;
        setThemeState(newTheme);
        if (newTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    };

    // System dark mode preference change handler
    const mediaQuery =
      typeof window !== 'undefined' && window.matchMedia
        ? window.matchMedia('(prefers-color-scheme: dark)')
        : null;

    const handleSystemChange = (e: MediaQueryListEvent) => {
      try {
        const stored =
          typeof localStorage !== 'undefined' && typeof localStorage.getItem === 'function'
            ? localStorage.getItem(THEME_STORAGE_KEY)
            : null;
        // Only adapt to system change if user has not explicitly chosen a preference
        if (!stored) {
          const sysTheme: Theme = e.matches ? 'dark' : 'light';
          setThemeState(sysTheme);
          if (sysTheme === 'dark') {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
      } catch {}
    };

    window.addEventListener(THEME_CHANGE_EVENT, handleThemeChange);
    window.addEventListener('storage', handleStorageChange);

    if (mediaQuery) {
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleSystemChange);
      } else if ('addListener' in mediaQuery) {
        (mediaQuery as any).addListener(handleSystemChange);
      }
    }

    return () => {
      window.removeEventListener(THEME_CHANGE_EVENT, handleThemeChange);
      window.removeEventListener('storage', handleStorageChange);
      if (mediaQuery) {
        if (mediaQuery.removeEventListener) {
          mediaQuery.removeEventListener('change', handleSystemChange);
        } else if ('removeListener' in mediaQuery) {
          (mediaQuery as any).removeListener(handleSystemChange);
        }
      }
    };
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const nextTheme: Theme = prev === 'dark' ? 'light' : 'dark';
      setClientTheme(nextTheme);
      return nextTheme;
    });
  }, []);

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
