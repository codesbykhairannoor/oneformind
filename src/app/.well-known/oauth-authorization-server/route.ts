import { NextResponse } from 'next/server';

const BASE_URL = process.env.APP_URL || 'https://tranvas.com';
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://tranvas.com';

/**
 * RFC 8414 OAuth 2.0 Authorization Server Metadata
 * Publishes standard OAuth 2.0 / PKCE discovery metadata for Tranvas.
 */
export async function GET() {
  const metadata = {
    issuer: BASE_URL,
    authorization_endpoint: `${SUPABASE_URL}/auth/v1/authorize`,
    token_endpoint: `${SUPABASE_URL}/auth/v1/token`,
    revocation_endpoint: `${SUPABASE_URL}/auth/v1/logout`,
    service_documentation: `${BASE_URL}/resources/api`,
    response_types_supported: ['code'],
    grant_types_supported: ['authorization_code', 'refresh_token'],
    code_challenge_methods_supported: ['S256'],
    token_endpoint_auth_methods_supported: ['none', 'client_secret_post'],
    scopes_supported: [
      'openid',
      'profile:read',
      'tasks:read',
      'tasks:write',
      'habits:read',
      'habits:write',
      'finance:read',
      'finance:write',
      'goals:read',
      'goals:write',
      'journals:read',
      'journals:write',
      'calendar:read',
      'calendar:write',
      'jobs:read',
      'jobs:write',
      'study:read',
      'study:write',
    ],
  };

  return NextResponse.json(metadata, {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
