/**
 * Privacy, Consent, and Data Governance Module
 * Handles Cookie Consent state, Data Deletion requests, and Email Subscription preferences.
 * Compliant with GDPR, NDPR (Nigeria Data Protection Regulation 2019 / NDPA 2023), and CCPA.
 */

export interface CookiePreferences {
  essential: boolean; // Always true
  preferences: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
}

export interface DataDeletionRequest {
  id: string;
  email: string;
  role: 'student' | 'landlord' | 'other';
  reason: string;
  details?: string;
  requested_at: string;
  status: 'pending' | 'processing' | 'completed';
}

export interface EmailPreferences {
  email: string;
  inspectionAlerts: boolean; // Transactional / essential for bookings
  lodgesUpdates: boolean;    // Marketing / campus digests
  platformNews: boolean;     // Product updates
  unsubscribedAll: boolean;
  updated_at: string;
}

export const COOKIE_CONSENT_KEY = 'lodgehere_cookie_consent';
export const DATA_DELETION_KEY = 'lodgehere_data_deletion_requests';
export const EMAIL_PREFS_KEY = 'lodgehere_email_preferences';
export const COOKIE_CONSENT_CHANGE_EVENT = 'lodgehere-cookie-consent-change';

/**
 * Default cookie state (Strict opt-in: non-essential cookies disabled until user consents)
 */
export const DEFAULT_COOKIE_PREFERENCES: CookiePreferences = {
  essential: true,
  preferences: false,
  analytics: false,
  marketing: false,
  timestamp: '',
};

/**
 * Retrieves the current cookie consent preferences from storage.
 */
export function getCookieConsent(): CookiePreferences | null {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return null;
  }

  try {
    const raw = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return {
      essential: true, // Always enforced
      preferences: Boolean(parsed.preferences),
      analytics: Boolean(parsed.analytics),
      marketing: Boolean(parsed.marketing),
      timestamp: parsed.timestamp || new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

/**
 * Saves cookie consent preferences and dispatches an update event.
 */
export function setCookieConsent(prefs: Partial<CookiePreferences>): CookiePreferences {
  const complete: CookiePreferences = {
    essential: true,
    preferences: Boolean(prefs.preferences),
    analytics: Boolean(prefs.analytics),
    marketing: Boolean(prefs.marketing),
    timestamp: new Date().toISOString(),
  };

  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(complete));
      window.dispatchEvent(
        new CustomEvent(COOKIE_CONSENT_CHANGE_EVENT, { detail: complete })
      );
    } catch {
      // Storage quota or private browsing restriction
    }
  }

  return complete;
}

/**
 * Accepts all cookies (essential + preferences + analytics + marketing).
 */
export function acceptAllCookies(): CookiePreferences {
  return setCookieConsent({
    preferences: true,
    analytics: true,
    marketing: true,
  });
}

/**
 * Rejects non-essential cookies (only essential remains active).
 */
export function rejectNonEssentialCookies(): CookiePreferences {
  return setCookieConsent({
    preferences: false,
    analytics: false,
    marketing: false,
  });
}

/**
 * Retrieves all registered data deletion requests.
 */
export function getDataDeletionRequests(): DataDeletionRequest[] {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return [];
  }

  try {
    const raw = localStorage.getItem(DATA_DELETION_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Submits a new formal data deletion / account erasure request.
 */
export function submitDataDeletionRequest(params: {
  email: string;
  role: 'student' | 'landlord' | 'other';
  reason: string;
  details?: string;
}): DataDeletionRequest {
  const newRequest: DataDeletionRequest = {
    id: `del-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    email: params.email.trim().toLowerCase(),
    role: params.role,
    reason: params.reason,
    details: params.details?.trim(),
    requested_at: new Date().toISOString(),
    status: 'pending',
  };

  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    try {
      const existing = getDataDeletionRequests();
      existing.unshift(newRequest);
      localStorage.setItem(DATA_DELETION_KEY, JSON.stringify(existing));
    } catch {
      // Storage write error
    }
  }

  return newRequest;
}

/**
 * Checks if an email currently has a pending data deletion request.
 */
export function hasPendingDeletionRequest(email: string): boolean {
  const requests = getDataDeletionRequests();
  const normalized = email.trim().toLowerCase();
  return requests.some(
    (req) => req.email === normalized && req.status === 'pending'
  );
}

/**
 * Retrieves email notification preferences for a given email address.
 */
export function getEmailPreferences(email: string): EmailPreferences {
  const normalized = email.trim().toLowerCase();
  const defaults: EmailPreferences = {
    email: normalized,
    inspectionAlerts: true,
    lodgesUpdates: false, // Default opt-out for marketing emails
    platformNews: false,   // Default opt-out for marketing emails
    unsubscribedAll: false,
    updated_at: new Date().toISOString(),
  };

  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return defaults;
  }

  try {
    const raw = localStorage.getItem(`${EMAIL_PREFS_KEY}_${normalized}`);
    return raw ? JSON.parse(raw) : defaults;
  } catch {
    return defaults;
  }
}

/**
 * Updates email preferences for a user.
 */
export function setEmailPreferences(
  email: string,
  prefs: Partial<Omit<EmailPreferences, 'email' | 'updated_at'>>
): EmailPreferences {
  const normalized = email.trim().toLowerCase();
  const current = getEmailPreferences(normalized);

  const updated: EmailPreferences = {
    ...current,
    ...prefs,
    email: normalized,
    updated_at: new Date().toISOString(),
  };

  // If unsubscribed from all, toggle off promotional preferences
  if (prefs.unsubscribedAll) {
    updated.lodgesUpdates = false;
    updated.platformNews = false;
    updated.unsubscribedAll = true;
  }

  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem(`${EMAIL_PREFS_KEY}_${normalized}`, JSON.stringify(updated));
    } catch {
      // Storage error
    }
  }

  return updated;
}

/**
 * Unsubscribes an email address from all marketing & non-essential email distributions.
 */
export function unsubscribeEmailFromAll(email: string): EmailPreferences {
  return setEmailPreferences(email, {
    unsubscribedAll: true,
    lodgesUpdates: false,
    platformNews: false,
  });
}
