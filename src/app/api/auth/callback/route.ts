import { NextResponse, type NextRequest } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

function isSafeRedirect(path: string | null): boolean {
  if (!path) return false;
  return path.startsWith('/') && !path.startsWith('//') && !path.startsWith('/\\') && !path.includes('\\');
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const roleParam = requestUrl.searchParams.get('role');
  const nextParam = requestUrl.searchParams.get('next');
  const errorParam = requestUrl.searchParams.get('error_description') || requestUrl.searchParams.get('error');

  const isLocalEnv = process.env.NODE_ENV === 'development';
  const forwardedHost = request.headers.get('x-forwarded-host');
  const forwardedProto = request.headers.get('x-forwarded-proto') || 'https';
  const baseUrl = !isLocalEnv && forwardedHost ? `${forwardedProto}://${forwardedHost}` : requestUrl.origin;

  if (errorParam) {
    console.error('OAuth error from provider:', errorParam);
    return NextResponse.redirect(`${baseUrl}/login?error=${encodeURIComponent(errorParam)}`);
  }

  if (code) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        console.error('Error exchanging code for session:', error.message);
        return NextResponse.redirect(`${baseUrl}/login?error=Failed to complete Google authentication. Please try again.`);
      }

      if (data?.user) {
        const adminClient = createAdminClient();

        // Query existing profile
        const { data: profile } = await adminClient
          .from('profiles')
          .select('role, onboarding_completed')
          .eq('id', data.user.id)
          .single();

        let userRole = profile?.role;
        let onboardingCompleted = profile?.onboarding_completed;

        // If profile does not exist yet, create it with Google details and onboarding_completed = false
        if (!profile) {
          const meta = data.user.user_metadata || {};
          const assignedRole = roleParam === 'landlord' ? 'landlord' : 'student';
          const nameFromGoogle = meta.full_name || meta.name || data.user.email?.split('@')[0] || 'User';

          await adminClient.from('profiles').upsert({
            id: data.user.id,
            role: assignedRole,
            full_name: nameFromGoogle,
            email: data.user.email || '',
            avatar_path: meta.avatar_url || meta.picture || null,
            onboarding_completed: false,
          });

          userRole = assignedRole;
          onboardingCompleted = false;
        }

        // Store the verified role in server-only app_metadata for tamper-proof middleware checks
        try {
          await adminClient.auth.admin.updateUserById(data.user.id, {
            app_metadata: { role: userRole },
          });
        } catch (updateErr) {
          console.warn('Could not update app_metadata:', updateErr);
        }

        // If onboarding has not been completed, redirect immediately to card-by-card onboarding flow
        if (onboardingCompleted === false) {
          return NextResponse.redirect(`${baseUrl}/onboarding`);
        }

        // Handle explicit next redirection if provided and validated safe
        if (isSafeRedirect(nextParam)) {
          return NextResponse.redirect(`${baseUrl}${nextParam}`);
        }

        // Role-based portal routing
        if (userRole === 'admin') {
          return NextResponse.redirect(`${baseUrl}/admin/dashboard`);
        } else if (userRole === 'landlord') {
          return NextResponse.redirect(`${baseUrl}/landlord/overview`);
        } else {
          return NextResponse.redirect(`${baseUrl}/student/overview`);
        }
      }
    } catch (err) {
      console.error('Unexpected callback error:', err);
      return NextResponse.redirect(`${baseUrl}/login?error=An unexpected error occurred during authentication.`);
    }
  }

  return NextResponse.redirect(`${baseUrl}/login?error=Invalid authentication callback.`);
}
