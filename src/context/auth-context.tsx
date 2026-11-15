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
}

export interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  role: UserRole | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const activeUserIdRef = useRef<string | null>(null);

  const fetchProfile = useCallback(async (userId: string): Promise<UserProfile | null> => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error || !data) {
        return null;
      }
      return data as UserProfile;
    } catch {
      return null;
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!user) return;
    const prof = await fetchProfile(user.id);
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
          const prof = await fetchProfile(currentUser.id);
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
