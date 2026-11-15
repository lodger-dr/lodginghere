'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { useDevRole } from '@/lib/dev-role';

export interface TourStep {
  targetSelector: string;
  title: string;
  whatItIs: string;
  whatToDo: string;
  howItWorks: string;
  badge?: string;
}

interface TourContextType {
  isOpen: boolean;
  currentStepIndex: number;
  steps: TourStep[];
  currentStep: TourStep | null;
  totalSteps: number;
  hasSeenTour: boolean;
  startTour: (forceRole?: 'student' | 'landlord') => void;
  nextStep: () => void;
  prevStep: () => void;
  skipTour: () => void;
}

const STUDENT_STEPS: TourStep[] = [
  {
    targetSelector: '[data-tour="role-badge"]',
    title: 'Your Verified Student Profile',
    badge: 'Step 1: Role Context',
    whatItIs: 'Your current student account status badge.',
    whatToDo: 'Click this badge anytime to inspect and manage your student profile settings.',
    howItWorks: 'During testing, login is removed. You have instant access to all features as a verified student.',
  },
  {
    targetSelector: '[data-tour="command-search"]',
    title: 'Universal Command & Lodge Search (⌘K)',
    badge: 'Step 2: Fast Jump',
    whatItIs: 'A global search bar tucked into the top navigation.',
    whatToDo: 'Press ⌘K (or Ctrl+K on Windows) or click this search widget to search anything instantly.',
    howItWorks: 'Jump straight to lodges near UNILAG, UNN, OAU, or toggle dark mode with one keystroke.',
  },
  {
    targetSelector: '[data-tour="sidebar-nav"]',
    title: 'Structured Portal Workflow Menu',
    badge: 'Step 3: Navigation',
    whatItIs: 'The left sidebar organized into 3 labeled operational groups.',
    whatToDo: 'Use this menu to move across your daily accommodation workflow: explore lodges, check campuses, and review bookings.',
    howItWorks: 'Menu items are grouped by lifecycle relationship so you never get lost. On mobile, this transforms into a bottom tab bar.',
  },
  {
    targetSelector: '[data-tour="primary-action"]',
    title: 'Order of Operation: Your Primary Next Step',
    badge: 'Step 4: Primary Action',
    whatItIs: 'The main hero action card anchored to the 3-step student accommodation lifecycle.',
    whatToDo: 'Click the animated primary CTA button to start browsing approved student accommodation near your campus.',
    howItWorks: 'Follow the 3 clear stages: 1. Profile Active → 2. Schedule Free Inspection → 3. Mutually Confirm Booking.',
  },
  {
    targetSelector: '[data-tour="inspection-tracker"]',
    title: 'Physical Room Inspection Tracker',
    badge: 'Step 5: Live Activity',
    whatItIs: 'Your active appointments to inspect rooms in person before making any financial commitment.',
    whatToDo: 'Track accepted viewing dates, caretaker arrival times, and lodge addresses right here.',
    howItWorks: 'THE GOLDEN RULE: Never pay rent or agent fees before physical inspection. All LodgeHere inspections are 100% free.',
  },
  {
    targetSelector: '[data-tour="accordions-help"]',
    title: 'Safety Guidelines & Caretaker Support Line',
    badge: 'Step 6: Help & Protocols',
    whatItIs: 'Folded knowledge accordions that keep secondary documentation out of your way until needed.',
    whatToDo: 'Click any accordion bar to unfold tenant safety checklists, anti-scam rules, or direct contact with campus representatives.',
    howItWorks: 'Need urgent help with a landlord? Emergency caretaker support line is available: +234 800 LODGEHERE.',
  },
];

