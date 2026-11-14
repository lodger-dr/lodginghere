import { describe, it, expect, beforeEach } from 'vitest';
import {
  getClientDevRole,
  setClientDevRole,
  DEV_ROLE_COOKIE,
  DEV_ROLE_CHANGE_EVENT,
} from './dev-role';

describe('Development Testing Role Utility', () => {
  beforeEach(() => {
    // Clear cookies
    document.cookie = `${DEV_ROLE_COOKIE}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    try {
      localStorage.clear();
    } catch {
      // Ignore if localStorage unavailable in environment
    }
  });

  it('should default to student when no cookie or localStorage is set', () => {
    expect(getClientDevRole()).toBe('student');
  });

  it('should set and retrieve landlord role', () => {
    setClientDevRole('landlord');
    expect(getClientDevRole()).toBe('landlord');
  });

  it('should set and retrieve student role', () => {
    setClientDevRole('landlord');
    expect(getClientDevRole()).toBe('landlord');

    setClientDevRole('student');
    expect(getClientDevRole()).toBe('student');
  });

  it('should dispatch DEV_ROLE_CHANGE_EVENT on role change', () => {
    let capturedRole = '';
    const listener = (event: Event) => {
      const customEvent = event as CustomEvent<{ role: string }>;
      capturedRole = customEvent.detail?.role;
    };

    window.addEventListener(DEV_ROLE_CHANGE_EVENT, listener);
    setClientDevRole('landlord');
    window.removeEventListener(DEV_ROLE_CHANGE_EVENT, listener);

    expect(capturedRole).toBe('landlord');
  });
});
