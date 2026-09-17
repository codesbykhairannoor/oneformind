import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { sendReminderEmail } from '@/lib/email-service';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const moduleType = body.moduleType || 'digest';
    const items = body.items || [];
    const customMessage = body.customMessage;

    const userName = session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.email.split('@')[0];

    const result = await sendReminderEmail({
      toEmail: session.user.email,
      userName,
      subject: `Pengingat ${moduleType.toUpperCase()} - OneForMind Life OS`,
      moduleType: moduleType as any,
      items,
      customMessage,
      locale: body.locale || 'id',
    });

    return NextResponse.json({
      success: true,
      deliveredTo: session.user.email,
      result,
    });
  } catch (error: any) {
    console.error('Error dispatching automated reminder email:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
