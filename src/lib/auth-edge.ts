import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

// NextAuth v5 changed the default cookie name from "next-auth.session-token"
// to "authjs.session-token". We must explicitly pass the correct cookie name.
// On HTTPS (production), the cookie is prefixed with __Secure-
const COOKIE_NAME = process.env.NODE_ENV === 'production'
  ? '__Secure-authjs.session-token'
  : 'authjs.session-token';

export async function getAuthToken(req: NextRequest) {
  // Try the new v5 cookie name first
  let token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
    cookieName: COOKIE_NAME,
  });

  // Fallback: try without cookieName (lets next-auth auto-detect)
  if (!token?.sub) {
    token = await getToken({
      req,
      secret: process.env.AUTH_SECRET,
    });
  }

  return token;
}
