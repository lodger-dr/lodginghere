import { createBrowserClient } from '@supabase/ssr';

export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pbgrhgenxpubcnmptqvv.supabase.co';

export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBiZ3JoZ2VueHB1YmNubXB0cXZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQ2MzkyNzksImV4cCI6MjExMDIxNTI3OX0.yWALcW7QAw6saIDtFUtNWmJ3mbqFmdfCgRyOPUJ29-M';

export function createClient() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
