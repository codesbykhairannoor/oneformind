import { createServerClient } from '@supabase/ssr'
import type { NextRequest } from 'next/server'

export async function getAuthToken(req: NextRequest) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll()
        },
        setAll() {
          // Read-only in edge API routes
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session?.user) return null;

  return {
    sub: session.user.id,
    email: session.user.email,
    accessToken: session.access_token,
  };
}
