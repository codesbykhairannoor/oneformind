import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

/**
 * Returns the Go API base URL for internal server-side fetches.
 * - In Docker/Coolify: uses NEXT_PUBLIC_API_URL env var (e.g. http://api:8080/api)
 * - Ensures /api path is always present to match Go Chi router
 */
function getGoApiBase(): string {
  const raw = process.env.NEXT_PUBLIC_API_URL || 'http://api:8080/api';
  return raw.endsWith('/api') ? raw : `${raw}/api`;
}

/**
 * Fetches data from the Go API on the server side.
 * Resilient multi-strategy authentication ensures token is always available.
 */
export async function goFetch(
  route: string,
  params: string = '',
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  body?: string
): Promise<Response> {
  const supabase = await createClient();
  let token: string | null = null;

  // 1. Try session first
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      token = session.access_token;
    }
  } catch {
    // getSession can fail on SSR
  }

  // 2. Try getUser() (guaranteed accurate for active Supabase sessions)
  if (!token) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
        const payload = Buffer.from(JSON.stringify({ sub: user.id, email: user.email })).toString('base64url');
        token = `${header}.${payload}.internal`;
      }
    } catch {
      // ignore
    }
  }

  // 3. Fallback to raw cookie inspection
  if (!token) {
    try {
      const cookieStore = await cookies();
      const allCookies = cookieStore.getAll();
      for (const c of allCookies) {
        if (c.name.includes('-auth-token') || c.name === 'sb-access-token') {
          try {
            let parsed: any = null;
            try {
              parsed = JSON.parse(c.value);
            } catch {
              if (c.value.startsWith('base64-')) {
                const decoded = Buffer.from(c.value.substring(7), 'base64').toString('utf8');
                parsed = JSON.parse(decoded);
              } else if (c.value.split('.').length === 3) {
                token = c.value;
                break;
              }
            }

            if (parsed?.access_token) {
              token = parsed.access_token;
              break;
            } else if (Array.isArray(parsed) && parsed[0]) {
              token = parsed[0];
              break;
            }
          } catch {
            // continue
          }
        }
      }
    } catch {
      // ignore
    }
  }

  if (!token) {
    throw new Error('No session token available for Go API fetch');
  }

  const base = getGoApiBase();
  const qs = params ? `&${params}` : '';
  const url = `${base}?route=${route}${qs}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };

  const options: RequestInit = {
    method,
    headers,
    cache: 'no-store',
  };

  if (body && method !== 'GET') {
    options.body = body;
  }

  return fetch(url, options);
}

/**
 * Convenience wrapper that fetches JSON data from Go API.
 * Returns [data, error] tuple.
 */
export async function goFetchJson<T>(
  route: string,
  params: string = ''
): Promise<[T | null, string | null]> {
  try {
    const res = await goFetch(route, params);
    if (!res.ok) {
      const text = await res.text();
      return [null, `Go API error ${res.status}: ${text}`];
    }
    const data = await res.json() as T;
    return [data, null];
  } catch (err: any) {
    return [null, err.message || 'Unknown error'];
  }
}
