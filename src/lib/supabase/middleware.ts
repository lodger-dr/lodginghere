import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

interface CookieToSet {
  name: string;
  value: string;
  options?: Parameters<NextResponse['cookies']['set']>[2];
}

function createRedirect(url: URL | string, supabaseResponse: NextResponse): NextResponse {
  const redirectResponse = NextResponse.redirect(url);
  supabaseResponse.cookies.getAll().forEach((cookie) => {
    redirectResponse.cookies.set(cookie.name, cookie.value, cookie);
  });
  return redirectResponse;
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: CookieToSet[]) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // Refreshes the auth token and retrieves the authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  const isStudentRoute = pathname.startsWith('/student');
  const isLandlordRoute = pathname.startsWith('/landlord');
  const isAdminRoute = pathname.startsWith('/admin');
  // Exclude /reset-password so recovery sessions can access password reset form
  const isAuthRoute = pathname === '/login' || pathname === '/register';

  // If user is unauthenticated and attempting to access protected dashboards:
  if (!user && (isStudentRoute || isLandlordRoute || isAdminRoute)) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('next', pathname);
    return createRedirect(url, supabaseResponse);
  }

  // Determine verified user role securely from server-controlled app_metadata or database query
  let verifiedRole: string | null = null;
  if (user) {
    if (user.app_metadata && typeof user.app_metadata.role === 'string') {
      verifiedRole = user.app_metadata.role;
    } else {
      // Query database profile to ensure role is authentic and avoid client-writable user_metadata spoofing
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      verifiedRole = profile?.role || 'student';
    }
  }

  // If user is already authenticated and navigating to login/register:
  if (user && isAuthRoute) {
    const url = request.nextUrl.clone();
    url.searchParams.delete('next');
    url.searchParams.delete('error');
    url.searchParams.delete('registered');

    if (verifiedRole === 'admin') {
      url.pathname = '/admin/dashboard';
    } else if (verifiedRole === 'landlord') {
      url.pathname = '/landlord/overview';
    } else {
      url.pathname = '/student/overview';
    }
    return createRedirect(url, supabaseResponse);
  }

  // Cross-portal authorization check:
  if (user && (isStudentRoute || isLandlordRoute || isAdminRoute)) {
    if (isAdminRoute && verifiedRole !== 'admin') {
      const url = request.nextUrl.clone();
      url.pathname = verifiedRole === 'landlord' ? '/landlord/overview' : '/student/overview';
      return createRedirect(url, supabaseResponse);
    }

    if (isLandlordRoute && verifiedRole !== 'landlord' && verifiedRole !== 'admin') {
      const url = request.nextUrl.clone();
      url.pathname = '/student/overview';
      return createRedirect(url, supabaseResponse);
    }

    if (isStudentRoute && verifiedRole !== 'student' && verifiedRole !== 'admin') {
      const url = request.nextUrl.clone();
      url.pathname = '/landlord/overview';
      return createRedirect(url, supabaseResponse);
    }
  }

  return supabaseResponse;
}
