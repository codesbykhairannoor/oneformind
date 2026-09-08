'use client';

import { useState, useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Award, ArrowRight } from 'lucide-react';

export default function AffiliateCalculator() {
    const t = useTranslations();
    const locale = useLocale();
    const isId = locale === 'id';

    const [referrals, setReferrals] = useState<number>(25);
    const [selectedPlan, setSelectedPlan] = useState<'architect' | 'quantum' | 'legendary'>('architect');

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
        const commRate = 0.60;

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

    const partnerTier = useMemo(() => {
        if (referrals >= 250) return { title: 'Diamond Partner 💎', badge: 'Top Tier (60%)' };
        if (referrals >= 100) return { title: 'Gold Partner 👑', badge: 'High Volume (60%)' };
        if (referrals >= 50) return { title: 'Silver Partner ⚡', badge: 'Growing (60%)' };
        return { title: 'Bronze Partner 🌟', badge: 'Standard 60%' };
    }, [referrals]);

    return (
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

                            {/* Slider */}
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
    );
}
