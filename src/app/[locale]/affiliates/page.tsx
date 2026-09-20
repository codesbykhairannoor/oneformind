'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import GuestLayout from '@/components/GuestLayout';
import { Link } from '@/i18n/routing';
import { trackCTAClick } from '@/lib/analytics';
import { createClient } from '@/utils/supabase/client';
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
    CheckCircle2
} from 'lucide-react';

export default function AffiliatesPage() {
    const t = useTranslations();
    const locale = useLocale();
    const isId = locale === 'id';

    const [session, setSession] = useState<any>(null);
    const [viewMode, setViewMode] = useState<'portal' | 'program'>('program');
    const [referrals, setReferrals] = useState(25);
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const supabase = createClient();

    useEffect(() => {
        let mounted = true;
        const checkAuth = async () => {
            const { data: { session: currentSession } } = await supabase.auth.getSession();
            if (mounted && currentSession) {
                setSession(currentSession);
                setViewMode('portal');
            }
        };
        checkAuth();
        return () => { mounted = false; };
    }, [supabase]);

    // Commission estimation: 60% of Quantum Plan (Rp 169.000 / mo or $15 / mo)
    // 60% of Rp 169k = Rp 101.400 / mo per user
    // 60% of $15 = $9.00 / mo per user
    const monthlyPerUser = isId ? 101400 : 9.00;
    const estimatedMonthlyEarnings = (referrals * monthlyPerUser).toLocaleString(isId ? 'id-ID' : 'en-US', {
        maximumFractionDigits: isId ? 0 : 2
    });
    // 8-Month recurring duration per user
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

    return (
        <GuestLayout>
            <main id="affiliates-page" className="bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-500 overflow-x-hidden min-h-screen">
                {/* AUTH STATUS BAR IF LOGGED IN */}
                {session && (
                    <div className="pt-24 pb-4 px-6 max-w-7xl mx-auto flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                                {isId ? 'Masuk sebagai Partner' : 'Logged in as Partner'}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setViewMode('portal')}
                                className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                                    viewMode === 'portal'
                                        ? 'bg-indigo-600 text-white shadow-md'
                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                                }`}
                            >
                                <LayoutDashboard className="w-3.5 h-3.5" />
                                <span>{isId ? 'Buka Dashboard Partner' : 'Partner Dashboard'}</span>
                            </button>
                            <button
                                onClick={() => setViewMode('program')}
                                className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                                    viewMode === 'program'
                                        ? 'bg-indigo-600 text-white shadow-md'
                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                                }`}
                            >
                                <Globe className="w-3.5 h-3.5" />
                                <span>{isId ? 'Info Program' : 'Program Details'}</span>
                            </button>
                        </div>
                    </div>
                )}

                {/* LOGGED IN ACTIVE PARTNER PORTAL VIEW */}
                {session && viewMode === 'portal' ? (
                    <div className="pt-8 pb-20 px-6 max-w-7xl mx-auto">
                        <AffiliatePortalDashboard />
                    </div>
                ) : (
                    <>
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
                                        href={session ? "#" : "/register"}
                                        onClick={() => {
                                            if (session) setViewMode('portal');
                                            trackCTAClick('affiliate_hero', 'Join Partner Program', '/register');
                                        }}
                                        className="w-full sm:w-auto px-10 py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-base shadow-xl shadow-indigo-200 dark:shadow-none transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                                    >
                                        <span>{session ? (isId ? 'Buka Portal Partner Anda' : 'Open Partner Portal') : (isId ? 'Daftar Jadi Partner (Gratis)' : 'Join Partner Program (Free)')}</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                    <a
                                        href="#calculator"
                                        className="w-full sm:w-auto px-8 py-5 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-base hover:bg-slate-100 dark:hover:bg-slate-700 transition-all text-center"
                                    >
                                        {isId ? 'Hitung Estimasi Komisi ↓' : 'Calculate Earnings ↓'}
                                    </a>
                                </div>
                            </div>
                        </header>

                        {/* 3 CORE PILLARS */}
                        <section className="py-20 px-6 bg-slate-50/50 dark:bg-slate-900/30 border-y border-slate-100 dark:border-slate-800">
                            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="p-8 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all">
                                    <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-2xl mb-6 font-black">
                                        💎
                                    </div>
                                    <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">
                                        {isId ? '60% Komisi Berulang Bulanan' : '60% Monthly Recurring'}
                                    </h3>
                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
                                        {isId
                                            ? 'Dapatkan 60% dari setiap pembayaran langganan pengguna — komisi berulang mengalir setiap bulan selama hingga 8 bulan langganan aktif.'
                                            : 'Earn a massive 60% of every subscription payment every single month for up to 8 active months per subscriber.'}
                                    </p>
                                </div>

                                <div className="p-8 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all">
                                    <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-2xl mb-6 font-black">
                                        ⏱️
                                    </div>
                                    <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">
                                        {isId ? '90-Day Cookie Tracking' : '90-Day Cookie Window'}
                                    </h3>
                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
                                        {isId
                                            ? 'Masa pelacakan cookie 90 hari memastikan Anda tidak kehilangan komisi meskipun calon pengguna baru mendaftar berminggu-minggu kemudian.'
                                            : 'Industry-leading 90-day 1st-party cookie tracking guarantees you receive full credit even if visitors convert up to 3 months later.'}
                                    </p>
                                </div>

                                <div className="p-8 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all">
                                    <div className="w-14 h-14 rounded-2xl bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center text-2xl mb-6 font-black">
                                        ⚡
                                    </div>
                                    <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">
                                        {isId ? 'Pencairan Multi-Metode' : 'Instant Multi-Method Payouts'}
                                    </h3>
                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
                                        {isId
                                            ? 'Tarik saldo komisi Anda langsung ke Bank Lokal (BCA, Mandiri, BRI, QRIS), PayPal, atau Wise dengan minimum saldo penarikan sangat rendah hanya Rp 50.000 / $5.'
                                            : 'Withdraw your earnings straight to Direct Bank Transfer (BCA/Mandiri/BRI/QRIS), PayPal, or Wise with a low $5 / Rp 50,000 threshold.'}
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* EARNINGS CALCULATOR */}
                        <section id="calculator" className="py-28 px-6">
                            <div className="max-w-4xl mx-auto p-10 md:p-14 bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950 text-white rounded-[3.5rem] shadow-2xl border border-slate-800 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none" />
                                
                                <div className="relative z-10 text-center space-y-6 mb-12">
                                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-indigo-300 font-black text-[10px] uppercase tracking-widest border border-white/10">
                                        📊 {isId ? 'KALKULATOR ESTIMASI PENDAPATAN 60%' : '60% EARNINGS ESTIMATOR'}
                                    </div>
                                    <h2 className="text-3xl md:text-5xl font-black tracking-tight">
                                        {isId ? 'Berapa Potensi Penghasilan Anda?' : 'How Much Could You Earn?'}
                                    </h2>
                                    <p className="text-slate-400 text-sm md:text-base font-medium max-w-xl mx-auto">
                                        {isId
                                            ? 'Geser slider di bawah untuk melihat potensi passive income bulanan dan total 8 bulan Anda dari referal pengguna aktif Quantum Plan.'
                                            : 'Slide to simulate your recurring monthly and cumulative 8-month passive income from referred Quantum Plan subscribers.'}
                                    </p>
                                </div>

                                <div className="relative z-10 max-w-xl mx-auto space-y-8">
                                    <div>
                                        <div className="flex justify-between items-center text-sm font-bold text-slate-300 mb-3">
                                            <span>{isId ? 'Jumlah Pengguna Aktif yang Diajak:' : 'Active Referred Subscribers:'}</span>
                                            <span className="text-2xl font-black text-indigo-400">{referrals} Users</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="5"
                                            max="200"
                                            step="5"
                                            value={referrals}
                                            onChange={(e) => setReferrals(Number(e.target.value))}
                                            className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                        />
                                        <div className="flex justify-between text-[11px] text-slate-500 font-bold mt-2">
                                            <span>5 users</span>
                                            <span>50 users</span>
                                            <span>100 users</span>
                                            <span>200 users</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                                        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">
                                                {isId ? 'Estimasi Komisi / Bulan' : 'Monthly Recurring (60%)'}
                                            </span>
                                            <span className="text-3xl font-black text-emerald-400">
                                                {isId ? `Rp ${estimatedMonthlyEarnings}` : `$${estimatedMonthlyEarnings}`}
                                            </span>
                                            <span className="text-[10px] text-slate-400 block mt-1">/ {isId ? 'bulan pasif' : 'month passive'}</span>
                                        </div>
                                        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">
                                                {isId ? 'Total Estimasi (8 Bulan)' : 'Total (8 Months Cap)'}
                                            </span>
                                            <span className="text-3xl font-black text-indigo-300">
                                                {isId ? `Rp ${estimated8MonthEarnings}` : `$${estimated8MonthEarnings}`}
                                            </span>
                                            <span className="text-[10px] text-slate-400 block mt-1">/ {isId ? 'total akumulasi' : 'cumulative total'}</span>
                                        </div>
                                    </div>

                                    <div className="text-center pt-4">
                                        <Link
                                            href={session ? "#" : "/register"}
                                            onClick={() => {
                                                if (session) setViewMode('portal');
                                            }}
                                            className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black rounded-2xl transition-all shadow-lg active:scale-95 cursor-pointer"
                                        >
                                            <span>{session ? (isId ? 'Buka Dashboard Partner' : 'Go to Partner Portal') : (isId ? 'Mulai Dapatkan Komisi 60% Sekarang' : 'Start Earning 60% Today')}</span>
                                            <ArrowRight className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* FAQ SECTION */}
                        <section className="py-20 px-6 max-w-4xl mx-auto">
                            <div className="text-center mb-16 space-y-3">
                                <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                                    {isId ? 'Pertanyaan yang Sering Diajukan' : 'Frequently Asked Questions'}
                                </h2>
                            </div>

                            <div className="space-y-4">
                                {faqs.map((faq, idx) => (
                                    <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
                                        <button
                                            type="button"
                                            onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                            className="w-full px-8 py-6 text-left font-black text-slate-800 dark:text-white flex justify-between items-center text-sm md:text-base cursor-pointer"
                                        >
                                            <span>{faq.q}</span>
                                            <ChevronDown className={`transform transition-transform ${openFaq === idx ? 'rotate-180 text-indigo-600' : 'text-slate-400'}`} size={20} />
                                        </button>
                                        {openFaq === idx && (
                                            <div className="px-8 pb-8 text-slate-500 dark:text-slate-400 font-medium leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-4 text-sm">
                                                {faq.a}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    </>
                )}
            </main>
        </GuestLayout>
    );
}
