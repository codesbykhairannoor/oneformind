export const SITE_NAME = 'Tranvas';

export interface RouteMeta {
  title: string;
  description: string;
}

/**
 * Standard global 2026 SaaS, SEO & GEO titles and descriptions for Tranvas.
 * Modeled after Linear, Notion, and Raycast global standards.
 * Optimized for human recognition, browser tab scannability, and generative AI search engines.
 */
export function getRouteTitle(pathname: string, locale: string = 'en'): string {
  const isId = locale === 'id';

  // Normalize pathname: remove query params, hash, locale prefix, trailing slashes
  let clean = pathname.split('?')[0].split('#')[0].replace(/^\/(id|en)(\/|$)/, '/');
  if (!clean.startsWith('/')) clean = `/${clean}`;
  if (clean.length > 1 && clean.endsWith('/')) clean = clean.slice(0, -1);

  // Exact Route Match
  switch (clean) {
    case '':
    case '/':
      return isId
        ? 'Tranvas — Life OS Terpadu untuk Fokus, Habit, Keuangan & Target'
        : 'Tranvas — The Unified Life OS for Focus, Habits, Finance & Goals';

    // Auth Routes
    case '/login':
      return isId
        ? 'Masuk ke Akun Tranvas — Life OS Terpadu'
        : 'Log In to Tranvas — The Unified Life OS';
    case '/register':
      return isId
        ? 'Daftar Akun Tranvas — Mulai Life OS Terpadu'
        : 'Get Started with Tranvas — The Unified Life OS';
    case '/forgot-password':
      return isId
        ? 'Lupa Kata Sandi | Tranvas'
        : 'Forgot Password | Tranvas';
    case '/confirm-password':
      return isId
        ? 'Konfirmasi Kata Sandi | Tranvas'
        : 'Confirm Password | Tranvas';
    case '/verify-email':
      return isId
        ? 'Verifikasi Email Akun | Tranvas'
        : 'Verify Your Email | Tranvas';

    // Marketing & Public Routes
    case '/pricing':
      return isId
        ? 'Harga & Paket Langganan Transparan | Tranvas'
        : 'Pricing & Plans — Transparent Access | Tranvas';
    case '/features':
      return isId
        ? 'Semua Fitur — 8 Modul Terpadu Life OS | Tranvas'
        : 'All Features — 8 Integrated Modules | Tranvas';
    case '/about':
      return isId
        ? 'Tentang Tranvas — Misi Membangun Unified Life OS'
        : 'About Tranvas — The Unified Life OS Vision';
    case '/contact':
      return isId
        ? 'Hubungi Kami — Dukungan & Kemitraan | Tranvas'
        : 'Contact Us — Support & Partnerships | Tranvas';
    case '/affiliates':
      return isId
        ? 'Program Afiliasi 30% Recurring | Tranvas'
        : 'Affiliate Program 30% Recurring | Tranvas';
    case '/privacy':
    case '/privacy-policy':
      return isId
        ? 'Kebijakan Privasi & Keamanan Data | Tranvas'
        : 'Privacy Policy & Data Protection | Tranvas';
    case '/terms':
    case '/terms-of-service':
      return isId
        ? 'Syarat & Ketentuan Layanan | Tranvas'
        : 'Terms of Service & Usage Agreement | Tranvas';

    // 8 Core Authenticated Modules & Hubs
    case '/dashboard':
      return isId
        ? 'Dashboard — Sinergi & Ikhtisar Kehidupan | Tranvas'
        : 'Dashboard — Daily Synergy & Life Overview | Tranvas';

    case '/planner':
    case '/planner/dashboard':
      return isId
        ? 'Daily Planner — Fokus Harian & Time Blocking | Tranvas'
        : 'Daily Planner — Focus & Time Blocking | Tranvas';

    case '/habits':
      return isId
        ? 'Habits Matrix — Konsistensi & Streak 28 Hari | Tranvas'
        : 'Habits Matrix — 28-Day Consistency & Streaks | Tranvas';

    case '/finance':
    case '/finance/dashboard':
      return isId
        ? 'Finance OS — Arus Kas & Zero-Based Budgeting | Tranvas'
        : 'Finance OS — Smart Cashflow & Budgeting | Tranvas';

    case '/goals':
      return isId
        ? 'Goals — Target & Milestone Bertingkat WOOP | Tranvas'
        : 'Goals — WOOP Scientific Milestone Cascading | Tranvas';

    case '/journal':
      return isId
        ? 'Mindful Journal — Refleksi Harian & Kejernihan Mental | Tranvas'
        : 'Mindful Journal — Reflection & Cognitive Clarity | Tranvas';
    case '/journal/write':
      return isId
        ? 'Tulis Jurnal Refleksi Baru | Tranvas'
        : 'New Reflection Entry — Mindful Journal | Tranvas';

    case '/jobs':
      return isId
        ? 'Career Pipeline — Pelacak Lamaran & Jalur Karir | Tranvas'
        : 'Career Pipeline — Job Application Tracker | Tranvas';

    case '/study':
      return isId
        ? 'Study Hub — Ruang Fokus & Pomodoro Belajar | Tranvas'
        : 'Study Hub — Focus Sessions & Pomodoro Timer | Tranvas';
    case '/study/portfolio':
      return isId
        ? 'Masteri Akademik & Portofolio Kursus | Tranvas'
        : 'Academic Portfolio & Course Mastery | Tranvas';

    case '/calendar':
      return isId
        ? 'Unified Calendar — Jadwal Hidup & Linimasa Terpadu | Tranvas'
        : 'Unified Calendar — Synchronized Life Schedule | Tranvas';

    // Settings, Billing, Account & Identity
    case '/settings':
      return isId
        ? 'Pengaturan Akun & Preferensi Sistem | Tranvas'
        : 'Settings — Account & System Preferences | Tranvas';
    case '/profile':
      return isId
        ? 'Profil Pengguna & Identitas | Tranvas'
        : 'User Profile & Identity | Tranvas';
    case '/billing':
      return isId
        ? 'Langganan & Manajemen Tagihan | Tranvas'
        : 'Subscription & Billing Management | Tranvas';
    case '/coach':
      return isId
        ? 'Neural Coach — Panduan Kognitif AI Pribadi | Tranvas'
        : 'Neural Coach — Cognitive AI Life Guidance | Tranvas';
    case '/admin':
      return isId
        ? 'Pusat Kontrol Admin & Analitik | Tranvas'
        : 'Admin Control Center & Analytics | Tranvas';
    case '/onboarding':
      return isId
        ? 'Setup Awal Workspace — Onboarding | Tranvas'
        : 'Workspace Setup & Onboarding | Tranvas';
    case '/payment/status':
      return isId
        ? 'Status Pembayaran Langganan | Tranvas'
        : 'Payment Status & Confirmation | Tranvas';

    // Company Pages
    case '/company/contact':
      return isId ? 'Kontak Perusahaan | Tranvas' : 'Company Contact | Tranvas';
    case '/company/press-kit':
      return isId ? 'Press Kit & Aset Media | Tranvas' : 'Press Kit & Media Assets | Tranvas';
    case '/company/privacy':
      return isId ? 'Privasi & Perlindungan Data | Tranvas' : 'Privacy & Data Security | Tranvas';
    case '/company/refund':
      return isId ? 'Kebijakan Pengembalian Dana | Tranvas' : 'Refund & Cancellation Policy | Tranvas';
    case '/company/security':
      return isId ? 'Standar Keamanan Enkripsi | Tranvas' : 'Security & Encryption Standards | Tranvas';
    case '/company/status':
      return isId ? 'Status Sistem & Uptime | Tranvas' : 'System Status & Uptime | Tranvas';
    case '/company/terms':
      return isId ? 'Ketentuan Layanan Perusahaan | Tranvas' : 'Terms of Service | Tranvas';

    // Resources Hub
    case '/resources/blog':
      return isId ? 'Blog & Wawasan Kognitif | Tranvas' : 'Blog & Cognitive Productivity Insights | Tranvas';
    case '/resources/changelog':
      return isId ? 'Changelog & Pembaruan Sistem | Tranvas' : 'Changelog & System Release Notes | Tranvas';
    case '/resources/community':
      return isId ? 'Komunitas Global Pengguna | Tranvas' : 'Global Life OS Community | Tranvas';
    case '/resources/guide':
      return isId ? 'Panduan Lengkap Memulai Life OS | Tranvas' : 'Mastery Guide & Life OS Walkthrough | Tranvas';
    case '/resources/help':
      return isId ? 'Pusat Bantuan & Tanya Jawab | Tranvas' : 'Help Center & Knowledge Base | Tranvas';
    case '/resources/stories':
      return isId ? 'Kisah Transformasi Pengguna | Tranvas' : 'User Transformation Stories & Case Studies | Tranvas';
    case '/resources/ai-trust':
      return isId ? 'Kepercayaan AI & Privasi Kognitif | Tranvas' : 'AI Trust & Cognitive Privacy Architecture | Tranvas';
    case '/resources/affiliate':
      return isId ? 'Panduan Mitra Afiliasi | Tranvas' : 'Affiliate Partner Guide & Assets | Tranvas';
    case '/resources/post':
      return isId ? 'Artikel & Wawasan Kognitif | Tranvas' : 'Articles & Cognitive Insights | Tranvas';

    default:
      // Subpath handling for journal write dynamic ID
      if (clean.startsWith('/journal/write/')) {
        return isId
          ? 'Edit Entri Jurnal Refleksi | Tranvas'
          : 'Edit Reflection Entry — Mindful Journal | Tranvas';
      }

      // Subpath handling for reset-password token
      if (clean.startsWith('/reset-password/')) {
        return isId
          ? 'Atur Ulang Kata Sandi Akun | Tranvas'
          : 'Reset Your Account Password | Tranvas';
      }

      // Subpath handling for public profile & card
      if (clean.startsWith('/p/')) {
        return isId
          ? 'Portofolio Publik Pengguna | Tranvas'
          : 'Public Life Profile & Portfolio | Tranvas';
      }

      // Features deepdives
      if (clean.startsWith('/features/')) {
        const featSlug = clean.replace('/features/', '');
        const featuresMap: Record<string, { en: string; id: string }> = {
          habit: { en: 'Habit Matrix — 28-Day Consistency Tracker', id: 'Pelacak Habit — Konsistensi 28 Hari' },
          planner: { en: 'Daily Planner — Deep Work & Time Blocking', id: 'Perencana Harian — Deep Work & Time Blocking' },
          finance: { en: 'Finance OS — Zero-Based Budgeting & Cashflow', id: 'Finance OS — Budgeting Cerdas & Arus Kas' },
          journal: { en: 'Mindful Journal — Cognitive Reflection & Clarity', id: 'Jurnal Refleksi — Kejernihan Mental' },
          goal: { en: 'WOOP Goal Tracker — Psychological Milestones', id: 'Pelacak Target — Metode Psikologi WOOP' },
          calendar: { en: 'Unified Calendar — Synchronized Life Timeline', id: 'Kalender Terpadu — Linimasa Jadwal Hidup' },
          job: { en: 'Career Pipeline — Job Application Tracker', id: 'Pipeline Karir — Pelacak Lamaran Kerja' },
          'neural-os': { en: 'Neural OS AI — Cognitive Life Architecture', id: 'Neural OS AI — Arsitektur Kognitif' },
        };
        const match = featuresMap[featSlug];
        if (match) {
          return `${isId ? match.id : match.en} | Tranvas`;
        }
      }

      // Solutions deepdives
      if (clean.startsWith('/solutions/')) {
        const solSlug = clean.replace('/solutions/', '');
        const solMap: Record<string, { en: string; id: string }> = {
          student: { en: 'Life OS for Students & Academic Focus', id: 'Life OS untuk Mahasiswa & Akademik' },
          freelancer: { en: 'Life OS for Freelancers & Solopreneurs', id: 'Life OS untuk Freelancer & Solopreneur' },
          personalgrowth: { en: 'Personal Growth & Self-Discipline System', id: 'Pengembangan Diri & Sistem Disiplin' },
          'finance-mastery': { en: 'Financial Clarity & Cashflow Mastery', id: 'Keuangan Pribadi & Penguasaan Arus Kas' },
          'career-accelerator': { en: 'Career Accelerator & Job Pipeline', id: 'Akselerator Karir & Pipeline Kerja' },
          'mental-clarity': { en: 'Mental Clarity & Mindful Journaling', id: 'Kejernihan Mental & Jurnal Refleksi' },
          'atomic-system': { en: 'Atomic Habits Implementation System', id: 'Sistem Penerapan Atomic Habits' },
          'deep-work': { en: 'Deep Work & Distraction-Free Flow', id: 'Deep Work & Fokus Tanpa Distraksi' },
          'second-brain': { en: 'Second Brain & Knowledge Operating System', id: 'Second Brain & Manajemen Pengetahuan' },
        };
        const match = solMap[solSlug];
        if (match) {
          return `${isId ? match.id : match.en} | Tranvas`;
        }
      }

      // Compare deepdives (all 25 competitors)
      if (clean.startsWith('/compare/')) {
        const compSlug = clean.replace('/compare/', '');
        const compMap: Record<string, { en: string; id: string }> = {
          notion: { en: 'Tranvas vs Notion — The Calm Unified Alternative', id: 'Tranvas vs Notion — Alternatif Terpadu & Ringan' },
          clickup: { en: 'Tranvas vs ClickUp — Personal Life OS vs Complex PM', id: 'Tranvas vs ClickUp — Life OS Personal vs PM Rumit' },
          onenote: { en: 'Tranvas vs OneNote — Modern Structured Execution', id: 'Tranvas vs OneNote — Eksekusi Terstruktur Modern' },
          todoist: { en: 'Tranvas vs Todoist — Complete Life OS vs Simple Todo', id: 'Tranvas vs Todoist — Life OS Terpadu vs Todo List' },
          ticktick: { en: 'Tranvas vs TickTick — Unified Ecosystem vs Task App', id: 'Tranvas vs TickTick — Ekosistem Terpadu vs Task Manager' },
          obsidian: { en: 'Tranvas vs Obsidian — Ready-to-Use Life OS vs Complex Setup', id: 'Tranvas vs Obsidian — Life OS Siap Pakai vs Setup Manual' },
          asana: { en: 'Tranvas vs Asana — Personal Execution vs Enterprise Team', id: 'Tranvas vs Asana — Fokus Individu vs Manajemen Tim' },
          monday: { en: 'Tranvas vs Monday.com — Personal Life vs Corporate PM', id: 'Tranvas vs Monday.com — Kehidupan Personal vs Korporat' },
          trello: { en: 'Tranvas vs Trello — 8 Modules vs Kanban Only', id: 'Tranvas vs Trello — 8 Modul Terpadu vs Papan Kanban' },
          evernote: { en: 'Tranvas vs Evernote — Modern Life OS vs Legacy Notes', id: 'Tranvas vs Evernote — Life OS Modern vs Catatan Lama' },
          applenotes: { en: 'Tranvas vs Apple Notes — Structured System vs Basic Notes', id: 'Tranvas vs Apple Notes — Sistem Terstruktur vs Catatan Dasar' },
          habitica: { en: 'Tranvas vs Habitica — Professional Focus vs Gamification', id: 'Tranvas vs Habitica — Produktivitas Profesional vs Game' },
          habitify: { en: 'Tranvas vs Habitify — Complete Synergy vs Habit Tracker Only', id: 'Tranvas vs Habitify — Sinergi 8 Modul vs Habit Saja' },
          streaks: { en: 'Tranvas vs Streaks — Full Life OS vs iOS-Only Habit', id: 'Tranvas vs Streaks — Life OS Lintas Platform vs Habit iOS' },
          ynab: { en: 'Tranvas vs YNAB — Finance + Full Productivity Without High Costs', id: 'Tranvas vs YNAB — Keuangan + Produktivitas Lengkap Hemat Biaya' },
          spendee: { en: 'Tranvas vs Spendee — Unified Life OS vs Simple Expense App', id: 'Tranvas vs Spendee — Ekosistem Terpadu vs Pelacak Pengeluaran' },
          wallet: { en: 'Tranvas vs Wallet — Integrated Finances Linked to Goals', id: 'Tranvas vs Wallet — Keuangan Terkoneksi Target' },
          spreadsheet: { en: 'Tranvas vs Excel & Google Sheets — Automated Life OS vs Fragile Sheets', id: 'Tranvas vs Google Sheets & Excel — Antarmuka Intuitif vs Rumus Rumit' },
          'custom-apps': { en: 'Tranvas vs Custom In-House Solutions — Zero Maintenance Life OS', id: 'Tranvas vs Solusi Kustom — Bebas Biaya Pemeliharaan & Kode' },
          'five-apps': { en: 'Tranvas vs 5 Disjointed Apps — Stop The Friction Tax', id: 'Tranvas vs 5 Aplikasi Terpisah — Hentikan Pajak Gesekan' },
          'planner-apps': { en: 'Tranvas vs Standalone Planner Apps', id: 'Tranvas vs Beragam Aplikasi Planner Terpisah' },
          'notes-apps': { en: 'Tranvas vs Paper Planners & Note Apps', id: 'Tranvas vs Buku Catatan & Planner Kertas' },
          'finance-apps': { en: 'Tranvas vs Conventional Finance Apps', id: 'Tranvas vs Aplikasi Keuangan Konvensional' },
          'habit-apps': { en: 'Tranvas vs Fragmented Habit Tracker Apps', id: 'Tranvas vs Beragam Aplikasi Habit Tracker Terpisah' },
          'management-tools': { en: 'Tranvas vs Clunky Project Management Tools', id: 'Tranvas vs Software Manajemen Proyek Rumit' },
        };
        const match = compMap[compSlug];
        if (match) {
          return `${isId ? match.id : match.en} | Tranvas`;
        }
      }

      // Clean generic fallback with uppercase words
      const pathWords = clean
        .replace(/^\//, '')
        .split('/')
        .filter(Boolean)
        .map((segment) => segment.split('-').map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(' '))
        .join(' — ');

      if (pathWords) {
        return `${pathWords} | ${SITE_NAME}`;
      }

      return isId
        ? 'Tranvas — Life OS Terpadu untuk Fokus, Habit, Keuangan & Target'
        : 'Tranvas — The Unified Life OS for Focus, Habits, Finance & Goals';
  }
}
