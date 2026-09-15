import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, { ...options, secure: false })
          )
        },
      },
    }
  )

  // Refresh session gracefully without blocking client route transitions
  try {
    const hasAuthCookie = request.cookies.has('sb-access-token') || 
      request.cookies.getAll().some(c => c.name.startsWith('sb-') && c.name.includes('-auth-token'));

    if (hasAuthCookie) {
      // Use a fast 120ms cap so slow network calls to Supabase auth API never freeze tab switching
      const getUserPromise = supabase.auth.getUser();
      const timeoutPromise = new Promise((resolve) => setTimeout(resolve, 120));
      await Promise.race([getUserPromise, timeoutPromise]);
    } else {
      await supabase.auth.getUser();
    }
  } catch (e) {
    // Non-fatal: keep tab navigation instant
  }

  return supabaseResponse
}
