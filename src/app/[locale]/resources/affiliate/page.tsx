'use client';

import React, { useState, useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import GuestLayout from '@/components/GuestLayout';
import { Link } from '@/i18n/routing';
import { 
    ChevronDown, 
    Sparkles, 
    Zap, 
    ShieldCheck, 
    TrendingUp, 
    Users, 
    Clock, 
    DollarSign, 
    Award, 
    CheckCircle2, 
    ArrowRight, 
    BarChart3, 
    Globe, 
    Layers
} from 'lucide-react';

export default function AffiliatePage() {
    const t = useTranslations();
    const locale = useLocale();
    const isId = locale === 'id';

    // State for Interactive Earnings Calculator
    const [referrals, setReferrals] = useState<number>(25);
    const [selectedPlan, setSelectedPlan] = useState<'architect' | 'quantum' | 'legendary'>('architect');
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    // Pricing & commission calculation logic (60% recurring revenue share up to 8 months)
    const planDetails = {
        architect: {
            name: 'Architect Pro',
            priceUsd: 8.99,
            priceIdr: 89000,
            isRecurring: true,
        },
        quantum: {
            name: 'Quantum AI',
            priceUsd: 15.00,
            priceIdr: 149000,
            isRecurring: true,
        },
        legendary: {
            name: 'Legendary Lifetime',
            priceUsd: 99.00,
            priceIdr: 1299000,
            isRecurring: false,
        },
    };

    const calculation = useMemo(() => {
        const plan = planDetails[selectedPlan];
        const commRate = 0.60; // 60% recurring commission

        if (plan.isRecurring) {
            const monthlyEarnUsd = referrals * plan.priceUsd * commRate;
            const eightMonthEarnUsd = monthlyEarnUsd * 8;
            const monthlyEarnIdr = referrals * plan.priceIdr * commRate;
            const eightMonthEarnIdr = monthlyEarnIdr * 8;

            return {
                isRecurring: true,
                monthlyUsd: monthlyEarnUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
                eightMonthUsd: eightMonthEarnUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
                monthlyIdr: Math.round(monthlyEarnIdr).toLocaleString('id-ID'),
                eightMonthIdr: Math.round(eightMonthEarnIdr).toLocaleString('id-ID'),
            };
        } else {
            const totalEarnUsd = referrals * plan.priceUsd * commRate;
            const totalEarnIdr = referrals * plan.priceIdr * commRate;

            return {
                isRecurring: false,
                totalUsd: totalEarnUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
                totalIdr: Math.round(totalEarnIdr).toLocaleString('id-ID'),
            };
        }
    }, [referrals, selectedPlan]);

    // Partner Tier based on referrals
    const partnerTier = useMemo(() => {
        if (referrals >= 250) return { title: 'Diamond Partner 💎', badge: 'Top Tier (60%)' };
        if (referrals >= 100) return { title: 'Gold Partner 👑', badge: 'High Volume (60%)' };
        if (referrals >= 50) return { title: 'Silver Partner ⚡', badge: 'Growing (60%)' };
        return { title: 'Bronze Partner 🌟', badge: 'Standard 60%' };
    }, [referrals]);

    const faqs = [
        {
            q: isId ? 'Berapa persen komisi yang saya dapatkan?' : 'What is the commission percentage?',
            a: isId 
                ? 'Anda mendapatkan 60% recurring revenue share dari setiap pembayaran langganan aktif pengguna selama hingga 8 bulan masa langganan mereka, serta 60% flat dari penjualan paket Legendary Lifetime. Komisi ini jauh melampaui standar industri SaaS biasa (15-25%).' 
                : 'You earn a generous 60% monthly recurring commission for every active paying subscriber you refer for up to 8 months of their subscription, as well as 60% flat on Legendary Lifetime sales. This is double to triple the typical 15-25% SaaS affiliate rate.'
        },
        {
            q: isId ? 'Bagaimana cara kerja Komisi 8 Bulan?' : 'How does the 8-Month Recurring Commission work?',
            a: isId
                ? 'Cukup ajak pengguna mendaftar melalui link afiliasi unik Anda. Ketika mereka mulai berlangganan, akun Anda otomatis ditandai di sistem kami. Anda akan menerima komisi 60% setiap bulan selama pengguna tersebut aktif berlangganan, hingga maksimal 8 bulan.'
                : 'Simply share your unique referral link. When your referral subscribes, your affiliate ID is automatically tagged in our system, and you will receive 60% recurring commission every month they stay active, for up to 8 full months.'
        },
        {
            q: isId ? 'Berapa lama masa berlaku cookie tracking?' : 'How long does the cookie tracking last?',
            a: isId
                ? 'Cookie pelacakan kami berlaku selama 90 hari. Jika seseorang mengklik link referral Anda hari ini dan baru mendaftar hingga 90 hari ke depan, atribusi referral tetap 100% tercatat atas nama Anda.'
                : 'We provide a 90-day cookie window. If a visitor clicks your affiliate link today and converts anytime within 90 days, you get 100% attribution for that customer.'
        },
        {
            q: isId ? 'Kapan dan bagaimana pembayaran komisi dicairkan?' : 'When and how are commissions paid out?',
            a: isId
                ? 'Komisi ditransfer setiap tanggal 1 dan 15 setiap bulannya secara otomatis melalui Transfer Bank Lokal Indonesia (BCA, Mandiri, BRI, QRIS), PayPal, Wise, atau portal resmi Lemon Squeezy.'
                : 'Payouts are processed bi-weekly (1st and 15th of every month) directly via PayPal, Wise, Local Bank Transfer, or via your Lemon Squeezy affiliate portal.'
        },
        {
            q: isId ? 'Apakah ada biaya untuk bergabung menjadi affiliate?' : 'Is there any fee to join the affiliate program?',
            a: isId
                ? 'Sama sekali TIDAK ADA biaya ($0 / 100% Gratis). Tidak ada syarat minimum follower atau kuota bulanan. Cukup daftar dan bagikan link unik Anda.'
                : 'Zero fees ($0 / 100% Free forever). There are no minimum follower requirements or sales quotas. Simply register and start sharing your link immediately.'
        }
    ];

    const advantages = [
        {
            icon: '💎',
            title: t('affiliate_adv_1_title'),
            desc: t('affiliate_adv_1_desc'),
            highlight: '60% Recurring',
        },
        {
            icon: '⏳',
            title: t('affiliate_adv_2_title'),
            desc: t('affiliate_adv_2_desc'),
            highlight: isId ? 'Hingga 8 Bulan' : 'Up to 8 Months',
        },
        {
            icon: '🍪',
            title: t('affiliate_adv_3_title'),
            desc: t('affiliate_adv_3_desc'),
            highlight: isId ? '90 Hari Tracking' : '90-Day Tracking',
        },
        {
            icon: '⚡',
            title: t('affiliate_adv_4_title'),
            desc: t('affiliate_adv_4_desc'),
            highlight: isId ? 'Free Trial 14 Hari' : '14-Day Free Trial',
        },
        {
            icon: '💸',
            title: t('affiliate_adv_5_title'),
            desc: t('affiliate_adv_5_desc'),
            highlight: isId ? 'Payout Otomatis' : 'Automated Payouts',
        },
    ];

    const steps = [
        {
            num: '01',
            title: t('affiliate_step_1_title'),
            desc: t('affiliate_step_1_desc'),
            icon: <Globe className="w-6 h-6 text-indigo-500" />,
        },
        {
            num: '02',
            title: t('affiliate_step_2_title'),
            desc: t('affiliate_step_2_desc'),
            icon: <Layers className="w-6 h-6 text-purple-500" />,
        },
        {
            num: '03',
            title: t('affiliate_step_3_title'),
            desc: t('affiliate_step_3_desc'),
            icon: <DollarSign className="w-6 h-6 text-emerald-500" />,
        },
    ];

    const personas = [
        {
            icon: '🎬',
            title: t('affiliate_who_1_title'),
            desc: t('affiliate_who_1_desc'),
            badge: 'Content Creators',
        },
        {
            icon: '🧠',
            title: t('affiliate_who_2_title'),
            desc: t('affiliate_who_2_desc'),
            badge: 'Coaches & Mentors',
        },
        {
            icon: '💼',
            title: t('affiliate_who_3_title'),
            desc: t('affiliate_who_3_desc'),
            badge: 'Freelancers & Agencies',
        },
        {
            icon: '🎓',
            title: t('affiliate_who_4_title'),
            desc: t('affiliate_who_4_desc'),
            badge: 'Community Leaders',
        },
    ];

    const comparison = [
        { feature: isId ? 'Bagi Hasil Komisi' : 'Commission Rate', tranvas: '60% Recurring Bulanan', others: '15% - 25% Sekali Bayar' },
        { feature: isId ? 'Masa Berlaku Cookie' : 'Cookie Lifetime', tranvas: '90 Hari Penuh', others: '14 - 30 Hari' },
        { feature: isId ? 'Durasi Komisi Per User' : 'Commission Duration', tranvas: 'Hingga 8 Bulan Langganan', others: 'Hanya 1 Bulan Pertama' },
        { feature: isId ? 'Hook Konversi User' : 'Conversion Hook', tranvas: '⚡ Free Trial 14 Hari ($0)', others: 'Langsung Bayar Penuh' },
        { feature: isId ? 'Ambang Batas Payout' : 'Minimum Payout Threshold', tranvas: '$20 / Rp 200.000', others: '$100+' },
    ];

    return (
        <GuestLayout>
            <main id="affiliate-program-page" className="bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-500 overflow-x-hidden">
                
                {/* 1. HERO SECTION */}
                <header className="pt-32 pb-24 px-6 relative overflow-hidden text-center bg-radial-gradient">
                    {/* Glowing ambient background */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[140%] h-[700px] bg-[radial-gradient(circle_at_50%_0%,#4f46e518_0,transparent_60%)] -z-10 pointer-events-none" />
                    
                    <div className="max-w-5xl mx-auto space-y-8 relative z-10">
                        {/* Live pulsating pill */}
                        <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 font-black text-xs uppercase tracking-widest shadow-sm border border-indigo-100 dark:border-indigo-500/20 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                            </span>
                            {t('affiliate_hero_badge')}
                        </div>

                        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.08] max-w-4xl mx-auto">
                            {t('affiliate_hero_title_1')}<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400">
                                {t('affiliate_hero_title_2')}
                            </span>
                        </h1>

                        <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed font-medium">
                            {t('affiliate_hero_desc')}
                        </p>

                        {/* Hero CTAs */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                            <Link 
                                href="/register?ref=partner" 
                                className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-base shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:scale-95 transition-all flex items-center justify-center gap-3 group"
                            >
                                <span>{t('affiliate_cta_join')}</span>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>

                            <a 
                                href="#calculator" 
                                className="w-full sm:w-auto px-8 py-5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 font-black text-base hover:bg-slate-200 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                            >
                                <BarChart3 className="w-5 h-5 text-indigo-500" />
                                <span>{t('affiliate_cta_calc')}</span>
                            </a>
                        </div>

                        {/* 4 Trust Metrics Highlight Grid */}
                        <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                            <div className="p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-100 dark:border-slate-800 shadow-sm text-center">
                                <div className="text-3xl sm:text-4xl font-black text-indigo-600 dark:text-indigo-400 tracking-tight mb-1">60%</div>
                                <p className="text-xs font-bold text-slate-500 dark:text-slate-400">{t('affiliate_stat_comm')}</p>
                            </div>
                            <div className="p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-100 dark:border-slate-800 shadow-sm text-center">
                                <div className="text-3xl sm:text-4xl font-black text-purple-600 dark:text-purple-400 tracking-tight mb-1">90 {isId ? 'Hari' : 'Days'}</div>
                                <p className="text-xs font-bold text-slate-500 dark:text-slate-400">{t('affiliate_stat_cookie')}</p>
                            </div>
                            <div className="p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-100 dark:border-slate-800 shadow-sm text-center">
                                <div className="text-3xl sm:text-4xl font-black text-pink-600 dark:text-pink-400 tracking-tight mb-1">8 {isId ? 'Bulan' : 'Months'}</div>
                                <p className="text-xs font-bold text-slate-500 dark:text-slate-400">{t('affiliate_stat_milestone')}</p>
                            </div>
                            <div className="p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-100 dark:border-slate-800 shadow-sm text-center">
                                <div className="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight mb-1">$0 / {isId ? 'Gratis' : 'Free'}</div>
                                <p className="text-xs font-bold text-slate-500 dark:text-slate-400">{t('affiliate_stat_fee')}</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* 2. CORE ADVANTAGES (5 PILLARS) */}
                <section className="py-24 px-6 bg-slate-50/70 dark:bg-slate-900/40 border-y border-slate-100 dark:border-slate-800">
                    <div className="max-w-6xl mx-auto space-y-16">
                        <div className="text-center space-y-4 max-w-3xl mx-auto">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider">
                                {t('affiliate_adv_badge')}
                            </div>
                            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                                {t('affiliate_adv_title')}
                            </h2>
                            <p className="text-base text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                                {t('affiliate_adv_desc')}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {advantages.map((adv, idx) => (
                                <div 
                                    key={idx} 
                                    className="p-8 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
                                >
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-4xl p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl inline-block shadow-inner">
                                                {adv.icon}
                                            </span>
                                            <span className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-wider">
                                                {adv.highlight}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-black text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                            {adv.title}
                                        </h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                                            {adv.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 3. INTERACTIVE EARNINGS SIMULATOR */}
                <section id="calculator" className="py-28 px-6 relative overflow-hidden">
                    <div className="max-w-5xl mx-auto space-y-16">
                        <div className="text-center space-y-4 max-w-3xl mx-auto">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider">
                                {t('affiliate_calc_badge')}
                            </div>
                            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                                {t('affiliate_calc_title')}
                            </h2>
                            <p className="text-base text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                                {t('affiliate_calc_desc')}
                            </p>
                        </div>

                        {/* Simulator Card */}
                        <div className="p-8 sm:p-12 rounded-[3.5rem] bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white shadow-2xl border border-indigo-500/30 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
                                {/* Left Controls */}
                                <div className="lg:col-span-7 space-y-8">
                                    {/* Partner Tier Status */}
                                    <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
                                        <div className="flex items-center gap-3">
                                            <Award className="w-6 h-6 text-amber-400" />
                                            <div>
                                                <p className="text-[10px] uppercase font-bold text-slate-400">Current Partner Tier</p>
                                                <p className="text-sm font-black text-white">{partnerTier.title}</p>
                                            </div>
                                        </div>
                                        <span className="px-3 py-1 rounded-full bg-indigo-500/30 border border-indigo-400/40 text-indigo-300 text-xs font-black uppercase">
                                            60% Commission
                                        </span>
                                    </div>

                                    {/* Slider for Active Referrals */}
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-baseline">
                                            <label className="text-sm font-bold text-slate-300">{t('affiliate_calc_referrals')}</label>
                                            <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                                                {referrals} {isId ? 'User' : 'Users'}
                                            </span>
                                        </div>
                                        <input 
                                            type="range" 
                                            min="1" 
                                            max="500" 
                                            step="1"
                                            value={referrals} 
                                            onChange={(e) => setReferrals(parseInt(e.target.value))}
                                            className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                        />
                                        <div className="flex justify-between text-[11px] font-bold text-slate-500">
                                            <span>1 User</span>
                                            <span>50 Users</span>
                                            <span>100 Users</span>
                                            <span>250 Users</span>
                                            <span>500+ Users</span>
                                        </div>
                                    </div>

                                    {/* Plan Selector Buttons */}
                                    <div className="space-y-3">
                                        <label className="text-sm font-bold text-slate-300">{t('affiliate_calc_plan')}</label>
                                        <div className="grid grid-cols-3 gap-3">
                                            {(['architect', 'quantum', 'legendary'] as const).map((planKey) => (
                                                <button
                                                    key={planKey}
                                                    type="button"
                                                    onClick={() => setSelectedPlan(planKey)}
                                                    className={`p-3.5 rounded-2xl text-xs font-black transition-all border text-center ${
                                                        selectedPlan === planKey
                                                            ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-600/40'
                                                            : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                                                    }`}
                                                >
                                                    <div>{planDetails[planKey].name}</div>
                                                    <div className="text-[10px] opacity-75 mt-0.5">
                                                        {isId ? `Rp ${(planDetails[planKey].priceIdr / 1000)}k` : `$${planDetails[planKey].priceUsd}`}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Right Result Display */}
                                <div className="lg:col-span-5 p-8 rounded-3xl bg-white/5 border border-white/10 text-center space-y-6 flex flex-col justify-center">
                                    {calculation.isRecurring ? (
                                        <>
                                            <div>
                                                <span className="text-[11px] font-black uppercase tracking-widest text-slate-400 block mb-1">
                                                    {t('affiliate_calc_monthly_earn')}
                                                </span>
                                                <div className="text-4xl sm:text-5xl font-black text-emerald-400 tracking-tight">
                                                    {isId ? `Rp ${calculation.monthlyIdr}` : `$${calculation.monthlyUsd}`}
                                                </div>
                                                <span className="text-xs text-slate-400 font-bold">/ {isId ? 'bulan' : 'month'}</span>
                                            </div>

                                            <div className="pt-4 border-t border-white/10">
                                                <span className="text-[11px] font-black uppercase tracking-widest text-slate-400 block mb-1">
                                                    {t('affiliate_calc_yearly_earn')}
                                                </span>
                                                <div className="text-2xl sm:text-3xl font-black text-indigo-300 tracking-tight">
                                                    {isId ? `Rp ${calculation.eightMonthIdr}` : `$${calculation.eightMonthUsd}`}
                                                </div>
                                                <span className="text-[11px] text-slate-400 font-bold">({isId ? 'total 8 bulan langganan' : '8 months total subscription'})</span>
                                            </div>
                                        </>
                                    ) : (
                                        <div>
                                            <span className="text-[11px] font-black uppercase tracking-widest text-slate-400 block mb-1">
                                                {isId ? 'Total Estimasi Komisi:' : 'Estimated Total Commission:'}
                                            </span>
                                            <div className="text-4xl sm:text-5xl font-black text-amber-400 tracking-tight">
                                                {isId ? `Rp ${calculation.totalIdr}` : `$${calculation.totalUsd}`}
                                            </div>
                                            <span className="text-xs text-slate-400 font-bold">{isId ? 'Komisi Langsung Flat 60%' : '60% Flat Commission'}</span>
                                        </div>
                                    )}

                                    <Link
                                        href="/register?ref=partner"
                                        className="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-sm uppercase tracking-wider transition-all shadow-lg shadow-emerald-500/20 active:scale-95 flex items-center justify-center gap-2"
                                    >
                                        <span>{isId ? 'Klaim Akun Partner' : 'Claim Partner Account'}</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>

                            <p className="mt-8 text-center text-[11px] text-slate-400 font-medium">
                                ℹ️ {t('affiliate_calc_disclaimer')}
                            </p>
                        </div>
                    </div>
                </section>

                {/* 4. 8-MONTH COMMISSION DURATION HIGHLIGHT */}
                <section className="py-20 px-6 bg-gradient-to-r from-indigo-900/10 via-purple-900/10 to-pink-900/10 border-y border-indigo-100 dark:border-indigo-900/40">
                    <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
                        <div className="space-y-4 max-w-xl">
                            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-black uppercase tracking-wider border border-indigo-500/20">
                                ⚡ {isId ? 'Sistem Bagi Hasil Adil' : 'Fair Revenue Share System'}
                            </div>
                            <h3 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                                {isId ? 'Komisi 60% Mengalir Setiap Bulan Hingga 8 Bulan' : '60% Commission Every Month for Up to 8 Months'}
                            </h3>
                            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                                {isId 
                                    ? 'Cukup ajak pengguna mendaftar sekali. Ketika mereka mulai berlangganan, akun Anda otomatis ditandai di sistem dan Anda langsung menerima 60% komisi setiap bulan selama pengguna tersebut aktif hingga 8 bulan masa langganan!'
                                    : 'Simply refer a customer once. When they subscribe, your partner account is tagged and you automatically earn 60% monthly recurring commission for every month they remain active, up to 8 full months!'}
                            </p>
                        </div>

                        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl shrink-0 w-full sm:w-auto text-center space-y-3">
                            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center text-3xl mx-auto">
                                📈
                            </div>
                            <h4 className="text-lg font-black text-slate-900 dark:text-white">{isId ? '60% Komisi Bulanan' : '60% Monthly Commission'}</h4>
                            <p className="text-xs text-slate-500 font-bold max-w-[200px] mx-auto">
                                {isId ? 'Aktif selama hingga 8 bulan masa langganan user.' : 'Active for up to 8 months of user subscription.'}
                            </p>
                        </div>
                    </div>
                </section>

                {/* 5. 3 SIMPLE STEPS TO GET STARTED */}
                <section className="py-24 px-6">
                    <div className="max-w-6xl mx-auto space-y-16">
                        <div className="text-center space-y-4 max-w-3xl mx-auto">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400 font-bold text-xs uppercase tracking-wider">
                                {t('affiliate_step_badge')}
                            </div>
                            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                                {t('affiliate_step_title')}
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                            {steps.map((step, idx) => (
                                <div 
                                    key={idx} 
                                    className="p-8 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative flex flex-col justify-between space-y-6"
                                >
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shadow-inner">
                                                {step.icon}
                                            </div>
                                            <span className="text-3xl font-black text-slate-200 dark:text-slate-800">
                                                {step.num}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-black text-slate-900 dark:text-white">
                                            {step.title}
                                        </h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                                            {step.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 6. WHO IS THIS BEST FOR? */}
                <section className="py-24 px-6 bg-slate-50/70 dark:bg-slate-900/40 border-y border-slate-100 dark:border-slate-800">
                    <div className="max-w-6xl mx-auto space-y-16">
                        <div className="text-center space-y-4 max-w-3xl mx-auto">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-100 dark:bg-pink-500/20 text-pink-700 dark:text-pink-400 font-bold text-xs uppercase tracking-wider">
                                {t('affiliate_who_badge')}
                            </div>
                            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                                {t('affiliate_who_title')}
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {personas.map((persona, idx) => (
                                <div 
                                    key={idx} 
                                    className="p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4"
                                >
                                    <div className="space-y-3">
                                        <span className="text-4xl block mb-2">{persona.icon}</span>
                                        <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-wider inline-block">
                                            {persona.badge}
                                        </span>
                                        <h3 className="text-base font-black text-slate-900 dark:text-white">
                                            {persona.title}
                                        </h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                                            {persona.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 7. COMPARISON MATRIX (TRANVAS VS OTHERS) */}
                <section className="py-24 px-6">
                    <div className="max-w-4xl mx-auto space-y-12">
                        <div className="text-center space-y-4">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider">
                                {t('affiliate_matrix_badge')}
                            </div>
                            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                                {t('affiliate_matrix_title')}
                            </h2>
                        </div>

                        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800">
                                        <th className="p-6 text-xs font-black uppercase text-slate-400">Fitur & Parameter</th>
                                        <th className="p-6 text-xs font-black uppercase text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/40 text-center">Tranvas Partner ⚡</th>
                                        <th className="p-6 text-xs font-black uppercase text-slate-400 text-center">Program SaaS Biasa</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs sm:text-sm font-bold">
                                    {comparison.map((row, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                                            <td className="p-6 text-slate-700 dark:text-slate-200 font-bold">{row.feature}</td>
                                            <td className="p-6 text-center font-black text-emerald-600 dark:text-emerald-400 bg-indigo-50/20 dark:bg-indigo-950/20">{row.tranvas}</td>
                                            <td className="p-6 text-center text-slate-400">{row.others}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                {/* 8. FAQ SECTION */}
                <section className="py-24 px-6 bg-slate-50/70 dark:bg-slate-900/40 border-t border-slate-100 dark:border-slate-800">
                    <div className="max-w-3xl mx-auto space-y-12">
                        <div className="text-center space-y-4">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs uppercase tracking-wider">
                                {t('affiliate_faq_badge')}
                            </div>
                            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                                {t('affiliate_faq_title')}
                            </h2>
                        </div>

                        <div className="space-y-4">
                            {faqs.map((faq, idx) => (
                                <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
                                    <button
                                        type="button"
                                        onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                        className="w-full px-8 py-6 text-left font-black text-slate-800 dark:text-white flex justify-between items-center text-sm md:text-base gap-4"
                                    >
                                        <span>{faq.q}</span>
                                        <ChevronDown className={`transform transition-transform shrink-0 ${openFaq === idx ? 'rotate-180 text-indigo-600' : 'text-slate-400'}`} size={20} />
                                    </button>
                                    {openFaq === idx && (
                                        <div className="px-8 pb-8 text-slate-500 dark:text-slate-400 font-medium text-xs sm:text-sm leading-relaxed border-t border-slate-100 dark:border-slate-800/80 pt-4">
                                            {faq.a}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 9. FINAL HIGH-CONVERTING CTA BANNER */}
                <section className="py-24 px-6">
                    <div className="max-w-5xl mx-auto p-10 sm:p-16 rounded-[3.5rem] bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-2xl text-center space-y-8 relative overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.2)_0,transparent_70%)] pointer-events-none" />

                        <div className="max-w-2xl mx-auto space-y-4 relative z-10">
                            <span className="px-4 py-1.5 rounded-full bg-white/20 text-white text-xs font-black uppercase tracking-widest inline-block backdrop-blur-md">
                                {t('affiliate_cta_final_badge')}
                            </span>
                            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                                {t('affiliate_cta_final_title')}
                            </h2>
                            <p className="text-sm sm:text-base text-white/90 font-medium leading-relaxed">
                                {t('affiliate_cta_final_desc')}
                            </p>
                        </div>

                        <div className="pt-2 relative z-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                href="/register?ref=partner"
                                className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-white text-slate-950 hover:bg-slate-100 font-black text-base shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
                            >
                                <span>{t('affiliate_cta_final_btn')}</span>
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </section>

            </main>
        </GuestLayout>
    );
}
