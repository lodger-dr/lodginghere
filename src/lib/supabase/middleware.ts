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

const FALLBACK_SUPABASE_URL = 'https://pbgrhgenxpubcnmptqvv.supabase.co';
const FALLBACK_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBiZ3JoZ2VueHB1YmNubXB0cXZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQ2MzkyNzksImV4cCI6MjExMDIxNTI3OX0.yWALcW7QAw6saIDtFUtNWmJ3mbqFmdfCgRyOPUJ29-M';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_SUPABASE_ANON_KEY;

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
  const isOnboardingRoute = pathname === '/onboarding';
  // Exclude /reset-password so recovery sessions can access password reset form
  const isAuthRoute = pathname === '/login' || pathname === '/register';

  // If user is unauthenticated and attempting to access protected dashboards or onboarding:
  if (!user && (isStudentRoute || isLandlordRoute || isAdminRoute || isOnboardingRoute)) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('next', pathname);
    return createRedirect(url, supabaseResponse);
  }

  // Determine verified user role and onboarding status
  let verifiedRole: string | null = null;
  let onboardingCompleted: boolean = true;

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, onboarding_completed')
      .eq('id', user.id)
      .single();

    verifiedRole = (user.app_metadata?.role as string) || profile?.role || 'student';
    if (profile) {
      onboardingCompleted = profile.onboarding_completed ?? true;
    } else {
      onboardingCompleted = (user.user_metadata?.onboarding_completed as boolean) ?? false;
    }
  }

  // If authenticated user has not completed onboarding yet:
  if (user && !onboardingCompleted) {
    if (!isOnboardingRoute) {
      const url = request.nextUrl.clone();
      url.pathname = '/onboarding';
      url.searchParams.delete('next');
      url.searchParams.delete('error');
      url.searchParams.delete('registered');
      return createRedirect(url, supabaseResponse);
    }
    // Allow user on /onboarding
    return supabaseResponse;
  }

  // If user has already completed onboarding and tries to visit /onboarding:
  if (user && onboardingCompleted && isOnboardingRoute) {
    const url = request.nextUrl.clone();
    if (verifiedRole === 'admin') {
      url.pathname = '/admin/dashboard';
    } else if (verifiedRole === 'landlord') {
      url.pathname = '/landlord/overview';
    } else {
      url.pathname = '/student/overview';
    }
    return createRedirect(url, supabaseResponse);
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
