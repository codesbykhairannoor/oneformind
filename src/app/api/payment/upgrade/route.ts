import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * Direct client-initiated subscription upgrade is permanently disabled to prevent
 * free-premium payment bypass exploits. Upgrades are granted exclusively through
 * verified payment gateway callbacks (Duitku, PayPal Capture, Lemon Squeezy HMAC webhook).
 */
export async function POST() {
  return NextResponse.json(
    { error: 'Forbidden: Direct self-upgrade is disabled. Complete checkout through a verified payment gateway.' },
    { status: 403 }
  );
}
