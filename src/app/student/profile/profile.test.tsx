import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import StudentProfilePage from './page';

const mockUpdateProfileState = vi.fn();
const mockRefreshProfile = vi.fn();

vi.mock('@/context/auth-context', () => ({
  useAuth: () => ({
    user: {
      id: 'test-user-id',
      email: 'student.real@example.com',
      user_metadata: {
        full_name: 'Chioma Adeyemi',
        phone: '08098765432',
        university_slug: 'university-of-lagos',
        department: 'Biochemistry',
      },
    },
    profile: {
      id: 'test-user-id',
      role: 'student',
      full_name: 'Chioma Adeyemi',
      email: 'student.real@example.com',
      phone: '08098765432',
      student_profile: {
        university_slug: 'university-of-lagos',
        department: 'Biochemistry',
      },
    },
    refreshProfile: mockRefreshProfile,
    updateProfileState: mockUpdateProfileState,
  }),
}));

vi.mock('@/app/(auth)/actions', () => ({
  updateStudentProfileAction: vi.fn().mockResolvedValue({
    success: true,
    message: 'Profile updated successfully',
  }),
}));

describe('StudentProfilePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with the authenticated user details and NOT hardcoded Daniel Okafor', () => {
    render(<StudentProfilePage />);

    // Name field
    const nameInput = screen.getByLabelText(/Full name/i) as HTMLInputElement;
    expect(nameInput.value).toBe('Chioma Adeyemi');
    expect(nameInput.value).not.toBe('Daniel Okafor');

    // Email field
    const emailInput = screen.getByLabelText(/Email address/i) as HTMLInputElement;
    expect(emailInput.value).toBe('student.real@example.com');
    expect(emailInput.value).not.toBe('daniel.student@example.com');

    // Phone field
    const phoneInput = screen.getByLabelText(/WhatsApp Phone Number/i) as HTMLInputElement;
    expect(phoneInput.value).toBe('08098765432');
    expect(phoneInput.value).not.toBe('08149901234');

    // Department field
    const deptInput = screen.getByLabelText(/Department \/ Faculty/i) as HTMLInputElement;
    expect(deptInput.value).toBe('Biochemistry');
  });

  it('submits updated profile data without reverting to hardcoded values', async () => {
    render(<StudentProfilePage />);

    const phoneInput = screen.getByLabelText(/WhatsApp Phone Number/i);
    fireEvent.change(phoneInput, { target: { value: '08123456789' } });

    const submitBtn = screen.getByRole('button', { name: /Save Changes/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockUpdateProfileState).toHaveBeenCalledWith(
        expect.objectContaining({
          phone: '08123456789',
        })
      );
    });
  });
});
