import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Determine user role and redirect to appropriate dashboard
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        const role = profile?.role || 'student';
        if (role === 'admin') {
          return NextResponse.redirect(`${origin}/admin/dashboard`);
        } else if (role === 'landlord') {
          return NextResponse.redirect(`${origin}/landlord/overview`);
        } else {
          return NextResponse.redirect(`${origin}/student/overview`);
        }
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Return user to login with error
  return NextResponse.redirect(`${origin}/login?error=Could+not+authenticate+user`);
}

