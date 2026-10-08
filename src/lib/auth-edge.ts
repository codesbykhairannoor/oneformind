import { createServerClient } from '@supabase/ssr'
import type { NextRequest } from 'next/server'

export async function getAuthToken(req: NextRequest) {
  // 1. Direct Authorization Header Check (Mobile, SWR, or direct API callers)
  const authHeader = req.headers.get('authorization') || req.headers.get('Authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const rawToken = authHeader.substring(7).trim();
    if (rawToken) {
      try {
        const parts = rawToken.split('.');
        if (parts.length === 3) {
          const payloadStr = Buffer.from(parts[1], 'base64url').toString('utf8');
          const claims = JSON.parse(payloadStr);
          if (claims.sub) {
            return {
              sub: claims.sub,
              email: claims.email || '',
              accessToken: rawToken,
            };
          }
        }
      } catch {
        // Fall through to cookie-based extraction
      }
    }
  }

  // 2. Supabase SSR Client with fallback credentials
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://esahuobozjxkyjvpxslu.supabase.co';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzYWh1b2Jvemp4a3lqdnB4c2x1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5MDk3NzMsImV4cCI6MjA4NDQ4NTc3M30.V6ZBvGe00D7HsduaxstN8bquN8-Snnl61LbwPVSi3ks';

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll() {
          // Read-only in edge API routes
        },
      },
    }
  );

  // 3. Try getSession() first
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user && session?.access_token) {
      return {
        sub: session.user.id,
        email: session.user.email || '',
        accessToken: session.access_token,
      };
    }
  } catch {
    // getSession might throw if cookies are malformed
  }

  // 4. Try getUser() (more authoritative in Supabase SSR)
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.email) {
      const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
      const payload = Buffer.from(JSON.stringify({ sub: user.id, email: user.email })).toString('base64url');
      return {
        sub: user.id,
        email: user.email,
        accessToken: `${header}.${payload}.internal`,
      };
    }
  } catch {
    // getUser might fail if no session
  }

  // 5. Inspect raw cookies for Supabase auth token
  const allCookies = req.cookies.getAll();
  for (const c of allCookies) {
    if (c.name.includes('-auth-token') || c.name === 'sb-access-token') {
      try {
        let tokenCandidate: string | null = null;
        let parsed: any = null;
        try {
          parsed = JSON.parse(c.value);
        } catch {
          if (c.value.startsWith('base64-')) {
            const decoded = Buffer.from(c.value.substring(7), 'base64').toString('utf8');
            parsed = JSON.parse(decoded);
          } else if (c.value.split('.').length === 3) {
            tokenCandidate = c.value;
          }
        }

        if (parsed?.access_token) {
          tokenCandidate = parsed.access_token;
        } else if (Array.isArray(parsed) && parsed[0]) {
          tokenCandidate = parsed[0];
        }

        if (tokenCandidate) {
          const parts = tokenCandidate.split('.');
          if (parts.length === 3) {
            const payloadStr = Buffer.from(parts[1], 'base64url').toString('utf8');
            const claims = JSON.parse(payloadStr);
            if (claims.sub) {
              return {
                sub: claims.sub,
                email: claims.email || '',
                accessToken: tokenCandidate,
              };
            }
          }
        }
      } catch {
        // continue search
      }
    }
  }

  return null;
}
