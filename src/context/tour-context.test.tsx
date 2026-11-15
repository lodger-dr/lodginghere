import { describe, it, expect, beforeEach, vi } from 'vitest';
import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { TourProvider, useTour } from './tour-context';

// Mock localStorage for test environment
const mockStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = String(value);
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: mockStorage,
  writable: true,
});
if (typeof globalThis !== 'undefined') {
  Object.defineProperty(globalThis, 'localStorage', {
    value: mockStorage,
    writable: true,
  });
}

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: () => '/student/overview',
}));

// Mock dev-role
vi.mock('@/lib/dev-role', () => ({
  useDevRole: () => ({ role: 'student' }),
}));

describe('TourContext and GuidedTour state machine', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('provides initial tour state with 6 student steps', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <TourProvider>{children}</TourProvider>
    );
    const { result } = renderHook(() => useTour(), { wrapper });

    expect(result.current.totalSteps).toBe(6);
    expect(result.current.steps).toHaveLength(6);
    expect(result.current.currentStepIndex).toBe(0);
    expect(result.current.currentStep?.title).toContain('Your Verified Student Profile');
  });

  it('manages tour navigation from start to next and finish', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <TourProvider>{children}</TourProvider>
    );
    const { result } = renderHook(() => useTour(), { wrapper });

    act(() => {
      result.current.startTour();
    });
    expect(result.current.isOpen).toBe(true);
    expect(result.current.currentStepIndex).toBe(0);

    // Step 2: Command Palette
    act(() => {
      result.current.nextStep();
    });
    expect(result.current.currentStepIndex).toBe(1);
    expect(result.current.currentStep?.title).toContain('Command & Lodge Search');

    // Step back
    act(() => {
      result.current.prevStep();
    });
    expect(result.current.currentStepIndex).toBe(0);

    // Advance to last step
    act(() => {
      for (let i = 0; i < 5; i++) {
        result.current.nextStep();
      }
    });
    expect(result.current.currentStepIndex).toBe(5);
    expect(result.current.currentStep?.title).toContain('Safety Guidelines');

    // Finish tour
    act(() => {
      result.current.nextStep();
    });
    expect(result.current.isOpen).toBe(false);
    expect(localStorage.getItem('lodgehere_tour_completed')).toBe('true');
  });

  it('allows skipping the tour at any step', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <TourProvider>{children}</TourProvider>
    );
    const { result } = renderHook(() => useTour(), { wrapper });

    act(() => {
      result.current.startTour();
    });
    expect(result.current.isOpen).toBe(true);

    act(() => {
      result.current.skipTour();
    });
    expect(result.current.isOpen).toBe(false);
    expect(localStorage.getItem('lodgehere_tour_completed')).toBe('true');
  });
});
