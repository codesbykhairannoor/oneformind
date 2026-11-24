import { createServerClient } from '@supabase/ssr';
import type { NextRequest } from 'next/server';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://esahuobozjxkyjvpxslu.supabase.co';
const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzYWh1b2Jvemp4a3lqdnB4c2x1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5MDk3NzMsImV4cCI6MjA4NDQ4NTc3M30.V6ZBvGe00D7HsduaxstN8bquN8-Snnl61LbwPVSi3ks';

export async function getAuthToken(req: NextRequest) {
  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return req.cookies.getAll();
      },
      setAll() {
        // Read-only in API route handlers
      },
    },
  });

  // 1. Direct Authorization Header Check — MUST cryptographically verify via Supabase Auth
  const authHeader = req.headers.get('authorization') || req.headers.get('Authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const rawToken = authHeader.substring(7).trim();
    if (rawToken && rawToken.split('.').length === 3) {
      try {
        const { data: { user }, error } = await supabase.auth.getUser(rawToken);
        if (!error && user?.id && user?.email) {
          return {
            sub: user.id,
            email: user.email,
            accessToken: rawToken,
          };
        }
      } catch {
        // Invalid/forged bearer token — reject instead of trusting unsigned base64 claims
      }
      return null;
    }
  }

  // 2. Cookie-based session — verify user authoritatively with Supabase getUser()
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user?.id || !user?.email) {
      return null;
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      return {
        sub: user.id,
        email: user.email,
        accessToken: session.access_token,
      };
    }
  } catch {
    return null;
  }

  return null;
}
