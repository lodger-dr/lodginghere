import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';
import { auth0 } from './lib/auth0';

export async function proxy(request: NextRequest) {
  // 1. Run Supabase session refresh and route boundary protection
  const supabaseResponse = await updateSession(request);

  // If Supabase route guard issued a redirect, return it immediately
  if (supabaseResponse.status >= 300 && supabaseResponse.status < 400) {
    return supabaseResponse;
  }

  // 2. Run Auth0 middleware safely
  try {
    const auth0Response = await auth0.middleware(request);
    return auth0Response;
  } catch (error) {
    // Fall back to Supabase response if Auth0 domain/session encounters a transient issue
    return supabaseResponse;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images, svg, icons
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
