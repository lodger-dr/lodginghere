import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const path = request.nextUrl.pathname;

  // Development Stage:
  // All authentication and sign-up requirements are completely bypassed for testing.
  // The active user persona is tracked via the 'dev_role' cookie ('student' or 'landlord').
  const devRoleCookie = request.cookies.get('dev_role')?.value;

  // Synchronize dev_role cookie if directly navigating to portal paths
  if (path.startsWith('/student') && devRoleCookie !== 'student') {
    response.cookies.set('dev_role', 'student', {
      path: '/',
      maxAge: 31536000,
      sameSite: 'lax',
    });
  } else if (path.startsWith('/landlord') && devRoleCookie !== 'landlord') {
    response.cookies.set('dev_role', 'landlord', {
      path: '/',
      maxAge: 31536000,
      sameSite: 'lax',
    });
  }

  return response;
}
