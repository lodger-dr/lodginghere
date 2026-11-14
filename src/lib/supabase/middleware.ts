import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: Array<{ name: string; value: string; options?: Record<string, unknown> }>) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options as any)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  // 1. Unauthenticated users trying to access protected portals
  const isStudentRoute = path.startsWith('/student');
  const isLandlordRoute = path.startsWith('/landlord');
  const isAdminRoute = path.startsWith('/admin');

  if (!user && (isStudentRoute || isLandlordRoute || isAdminRoute)) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('next', path);
    return NextResponse.redirect(url);
  }

  // 2. Authenticated user role check
  if (user) {
    // Fetch profile role from database
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    const role = profile?.role || 'student';

    // If visiting auth pages while logged in, redirect to respective portal
    if (path === '/login' || path === '/register' || path === '/reset-password') {
      const url = request.nextUrl.clone();
      if (role === 'admin') {
        url.pathname = '/admin/dashboard';
      } else if (role === 'landlord') {
        url.pathname = '/landlord/overview';
      } else {
        url.pathname = '/student/overview';
      }
      return NextResponse.redirect(url);
    }

    // Role boundary enforcement
    if (isStudentRoute && role !== 'student' && role !== 'admin') {
      const url = request.nextUrl.clone();
      url.pathname = '/landlord/overview';
      return NextResponse.redirect(url);
    }

    if (isLandlordRoute && role !== 'landlord' && role !== 'admin') {
      const url = request.nextUrl.clone();
      url.pathname = '/student/overview';
      return NextResponse.redirect(url);
    }

    if (isAdminRoute && role !== 'admin') {
      const url = request.nextUrl.clone();
      url.pathname = role === 'landlord' ? '/landlord/overview' : '/student/overview';
      return NextResponse.redirect(url);
    }
  }

  return response;
}

