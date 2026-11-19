import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MobileBottomNav } from './mobile-bottom-nav';

let mockPathname = '/';
let mockAuthRole: string | null = null;
let mockIsAuthenticated = false;

vi.mock('next/navigation', () => ({
  usePathname: () => mockPathname,
}));

vi.mock('@/context/auth-context', () => ({
  useAuth: () => ({
    user: mockIsAuthenticated ? { id: 'u-1', email: 'user@example.com' } : null,
    role: mockAuthRole,
    isAuthenticated: mockIsAuthenticated,
  }),
}));

vi.mock('@/lib/dev-role', () => ({
  useDevRole: () => ({
    role: mockAuthRole || 'student',
  }),
}));

vi.mock('@/lib/data/lodges-data', () => ({
  getInspections: () => [
    { id: 'insp-1', status: 'pending' },
    { id: 'insp-2', status: 'accepted' },
  ],
}));

describe('MobileBottomNav (Student 4-Tab Navigation)', () => {
  beforeEach(() => {
    mockPathname = '/';
    mockAuthRole = null;
    mockIsAuthenticated = false;
  });

  it('renders student navigation tabs (Explore, Saved, Enquiries, Profile) when on student discovery home', () => {
    mockPathname = '/';
    render(<MobileBottomNav />);

    expect(screen.getByRole('navigation', { name: /mobile navigation/i })).toBeDefined();
    expect(screen.getByText('Explore')).toBeDefined();
    expect(screen.getByText('Saved')).toBeDefined();
    expect(screen.getByText('Enquiries')).toBeDefined();
    expect(screen.getByText('Profile')).toBeDefined();
  });

  it('renders student navigation tabs on student sub-routes', () => {
    mockPathname = '/student/saved';
    mockAuthRole = 'student';
    mockIsAuthenticated = true;

    render(<MobileBottomNav />);

    expect(screen.getByText('Explore')).toBeDefined();
    expect(screen.getByText('Saved')).toBeDefined();
    expect(screen.getByText('Enquiries')).toBeDefined();
    expect(screen.getByText('Profile')).toBeDefined();
  });

  it('renders landlord dashboard tabs when on landlord routes', () => {
    mockPathname = '/landlord/overview';
    mockAuthRole = 'landlord';
    mockIsAuthenticated = true;

    render(<MobileBottomNav />);

    expect(screen.getByText('Overview')).toBeDefined();
    expect(screen.getByText('Properties')).toBeDefined();
    expect(screen.getByText('Rooms')).toBeDefined();
    expect(screen.getByText('Inspections')).toBeDefined();
    expect(screen.getByText('Profile')).toBeDefined();
  });

  it('hides completely on lodge detail pages to give full focus to the primary inspection bar', () => {
    mockPathname = '/lodges/emerald-haven-self-con-akoka';
    const { container } = render(<MobileBottomNav />);
    expect(container.firstChild).toBeNull();
  });

  it('hides on auth pages (login, register, onboarding)', () => {
    mockPathname = '/login';
    const { container: loginContainer } = render(<MobileBottomNav />);
    expect(loginContainer.firstChild).toBeNull();

    mockPathname = '/onboarding';
    const { container: onboardingContainer } = render(<MobileBottomNav />);
    expect(onboardingContainer.firstChild).toBeNull();
  });
});
