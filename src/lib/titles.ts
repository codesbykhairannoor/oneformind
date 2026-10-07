export const SITE_NAME = 'Tranvas';

export interface RouteMeta {
  title: string;
  description: string;
}

/**
 * Standard clean, human, and concise browser tab titles for Tranvas.
 * Modeled after Linear, Notion, Raycast, and GitHub.
 * Fits perfectly in browser tabs without truncation or em-dash AI buzzwords.
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
        ? 'Tranvas | Life OS Terpadu'
        : 'Tranvas | The Unified Life OS';

    // Auth Routes
    case '/login':
      return isId ? 'Masuk | Tranvas' : 'Log in | Tranvas';
    case '/register':
      return isId ? 'Daftar Akun | Tranvas' : 'Get Started | Tranvas';
    case '/forgot-password':
      return isId ? 'Lupa Kata Sandi | Tranvas' : 'Forgot Password | Tranvas';
    case '/confirm-password':
      return isId ? 'Konfirmasi Sandi | Tranvas' : 'Confirm Password | Tranvas';
    case '/verify-email':
      return isId ? 'Verifikasi Email | Tranvas' : 'Verify Email | Tranvas';

    // Marketing & Public Routes
    case '/pricing':
      return isId ? 'Harga & Paket | Tranvas' : 'Pricing | Tranvas';
    case '/features':
      return isId ? 'Fitur | Tranvas' : 'Features | Tranvas';
    case '/about':
      return isId ? 'Tentang Kami | Tranvas' : 'About | Tranvas';
    case '/contact':
      return isId ? 'Kontak | Tranvas' : 'Contact | Tranvas';
    case '/affiliates':
      return isId ? 'Afiliasi | Tranvas' : 'Affiliates | Tranvas';
    case '/privacy':
    case '/privacy-policy':
      return isId ? 'Kebijakan Privasi | Tranvas' : 'Privacy Policy | Tranvas';
    case '/terms':
    case '/terms-of-service':
      return isId ? 'Syarat & Ketentuan | Tranvas' : 'Terms of Service | Tranvas';

    // 8 Core Authenticated Modules & Hubs
    case '/dashboard':
      return 'Dashboard | Tranvas';

    case '/planner':
    case '/planner/dashboard':
      return 'Daily Planner | Tranvas';

    case '/habits':
      return isId ? 'Habits Matrix | Tranvas' : 'Habits | Tranvas';

    case '/finance':
    case '/finance/dashboard':
      return 'Finance OS | Tranvas';

    case '/goals':
      return isId ? 'Target & Goals | Tranvas' : 'Goals | Tranvas';

    case '/journal':
      return isId ? 'Jurnal Refleksi | Tranvas' : 'Mindful Journal | Tranvas';
    case '/journal/write':
      return isId ? 'Tulis Jurnal | Tranvas' : 'New Entry | Tranvas';

    case '/jobs':
      return isId ? 'Pipeline Karir | Tranvas' : 'Career Pipeline | Tranvas';

    case '/study':
      return 'Study Hub | Tranvas';
    case '/study/portfolio':
      return isId ? 'Portofolio Akademik | Tranvas' : 'Academic Portfolio | Tranvas';

    case '/calendar':
      return isId ? 'Kalender Terpadu | Tranvas' : 'Calendar | Tranvas';

    // Settings, Billing, Account & Identity
    case '/settings':
      return isId ? 'Pengaturan | Tranvas' : 'Settings | Tranvas';
    case '/profile':
      return isId ? 'Profil | Tranvas' : 'Profile | Tranvas';
    case '/billing':
      return isId ? 'Tagihan & Paket | Tranvas' : 'Billing & Plans | Tranvas';
    case '/coach':
      return 'AI Coach | Tranvas';
    case '/admin':
      return isId ? 'Pusat Admin | Tranvas' : 'Admin | Tranvas';
    case '/onboarding':
      return 'Onboarding | Tranvas';
    case '/payment/status':
      return isId ? 'Status Pembayaran | Tranvas' : 'Payment Status | Tranvas';

    // Company Pages
    case '/company/contact':
      return isId ? 'Kontak Perusahaan | Tranvas' : 'Company Contact | Tranvas';
    case '/company/press-kit':
      return 'Press Kit | Tranvas';
    case '/company/privacy':
      return isId ? 'Privasi | Tranvas' : 'Privacy | Tranvas';
    case '/company/refund':
      return isId ? 'Kebijakan Refund | Tranvas' : 'Refund Policy | Tranvas';
    case '/company/security':
      return isId ? 'Keamanan | Tranvas' : 'Security | Tranvas';
    case '/company/status':
      return isId ? 'Status Sistem | Tranvas' : 'System Status | Tranvas';
    case '/company/terms':
      return isId ? 'Ketentuan | Tranvas' : 'Terms | Tranvas';

    // Resources Hub
    case '/resources/blog':
    case '/resources/post':
      return 'Blog | Tranvas';
    case '/resources/changelog':
      return 'Changelog | Tranvas';
    case '/resources/community':
      return isId ? 'Komunitas | Tranvas' : 'Community | Tranvas';
    case '/resources/guide':
      return isId ? 'Panduan Pengguna | Tranvas' : 'User Guide | Tranvas';
    case '/resources/help':
      return isId ? 'Pusat Bantuan | Tranvas' : 'Help Center | Tranvas';
    case '/resources/stories':
      return isId ? 'Kisah Pengguna | Tranvas' : 'Customer Stories | Tranvas';
    case '/resources/ai-trust':
      return isId ? 'Privasi AI | Tranvas' : 'AI & Privacy | Tranvas';
    case '/resources/affiliate':
      return isId ? 'Panduan Afiliasi | Tranvas' : 'Affiliate Guide | Tranvas';

    default:
      // Subpath handling for journal write dynamic ID
      if (clean.startsWith('/journal/write/')) {
        return isId ? 'Edit Jurnal | Tranvas' : 'Edit Entry | Tranvas';
      }

      // Subpath handling for reset-password token
      if (clean.startsWith('/reset-password/')) {
        return isId ? 'Atur Ulang Sandi | Tranvas' : 'Reset Password | Tranvas';
      }

      // Subpath handling for public profile & card
      if (clean.startsWith('/p/')) {
        return isId ? 'Profil Publik | Tranvas' : 'Public Profile | Tranvas';
      }

      // Features deepdives
      if (clean.startsWith('/features/')) {
        const featSlug = clean.replace('/features/', '');
        const featuresMap: Record<string, { en: string; id: string }> = {
          habit: { en: 'Habits Feature', id: 'Fitur Habit' },
          planner: { en: 'Planner Feature', id: 'Fitur Planner' },
          finance: { en: 'Finance Feature', id: 'Fitur Finance' },
          journal: { en: 'Journal Feature', id: 'Fitur Journal' },
          goal: { en: 'Goals Feature', id: 'Fitur Goals' },
          calendar: { en: 'Calendar Feature', id: 'Fitur Kalender' },
          job: { en: 'Career Feature', id: 'Fitur Karir' },
          'neural-os': { en: 'Neural OS', id: 'Neural OS' },
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
          student: { en: 'For Students', id: 'Untuk Mahasiswa' },
          freelancer: { en: 'For Freelancers', id: 'Untuk Freelancer' },
          personalgrowth: { en: 'Personal Growth', id: 'Pengembangan Diri' },
          'finance-mastery': { en: 'Finance Mastery', id: 'Manajemen Keuangan' },
          'career-accelerator': { en: 'Career Accelerator', id: 'Akselerator Karir' },
          'mental-clarity': { en: 'Mental Clarity', id: 'Kejernihan Mental' },
          'atomic-system': { en: 'Atomic Habits', id: 'Sistem Kebiasaan' },
          'deep-work': { en: 'Deep Work', id: 'Fokus Deep Work' },
          'second-brain': { en: 'Second Brain', id: 'Second Brain' },
        };
        const match = solMap[solSlug];
        if (match) {
          return `${isId ? match.id : match.en} | Tranvas`;
        }
      }

      // Compare deepdives (all 25 competitors)
      if (clean.startsWith('/compare/')) {
        const compSlug = clean.replace('/compare/', '');
        const compMap: Record<string, string> = {
          notion: 'Tranvas vs Notion',
          clickup: 'Tranvas vs ClickUp',
          onenote: 'Tranvas vs OneNote',
          todoist: 'Tranvas vs Todoist',
          ticktick: 'Tranvas vs TickTick',
          obsidian: 'Tranvas vs Obsidian',
          asana: 'Tranvas vs Asana',
          monday: 'Tranvas vs Monday.com',
          trello: 'Tranvas vs Trello',
          evernote: 'Tranvas vs Evernote',
          applenotes: 'Tranvas vs Apple Notes',
          habitica: 'Tranvas vs Habitica',
          habitify: 'Tranvas vs Habitify',
          streaks: 'Tranvas vs Streaks',
          ynab: 'Tranvas vs YNAB',
          spendee: 'Tranvas vs Spendee',
          wallet: 'Tranvas vs Wallet',
          spreadsheet: 'Tranvas vs Excel & Sheets',
          'custom-apps': 'Tranvas vs Custom Apps',
          'five-apps': 'Tranvas vs 5 Disjointed Apps',
          'planner-apps': 'Tranvas vs Planner Apps',
          'notes-apps': 'Tranvas vs Note Apps',
          'finance-apps': 'Tranvas vs Finance Apps',
          'habit-apps': 'Tranvas vs Habit Apps',
          'management-tools': 'Tranvas vs PM Tools',
        };
        const match = compMap[compSlug];
        if (match) {
          return match;
        }
      }

      // Clean generic fallback with uppercase words (e.g. /my-account -> My Account | Tranvas)
      const pathWords = clean
        .replace(/^\//, '')
        .split('/')
        .filter(Boolean)
        .map((segment) => segment.split('-').map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(' '))
        .join(' | ');

      if (pathWords) {
        return `${pathWords} | ${SITE_NAME}`;
      }

      return isId
        ? 'Tranvas | Life OS Terpadu'
        : 'Tranvas | The Unified Life OS';
  }
}
