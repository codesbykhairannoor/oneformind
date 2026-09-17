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
    const userName = session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.email.split('@')[0];

    const sampleItemsMap: Record<string, string[]> = {
      habit: [
        '🌱 Minum 2L Air Putih (Target harian)',
        '🏃 Lari Pagi 20 Menit (Streak: 5 hari)',
        '📖 Baca Buku 15 Halaman (Aktif)'
      ],
      planner: [
        '⚡ [Vital] Review Laporan Finansial Bulanan - Deadline: 12:00',
        '📌 [Penting] Siapkan Presentasi Strategi Q4',
        '☕ Evaluasi mingguan bersama tim'
      ],
      finance: [
        '💰 Alokasi Tabungan Bulanan: Rp 2.500.000 / Rp 3.000.000 (83%)',
        '⚠️ Batas Pengeluaran Dining Out: Tersisa Rp 450.000'
      ],
      journal: [
        '📓 Refleksi Hari: Apa 1 pelajaran terbaik yang Anda dapatkan hari ini?',
        '✨ Catat tingkat energi dan suasana hati Anda sebelum istirahat.'
      ],
      goals: [
        '🎯 Target North Star: Luncurkan MVP Life OS (Progres: 75%)',
        '🏁 Milestone: Selesaikan 100% integrasi Next.js'
      ],
      study: [
        '🎓 Flashcard Review: 24 kartu menunggu untuk diulang',
        '📚 Bacaan Aktif: Atomic Habits (Bab 4)'
      ],
      job: [
        '💼 Lamaran Kerja: 2 perusahaan menunggu tanggapan follow-up',
        '🗓️ Jadwal Wawancara Teknis besok pukul 14:00'
      ],
      digest: [
        '🌱 3 Kebiasaan aktif menunggu centang hari ini',
        '📋 2 Tugas prioritas tinggi di Planner',
        '💸 Budget bulanan dalam batas aman (34% terpakai)',
        '📓 Jurnal malam siap diisi'
      ]
    };

    const items = sampleItemsMap[moduleType] || sampleItemsMap.digest;

    const result = await sendReminderEmail({
      toEmail: session.user.email,
      userName: userName,
      subject: `Uji Coba Pengingat: ${moduleType.toUpperCase()} Reminder`,
      moduleType: moduleType as any,
      items: items,
      customMessage: 'Ini adalah email uji coba untuk memverifikasi bahwa sistem pengingat otomatis OneForMind berhasil terkirim ke inbox email Anda.',
      locale: body.locale || 'id',
    });

    return NextResponse.json({
      success: true,
      deliveredTo: session.user.email,
      simulated: result.simulated,
      message: 'Email pengingat berhasil dikirim!',
    });
  } catch (error: any) {
    console.error('Error sending test notification email:', error);
    return NextResponse.json({ error: error.message || 'Gagal mengirim email pengingat' }, { status: 500 });
  }
}
