'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import { UserRole } from '@/types/database';
import { useRouter } from 'next/navigation';

export interface UserProfile {
  id: string;
  role: UserRole;
  full_name: string;
  email: string;
  phone?: string | null;
  avatar_path?: string | null;
  onboarding_completed?: boolean;
  created_at?: string;
  updated_at?: string;
  student_profile?: {
    university_id?: string | null;
    university_slug?: string | null;
    department?: string | null;
    campus_name?: string | null;
  } | null;
  landlord_profile?: {
    provider_type?: string | null;
    business_name?: string | null;
    operating_area?: string | null;
    verification_status?: string | null;
  } | null;
}

export interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  role: UserRole | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateProfileState: (updates: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const activeUserIdRef = useRef<string | null>(null);

  const fetchProfile = useCallback(async (userId: string, currentUser?: User | null): Promise<UserProfile | null> => {
    // 1. Check local storage cache for instant hydration
    let cachedProfile: UserProfile | null = null;
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem(`lodgehere_profile_cache_${userId}`);
        if (raw) cachedProfile = JSON.parse(raw);
      } catch {}
    }

    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (!error && data) {
        const profileObj: UserProfile = { ...data };

        // Fetch student subprofile if applicable
        if (profileObj.role === 'student') {
          try {
            const { data: spData } = await supabase
              .from('student_profiles')
              .select('*, universities(name, slug)')
              .eq('user_id', userId)
              .single();

            if (spData) {
              profileObj.student_profile = {
                university_id: spData.university_id,
                university_slug: (spData.universities as any)?.slug || null,
                department: spData.department,
                campus_name: null,
              };
            }
          } catch {}
        } else if (profileObj.role === 'landlord') {
          try {
            const { data: lpData } = await supabase
              .from('landlord_profiles')
              .select('*')
              .eq('user_id', userId)
              .single();

            if (lpData) {
              profileObj.landlord_profile = {
                provider_type: lpData.provider_type,
                business_name: lpData.business_name,
                operating_area: lpData.contact_details?.operating_area || null,
                verification_status: lpData.verification_status,
              };
            }
          } catch {}
        }

        // Cache for rapid local access
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(`lodgehere_profile_cache_${userId}`, JSON.stringify(profileObj));
          } catch {}
        }

        return profileObj;
      }
    } catch (err) {
      console.warn('Supabase fetchProfile error:', err);
    }

    // 2. Return cached profile if DB query failed
    if (cachedProfile) {
      return cachedProfile;
    }

    // 3. Fallback to auth metadata if profile table doesn't have the row yet
    if (currentUser) {
      const meta = currentUser.user_metadata || {};
      const fallbackRole =
        (currentUser.app_metadata?.role as UserRole) ||
        (meta.role as UserRole) ||
        'student';

      const fallback: UserProfile = {
        id: currentUser.id,
        role: fallbackRole,
        full_name: meta.full_name || meta.name || currentUser.email?.split('@')[0] || '',
        email: currentUser.email || '',
        phone: meta.phone || null,
        onboarding_completed: Boolean(meta.onboarding_completed),
        student_profile: {
          university_slug: meta.university_slug || (typeof window !== 'undefined' ? localStorage.getItem('lodgehere_user_university') : null),
          department: meta.department || null,
          campus_name: meta.campus_name || null,
        },
        landlord_profile: {
          business_name: meta.business_name || null,
          provider_type: meta.provider_type || 'owner',
          operating_area: meta.operating_area || null,
        },
      };

      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(`lodgehere_profile_cache_${userId}`, JSON.stringify(fallback));
        } catch {}
      }

      return fallback;
    }

    return null;
  }, []);

  const updateProfileState = useCallback((updates: Partial<UserProfile>) => {
    setProfile((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...updates };
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(`lodgehere_profile_cache_${updated.id}`, JSON.stringify(updated));
        } catch {}
      }
      return updated;
    });
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!user) return;
    const prof = await fetchProfile(user.id, user);
    if (prof) {
      setProfile(prof);
      setRole(prof.role);
    }
  }, [user, fetchProfile]);

  useEffect(() => {
    const supabase = createClient();
    let isMounted = true;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;

      if (session?.user) {
        const currentUser = session.user;
        setUser(currentUser);

        // Avoid duplicate concurrent profile fetching if user hasn't changed
        if (activeUserIdRef.current !== currentUser.id || event === 'USER_UPDATED') {
          activeUserIdRef.current = currentUser.id;
          const prof = await fetchProfile(currentUser.id, currentUser);
          if (isMounted) {
            if (prof) {
              setProfile(prof);
              setRole(prof.role);
            } else {
              const fallbackRole =
                (currentUser.app_metadata?.role as UserRole) ||
                (currentUser.user_metadata?.role as UserRole) ||
                'student';
              setRole(fallbackRole);
            }
          }
        }
      } else {
        activeUserIdRef.current = null;
        setUser(null);
        setProfile(null);
        setRole(null);
      }

      if (isMounted) {
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const signOut = useCallback(async () => {
    setIsLoading(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      activeUserIdRef.current = null;
      setUser(null);
      setProfile(null);
      setRole(null);
      router.push('/login');
      router.refresh();
    } catch (err) {
      console.error('Error during signOut:', err);
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        role,
        isLoading,
        isAuthenticated: !!user,
        signOut,
        refreshProfile,
        updateProfileState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
