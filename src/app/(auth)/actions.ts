'use server';

import { redirect } from 'next/navigation';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import {
  loginSchema,
  studentSignUpSchema,
  landlordSignUpSchema,
  resetPasswordSchema,
  emailSignUpSchema,
} from '@/lib/validations/auth';

export interface ActionResponse {
  success: boolean;
  message?: string;
  redirectTo?: string;
  errors?: Record<string, string[]>;
}

function isSafeRedirect(path: unknown): path is string {
  if (typeof path !== 'string') return false;
  return path.startsWith('/') && !path.startsWith('//') && !path.startsWith('/\\') && !path.includes('\\');
}

export async function signInAction(formData: FormData): Promise<ActionResponse> {
  const rawData = {
    email: formData.get('email'),
    password: formData.get('password'),
  };

  const parsed = loginSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: parsed.data.email,
      password: parsed.data.password,
    });

    if (error) {
      const msg = error.message.toLowerCase();
      if (msg.includes('failed to fetch') || msg.includes('networkerror') || msg.includes('fetch failed')) {
        return {
          success: false,
          message: 'Unable to connect to the authentication server. Please check your internet connection.',
        };
      }
      if (msg.includes('invalid login credentials') || msg.includes('invalid credentials')) {
        return {
          success: false,
          message: 'Invalid email or password. Please check your credentials.',
        };
      }
      if (msg.includes('email not confirmed')) {
        return {
          success: false,
          message: 'Please check your email and click the confirmation link before signing in.',
        };
      }
      return {
        success: false,
        message: error.message || 'Invalid email or password',
      };
    }

    if (!data.user) {
      return {
        success: false,
        message: 'Authentication failed. Please try again.',
      };
    }

    // Get verified user role and onboarding status from profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, onboarding_completed')
      .eq('id', data.user.id)
      .single();

    if (profile && profile.onboarding_completed === false) {
      return {
        success: true,
        redirectTo: '/onboarding',
      };
    }

    const role = profile?.role || 'student';
    const nextParam = formData.get('next');

    let redirectTo = '/student/overview';

    if (isSafeRedirect(nextParam)) {
      redirectTo = nextParam;
    } else if (role === 'admin') {
      redirectTo = '/admin/dashboard';
    } else if (role === 'landlord') {
      redirectTo = '/landlord/overview';
    }

    return {
      success: true,
      redirectTo,
    };
  } catch (err: unknown) {
    console.error('Sign-in error:', err);
    return {
      success: false,
      message: 'Could not connect to authentication service. Please check your internet connection and try again.',
    };
  }
}

