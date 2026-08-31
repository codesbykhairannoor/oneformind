import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
export async function GET(req: Request) {
  try {
    const host = req.headers.get('host');
    const goUrl = 'https://' + host + '/api?route=habits&period=2026-08';
    const goRes = await fetch(goUrl, { headers: { 'X-User-Id': '1' }, cache: 'no-store' });
    const text = await goRes.text();
    return NextResponse.json({ success: true, status: goRes.status, url: goUrl, body: text });
  } catch(e: any) {
    return NextResponse.json({ success: false, error: e.message, stack: e.stack });
  }
}
