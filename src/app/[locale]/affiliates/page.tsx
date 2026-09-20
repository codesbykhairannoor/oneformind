'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import AuthenticatedLayout from '@/components/AuthenticatedLayout';
import GuestLayout from '@/components/GuestLayout';
import { useSupabaseSession as useSession } from '@/hooks/useSupabaseSession';
import { Link } from '@/i18n/routing';
import { trackCTAClick } from '@/lib/analytics';
import AffiliatePortalDashboard from '@/components/affiliate/AffiliatePortalDashboard';
import {
    Sparkles,
    DollarSign,
    Clock,
    ShieldCheck,
    ChevronDown,
    ArrowRight,
    Share2,
    Users,
    Gift,
    Zap,
    LayoutDashboard,
    Globe,
    CheckCircle2,
    BookOpen
} from 'lucide-react';

export default function AffiliatesPage() {
    const t = useTranslations();
    const locale = useLocale();
    const isId = locale === 'id';

    const { data: session, status } = useSession();
    const [viewMode, setViewMode] = useState<'portal' | 'program'>('portal');
    const [referrals, setReferrals] = useState(25);
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    // Commission estimation: 60% of Quantum Plan (Rp 169.000 / mo or $15 / mo)
    const monthlyPerUser = isId ? 101400 : 9.00;
    const estimatedMonthlyEarnings = (referrals * monthlyPerUser).toLocaleString(isId ? 'id-ID' : 'en-US', {
        maximumFractionDigits: isId ? 0 : 2
    });
    const estimated8MonthEarnings = (referrals * monthlyPerUser * 8).toLocaleString(isId ? 'id-ID' : 'en-US', {
        maximumFractionDigits: isId ? 0 : 2
    });

    const faqs = [
        {
            q: isId ? 'Berapa persen komisi yang saya dapatkan?' : 'What is the commission percentage?',
            a: isId 
                ? 'Anda mendapatkan komisi 60% berulang (recurring) setiap bulan untuk setiap pembayaran langganan aktif dari pengguna yang mendaftar melalui link referral Anda selama hingga 8 bulan masa langganan.'
                : 'You earn an industry-leading 60% monthly recurring revenue share on every active subscription payment made by users who sign up through your referral link for up to 8 active months.'
        },
        {
            q: isId ? 'Berapa lama masa aktif cookie pelacakan?' : 'How long does the tracking cookie last?',
            a: isId
                ? 'Kami menggunakan teknologi pelacakan 1st-party cookie selama 90 hari dengan backup local storage. Jika calon pengguna mengklik link Anda hari ini dan baru mendaftar dalam kurun 90 hari ke depan, atribusi komisi tetap 100% milik Anda.'
                : 'We provide a generous 90-day 1st-party tracking cookie with anti-ITP local storage redundancy. If a visitor clicks your link and registers anytime within 90 days, you receive 100% full attribution.'
        },
        {
            q: isId ? 'Bagaimana cara dan jadwal pencairan komisi?' : 'How and when do payouts work?',
            a: isId
                ? 'Komisi yang telah melewati masa escrow 14 hari (Net-14 anti-refund) dapat dicairkan kapan saja melalui Transfer Bank Lokal Indonesia (BCA, Mandiri, BRI, QRIS) atau PayPal dengan batas minimum pencairan sangat terjangkau hanya Rp 50.000 atau $5.00.'
                : 'Commissions cleared through our 14-day anti-refund escrow period can be withdrawn anytime directly to Direct Local Bank Transfer, PayPal, or Wise with a low minimum threshold of only Rp 50,000 or $5.00.'
        },
        {
            q: isId ? 'Apakah gratis untuk bergabung?' : 'Is it completely free to join?',
            a: isId
                ? 'Ya, 100% GRATIS! Tidak ada biaya pendaftaran, tidak ada biaya langganan software pihak ketiga, dan tidak ada target kuota minimum. Anda bisa langsung mendapatkan link referral aktif begitu mendaftar.'
                : 'Yes, 100% FREE! There are zero registration fees, zero third-party software overheads, and no minimum audience limits. You get your active referral link immediately upon registration.'
        },
        {
            q: isId ? 'Apakah calon pengguna saya mendapatkan penawaran khusus?' : 'Do my referred users get any special offer?',
            a: isId
                ? 'Ya! Setiap pengguna yang mendaftar melalui link Anda dapat menikmati Free Trial 14 Hari untuk mencoba semua fitur lengkap Pro Architect tanpa biaya di awal ($0 upfront), sehingga konversi pendaftaran sangat tinggi.'
                : 'Yes! Every user referred by your link gets access to a 14-Day Free Trial of full Pro Architect features ($0 upfront), resulting in unmatched click-to-signup conversion rates.'
        }
    ];

    // Program details / calculator section
    const programGuideContent = (
        <div className="space-y-16 py-8">
            {/* 3 CORE PILLARS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-8 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xl mb-6 font-black">
                        💎
                    </div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">
                        {isId ? '60% Komisi Berulang Bulanan' : '60% Monthly Recurring'}
                    </h3>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
                        {isId
                            ? 'Bukan cuma komisi satu kali. Anda menerima 60% bagi hasil dari tagihan langganan setiap bulan selama 8 bulan.'
                            : 'Not a one-off payment. Receive a massive 60% cut of every active subscription payment month after month for up to 8 months.'}
                    </p>
                </div>

                <div className="p-8 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xl mb-6 font-black">
                        🍪
                    </div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">
                        {isId ? '90 Hari Tracking Cookie' : '90-Day Cookie Window'}
                    </h3>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
                        {isId
                            ? 'Audiens Anda mengklik hari ini tapi baru mendaftar 3 bulan lagi? Anda tetap mendapatkan komisi 100% penuh berkat cookie 90 hari.'
                            : 'Visitors click today and convert anytime over the next 90 days? You still get full attribution and commissions.'}
                    </p>
                </div>

                <div className="p-8 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
                    <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center text-xl mb-6 font-black">
                        ⚡
                    </div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">
                        {isId ? 'Pencairan Fleksibel (Min Rp 50k)' : 'Low Payout Threshold ($5)'}
                    </h3>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
                        {isId
                            ? 'Tarik saldo komisi Anda langsung ke Bank Lokal (BCA, Mandiri, BRI, QRIS) atau PayPal dengan batas minimal penarikan hanya Rp 50.000.'
                            : 'Easily withdraw your earnings directly to Local Bank Transfer, PayPal, or Wise with an ultra-accessible $5 minimum threshold.'}
                    </p>
                </div>
            </div>

            {/* EARNINGS CALCULATOR */}
            <div id="calculator" className="p-8 md:p-12 rounded-[2.5rem] bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white shadow-2xl relative overflow-hidden">
                <div className="max-w-4xl mx-auto space-y-8">
                    <div className="text-center space-y-3">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                            <Sparkles className="w-3.5 h-3.5" />
                            {isId ? 'Simulator Bagi Hasil 60%' : '60% Revenue Calculator'}
                        </div>
                        <h2 className="text-2xl md:text-4xl font-black tracking-tight">
                            {isId ? 'Berapa Potensi Penghasilan Anda?' : 'How Much Can You Earn?'}
                        </h2>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-md space-y-6">
                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-sm font-bold">
                                <span className="text-slate-300">{isId ? 'Jumlah Pengguna Aktif yang Anda Referensikan:' : 'Active Referrals:'}</span>
                                <span className="text-xl font-black text-emerald-400">{referrals} Users</span>
                            </div>
                            <input
                                type="range"
                                min="1"
                                max="200"
                                value={referrals}
                                onChange={(e) => setReferrals(parseInt(e.target.value))}
                                className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/10">
                            <div className="bg-white/5 p-6 rounded-2xl border border-white/5 space-y-1">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{isId ? 'Estimasi Komisi / Bulan' : 'Monthly Recurring Share'}</p>
                                <p className="text-3xl md:text-4xl font-black text-emerald-400">
                                    {isId ? `Rp ${estimatedMonthlyEarnings}` : `$${estimatedMonthlyEarnings}`}
                                    <span className="text-sm font-normal text-slate-400"> /mo</span>
                                </p>
                            </div>
                            <div className="bg-white/5 p-6 rounded-2xl border border-white/5 space-y-1">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{isId ? 'Total Komisi (8 Bulan Langganan)' : '8-Month Total Payout'}</p>
                                <p className="text-3xl md:text-4xl font-black text-indigo-400">
                                    {isId ? `Rp ${estimated8MonthEarnings}` : `$${estimated8MonthEarnings}`}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* FAQ SECTION */}
            <div className="max-w-4xl mx-auto space-y-6">
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white text-center">
                    {isId ? 'Pertanyaan yang Sering Diajukan' : 'Frequently Asked Questions'}
                </h2>
                <div className="space-y-4">
                    {faqs.map((faq, idx) => (
                        <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                            <button
                                type="button"
                                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                className="w-full px-6 py-5 text-left font-bold text-slate-800 dark:text-white flex justify-between items-center text-sm md:text-base cursor-pointer"
                            >
                                <span>{faq.q}</span>
                                <ChevronDown className={`transform transition-transform ${openFaq === idx ? 'rotate-180 text-indigo-600' : 'text-slate-400'}`} size={18} />
                            </button>
                            {openFaq === idx && (
                                <div className="px-6 pb-6 text-slate-500 dark:text-slate-400 font-medium leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-4 text-sm">
                                    {faq.a}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    // 1. AUTHENTICATED USER EXPERIENCE (Inside Application)
    if (session?.user) {
        return (
            <AuthenticatedLayout>
                <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
                    {/* TOP PAGE HEADER & TAB SWITCHER */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 uppercase tracking-wider">
                                    <Sparkles className="w-3 h-3" />
                                    60% Recurring • 8 Bulan
                                </span>
                            </div>
                            <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                                {isId ? 'Portal Program Afiliasi' : 'Affiliate Partner Portal'}
                            </h1>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
                                {isId 
                                    ? 'Kelola link pelacakan, pantau konversi referral, dan ajukan penarikan komisi 60% Anda.'
                                    : 'Manage your tracking links, monitor referrals, and withdraw your 60% recurring revenue share.'}
                            </p>
                        </div>

                        {/* TAB TOGGLE: DASHBOARD vs GUIDE */}
                        <div className="flex items-center bg-slate-100 dark:bg-slate-900 p-1 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                            <button
                                onClick={() => setViewMode('portal')}
                                className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
                                    viewMode === 'portal'
                                        ? 'bg-indigo-600 text-white shadow-md'
                                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                }`}
                            >
                                <LayoutDashboard className="w-3.5 h-3.5" />
                                <span>{isId ? 'Dashboard Partner' : 'Partner Dashboard'}</span>
                            </button>
                            <button
                                onClick={() => setViewMode('program')}
                                className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
                                    viewMode === 'program'
                                        ? 'bg-indigo-600 text-white shadow-md'
                                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                }`}
                            >
                                <BookOpen className="w-3.5 h-3.5" />
                                <span>{isId ? 'Panduan & Kalkulator' : 'Guide & Calculator'}</span>
                            </button>
                        </div>
                    </div>

                    {/* MAIN CONTENT AREA */}
                    {viewMode === 'portal' ? (
                        <AffiliatePortalDashboard />
                    ) : (
                        programGuideContent
                    )}
                </div>
            </AuthenticatedLayout>
        );
    }

    // 2. GUEST PUBLIC EXPERIENCE (For logged-out visitors)
    return (
        <GuestLayout>
            <main id="affiliates-page" className="bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-500 overflow-x-hidden min-h-screen">
                {/* HERO SECTION */}
                <header className="pt-32 pb-20 px-6 relative text-center">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[140%] h-[750px] bg-[radial-gradient(circle_at_50%_0%,#4f46e515_0,transparent_50%)] -z-10" />
                    
                    <div className="max-w-5xl mx-auto space-y-8">
                        <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-black text-[10px] uppercase tracking-[0.3em] shadow-sm border border-emerald-100 dark:border-emerald-500/20">
                            <Sparkles className="w-3.5 h-3.5" />
                            {isId ? 'PROGRAM KEMITRAAN RESMI • 60% KOMISI RECURRING' : 'OFFICIAL PARTNER PROGRAM • 60% RECURRING'}
                        </div>

                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.05]">
                            {isId ? 'Dapatkan Komisi ' : 'Earn '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-indigo-600 to-purple-600">
                                60% Recurring
                            </span>
                            <br />
                            {isId ? 'Hingga 8 Bulan per User' : 'For Up to 8 Months per User'}
                        </h1>

                        <p className="text-slate-500 dark:text-slate-400 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
                            {isId
                                ? 'Bantu audiens Anda membangun Life Operating System terbaik dan nikmati bagi hasil 60% tiap bulan selama hingga 8 bulan langganan aktif, didukung cookie tracking 90 hari.'
                                : 'Partner with the leading unified Life OS. Turn your audience into sustainable monthly passive income with 60% recurring commissions for up to 8 months per active subscriber.'}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                            <Link
                                href="/login?next=/affiliates"
                                onClick={() => trackCTAClick('affiliate_hero', 'Join Partner Program', '/login?next=/affiliates')}
                                className="w-full sm:w-auto px-10 py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-base shadow-xl shadow-indigo-200 dark:shadow-none transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                            >
                                <span>{isId ? 'Masuk ke Portal Partner' : 'Login to Partner Portal'}</span>
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                            <Link
                                href="/register?next=/affiliates"
                                className="w-full sm:w-auto px-8 py-5 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-base hover:bg-slate-100 dark:hover:bg-slate-700 transition-all text-center"
                            >
                                {isId ? 'Daftar Akun Baru (Gratis)' : 'Create Free Account'}
                            </Link>
                        </div>
                    </div>
                </header>

                {/* DETAILS & CALCULATOR */}
                <div className="max-w-7xl mx-auto px-6 pb-20">
                    {programGuideContent}
                </div>
            </main>
        </GuestLayout>
    );
}