export async function signUpAction(formData: FormData): Promise<ActionResponse> {
  const role = formData.get('role');

  try {
    if (role === 'student') {
      const rawData = {
        role: 'student' as const,
        fullName: formData.get('fullName'),
        email: formData.get('email'),
        password: formData.get('password'),
        phone: formData.get('phone') || undefined,
        universityId: formData.get('universityId') || undefined,
        department: formData.get('department') || undefined,
      };

      const parsed = studentSignUpSchema.safeParse(rawData);
      if (!parsed.success) {
        return {
          success: false,
          errors: parsed.error.flatten().fieldErrors,
        };
      }

      const supabase = await createClient();

      let universityIdValue: string | null = null;
      if (parsed.data.universityId) {
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(parsed.data.universityId);
        if (isUuid) {
          universityIdValue = parsed.data.universityId;
        } else {
          const { data: uni } = await supabase
            .from('universities')
            .select('id')
            .eq('slug', parsed.data.universityId)
            .single();
          universityIdValue = uni?.id || null;
        }
      }

      const { data, error } = await supabase.auth.signUp({
        email: parsed.data.email,
        password: parsed.data.password,
        options: {
          data: {
            role: 'student',
            full_name: parsed.data.fullName,
            phone: parsed.data.phone || null,
            university_id: universityIdValue,
            department: parsed.data.department || null,
          },
        },
      });

      if (error) {
        const msg = error.message.toLowerCase();
        if (msg.includes('user already registered')) {
          return {
            success: false,
            message: 'An account with this email already exists. Please sign in instead.',
          };
        }
        if (msg.includes('rate limit') || msg.includes('over_email_send_rate_limit')) {
          return {
            success: false,
            message: 'Email rate limit reached for security. Please wait a moment before trying again or try signing in.',
          };
        }
        if (msg.includes('invalid') || msg.includes('email_address_invalid')) {
          return {
            success: false,
            message: 'Please provide a valid, active email address.',
          };
        }
        return {
          success: false,
          message: error.message,
        };
      }

      // Sync role into app_metadata using admin client
      if (data?.user?.id) {
        try {
          const adminClient = createAdminClient();
          await adminClient.auth.admin.updateUserById(data.user.id, {
            app_metadata: { role: 'student' },
          });
        } catch {
          // Non-critical fallback
        }
      }

      // If session is active (autoconfirm enabled)
      if (data?.session) {
        return {
          success: true,
          redirectTo: '/student/overview',
        };
      }

      return {
        success: true,
        redirectTo: '/login?registered=true',
      };
    } else if (role === 'landlord') {
      const rawData = {
        role: 'landlord' as const,
        fullName: formData.get('fullName'),
        email: formData.get('email'),
        password: formData.get('password'),
        phone: formData.get('phone') || undefined,
        providerType: formData.get('providerType'),
        businessName: formData.get('businessName') || undefined,
      };

      const parsed = landlordSignUpSchema.safeParse(rawData);
      if (!parsed.success) {
        return {
          success: false,
          errors: parsed.error.flatten().fieldErrors,
        };
      }

      const supabase = await createClient();
      const { data, error } = await supabase.auth.signUp({
        email: parsed.data.email,
        password: parsed.data.password,
        options: {
          data: {
            role: 'landlord',
            full_name: parsed.data.fullName,
            phone: parsed.data.phone || null,
            provider_type: parsed.data.providerType,
            business_name: parsed.data.businessName || null,
          },
        },
      });

      if (error) {
        const msg = error.message.toLowerCase();
        if (msg.includes('user already registered')) {
          return {
            success: false,
            message: 'An account with this email already exists. Please sign in instead.',
          };
        }
        if (msg.includes('rate limit') || msg.includes('over_email_send_rate_limit')) {
          return {
            success: false,
            message: 'Email rate limit reached for security. Please wait a moment before trying again or try signing in.',
          };
        }
        if (msg.includes('invalid') || msg.includes('email_address_invalid')) {
          return {
            success: false,
            message: 'Please provide a valid, active email address.',
          };
        }
        return {
          success: false,
          message: error.message,
        };
      }

      if (data?.user?.id) {
        try {
          const adminClient = createAdminClient();
          await adminClient.auth.admin.updateUserById(data.user.id, {
            app_metadata: { role: 'landlord' },
          });
        } catch {
          // Non-critical fallback
        }
      }

      if (data?.session) {
        return {
          success: true,
          redirectTo: '/landlord/overview',
        };
      }

      return {
        success: true,
        redirectTo: '/login?registered=true',
      };
    }

    return {
      success: false,
      message: 'Invalid registration role provided.',
    };
  } catch (err: unknown) {
    console.error('Sign-up error:', err);
    return {
      success: false,
      message: 'Could not connect to authentication service. Please check your internet connection and try again.',
    };
  }
}

export async function signOutAction(): Promise<void> {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
  } catch (err) {
    console.error('Sign-out error:', err);
  }
  redirect('/login');
}

export async function resetPasswordAction(formData: FormData): Promise<ActionResponse> {
  const rawData = {
    email: formData.get('email'),
  };

  const parsed = resetPasswordSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const supabase = await createClient();
    const appBaseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
      redirectTo: `${appBaseUrl}/api/auth/callback?next=/reset-password`,
    });

    if (error) {
      return {
        success: false,
        message: error.message,
      };
    }

    return {
      success: true,
      message: 'If an account exists with that email, a password reset link has been dispatched.',
    };
  } catch (err) {
    console.error('Reset password error:', err);
    return {
      success: false,
      message: 'Could not connect to authentication service. Please check your internet connection.',
    };
  }
}

export async function signUpWithEmailAction(formData: FormData): Promise<ActionResponse> {
  const rawData = {
    email: formData.get('email'),
    password: formData.get('password'),
  };

  const parsed = emailSignUpSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const supabase = await createClient();
    const emailStr = parsed.data.email.trim();
    const defaultName = emailStr.split('@')[0];

    const { data, error } = await supabase.auth.signUp({
      email: emailStr,
      password: parsed.data.password,
      options: {
        data: {
          full_name: defaultName,
          role: 'student',
          onboarding_completed: false,
        },
      },
    });

    if (error) {
      const msg = error.message.toLowerCase();
      if (msg.includes('user already registered') || msg.includes('already exists')) {
        return {
          success: false,
          message: 'An account with this email already exists. Please sign in instead.',
        };
      }
      if (msg.includes('rate limit') || msg.includes('over_email_send_rate_limit')) {
        return {
          success: false,
          message: 'Email rate limit reached. Please wait a moment before trying again or sign in.',
        };
      }
      return {
        success: false,
        message: error.message,
      };
    }

    if (data?.user?.id) {
      try {
        const adminClient = createAdminClient();
        await adminClient.from('profiles').upsert({
          id: data.user.id,
          email: emailStr,
          full_name: defaultName,
          role: 'student',
          onboarding_completed: false,
        });
        await adminClient.auth.admin.updateUserById(data.user.id, {
          app_metadata: { role: 'student' },
        });
      } catch (profileErr) {
        console.warn('Initial profile setup note:', profileErr);
      }
    }

    return {
      success: true,
      redirectTo: '/onboarding',
    };
  } catch (err: unknown) {
    console.error('Email sign-up error:', err);
    return {
      success: false,
      message: 'Could not connect to authentication service. Please check your internet connection.',
    };
  }
}

