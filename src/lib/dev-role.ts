'use client';

import { useState, useEffect, useCallback } from 'react';

export type DevRole = 'student' | 'landlord';

export const DEV_ROLE_COOKIE = 'dev_role';
export const DEV_ROLE_CHANGE_EVENT = 'dev-role-change';

/**
 * Reads the active role in testing mode from document cookies or localStorage.
 * Defaults to 'student' if none is set.
 */
export function getClientDevRole(): DevRole {
  if (typeof document === 'undefined') return 'student';

  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${DEV_ROLE_COOKIE}=([^;]*)`));
  if (match && (match[1] === 'student' || match[1] === 'landlord')) {
    return match[1] as DevRole;
  }

  try {
    const stored = localStorage.getItem(DEV_ROLE_COOKIE);
    if (stored === 'student' || stored === 'landlord') {
      return stored as DevRole;
    }
  } catch {
    // Ignore storage access errors
  }

  return 'student';
}

/**
 * Sets the active role in testing mode across cookies, localStorage, and triggers window event.
 */
export function setClientDevRole(role: DevRole): void {
  if (typeof document === 'undefined') return;

  document.cookie = `${DEV_ROLE_COOKIE}=${role}; path=/; max-age=31536000; SameSite=Lax`;

  try {
    localStorage.setItem(DEV_ROLE_COOKIE, role);
  } catch {
    // Ignore storage access errors
  }

  window.dispatchEvent(new CustomEvent(DEV_ROLE_CHANGE_EVENT, { detail: { role } }));
}

/**
 * React hook to read and switch the active development role.
 */
export function useDevRole() {
  const [role, setRoleState] = useState<DevRole>('student');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setRoleState(getClientDevRole());

    const handleRoleChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ role: DevRole }>;
      if (customEvent.detail?.role) {
        setRoleState(customEvent.detail.role);
      } else {
        setRoleState(getClientDevRole());
      }
    };

    window.addEventListener(DEV_ROLE_CHANGE_EVENT, handleRoleChange);
    window.addEventListener('storage', handleRoleChange);

    return () => {
      window.removeEventListener(DEV_ROLE_CHANGE_EVENT, handleRoleChange);
      window.removeEventListener('storage', handleRoleChange);
    };
  }, []);

  const switchRole = useCallback((newRole: DevRole) => {
    setRoleState(newRole);
    setClientDevRole(newRole);
  }, []);

  return {
    role,
    switchRole,
    isStudent: role === 'student',
    isLandlord: role === 'landlord',
    mounted,
  };
}
