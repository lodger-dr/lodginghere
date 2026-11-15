import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LandlordProfilePage from './page';

const mockUpdateProfileState = vi.fn();
const mockRefreshProfile = vi.fn();

vi.mock('@/context/auth-context', () => ({
  useAuth: () => ({
    user: {
      id: 'landlord-user-id',
      email: 'owner.real@example.com',
      user_metadata: {
        full_name: 'Mrs. Folashade Adeleke',
        phone: '08022223333',
        business_name: 'Adeleke Premium Residences',
      },
    },
    profile: {
      id: 'landlord-user-id',
      role: 'landlord',
      full_name: 'Mrs. Folashade Adeleke',
      email: 'owner.real@example.com',
      phone: '08022223333',
      landlord_profile: {
        business_name: 'Adeleke Premium Residences',
      },
    },
    refreshProfile: mockRefreshProfile,
    updateProfileState: mockUpdateProfileState,
  }),
}));

vi.mock('@/app/(auth)/actions', () => ({
  updateLandlordProfileAction: vi.fn().mockResolvedValue({
    success: true,
    message: 'Provider profile updated successfully',
  }),
}));

describe('LandlordProfilePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with the authenticated landlord details and NOT hardcoded Chief Adebayo', () => {
    render(<LandlordProfilePage />);

    // Full Legal Name
    const nameInput = screen.getByLabelText(/Full Legal Name/i) as HTMLInputElement;
    expect(nameInput.value).toBe('Mrs. Folashade Adeleke');
    expect(nameInput.value).not.toBe('Chief Adebayo Olanrewaju');

    // Business Name
    const bizInput = screen.getByLabelText(/Business or Brand Name/i) as HTMLInputElement;
    expect(bizInput.value).toBe('Adeleke Premium Residences');
    expect(bizInput.value).not.toBe('Adebayo Properties & Lodges');

    // Email
    const emailInput = screen.getByLabelText(/Email Address/i) as HTMLInputElement;
    expect(emailInput.value).toBe('owner.real@example.com');
    expect(emailInput.value).not.toBe('landlord.adebayo@example.com');

    // Phone
    const phoneInput = screen.getByLabelText(/Contact Phone \/ WhatsApp/i) as HTMLInputElement;
    expect(phoneInput.value).toBe('08022223333');
    expect(phoneInput.value).not.toBe('+234 803 234 5678');
  });

  it('submits updated landlord data correctly', async () => {
    render(<LandlordProfilePage />);

    const phoneInput = screen.getByLabelText(/Contact Phone \/ WhatsApp/i);
    fireEvent.change(phoneInput, { target: { value: '08099998888' } });

    const submitBtn = screen.getByRole('button', { name: /Save Changes/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockUpdateProfileState).toHaveBeenCalledWith(
        expect.objectContaining({
          phone: '08099998888',
        })
      );
    });
  });
});
