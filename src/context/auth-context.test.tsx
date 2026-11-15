import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { AuthProvider, useAuth } from './auth-context';

// Mock Supabase client
vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
      getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
      onAuthStateChange: vi.fn().mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
      }),
      signOut: vi.fn().mockResolvedValue({ error: null }),
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          single: vi.fn().mockResolvedValue({ data: null, error: null }),
        }),
      }),
    }),
  }),
}));

// Mock Next router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
}));

function Consumer() {
  const { isAuthenticated, isLoading, role } = useAuth();
  return (
    <div>
      <span data-testid="loading">{isLoading ? 'loading' : 'ready'}</span>
      <span data-testid="auth">{isAuthenticated ? 'authenticated' : 'unauthenticated'}</span>
      <span data-testid="role">{role || 'none'}</span>
    </div>
  );
}

describe('AuthContext and AuthProvider', () => {
  it('should render children within AuthProvider', async () => {
    await act(async () => {
      render(
        <AuthProvider>
          <Consumer />
        </AuthProvider>
      );
    });

    expect(screen.getByTestId('auth').textContent).toBe('unauthenticated');
    expect(screen.getByTestId('role').textContent).toBe('none');
  });

  it('should throw an error when useAuth is consumed outside AuthProvider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => render(<Consumer />)).toThrow(
      'useAuth must be used within an AuthProvider'
    );

    spy.mockRestore();
  });
});
