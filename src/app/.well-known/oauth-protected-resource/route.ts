import { NextResponse } from 'next/server';

const BASE_URL = process.env.APP_URL || 'https://tranvas.com';

/**
 * RFC 9728 OAuth 2.0 Protected Resource Metadata
 * Declares machine-readable scoped API permissions for AI agents and OAuth clients.
 */
export async function GET() {
  const metadata = {
    resource: `${BASE_URL}/api`,
    authorization_servers: [BASE_URL],
    bearer_methods_supported: ['header'],
    resource_documentation: `${BASE_URL}/resources/api`,
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
