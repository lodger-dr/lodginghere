import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

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
        // Query the profile role
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();

        let userRole = profile?.role || 'student';

        // If the user signed up specifically through the landlord tab
        if (roleParam === 'landlord' && userRole !== 'admin') {
          if (userRole !== 'landlord') {
            await supabase
              .from('profiles')
              .update({ role: 'landlord' })
              .eq('id', data.user.id);

            await supabase
              .from('landlord_profiles')
              .upsert({
                user_id: data.user.id,
                provider_type: 'owner',
              });

            userRole = 'landlord';
          }
        }

        // Handle explicit next redirection if provided and safe
        if (nextParam && nextParam.startsWith('/')) {
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
