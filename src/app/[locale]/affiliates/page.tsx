'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import GuestLayout from '@/components/GuestLayout';
import { Link } from '@/i18n/routing';
import { trackCTAClick } from '@/lib/analytics';
import { Sparkles, DollarSign, Clock, ShieldCheck, ChevronDown, ArrowRight, Share2, Users, Gift } from 'lucide-react';

export default function AffiliatesPage() {
    const t = useTranslations();
    const locale = useLocale();
    const isId = locale === 'id';

    const [referrals, setReferrals] = useState(25);
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    // Commission estimation: Quantum Plan at $15/mo ($4.50 commission per user per month)
    const monthlyPerUser = isId ? 50700 : 4.50; // 30% of Rp 169k or $15
    const estimatedMonthlyEarnings = (referrals * monthlyPerUser).toLocaleString(isId ? 'id-ID' : 'en-US', {
        maximumFractionDigits: isId ? 0 : 2
    });
    const estimatedAnnualEarnings = (referrals * monthlyPerUser * 12).toLocaleString(isId ? 'id-ID' : 'en-US', {
        maximumFractionDigits: isId ? 0 : 2
    });

    const faqs = [
        {
            q: isId ? 'Berapa komisi yang saya dapatkan?' : 'How much commission can I earn?',
            a: isId 
                ? 'Anda mendapatkan komisi berulang 30% untuk setiap pembayaran langganan (bulanan atau tahunan) dari pengguna yang mendaftar melalui link referal Anda selama mereka aktif berlangganan.'
                : 'You earn a 30% recurring commission on every subscription payment (monthly or annual) made by users who sign up through your referral link for as long as they stay subscribed.'
        },
        {
            q: isId ? 'Berapa lama masa aktif cookie pelacakan?' : 'How long does the tracking cookie last?',
            a: isId
                ? 'Kami menggunakan masa aktif cookie 60 hari. Jika pengunjung mengklik link Anda dan mendaftar dalam kurun waktu 60 hari, komisi tetap menjadi milik Anda.'
                : 'We offer a generous 60-day cookie window. If a visitor clicks your link and converts anytime within 60 days, the commission is credited to your account.'
        },
        {
            q: isId ? 'Bagaimana cara dan jadwal pencairan komisi?' : 'How and when do payouts work?',
            a: isId
                ? 'Komisi dicairkan secara otomatis setiap tanggal 15 setiap bulan via Transfer Bank Lokal Indonesia atau PayPal dengan minimum saldo penarikan $20 / Rp 300.000.'
                : 'Payouts are distributed automatically on the 15th of each month via PayPal or Direct Bank Transfer with a low minimum threshold of $20.'
        },
        {
            q: isId ? 'Apakah gratis untuk bergabung?' : 'Is it completely free to join?',
            a: isId
                ? 'Ya, 100% gratis! Tidak ada biaya pendaftaran, tidak ada kuota minimum, dan siapa pun bisa bergabung mulai dari kreator, blogger, reviewer, hingga pengguna setia Tranvas.'
                : 'Yes, 100% free! There are zero signup fees, no minimum audience quotas, and anyone from creators to passionate Tranvas users can start earning today.'
        }
    ];

    return (
        <GuestLayout>
            <main id="affiliates-page" className="bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-500 overflow-x-hidden">
                {/* HERO SECTION */}
                <header className="pt-32 pb-20 px-6 relative text-center">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[140%] h-[750px] bg-[radial-gradient(circle_at_50%_0%,#4f46e515_0,transparent_50%)] -z-10" />
                    
                    <div className="max-w-5xl mx-auto space-y-8">
                        <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-black text-[10px] uppercase tracking-[0.3em] shadow-sm border border-emerald-100 dark:border-emerald-500/20">
                            <Sparkles className="w-3.5 h-3.5" />
                            {isId ? 'PROGRAM KEMITRAAN RESMI' : 'OFFICIAL PARTNER PROGRAM'}
                        </div>

                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.05]">
                            {isId ? 'Dapatkan Komisi ' : 'Earn '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-indigo-600 to-purple-600">
                                30% Recurring
                            </span>
                            <br />
                            {isId ? 'dengan Membagikan Tranvas' : 'by Sharing Tranvas'}
                        </h1>

                        <p className="text-slate-500 dark:text-slate-400 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
                            {isId
                                ? 'Bantu audiens Anda membangun Life Operating System terbaik dan nikmati passive income bulanan yang berkelanjutan.'
                                : 'Partner with the leading unified Life OS. Turn your audience into sustainable monthly passive income with 30% lifetime recurring commissions.'}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                            <a
                                href="https://trackdesk.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => trackCTAClick('affiliate_hero', 'Join Partner Program', 'https://trackdesk.com')}
                                className="w-full sm:w-auto px-10 py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-base shadow-xl shadow-indigo-200 dark:shadow-none transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2"
                            >
                                <span>{isId ? 'Daftar Jadi Affiliate (Gratis)' : 'Join Partner Program (Free)'}</span>
                                <ArrowRight className="w-4 h-4" />
                            </a>
                            <a
                                href="#calculator"
                                className="w-full sm:w-auto px-8 py-5 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-base hover:bg-slate-100 dark:hover:bg-slate-700 transition-all text-center"
                            >
                                {isId ? 'Hitung Estimasi Komisi' : 'Calculate Earnings'}
                            </a>
                        </div>
                    </div>
                </header>

                {/* 3 CORE PILLARS */}
                <section className="py-20 px-6 bg-slate-50/50 dark:bg-slate-900/30 border-y border-slate-100 dark:border-slate-800">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-8 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all">
                            <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-2xl mb-6 font-black">
                                💰
                            </div>
                            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">
                                {isId ? '30% Komisi Seumur Hidup' : '30% Lifetime Recurring'}
                            </h3>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
                                {isId
                                    ? 'Dapatkan komisi tidak hanya pada pembelian pertama, tetapi setiap kali pelanggan Anda memperpanjang langganan bulanan atau tahunan.'
                                    : 'Earn recurring revenue month after month for as long as your referred users remain active subscribers.'}
                            </p>
                        </div>

                        <div className="p-8 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all">
                            <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-2xl mb-6 font-black">
                                ⏳
                            </div>
                            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">
                                {isId ? '60-Day Cookie Window' : '60-Day Cookie Window'}
                            </h3>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
                                {isId
                                    ? 'Masa pelacakan cookie ekstra panjang memastikan Anda tidak kehilangan komisi meskipun calon pengguna butuh waktu sebelum berlangganan.'
                                    : 'Generous 60-day attribution tracking ensures you receive full credit even if users convert weeks after their initial click.'}
                            </p>
                        </div>

                        <div className="p-8 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all">
                            <div className="w-14 h-14 rounded-2xl bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center text-2xl mb-6 font-black">
                                🚀
                            </div>
                            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">
                                {isId ? 'Produk Konversi Tinggi' : 'High-Converting Product'}
                            </h3>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
                                {isId
                                    ? 'Tranvas menggabungkan Habit, Finance, dan Planner dengan UI kelas dunia yang sangat mudah disukai dan dipromosikan.'
                                    : 'A beautifully crafted, all-in-one productivity suite with unmatched user retention and frictionless onboarding.'}
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
                                📊 {isId ? 'KALKULATOR ESTIMASI PENDAPATAN' : 'EARNINGS ESTIMATOR'}
                            </div>
                            <h2 className="text-3xl md:text-5xl font-black tracking-tight">
                                {isId ? 'Berapa yang Bisa Anda Dapatkan?' : 'How Much Can You Earn?'}
                            </h2>
                            <p className="text-slate-400 text-sm md:text-base font-medium max-w-xl mx-auto">
                                {isId
                                    ? 'Geser slider di bawah untuk melihat potensi passive income bulanan Anda dari referal pengguna aktif Quantum Plan.'
                                    : 'Slide to simulate your potential recurring passive income based on active referred subscribers.'}
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
                                        {isId ? 'Estimasi per Bulan' : 'Monthly Recurring'}
                                    </span>
                                    <span className="text-3xl font-black text-emerald-400">
                                        {isId ? `Rp ${estimatedMonthlyEarnings}` : `$${estimatedMonthlyEarnings}`}
                                    </span>
                                    <span className="text-[10px] text-slate-400 block mt-1">/ {isId ? 'bulan pasif' : 'month passive'}</span>
                                </div>
                                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">
                                        {isId ? 'Estimasi per Tahun' : 'Annual Run-Rate'}
                                    </span>
                                    <span className="text-3xl font-black text-indigo-300">
                                        {isId ? `Rp ${estimatedAnnualEarnings}` : `$${estimatedAnnualEarnings}`}
                                    </span>
                                    <span className="text-[10px] text-slate-400 block mt-1">/ {isId ? 'tahun' : 'year'}</span>
                                </div>
                            </div>

                            <div className="text-center pt-4">
                                <a
                                    href="https://trackdesk.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black rounded-2xl transition-all shadow-lg active:scale-95"
                                >
                                    <span>{isId ? 'Mulai Dapatkan Komisi Sekarang' : 'Start Earning Today'}</span>
                                    <ArrowRight className="w-4 h-4" />
                                </a>
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
                                    className="w-full px-8 py-6 text-left font-black text-slate-800 dark:text-white flex justify-between items-center text-sm md:text-base"
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
            </main>
        </GuestLayout>
    );
}