export async function completeOnboardingAction(formData: FormData): Promise<ActionResponse> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        message: 'Your session has expired. Please sign in again to complete onboarding.',
        redirectTo: '/login',
      };
    }

    const role = formData.get('role');
    const fullName = (formData.get('fullName') as string)?.trim();
    const phone = (formData.get('phone') as string)?.trim() || null;

    if (!fullName || fullName.length < 2) {
      return {
        success: false,
        errors: { fullName: ['Please enter your full name (at least 2 characters)'] },
      };
    }

    if (role !== 'student' && role !== 'landlord') {
      return {
        success: false,
        message: 'Please choose whether you are a Student or an Accommodation Provider.',
      };
    }

    const adminClient = createAdminClient();

    if (role === 'student') {
      const universityId = formData.get('universityId') as string | null;
      const campusName = formData.get('campusName') as string | null;
      const department = formData.get('department') as string | null;

      let universityIdValue: string | null = null;
      if (universityId) {
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(universityId);
        if (isUuid) {
          universityIdValue = universityId;
        } else {
          const { data: uni } = await supabase
            .from('universities')
            .select('id')
            .eq('slug', universityId)
            .single();
          universityIdValue = uni?.id || null;
        }
      }

      const { error: profileError } = await adminClient
        .from('profiles')
        .update({
          full_name: fullName,
          role: 'student',
          phone: phone,
          onboarding_completed: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (profileError) {
        console.error('Error updating student profile in onboarding:', profileError);
        return {
          success: false,
          message: 'Failed to save student profile. Please try again.',
        };
      }

      await adminClient.from('student_profiles').upsert({
        user_id: user.id,
        university_id: universityIdValue,
        department: department || null,
        updated_at: new Date().toISOString(),
      });

      try {
        await adminClient.auth.admin.updateUserById(user.id, {
          app_metadata: { role: 'student' },
          user_metadata: {
            full_name: fullName,
            role: 'student',
            onboarding_completed: true,
            campus_name: campusName || null,
          },
        });
      } catch (adminErr) {
        console.warn('Could not update student metadata:', adminErr);
      }

      return {
        success: true,
        redirectTo: '/student/overview',
      };
    } else {
      const providerType = (formData.get('providerType') as string) || 'owner';
      const businessName = (formData.get('businessName') as string)?.trim() || null;
      const operatingArea = (formData.get('operatingArea') as string)?.trim() || null;

      const { error: profileError } = await adminClient
        .from('profiles')
        .update({
          full_name: fullName,
          role: 'landlord',
          phone: phone,
          onboarding_completed: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (profileError) {
        console.error('Error updating landlord profile in onboarding:', profileError);
        return {
          success: false,
          message: 'Failed to save accommodation provider profile. Please try again.',
        };
      }

      await adminClient.from('landlord_profiles').upsert({
        user_id: user.id,
        provider_type: providerType === 'authorized_representative' ? 'authorized_representative' : 'owner',
        business_name: businessName,
        contact_details: operatingArea ? { operating_area: operatingArea } : null,
        updated_at: new Date().toISOString(),
      });

      try {
        await adminClient.auth.admin.updateUserById(user.id, {
          app_metadata: { role: 'landlord' },
          user_metadata: {
            full_name: fullName,
            role: 'landlord',
            onboarding_completed: true,
            business_name: businessName,
          },
        });
      } catch (adminErr) {
        console.warn('Could not update landlord metadata:', adminErr);
      }

      return {
        success: true,
        redirectTo: '/landlord/overview',
      };
    }
  } catch (err) {
    console.error('Onboarding action error:', err);
    return {
      success: false,
      message: 'An unexpected error occurred while completing onboarding. Please try again.',
    };
  }
}
