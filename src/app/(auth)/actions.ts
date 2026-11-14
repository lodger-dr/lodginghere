'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import {
  loginSchema,
  studentSignUpSchema,
  landlordSignUpSchema,
  resetPasswordSchema,
} from '@/lib/validations/auth';

export interface ActionResponse {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
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

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
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

  // Get user role from profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', data.user.id)
    .single();

  const role = profile?.role || 'student';

  if (role === 'admin') {
    redirect('/admin/dashboard');
  } else if (role === 'landlord') {
    redirect('/landlord/overview');
  } else {
    redirect('/student/overview');
  }
}

export async function signUpAction(formData: FormData): Promise<ActionResponse> {
  const role = formData.get('role');

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
    const { data, error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        data: {
          role: 'student',
          full_name: parsed.data.fullName,
          phone: parsed.data.phone || null,
          university_id: parsed.data.universityId || null,
          department: parsed.data.department || null,
        },
      },
    });

    if (error) {
      return {
        success: false,
        message: error.message,
      };
    }

    if (data.session) {
      redirect('/student/overview');
    }

    return {
      success: true,
      message: 'Account created! Please check your email to verify your address.',
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
      return {
        success: false,
        message: error.message,
      };
    }

    if (data.session) {
      redirect('/landlord/overview');
    }

    return {
      success: true,
      message: 'Landlord account created! Please check your email to verify your address.',
    };
  }

  return {
    success: false,
    message: 'Invalid registration role provided.',
  };
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
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

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password`,
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
}

