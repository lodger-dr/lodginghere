import { describe, it, expect, beforeEach } from 'vitest';
import {
  getCookieConsent,
  setCookieConsent,
  acceptAllCookies,
  rejectNonEssentialCookies,
  submitDataDeletionRequest,
  getDataDeletionRequests,
  hasPendingDeletionRequest,
  getEmailPreferences,
  setEmailPreferences,
  unsubscribeEmailFromAll,
} from './privacy';

describe('Privacy and Consent Module', () => {
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

    if (typeof window !== 'undefined') {
      Object.defineProperty(window, 'localStorage', {
        value: storageMock,
        writable: true,
        configurable: true,
      });
    }
    Object.defineProperty(globalThis, 'localStorage', {
      value: storageMock,
      writable: true,
      configurable: true,
    });
  });

  describe('Cookie Consent Management', () => {
    it('returns null when no cookie preferences have been set', () => {
      expect(getCookieConsent()).toBeNull();
    });

    it('saves and reads custom cookie preferences', () => {
      const saved = setCookieConsent({
        preferences: true,
        analytics: false,
        marketing: false,
      });

      expect(saved.essential).toBe(true);
      expect(saved.preferences).toBe(true);
      expect(saved.analytics).toBe(false);
      expect(saved.marketing).toBe(false);

      const fetched = getCookieConsent();
      expect(fetched).not.toBeNull();
      expect(fetched?.essential).toBe(true);
      expect(fetched?.preferences).toBe(true);
      expect(fetched?.analytics).toBe(false);
    });

    it('accepts all cookies correctly', () => {
      const consent = acceptAllCookies();
      expect(consent.essential).toBe(true);
      expect(consent.preferences).toBe(true);
      expect(consent.analytics).toBe(true);
      expect(consent.marketing).toBe(true);
    });

    it('rejects non-essential cookies while preserving essential cookies', () => {
      const consent = rejectNonEssentialCookies();
      expect(consent.essential).toBe(true);
      expect(consent.preferences).toBe(false);
      expect(consent.analytics).toBe(false);
      expect(consent.marketing).toBe(false);
    });
  });

  describe('Data Deletion Requests', () => {
    it('creates a new data deletion request and stores it', () => {
      const req = submitDataDeletionRequest({
        email: 'student@example.com',
        role: 'student',
        reason: 'Graduating university and closing account',
      });

      expect(req.id).toBeDefined();
      expect(req.email).toBe('student@example.com');
      expect(req.status).toBe('pending');

      const all = getDataDeletionRequests();
      expect(all).toHaveLength(1);
      expect(all[0].email).toBe('student@example.com');
      expect(hasPendingDeletionRequest('STUDENT@EXAMPLE.COM')).toBe(true);
    });

    it('correctly tracks multiple deletion requests without collision', () => {
      submitDataDeletionRequest({
        email: 'user1@unilag.edu.ng',
        role: 'student',
        reason: 'Privacy choice',
      });
      submitDataDeletionRequest({
        email: 'landlord@domain.com',
        role: 'landlord',
        reason: 'Selling property',
      });

      const all = getDataDeletionRequests();
      expect(all).toHaveLength(2);
      expect(hasPendingDeletionRequest('user1@unilag.edu.ng')).toBe(true);
      expect(hasPendingDeletionRequest('landlord@domain.com')).toBe(true);
      expect(hasPendingDeletionRequest('unknown@domain.com')).toBe(false);
    });
  });

  describe('Email Notification Preferences & Unsubscribe', () => {
    it('defaults to marketing opt-out for new users', () => {
      const prefs = getEmailPreferences('newstudent@example.com');
      expect(prefs.email).toBe('newstudent@example.com');
      expect(prefs.inspectionAlerts).toBe(true); // essential
      expect(prefs.lodgesUpdates).toBe(false);   // default opt-out
      expect(prefs.platformNews).toBe(false);    // default opt-out
      expect(prefs.unsubscribedAll).toBe(false);
    });

    it('unsubscribes a user from all non-essential communications', () => {
      const updated = unsubscribeEmailFromAll('newstudent@example.com');
      expect(updated.unsubscribedAll).toBe(true);
      expect(updated.lodgesUpdates).toBe(false);
      expect(updated.platformNews).toBe(false);

      const fetched = getEmailPreferences('newstudent@example.com');
      expect(fetched.unsubscribedAll).toBe(true);
    });

    it('allows customized preference updates', () => {
      const updated = setEmailPreferences('custom@example.com', {
        lodgesUpdates: true,
        platformNews: false,
      });

      expect(updated.lodgesUpdates).toBe(true);
      expect(updated.platformNews).toBe(false);
    });
  });
});