const LANDLORD_STEPS: TourStep[] = [
  {
    targetSelector: '[data-tour="role-badge"]',
    title: 'Provider Account: Landlord Portal',
    badge: 'Step 1: Role Context',
    whatItIs: 'Your registered provider status badge.',
    whatToDo: 'Click to view your provider profile, banking details, or switch back to the Student view.',
    howItWorks: 'In development testing mode, all landlord features are fully unlocked without authentication gates.',
  },
  {
    targetSelector: '[data-tour="command-search"]',
    title: 'Universal Quick Actions (⌘K)',
    badge: 'Step 2: Fast Jump',
    whatItIs: 'Quick action search bar for property listings and operations.',
    whatToDo: 'Press ⌘K or click to jump directly to property management, room inventories, or change themes.',
    howItWorks: 'Provides instant keyboard access to every corner of your accommodation portfolio.',
  },
  {
    targetSelector: '[data-tour="sidebar-nav"]',
    title: 'Portfolio & Pipeline Navigation',
    badge: 'Step 3: Navigation',
    whatItIs: 'The left sidebar organized into Portfolio Management, Student Pipeline, and Preferences.',
    whatToDo: 'Navigate between your listed properties, live room vacancies, and incoming student inspection appointments.',
    howItWorks: 'Keeps property management clearly separated from student communication and profile settings.',
  },
  {
    targetSelector: '[data-tour="primary-action"]',
    title: 'Onboarding Checklist & Add Property',
    badge: 'Step 4: Primary Action',
    whatItIs: 'Your 4-step onboarding checklist to list and fill student vacancies.',
    whatToDo: 'Click the "Add Property" winning CTA to publish a new lodge listing with campus distance and photos.',
    howItWorks: 'Each step guides you from initial property verification to room inventory setup and inspection reviews.',
  },
  {
    targetSelector: '[data-tour="quick-actions"]',
    title: 'Real-time Vacancy & Room Inventory',
    badge: 'Step 5: Live Activity',
    whatItIs: 'Quick management shortcuts and live vacancy counters.',
    whatToDo: 'Configure unit numbers (e.g. Room 101), toggle vacancy availability, and view student inspection requests.',
    howItWorks: 'Students can only book physical inspections for rooms currently marked as vacant.',
  },
  {
    targetSelector: '[data-tour="accordions-help"]',
    title: 'Landlord Compliance & Operating Standards',
    badge: 'Step 6: Help & Protocols',
    whatItIs: 'Folded accordions containing mandatory inspection codes and landlord SLAs.',
    whatToDo: 'Click any accordion bar to review the 24-hour response SLA, zero-fee inspection mandate, and priority partner support.',
    howItWorks: 'Maintains tenant trust by ensuring verified direct contracts with zero third-party agent markups.',
  },
];

const TourContext = createContext<TourContextType | undefined>(undefined);

export function TourProvider({ children }: { children: React.ReactNode }) {
  const { role } = useDevRole();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [hasSeenTour, setHasSeenTour] = useState(true); // default true for SSR safety

  // Determine active steps based on pathname and role
  const isLandlord = pathname?.startsWith('/landlord') || role === 'landlord';
  const steps = isLandlord ? LANDLORD_STEPS : STUDENT_STEPS;
  const currentStep = steps[currentStepIndex] || null;

  // Read localStorage on client mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('lodgehere_tour_completed');
      if (!stored) {
        setHasSeenTour(false);
        // If visiting a dashboard for the first time, auto-launch tour after a slight delay
        if (pathname?.startsWith('/student') || pathname?.startsWith('/landlord')) {
          const timer = setTimeout(() => {
            setIsOpen(true);
            setCurrentStepIndex(0);
          }, 800);
          return () => clearTimeout(timer);
        }
      } else {
        setHasSeenTour(true);
      }
    } catch {
      setHasSeenTour(true);
    }
  }, [pathname]);

  const startTour = useCallback(() => {
    setCurrentStepIndex(0);
    setIsOpen(true);
  }, []);

  const nextStep = useCallback(() => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      // Completed last step
      setIsOpen(false);
      try {
        localStorage.setItem('lodgehere_tour_completed', 'true');
        setHasSeenTour(true);
      } catch {}
    }
  }, [currentStepIndex, steps.length]);

  const prevStep = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  }, [currentStepIndex]);

  const skipTour = useCallback(() => {
    setIsOpen(false);
    try {
      localStorage.setItem('lodgehere_tour_completed', 'true');
      setHasSeenTour(true);
    } catch {}
  }, []);

  return (
    <TourContext.Provider
      value={{
        isOpen,
        currentStepIndex,
        steps,
        currentStep,
        totalSteps: steps.length,
        hasSeenTour,
        startTour,
        nextStep,
        prevStep,
        skipTour,
      }}
    >
      {children}
    </TourContext.Provider>
  );
}

export function useTour() {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error('useTour must be used within a TourProvider');
  }
  return context;
}
