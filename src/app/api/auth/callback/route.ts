import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const ALLOWED_HOST_RE = /^(?:(?:www\.)?tranvas\.com|[a-z0-9-]+\.vercel\.app|localhost(?::\d+)?|127\.0\.0\.1(?::\d+)?)$/i;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const rawNext = searchParams.get('next') ?? '/dashboard';

  // Prevent Open Redirect & Protocol Smuggling (e.g. //evil.com, https://evil.com, /\evil.com)
  let safeNext = '/dashboard';
  if (
    rawNext &&
    rawNext.startsWith('/') &&
    !rawNext.startsWith('//') &&
    !rawNext.startsWith('/\\') &&
    !rawNext.includes('\\')
  ) {
    try {
      const parsed = new URL(rawNext, 'http://localhost');
      if (parsed.origin === 'http://localhost' && parsed.pathname.startsWith('/')) {
        safeNext = parsed.pathname + parsed.search + parsed.hash;
      }
    } catch {
      safeNext = '/dashboard';
    }
  }

  // SECURITY: Validate Host / X-Forwarded-Host against strict allowlist to block Host Header Injection
  const rawHost = (request.headers.get('x-forwarded-host') || request.headers.get('host') || '').split(',')[0].trim();
  let origin = (process.env.APP_URL || 'https://tranvas.com').replace(/\/$/, '');
  if (rawHost && ALLOWED_HOST_RE.test(rawHost)) {
    const protocol = rawHost.startsWith('localhost') || rawHost.startsWith('127.0.0.1') ? 'http' : 'https';
    origin = `${protocol}://${rawHost}`;
  }

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // Ignored when called from Server Component context
            }
          },
        },
      }
    );
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && data?.session?.user) {
      const refCookie = cookieStore.get('tranvas_ref_code')?.value;
      if (refCookie) {
        try {
          const { recordSignupReferral } = await import('@/lib/affiliate/affiliate-service');
          await recordSignupReferral(supabase, data.session.user.id, refCookie);
        } catch (refErr) {
          console.warn('OAuth referral attribution notice:', refErr);
        }
      }
      return NextResponse.redirect(`${origin}${safeNext}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=Could%20not%20authenticate%20user`);
}
