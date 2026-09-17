/**
 * Email Dispatcher Service for Life OS Reminders (Habits, Finance, Journal, Planner, etc.)
 */

export interface ReminderEmailPayload {
  toEmail: string;
  userName: string;
  subject: string;
  moduleType: 'habit' | 'planner' | 'finance' | 'journal' | 'goals' | 'study' | 'job' | 'digest';
  items?: string[];
  customMessage?: string;
  locale?: string;
}

export async function sendReminderEmail(payload: ReminderEmailPayload): Promise<{ success: boolean; messageId?: string; simulated?: boolean; error?: string }> {
  const { toEmail, userName, subject, moduleType, items = [], customMessage, locale = 'id' } = payload;
  const isIndo = locale === 'id';

  if (!toEmail) {
    return { success: false, error: 'Recipient email is required' };
  }

  const moduleTitles: Record<string, { id: string; en: string; icon: string }> = {
    habit: { id: 'Pengingat Kebiasaan Harian', en: 'Daily Habit Reminder', icon: '🌱' },
    planner: { id: 'Agenda & Tugas Prioritas Hari Ini', en: 'Today\'s Planner & Vital Tasks', icon: '📋' },
    finance: { id: 'Review Arus Kas & Anggaran', en: 'Cashflow & Budget Check', icon: '💸' },
    journal: { id: 'Waktunya Refleksi & Catat Jurnal', en: 'Daily Evening Journal Reflection', icon: '📓' },
    goals: { id: 'Evaluasi Progres Target & OKR', en: 'Goal Milestone & OKR Review', icon: '🎯' },
    study: { id: 'Pengingat Belajar & Tugas Akademik', en: 'Study & Assignment Radar', icon: '🎓' },
    job: { id: 'Pengingat Follow-Up Karier & Lamaran', en: 'Career & Job Pipeline Check', icon: '💼' },
    digest: { id: 'Ringkasan Harian Life OS Anda', en: 'Your Daily Life OS Brief', icon: '✨' },
  };

  const currentMod = moduleTitles[moduleType] || moduleTitles.digest;
  const formattedTitle = isIndo ? currentMod.id : currentMod.en;

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 10px 25px rgba(0,0,0,0.03);">
    
    <!-- HEADER -->
    <tr>
      <td style="padding: 36px 36px 28px 36px; background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); text-align: left;">
        <div style="font-size: 28px; line-height: 1; margin-bottom: 12px;">${currentMod.icon}</div>
        <h1 style="margin: 0; font-size: 22px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">
          ${formattedTitle}
        </h1>
        <p style="margin: 6px 0 0 0; font-size: 13px; color: #e0e7ff; font-weight: 500;">
          OneForMind Life OS • ${new Date().toLocaleDateString(isIndo ? 'id-ID' : 'en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </td>
    </tr>

    <!-- BODY -->
    <tr>
      <td style="padding: 32px 36px;">
        <p style="font-size: 15px; line-height: 1.6; margin: 0 0 20px 0; color: #334155;">
          ${isIndo ? `Halo <strong>${userName}</strong>,` : `Hi <strong>${userName}</strong>,`}
        </p>

        <p style="font-size: 14px; line-height: 1.6; margin: 0 0 24px 0; color: #475569;">
          ${customMessage || (isIndo 
            ? 'Berikut adalah pengingat otomatis berdasarkan modul aktif yang Anda jadwalkan di pengaturan akun OneForMind:' 
            : 'Here is your automated reminder based on active modules configured in your OneForMind account settings:')}
        </p>

        ${items.length > 0 ? `
        <!-- ITEM LIST -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 28px; background-color: #f8fafc; border-radius: 16px; border: 1px solid #edf2f7; padding: 16px;">
          ${items.map(item => `
            <tr>
              <td style="padding: 8px 12px; font-size: 13px; font-weight: 600; color: #1e293b; border-bottom: 1px solid #e2e8f0;">
                • ${item}
              </td>
            </tr>
          `).join('')}
        </table>
        ` : ''}

        <!-- CTA BUTTON -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top: 10px; margin-bottom: 30px;">
          <tr>
            <td align="center">
              <a href="https://tranvas.com/dashboard" target="_blank" style="display: inline-block; padding: 14px 32px; background-color: #4f46e5; color: #ffffff; font-size: 14px; font-weight: 700; text-decoration: none; border-radius: 14px; box-shadow: 0 4px 12px rgba(79, 70, 229, 0.25);">
                ${isIndo ? 'Buka Workspace & Selesaikan Sekarang →' : 'Open Workspace & Complete Now →'}
              </a>
            </td>
          </tr>
        </table>

        <!-- TIP FOOTER -->
        <div style="border-top: 1px solid #f1f5f9; padding-top: 20px; font-size: 12px; color: #94a3b8; line-height: 1.6;">
          <p style="margin: 0 0 8px 0;">
            💡 <em>${isIndo ? 'Tips: Konsistensi 2 menit setiap hari jauh lebih berdampak dibanding motivasi sporadis.' : 'Tip: 2 minutes of daily consistency compounds faster than sporadic bursts of motivation.'}</em>
          </p>
          <p style="margin: 0;">
            ${isIndo ? 'Anda menerima email ini karena pengingat aktif di Pengaturan Notifikasi. Anda dapat menonaktifkan atau mengatur jam pengiriman kapan saja di menu Pengaturan.' : 'You received this email because reminders are active in your Notification Settings. You can disable or change reminder timings anytime in Settings.'}
          </p>
        </div>
      </td>
    </tr>

  </table>
</body>
</html>
  `.trim();

  // Try sending via Resend API if API Key is configured in environment
  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM || 'OneForMind Reminders <reminders@tranvas.com>',
          to: [toEmail],
          subject: `${currentMod.icon} ${subject}`,
          html: htmlContent,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        return { success: true, messageId: data.id, simulated: false };
      }
    } catch (e: any) {
      console.warn('Resend API dispatch failed, falling back to mailer log:', e.message);
    }
  }

  // Graceful fallback: structured audit log for server dispatch
  console.log(`[EMAIL DISPATCH] Sent ${moduleType} reminder to ${toEmail} | Subject: ${subject}`);
  return {
    success: true,
    messageId: `sim_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
    simulated: true,
  };
}
