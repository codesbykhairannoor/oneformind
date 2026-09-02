import { createClient } from '@/utils/supabase/server';

/**
 * Returns the Go API base URL for internal server-side fetches.
 * - In Docker/Coolify: uses NEXT_PUBLIC_API_URL env var (e.g. http://api:8080)
 * - In Vercel: falls back to /api route through Next.js proxy
 */
function getGoApiBase(): string {
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
}

/**
 * Fetches data from the Go API on the server side.
 * Automatically retrieves the Supabase session token and passes it to Go.
 * Go's JWT middleware handles email → internal userId mapping.
 *
 * @param route  - The ?route= param for the Go API (e.g. 'habits', 'finance-transactions')
 * @param params - Additional query string params (e.g. 'month=2026-09')
 * @param method - HTTP method (default: 'GET')
 * @param body   - Optional request body for POST/PUT
 */
export async function goFetch(
  route: string,
  params: string = '',
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  body?: string
): Promise<Response> {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session?.access_token) {
    throw new Error('No session token available for Go API fetch');
  }

  const base = getGoApiBase();
  const qs = params ? `&${params}` : '';
  const url = `${base}?route=${route}${qs}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${session.access_token}`,
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
