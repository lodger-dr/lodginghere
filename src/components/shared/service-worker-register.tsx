'use client';

import { useEffect } from 'react';

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((reg) => {
            // Service worker successfully registered
          })
          .catch((err) => {
            console.warn('LodgeHere Service Worker registration skipped:', err);
          });
      });
    }
  }, []);

  return null;
}
