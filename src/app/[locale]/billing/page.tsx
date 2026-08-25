'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import AuthenticatedLayout from '@/components/AuthenticatedLayout';
import { Link, useRouter } from '@/i18n/routing';
import { ChevronDown, Check, Lock, Sparkles, Star } from 'lucide-react';

export default function BillingPricingPage() {
    const t = useTranslations();
    const locale = useLocale();
    const router = useRouter();
    const [isAnnual, setIsAnnual] = useState(true);
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const isId = locale === 'id';

    const faqs = [
        { q: t('pricing_faq_1_q'), a: t('pricing_faq_1_a') },
        { q: t('pricing_faq_2_q'), a: t('pricing_faq_2_a') },
        { q: t('pricing_faq_3_q'), a: t('pricing_faq_3_a') },
        { q: t('pricing_faq_4_q'), a: t('pricing_faq_4_a') },
    ];

    const features = [
        [t('pricing_f_active_habits'), t('pricing_v_unlimited'), t('pricing_v_unlimited'), t('pricing_v_unlimited')],
        [t('pricing_f_planner_engine'), t('pricing_v_batch'), t('pricing_v_batch'), t('pricing_v_ai_powered')],
        [t('pricing_f_vault_savings'), t('pricing_v_unlimited'), t('pricing_v_unlimited'), t('pricing_v_unlimited')],
        [t('pricing_f_ai_assistant'), '—', '—', t('pricing_v_247_access')],
        [t('pricing_f_life_insights'), t('pricing_v_basic'), t('pricing_v_advanced'), t('pricing_v_predictive')],
        [t('pricing_f_custom_modules'), '—', t('pricing_v_partial'), t('pricing_v_full')],
    ];

    const modules = [
        ['Journal Tracker', '—', '✓', '✓'],
        ['Goal Tracker', '—', '✓', '✓'],
        ['Job Application', '—', '✓', '✓'],
        ['Calendar Timeline', '—', '✓', '✓'],
    ];

    const handleCheckout = (planId: string) => {
        // Authenticated user checkout goes directly to status page simulation
        router.push(`/payment/status?status=success&plan=${planId}`);
    };

    return (
        <AuthenticatedLayout>
            <main id="billing-pricing-page" className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-500 overflow-x-hidden min-h-screen pb-32">
                {/* HERO */}
                <header style={{ marginBottom: '80px' }} className="pt-20 pb-2 px-4 md:px-8 text-center">
                    <div className="max-w-7xl mx-auto space-y-4">
                        <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter mb-4 mx-auto">
                            {t('pricing_title_1')}{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                                {t('pricing_title_2')}
                            </span>
                        </h1>

                        <p className="text-slate-500 dark:text-slate-400 font-bold max-w-xl mx-auto leading-relaxed text-sm sm:text-base">
                            {t('pricing_subtitle')}
                        </p>

                        {/* Billing Toggle */}
                        <div className="flex justify-center mt-8 mb-14">
                            <div className="inline-flex items-center p-1 bg-white dark:bg-slate-950 rounded-[1.8rem] border border-slate-100 dark:border-slate-800 shadow-sm scale-110">
                                <button
                                    type="button"
                                    onClick={() => setIsAnnual(false)}
                                    className={`px-8 py-3 rounded-[1.6rem] text-xs font-black transition-all ${
                                        !isAnnual
                                            ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-950 shadow-xl'
                                            : 'text-slate-400 hover:text-slate-600'
                                    }`}
                                >
                                    {t('pricing_monthly')}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsAnnual(true)}
                                    className={`px-8 py-3 rounded-[1.6rem] text-xs font-black transition-all relative flex items-center gap-2 ${
                                        isAnnual
                                            ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-950 shadow-xl'
                                            : 'text-slate-400 hover:text-slate-600'
                                    }`}
                                >
                                    {t('pricing_yearly')}
                                    <span className="absolute -top-4 -right-2 px-2 py-1 rounded-lg bg-emerald-500 text-[8px] text-white animate-bounce shadow-lg">
                                        {t('pricing_billing_save')}
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                {/* PRICING GRID */}
                <section style={{ marginBottom: '80px' }} className="px-4 md:px-8">
                    <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch">
                        {/* 1. Explorer */}
                        <div className="group relative flex flex-col p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all duration-700 shadow-xl shadow-slate-200/50 dark:shadow-none hover:-translate-y-2 hover:shadow-2xl">
                            <div className="mb-8">
                                <span className="text-xs font-black tracking-wide text-slate-400 dark:text-slate-500 mb-6 block">{t('pricing_l1_name')}</span>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl lg:text-5xl font-black text-slate-950 dark:text-white tracking-tighter">{t('pricing_free')}</span>
                                </div>
                            </div>
                            
                            <p className="text-[11px] font-bold text-slate-500 leading-relaxed min-h-[44px] mb-8">{t('pricing_explorer_desc')}</p>

                            <ul className="space-y-4 mb-10 flex-grow border-t border-slate-50 dark:border-slate-800 pt-8">
                                <li className="flex items-start gap-4">
                                    <div className="mt-1 flex items-center justify-center shrink-0">
                                        <Check className="text-emerald-500 w-[14px] h-[14px]" strokeWidth={2.5} />
                                    </div>
                                    <span className="text-[11px] font-black leading-tight text-slate-700 dark:text-slate-200">{t('pricing_f_habit_max5')}</span>
                                </li>
                                <li className="flex items-start gap-4">
                                    <div className="mt-1 flex items-center justify-center shrink-0">
                                        <Check className="text-emerald-500 w-[14px] h-[14px]" strokeWidth={2.5} />
                                    </div>
                                    <span className="text-[11px] font-black leading-tight text-slate-700 dark:text-slate-200">{t('pricing_f_daily_planner_tasks')}</span>
                                </li>
                                <li className="flex items-start gap-4">
                                    <div className="mt-1 flex items-center justify-center shrink-0">
                                        <Check className="text-emerald-500 w-[14px] h-[14px]" strokeWidth={2.5} />
                                    </div>
                                    <span className="text-[11px] font-black leading-tight text-slate-700 dark:text-slate-200">{t('pricing_f_basic_finance_simple')}</span>
                                </li>
                                <li className="flex items-start gap-4">
                                    <div className="mt-1 flex items-center justify-center shrink-0">
                                        <Check className="text-emerald-500 w-[14px] h-[14px]" strokeWidth={2.5} />
                                    </div>
                                    <span className="text-[11px] font-black leading-tight text-slate-700 dark:text-slate-200">{t('pricing_f_standard_dashboards')}</span>
                                </li>
                                <li className="flex items-start gap-4 opacity-40">
                                    <div className="mt-1 flex items-center justify-center shrink-0">
                                        <Lock className="text-slate-500 w-[14px] h-[14px]" strokeWidth={2.5} />
                                    </div>
                                    <span className="text-[11px] font-black leading-tight text-slate-500">{t('pricing_f_journal_goals_jobs_locked')}</span>
                                </li>
                                <li className="flex items-start gap-4 opacity-40">
                                    <div className="mt-1 flex items-center justify-center shrink-0">
                                        <Lock className="text-slate-500 w-[14px] h-[14px]" strokeWidth={2.5} />
                                    </div>
                                    <span className="text-[11px] font-black leading-tight text-slate-500">{t('pricing_f_advanced_ai_locked')}</span>
                                </li>
                            </ul>

                            <button type="button" disabled className="w-full py-5 rounded-[2rem] font-black text-xs flex items-center justify-center gap-3 bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-default">
                                {t('pricing_btn_current')}
                            </button>
                        </div>

                        {/* 2. Architect */}
                        <div className="group relative flex flex-col p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all duration-700 shadow-xl shadow-slate-200/50 dark:shadow-none hover:-translate-y-2 hover:shadow-2xl">
                            <div className="mb-8">
                                <span className="text-xs font-black tracking-wide text-slate-400 dark:text-slate-500 mb-6 block">{t('pricing_l2_name')}</span>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl lg:text-5xl font-black text-slate-950 dark:text-white tracking-tighter">
                                        {isAnnual ? (isId ? 'Rp 79k' : '$4.99') : (isId ? 'Rp 99k' : '$6.99')}
                                    </span>
                                    <span className="text-[10px] font-bold text-slate-400 mb-1">/{t('pricing_per_month_short')}</span>
                                </div>
                            </div>

                            <p className="text-[11px] font-bold text-slate-500 leading-relaxed min-h-[44px] mb-8">{t('pricing_architect_desc')}</p>

                            <ul className="space-y-4 mb-10 flex-grow border-t border-slate-50 dark:border-slate-800 pt-8">
                                <li className="flex items-center justify-center py-2 mb-2 bg-indigo-50/50 dark:bg-indigo-500/5 rounded-xl border border-indigo-100 dark:border-indigo-500/10 w-full">
                                    <span className="text-[9px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">{t('pricing_feature_header_explorer_plus')}</span>
                                </li>
                                <li className="flex items-start gap-4">
                                    <div className="mt-1 flex items-center justify-center shrink-0">
                                        <Check className="text-indigo-500 w-[14px] h-[14px]" strokeWidth={2.5} />
                                    </div>
                                    <span className="text-[11px] font-black leading-tight text-slate-700 dark:text-slate-200">{t('pricing_f_all_tabs_open')}</span>
                                </li>
                                <li className="flex items-start gap-4">
                                    <div className="mt-1 flex items-center justify-center shrink-0">
                                        <Check className="text-indigo-500 w-[14px] h-[14px]" strokeWidth={2.5} />
                                    </div>
                                    <span className="text-[11px] font-black leading-tight text-slate-700 dark:text-slate-200">{t('pricing_f_unlimited_habit')}</span>
                                </li>
                                <li className="flex items-start gap-4">
                                    <div className="mt-1 flex items-center justify-center shrink-0">
                                        <Check className="text-indigo-500 w-[14px] h-[14px]" strokeWidth={2.5} />
                                    </div>
                                    <span className="text-[11px] font-black leading-tight text-slate-700 dark:text-slate-200">{t('pricing_f_the_vault')}</span>
                                </li>
                                <li className="flex items-start gap-4">
                                    <div className="mt-1 flex items-center justify-center shrink-0">
                                        <Check className="text-indigo-500 w-[14px] h-[14px]" strokeWidth={2.5} />
                                    </div>
                                    <span className="text-[11px] font-black leading-tight text-slate-700 dark:text-slate-200">{t('pricing_f_finance_trends')}</span>
                                </li>
                                <li className="flex items-start gap-4">
                                    <div className="mt-1 flex items-center justify-center shrink-0">
                                        <Check className="text-indigo-500 w-[14px] h-[14px]" strokeWidth={2.5} />
                                    </div>
                                    <span className="text-[11px] font-black leading-tight text-slate-700 dark:text-slate-200">{t('pricing_f_batch_planner')}</span>
                                </li>
                                <li className="flex items-start gap-4">
                                    <div className="mt-1 flex items-center justify-center shrink-0">
                                        <Check className="text-indigo-500 w-[14px] h-[14px]" strokeWidth={2.5} />
                                    </div>
                                    <span className="text-[11px] font-black leading-tight text-slate-700 dark:text-slate-200">{t('pricing_f_neural_sync')}</span>
                                </li>
                            </ul>

                            <button type="button" onClick={() => handleCheckout('Architect')} className="w-full py-5 rounded-[2rem] font-black text-xs transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-3 bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-500/40">
                                {t('pricing_btn_upgrade')}
                            </button>
                        </div>

                        {/* 3. Quantum (AI Recommended) */}
                        <div className="group relative flex flex-col p-8 rounded-[3.5rem] border-2 border-indigo-500 shadow-[0_0_80px_rgba(79,70,229,0.15)] lg:scale-105 z-10 bg-slate-900 border-indigo-900 transition-all duration-700 hover:-translate-y-2">
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-transparent rounded-[3.5rem] overflow-hidden" />
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full bg-indigo-600 text-white text-[9px] font-black tracking-[0.2em] uppercase shadow-lg border border-white/20 animate-pulse">
                                {t('pricing_badge_ai_rec')}
                            </div>

                            <div className="mb-8 relative z-10">
                                <span className="text-xs font-black tracking-wide text-indigo-400 mb-6 block">{t('pricing_l3_name')}</span>
                                <div className="flex items-baseline gap-2 text-white">
                                    <span className="text-4xl lg:text-5xl font-black tracking-tighter">
                                        {isAnnual ? (isId ? 'Rp 109k' : '$6.99') : (isId ? 'Rp 159k' : '$9.99')}
                                    </span>
                                    <span className="text-[10px] font-bold opacity-50 mb-1">/{t('pricing_per_month_short')}</span>
                                </div>
                            </div>

                            <p className="text-[11px] font-bold text-slate-400 leading-relaxed min-h-[44px] mb-8 relative z-10">{t('pricing_quantum_desc')}</p>

                            <ul className="space-y-4 mb-10 flex-grow relative z-10 border-t border-white/5 pt-8">
                                <li className="flex items-center justify-center py-2 mb-2 bg-white/5 rounded-xl border border-white/10 w-full">
                                    <span className="text-[9px] font-black text-indigo-300 uppercase tracking-widest">{t('pricing_feature_header_architect_plus')}</span>
                                </li>
                                <li className="flex items-start gap-4">
                                    <div className="mt-1 flex items-center justify-center shrink-0">
                                        <Sparkles className="text-indigo-400 w-[14px] h-[14px]" strokeWidth={2.5} />
                                    </div>
                                    <span className="text-[11px] font-black leading-tight text-white">{t('pricing_f_neural_ai')}</span>
                                </li>
                                <li className="flex items-start gap-4">
                                    <div className="mt-1 flex items-center justify-center shrink-0">
                                        <Check className="text-indigo-400 w-[14px] h-[14px]" strokeWidth={2.5} />
                                    </div>
                                    <span className="text-[11px] font-black leading-tight text-indigo-200">{t('feat_ai_stacking')}</span>
                                </li>
                                <li className="flex items-start gap-4">
                                    <div className="mt-1 flex items-center justify-center shrink-0">
                                        <Check className="text-indigo-400 w-[14px] h-[14px]" strokeWidth={2.5} />
                                    </div>
                                    <span className="text-[11px] font-black leading-tight text-indigo-200">{t('feat_ai_audit')}</span>
                                </li>
                                <li className="flex items-start gap-4">
                                    <div className="mt-1 flex items-center justify-center shrink-0">
                                        <Check className="text-indigo-400 w-[14px] h-[14px]" strokeWidth={2.5} />
                                    </div>
                                    <span className="text-[11px] font-black leading-tight text-indigo-200">{t('feat_sentiment_ai')}</span>
                                </li>
                                <li className="flex items-start gap-4">
                                    <div className="mt-1 flex items-center justify-center shrink-0">
                                        <Check className="text-indigo-400 w-[14px] h-[14px]" strokeWidth={2.5} />
                                    </div>
                                    <span className="text-[11px] font-black leading-tight text-indigo-200">{t('feat_resume_ai')}</span>
                                </li>
                                <li className="flex items-start gap-4">
                                    <div className="mt-1 flex items-center justify-center shrink-0">
                                        <Check className="text-indigo-400 w-[14px] h-[14px]" strokeWidth={2.5} />
                                    </div>
                                    <span className="text-[11px] font-black leading-tight text-indigo-200">{t('pricing_f_early_access')}</span>
                                </li>
                            </ul>

                            <button type="button" onClick={() => handleCheckout('Quantum')} className="relative z-10 w-full py-5 rounded-[2rem] font-black text-xs hover:scale-105 transition-all active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.1)] bg-white text-slate-950">
                                {t('pricing_btn_unleash')}
                            </button>
                        </div>

                        {/* 4. Legendary */}
                        <div className="group relative flex flex-col p-8 rounded-[3rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-black transition-all duration-700 hover:-translate-y-2 hover:shadow-2xl">
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-amber-500 text-white text-[8px] font-black tracking-widest whitespace-nowrap shadow-lg">
                                {t('pricing_badge_founder')}
                            </div>

                            <div className="mb-8">
                                <span className="text-xs font-black tracking-wide text-amber-600 dark:text-amber-500 mb-6 block">{t('pricing_l4_name')}</span>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl lg:text-5xl font-black text-slate-950 dark:text-white tracking-tighter">
                                        {isId ? 'Rp 899k' : '$59.00'}
                                    </span>
                                </div>
                                <div className="text-[9px] font-black text-amber-500 mt-1 uppercase tracking-tighter">{t('pricing_lifetime')}</div>
                            </div>

                            <p className="text-[11px] font-bold text-slate-500 leading-relaxed min-h-[44px] mb-8">{t('pricing_legendary_desc')}</p>

                            <ul className="space-y-4 mb-10 flex-grow border-t border-slate-50 dark:border-slate-800 pt-8">
                                <li className="flex items-center justify-center py-2 mb-2 bg-amber-500/5 rounded-xl border border-amber-500/10 w-full">
                                    <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest">{t('pricing_feature_header_quantum_plus')}</span>
                                </li>
                                <li className="flex items-start gap-4">
                                    <div className="mt-1 flex items-center justify-center shrink-0">
                                        <Star className="text-amber-500 w-[14px] h-[14px]" strokeWidth={2.5} />
                                    </div>
                                    <span className="text-[11px] font-black leading-tight text-slate-700 dark:text-slate-200">{t('pricing_f_lifetime_access')}</span>
                                </li>
                                <li className="flex items-start gap-4">
                                    <div className="mt-1 flex items-center justify-center shrink-0">
                                        <Check className="text-amber-500 w-[14px] h-[14px]" strokeWidth={2.5} />
                                    </div>
                                    <span className="text-[11px] font-black leading-tight text-slate-700 dark:text-slate-200">{t('pricing_f_legendary_trial_ai')}</span>
                                </li>
                                <li className="flex items-start gap-4">
                                    <div className="mt-1 flex items-center justify-center shrink-0">
                                        <Check className="text-emerald-500 w-[14px] h-[14px]" strokeWidth={2.5} />
                                    </div>
                                    <span className="text-[11px] font-black leading-tight text-slate-700 dark:text-slate-200">{t('pricing_f_founder_badge')}</span>
                                </li>
                                <li className="flex items-start gap-4">
                                    <div className="mt-1 flex items-center justify-center shrink-0">
                                        <Check className="text-emerald-500 w-[14px] h-[14px]" strokeWidth={2.5} />
                                    </div>
                                    <span className="text-[11px] font-black leading-tight text-slate-700 dark:text-slate-200">{t('pricing_f_neural_sync')}</span>
                                </li>
                                <li className="flex items-start gap-4">
                                    <div className="mt-1 flex items-center justify-center shrink-0">
                                        <Check className="text-emerald-500 w-[14px] h-[14px]" strokeWidth={2.5} />
                                    </div>
                                    <span className="text-[11px] font-black leading-tight text-slate-700 dark:text-slate-200">{t('pricing_f_vvip_support')}</span>
                                </li>
                            </ul>

                            <button type="button" onClick={() => handleCheckout('Legendary')} className="w-full py-5 rounded-[2rem] font-black text-xs transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-3 bg-slate-950 dark:bg-white text-white dark:text-slate-950 hover:bg-slate-800">
                                {t('pricing_btn_legendary')}
                            </button>
                        </div>
                    </div>
                </section>

                {/* EXPANDED COMPARISON TABLE */}
                <section style={{ marginBottom: '80px' }} className="py-20 bg-slate-50/50 dark:bg-slate-900/30">
                    <div className="max-w-5xl mx-auto px-6 space-y-12">
                        <div className="text-center space-y-2 mb-16">
                            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-900 dark:text-white font-black">
                                {t('pricing_comparison_title')}
                            </h2>
                            <p style={{ fontSize: '1.15rem', lineHeight: 1.8, color: 'var(--text-muted)' }} className="font-bold uppercase tracking-[0.4em]">{t('pricing_comparison_subtitle')}</p>
                        </div>

                        <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-2xl overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[800px]">
                                <thead>
                                    <tr className="bg-slate-50 dark:bg-slate-800/50">
                                        <th className="p-8 text-[10px] font-black tracking-wide text-slate-400">{t('pricing_feature_col_name')}</th>
                                        <th className="p-8 text-[10px] font-black tracking-wide text-slate-900 dark:text-white text-center">Explorer</th>
                                        <th className="p-8 text-[10px] font-black tracking-wide text-indigo-500 text-center">{t('pricing_architect_title')}</th>
                                        <th className="p-8 text-[10px] font-black tracking-wide text-amber-500 text-center">{t('pricing_quantum_title')}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50 dark:divide-slate-800 text-xs font-bold">
                                    {features.map((row, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-850 transition-colors">
                                            <td className="p-8 text-xs font-black text-slate-700 dark:text-slate-200">{row[0]}</td>
                                            <td className="p-8 text-xs font-bold text-slate-400 text-center">{row[1]}</td>
                                            <td className="p-8 text-xs font-black text-indigo-600 dark:text-indigo-400 text-center">{row[2]}</td>
                                            <td className="p-8 text-xs font-black text-amber-600 dark:text-amber-500 text-center">{row[3]}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                {/* FAQ */}
                <section className="py-20 max-w-4xl mx-auto px-6 space-y-12">
                    <div className="text-center space-y-4">
                        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-900 dark:text-white font-black">
                            {t('pricing_faq_title')}
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
                                    <div className="px-8 pb-8 text-slate-500 dark:text-slate-400 font-bold leading-relaxed border-t border-slate-100 pt-4">
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </AuthenticatedLayout>
    );
}
