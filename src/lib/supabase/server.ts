import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pbgrhgenxpubcnmptqvv.supabase.co';

export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBiZ3JoZ2VueHB1YmNubXB0cXZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQ2MzkyNzksImV4cCI6MjExMDIxNTI3OX0.yWALcW7QAw6saIDtFUtNWmJ3mbqFmdfCgRyOPUJ29-M';

export const SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBiZ3JoZ2VueHB1YmNubXB0cXZ2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5NDYzOTI3OSwiZXhwIjoyMTEwMjE1Mjc5fQ.iHG4VymDc704yQSl5q1TAyH5RhKvmnpff_1bMtavo0o';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: Array<{ name: string; value: string; options?: Parameters<typeof cookieStore.set>[2] }>) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing user sessions.
        }
      },
    },
  });
}

// Server-only client with service role key for privileged operations (moderation, audit logs)
export function createAdminClient() {
  return createServerClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    cookies: {
      getAll() {
        return [];
      },
      setAll() { },
    },
  });
}
